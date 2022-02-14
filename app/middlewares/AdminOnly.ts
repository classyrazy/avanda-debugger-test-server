import { Middleware, Request, Response } from "@avanda/http";
import User from "../models/User";
import {DataOf} from "@avanda/orm";
export default class AdminOnly implements Middleware{
    async boot(res: Response,req: Request) {

        try {
            let user = req.getAttrs<DataOf<User> | null>('user')
            if (!user)
                return res.error('You are not logged in')

            if (user.type != 'admin')
                return res.error('You are not authorized to access this')

            return true;

        }catch (e) {
            console.log({e})
            return res.error('You are not logged in')
        }
    }

}