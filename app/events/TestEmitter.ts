import {Broadcastable} from "@avanda/http";
    export default class TestEmitter extends Broadcastable{

        constructor(
            public dataPassed: string
        ){
            super();
        }
        get path(): string {
            return 'testing-event';
        }
        
        payload(): any {
            return {
                name: 'adewale',
                pay: 'load',
                dataPassed: this.dataPassed
            }
        }
    
        async defaultPayload(): Promise<any> {
            return {
                name: 'adewale',
                pay: 'load default'
            }
        }
    
    }