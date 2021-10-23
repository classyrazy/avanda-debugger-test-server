import {Controller, Request, Response, Get, Post} from "@avanda/http";
import Model from "../models/User"
import ValidateLogin from "../middlewares/forms/ValidateLogin";
import ValidateRegistration from "../middlewares/forms/ValidateRegistration";
import {Hash,Token} from "@avanda/app";
import LoggedUserOnly from "../middlewares/LoggedUserOnly";

export default class User extends Controller {
    model?: Model

    @Get(
        new LoggedUserOnly()
    )
    async get(res: Response,req: Request){
        let session = await this.model.getActiveSession(req)
        let user = new Model().find(session.user_id);

        return res.success<any>('you are logged in',user)
    }

    @Post(
        new ValidateLogin()
    )
    async login(res: Response,req: Request){

        let user = await this.model?.where({
            email: req.getData('email') as string
        }).first()

        if (!user){
            return res.error('Invalid email or password')
        }

        let password = req.getData('password') as string

        let isValidPassword = await Hash.verify(user.password,password)

        if(!isValidPassword){
            return res.error('Invalid login details')
        }

        // create new session

        let token = this.model.createSession(user.id,"logged-in")

        return res.success('login successful', {token})
    }
    @Post(
        new ValidateRegistration()
    )
    async register(res: Response,req: Request){
        let user = await this.model?.create({
            email: req.getData('email'),
            password: await Hash.make(req.getData('password')),
            full_name: req.getData('full_name') as string,
        })

        let token = this.model.createSession(user.id,"email-verification")

        //

        return res.success('Registration was successful',{
            token,
            next: '/registration/email-verification'
        })

    }
}
