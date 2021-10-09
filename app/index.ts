import { Query } from "@avanda/http";
import {Connection} from "@avanda/app"

import Models from "./models/.boot"
import Controllers from "./controllers/.boot"

import serverConfig from "../configs/server"

async function boot() {
 let app = await new Query(serverConfig)
     .execute(
         Models,
         Controllers
     )

    return app.getServerInstance()
    // app.listen()
}


export const appInstance = boot();

