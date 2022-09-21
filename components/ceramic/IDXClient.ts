import {WebClient} from "./clients";
import {DID} from "dids";
import {Ed25519Provider} from "key-did-provider-ed25519";
import KeyDidResolver from "key-did-resolver";

interface  UserInfo{
    name : string,
    sex: string,
    location:string,
    website:string,
    description:string
    cids:[]
}

export class IDXClient {

    // @ts-ignore
    _webClient: WebClient

    constructor() {
        this.createWebClient()
    }


    createWebClient() {
        this._webClient = new WebClient()
    }

    getJsDID(seed: Uint8Array): Promise<DID> {
        return this._webClient.connectByJsDID(seed)
    }


    async writeUserInfo(userInfo:UserInfo) {
        console.log(userInfo)
        await this._webClient.idx.set('basicProfile', userInfo)
    }

    async addOrUpdateUserInfoMetaData(kv: any) {
        await this._webClient.idx.merge("basicProfile", kv)
    }

    async readFiles():Promise<{}> {
        const result = await this._webClient.idx.get('basicProfile')
        // @ts-ignore
        return result
    }
}
