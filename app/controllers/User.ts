import { Controller, Request, Response, Get, Post, Watchable } from "@avanda/http";
import UserModel from "../models/User"
import BlogModel from "../models/Blog"
import TestEmitter from "../events/TestEmitter";

export default class User extends Controller {
    model?: UserModel
    @Get()
    async get(response: Response, request: Request): Promise<any> {
        return (await this.model?.first())
    }
    @Get()
    async set(response: Response, request: Request): Promise<any> {
        return ({test: "userr"})
    }

    @Get()
    async getAll(response: Response, request: Request) {
        return (await this.model?.all())
    }

    @Get()
    async testParams(response: Response, request: Request) {   
        console.log(request.params) 
        return response.success<any>("Oyin's name", {name: "Oyin", age: 12, color: "black"}, 201)
    }
    @Post()
    async testPost(response: Response, request: Request) {
        console.log("helloooo worls")
        console.log(request.data, request.params, request.columns)
        return response.success<any>("Oyin's name", {name: "Oyin", age: 12, color: "black"}, 201)
    }
    @Post()
    async testWatchRequest(response: Response, request: Request) {
        console.log("helloooo worls")
        console.log({dataPassed: request.data['data_passed']})
        await new TestEmitter(request.getData("data_passed")).broadcast()
        return response.success("sent")
    }
    @Watchable({
        event: 'testing-event'
    })
    watcherFunction (res: Response, req: Request){
        let payload = req.getPayload()
        console.log({payload})
        return res.success("", payload)
    }

    

}
