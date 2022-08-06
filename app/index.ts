import { Query } from "@avanda/http";
import Models from "./models/.boot";
import Controllers from "./controllers/.boot";
import serverConfig from "../configs/server";
function boot() {
  const app = new Query(serverConfig).execute(Models, Controllers);
  app.listen();
}
boot();
