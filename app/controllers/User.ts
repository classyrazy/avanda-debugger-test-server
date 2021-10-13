import {Controller, Request, Response} from "@avanda/http";
import {Get,Post,Option} from "@avanda/http";
import Model from "../models/User"
import LoggedUserOnly from "../middlewares/LoggedUserOnly";

export default class User extends Controller {
    model: Model
    @Post()
    async add(response: Response, request: Request): Promise<Response> {
        return super.add(response, request);
    }

    login(res: Response){

        return res.success('login successful',this.model?.first())
    }
}
