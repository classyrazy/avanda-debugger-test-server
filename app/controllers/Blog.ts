import {Controller, Request, Response, Get, Delete} from "@avanda/http";
import BlogModel from "../models/Blog"
import UserModel from "../models/User"

export default class Blog extends Controller {
    model?:  BlogModel
    @Get()
    async get(response: Response,request: Request): Promise<any> {
        return (await this.model?.first())
    }

    @Get()
    async getAll(response: Response,request: Request) {
        return (await this.model?.all())
    }
    
    @Get()
    async getUserBlog(response: Response, request: Request) {    
        return response.success<any>("test", new BlogModel().where({ 'user_uuid': request.getArgs("uuid")}).first())
    }

}
