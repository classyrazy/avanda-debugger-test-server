import { Middleware, Request, Response } from "@avanda/http";
import User from "../../models/User";


export default class ValidateRegistration implements Middleware{
    async boot(res: Response,req: Request){

        return req.validate( (Rule) => ({
            email: new Rule().required().email().unique(new User()),
            password: new Rule().required().minLength(6),
            full_name: new Rule().required(),
            confirmPassword: new Rule()
                .required()
                .refs('password')
                .error('Confirm password must be same as password'),
        }))
    }
}