import {Controller, Request, Response} from "@avanda/http";
import {Get,Post,Option} from "@avanda/http";
import Model from "../models/User"
import LoggedUserOnly from "../middlewares/LoggedUserOnly";

export default class User extends Controller {
    model: Model
    @Get(
        new LoggedUserOnly()
    )
    async get(res,req){

        return res.success('hello world')
    }
}
