import { Middleware, Request, Response } from "@avanda/http";

export default class ValidateLogin implements Middleware{
    boot(res: Response, req: Request){

        return req.validate((rule) => ({
            email: rule.string().required().email(),
            password: rule.string().required()
        }))
    }
}