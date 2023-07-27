import { Seeder } from "@avanda/orm"
import User from "../models/User"
import { useQuickTraits } from "../utils/quickTraits"

export default class implements Seeder {
    async run(faker: Faker.FakerStatic): Promise<void> {
        const { generateNanoId } = useQuickTraits()
        await new User().createBulk([
            /*Create multiple data here*/
            {
                uuid: generateNanoId(),
                username: "JohnDoe",
                email: faker.internet.email(),
            },
            {
                uuid: generateNanoId(),
                username: faker.internet.userName(),
                email: faker.internet.email(),
            }
        ])
    }
}