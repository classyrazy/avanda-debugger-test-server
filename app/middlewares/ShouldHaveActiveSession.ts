import { Middleware, Request, Response } from "@avanda/http";
import User from "../models/User";
export default class ShouldHaveActiveSession implements Middleware{
    async boot(res: Response,req: Request) {

        try {
            let session = await new User().getActiveSession(req)

            req.setAttr('user_id',session.user_id)

            let user = await new User().find(session?.user_id);

            if (!user)
                throw new Error('you are not logged in')

            req.setAttr('user',user)

            return !!session?.user_id && !!user;
        }catch (e) {
            return res.error('Couldn\'t find any active session')
        }
    }

}