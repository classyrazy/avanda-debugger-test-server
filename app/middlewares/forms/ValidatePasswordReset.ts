import { Middleware, Request, Response } from "@avanda/http";
import User from "../../models/User";


export default class ValidatePasswordReset implements Middleware{
    async boot(res: Response,req: Request){

        return req.validate( (Rule) => ({
            new_password: new Rule()
                .required()
                .error('New password required')
                .minLength(6)
                .error('New password must be at least 6 characters'),
            re_new_password: new Rule()
                .required()
                .error('Retyped new password required')
                .refs('new_password')
                .error('Retype password must be same as new password'),
        }))
    }
}