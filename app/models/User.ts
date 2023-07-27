import {Column,Model} from "@avanda/orm";

export default class User extends Model{
    id?: number;

    @Column.text({
        masSize: 10
    })
    uuid?: string;

    @Column.text({
        index: {
            type: "UNIQUE",
            name: "unique_username_id"
        },
        masSize: 20,
    })
    username?: string;

    @Column.text({
        masSize: 225,
        index:{
            type: "UNIQUE",
            name: "unique_email_id"
        }
    })
    email?: string;
}