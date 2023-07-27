import {Seeder} from "@avanda/orm"
import Blog from "../models/Blog"
import { useQuickTraits } from "../utils/quickTraits"

export default class implements Seeder{
    async run(faker: Faker.FakerStatic): Promise<void> {
        const { generateNanoId } = useQuickTraits()

        await new Blog().createBulk([
            /*Create multiple data here*/
            // {
            //     user_uuid: "CDn614371O",
            //     title: "My First Blog",
            //     body: "This is my first blog dfjkdkf nkjefihldhfk nbdfkjbkdvgn hbjfkeklgfbdlkjgfe heghfklefj djkjklhdg dgjkihhdgklehjflidg dgkjjhdglkdgkldkljg lkjd;gljld fgn,nk,jgd mfg,mnlkjal;dg kjdhgkkldwg n,dogihog;ndfgkjnkfg jkhglkfhgkklgd",
            // },
            {
                user_uuid: "Vg-1hVvVQr",
                title: "My Second Blog",
                body: "This is my first blog dfjkdkf nkjefihldhfk nbdfkjbkdvgn hbjfkeklgfbdlkjgfe heghfklefj djkjklhdg dgjkihhdgklehjflidg dgkjjhdglkdgkldkljg lkjd;gljld fgn,nk,jgd mfg,mnlkjal;dg kjdhgkkldwg n,dogihog;ndfgkjnkfg jkhglkfhgkklgd",
            },
        ])
    }
}