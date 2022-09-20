import { DID } from 'dids'
import { Core } from './core'
import {Ed25519Provider} from "key-did-provider-ed25519";
import KeyDidResolver from "key-did-resolver";

export class WebClient extends Core {

  constructor() {
    super()
  }

  async connectByJsDID(seed:Uint8Array): Promise<DID>{
    const provider = new Ed25519Provider(seed)
    const resolver = { ...KeyDidResolver.getResolver()}
    const did = new DID({ resolver })
    this._ceramic.did = did
    this._ceramic.did.setProvider(provider)
    await this._ceramic.did.authenticate()
    return did
  }
}
