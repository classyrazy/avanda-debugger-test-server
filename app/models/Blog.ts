import {Column,Model} from "@avanda/orm";
import User from "./User";

export default class Blog extends Model{
    @Column.text()
    title?:string;

    @Column.text()
    body?:string;

    @Column.int({
        references: new User
    })
    user_id?:number;
}