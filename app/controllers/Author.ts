import {Controller, Request, Response, Get} from "@avanda/http";
import { DataOf } from "@avanda/orm";
import Blog from "../models/Blog";
import AuthorModel from "../models/Author"

export default class Author extends Controller {
    model?:  AuthorModel
    @Get()
    async get(response: Response,request: Request, model?: Model): Promise<any> {
        return (await this.model?.first())
    }

    @Get()
    async getAll(response: Response,request: Request, model?: Model) {
        return (await this.model?.all())
    }

    @Get()
    async getAuthor(response: Response,request: Request) {
        return response.success<any>("test", await new AuthorModel().where({"user_id": request.getArgs('user_uuid')}).first())
    }

}
