import {Controller, Request, Response, Get} from "@avanda/http";
import Model from "../models/Blog"

export default class Blog extends Controller {
    model?: Model
    
    @Get()
    async get(res: Response, req: Request){

        console.log({arg: req.getArgs('id')})

        return res.success<any>('hello world',this.model?.first())
    }
}
