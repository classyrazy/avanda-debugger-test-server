import { Middleware, Request, Response } from "@avanda/http";
import User from "../../models/User";

export default class ValidatePasswordRetrieval implements Middleware{
    boot(res: Response, req: Request){

        return req.validate((Rule) => ({
            email: new Rule().required().email().exists(new User()).error('Email not recognized'),
        }))
    }
}