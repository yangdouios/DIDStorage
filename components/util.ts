import {BigNumber, utils} from "ethers";


export function getSeedFromAddress(address: any) {
    const hash = utils.keccak256(address.toString());
    console.log(hash)
    // @ts-ignore
    const array = hash
        // @ts-ignore
        .replace('0x', '')
        // @ts-ignore
        .match(/.{2}/g)
        .map((hexNoPrefix) => BigNumber.from('0x' + hexNoPrefix).toNumber())
    const seed = JSON.parse(JSON.stringify(array));
    return seed;
}
