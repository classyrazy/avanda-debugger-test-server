import { Query } from "@avanda/http";
import Models from "./models/.boot";
import Controllers from "./controllers/.boot";
import serverConfig from "../configs/server";
import { Connection } from "@avanda/app";
import { Model } from "@avanda/orm";
import databaseConfig from "../configs/database";
Model.setConnection(Connection(databaseConfig))
function boot() {
  const app = new Query(serverConfig).execute(
    Models,
    Controllers
  );
  app.listen();
}
boot();
