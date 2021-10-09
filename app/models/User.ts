import {Column,Model} from "@avanda/orm";
export default class User extends Model{
    @Column.text()
    full_name?:string;

    @Column.int()
    no_of_posts?:number = 0

}