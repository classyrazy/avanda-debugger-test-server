import {Column,Model} from "@avanda/orm";
import {Request} from "@avanda/http";
import {Token} from "@avanda/app";

interface Session{
    user_id: number,
    auth_stage: 'email-verification' | 'logged-in'
}

export default class User extends Model{

    id?: number

    @Column.text({
        unique: true,
        masSize: 255
    })
    email?: string

    @Column.text()
    password?: string

    @Column.text({
        nullable: true
    })
    email_verification_token?: string

    @Column.text()
    full_name?: string

    @Column.text({
        nullable: true
    })
    phone_number?: string

    @Column.text({
        nullable: true
    })
    picture?: string

    @Column.enum(['admin','ordinary'])
    type?: 'admin' | 'ordinary' = 'ordinary'

    @Column.int({
        nullable: true
    })
    default_address_id?: number = null


    @Column.text({
        nullable: true
    })
    password_retrieval_token?: string

    async getActiveSession(req: Request): Promise<Session>{
        let token = req.getHeader<string>('authorization').split(' ')[1]
        return (await Token.decode<Session>(token))
    }

    async createSession(user_id: number, auth_stage: 'email-verification' | 'logged-in' ): Promise<string>{
        return await Token.generate({user_id,auth_stage})
    }
}