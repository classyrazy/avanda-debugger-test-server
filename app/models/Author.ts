import {Column,Model} from "@avanda/orm";
import Blog from "./Blog";
import User from "./User";

export default class Author extends Model{
    id?: number;
    @Column.text({
        references: new Blog().user_uuid,
        masSize: 255
    })
    user_id?:string;

    @Column.text({
        masSize: 255
    })
    name?: string

    @Column.int()
    age?: number
    
}