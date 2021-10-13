import {Controller, Request, Response, Get, Post} from "@avanda/http";
import Model from "../models/Blog"

export default class Blog extends Controller {
    model?: Model
    
    @Get()
    async get(res: Response, req: Request){

        console.log({arg: req.getArgs('id')})

        return res.success<any>('hello world',this.model?.first())
    }

    @Post()
    async set(res: Response, req: Request){
        this.model?.create({
            body:'Hello world',
            title: 'This is the first blog post',
            user_id: 1
        })
    }
}
