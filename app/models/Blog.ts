import { Column, Model } from "@avanda/orm";
import User from "./User";

export default class Blog extends Model {
    id?: number;

    @Column.text({
        references: new User().uuid,
        masSize: 10
    })
    user_uuid?: string;

    @Column.text({
        masSize: 255
    })
    title?: string;

    @Column.text({
        masSize: 255
    })
    body?: string;
}