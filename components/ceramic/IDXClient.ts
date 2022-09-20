import {WebClient} from "./clients";
import {APP_NETWORK} from "./config";
import {DID} from "dids";

interface  UserInfo{
    name : string,
    sex: string,
    location:string,
    website:string,
    description:string
}

export class IDXClient {

    // @ts-ignore
    _webClient: WebClient

    constructor() {
        this.createWebClient()
    }


    createWebClient() {
        this._webClient = new WebClient(APP_NETWORK)
    }

    getJsDID(seed: Uint8Array): Promise<DID> {
        return this._webClient.connectByJsDID(seed)
    }

    async getDID(address: string, provider: any): Promise<DID> {
        if (!this._webClient) {
            this.createWebClient()
        }

        const did: DID = await this._webClient.authenticateByAddress(address, provider, true)
        return did
    }

    async writeUserInfo(userInfo:UserInfo) {
        await this._webClient.idx.set('basicProfile', userInfo)
    }

    async addOrUpdateUserInfoMetaData(kv: any) {
        await this._webClient.idx.merge("basicProfile", kv)
    }


    async readUserInfo():Promise<{}> {
        const result = await this._webClient.idx.get('basicProfile')
        console.log("readUserInfo:" + result)
        // @ts-ignore
        return result
    }

}
