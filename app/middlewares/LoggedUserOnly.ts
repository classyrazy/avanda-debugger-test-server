import {Middleware} from "@avanda/http/middleware";
import {Request, Response} from "@avanda/http";

export default class LoggedUserOnly implements Middleware{
    validate(res: Response, req: Request): boolean {
        return true;
    }
    onFailure(res: Response, req: Request): Response {
        // fall back response
        return res.error('This error message is showing because validate method returns false',500);
    }

}