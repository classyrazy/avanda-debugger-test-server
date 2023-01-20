import {serverConfig} from "@avanda/app";
import {Env} from "@avanda/app";
const config: serverConfig =  {
    port: Env.get('PORT',8000),
    rootPath: '/',
    CORSWhitelist: Env.get<string>('CORS_WHITELIST',"http://localhost:3000,http://localhost:4000,http://localhost:9000").split(',')
}

export default config
