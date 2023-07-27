import {Seeder} from "@avanda/orm"
import Author from "../models/Author"
export default class implements Seeder{
    async run(faker: Faker.FakerStatic): Promise<void> {
        await new Author().createBulk([
            /*Create multiple data here*/
            {
                user_id: "Vg-1hVvVQr",
                name: "Oyin",
                age: 12

            }
        ])
    }
}