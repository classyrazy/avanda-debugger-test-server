import { Middleware, Request, Response } from "@avanda/http";

export default class ValidateLogin implements Middleware{
    boot(res: Response, req: Request){

        return req.validate((Rule) => ({
            email: new Rule().required().email(),
            password: new Rule().required()
        }))
    }
}