import { IDX } from '@ceramicstudio/idx'
import type { AlsoKnownAs, BasicProfile } from '@ceramicstudio/idx-constants'
import { Resolver } from 'did-resolver'
import KeyDidResolver from 'key-did-resolver'
import {CeramicClient} from "@ceramicnetwork/http-client";
const API_URL = 'https://ceramic-clay.3boxlabs.com/'

export class Core {
  // @ts-ignore
  _ceramic: CeramicClient
  _idx: IDX
  _resolver: Resolver

  constructor() {
    // @ts-ignore
    this._ceramic = new CeramicClient(API_URL)
    // @ts-ignore
    this._idx = new IDX({ ceramic: this._ceramic })
    this._resolver = new Resolver({
      ...KeyDidResolver.getResolver(),
    });
  }

  // @ts-ignore
  get ceramic(): CeramicClient {
    return this._ceramic
  }


  get idx(): IDX {
    return this._idx
  }

  get resolver(): Resolver {
    return this._resolver
  }

  async getAlsoKnownAs(id: string): Promise<AlsoKnownAs | null> {
    try {
      return await this._idx.get<AlsoKnownAs>('alsoKnownAs', id)
    } catch (err) {
      console.warn('Failed to load AKA accounts', id, err)
      return null
    }
  }

  async getProfile(id: string): Promise<BasicProfile | null> {
    try {
      return await this._idx.get<BasicProfile>('basicProfile', id)
    } catch (err) {
      console.warn('Failed to load profile', id, err)
      return null
    }
  }
}
