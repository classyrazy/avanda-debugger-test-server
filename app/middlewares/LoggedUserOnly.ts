import { Middleware, Request, Response } from "@avanda/http";
import User from "../models/User";
export default class LoggedUserOnly implements Middleware{
    async boot(res: Response,req: Request) {


        let user = new User()
        try {
            let session = await user.getActiveSession(req)
            return !!session?.user_id && !!(await user.find(session?.user_id)) && session?.auth_stage == 'logged-in';
        }catch (e) {
            return res.error('You are not logged in')
        }
    }

}