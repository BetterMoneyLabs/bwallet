// https://github.com/ergoplatform/sigma-rust/blob/develop/bindings/ergo-lib-wasm/examples/address-generation-demo/index.ts
import { generateMnemonic } from 'bip39'
import * as ergo from 'ergo-lib-wasm-browser'

const RE_VALID_MNEMONIC_STRICT = RegExp('^(?:[a-z]+ ){11}[a-z]+$')

export function isValidMnemonic(text: string): boolean {
    return RE_VALID_MNEMONIC_STRICT.test(text)
}

export function createRandomMnemonic(): string {
    return generateMnemonic()
}

export function createSeed(mnemonic: string): Uint8Array {
    if (!isValidMnemonic(mnemonic)) {
        throw new Error(
            "Internal error: invalid mnemonic format"
        )
    }
    return ergo.Mnemonic.to_seed(mnemonic, '')
}

type MnemonicSeed = {
    mnemonic: string,
    seed: Uint8Array
}

export function createRandomSeed(): MnemonicSeed {
    const mnemonic = createRandomMnemonic()
    return {
        mnemonic: mnemonic,
        seed: createSeed(mnemonic)
    }
}
