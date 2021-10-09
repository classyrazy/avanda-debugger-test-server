import { CommandLine } from "@avanda/cli";
import {Out} from "@avanda/cli";


export default class Hello implements CommandLine {
    command: string = "hello <target>";
    description: string = "generate a bootstrapper";


    public exe(target: string = '',options: object) {
        Out.success('this is coming from Hello')
    }

}