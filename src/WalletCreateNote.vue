<script setup lang="ts">
import { ref } from 'vue'
import { Wallet, SecretKeys, SecretKey, Address } from 'ergo-lib-wasm-browser'
import * as ergo from 'ergo-lib-wasm-browser'
import useBasisClient from './BasisClient.ts'
import { blake2b } from 'blakejs';
import { secp256k1 } from '@noble/curves/secp256k1.js';
import BigNumber from 'bignumber.js';

const { skBytes, pkBytes } = defineProps({
    skBytes: Uint8Array,
    pkBytes: Uint8Array,
})
const bClient = useBasisClient()
const errorMsg = ref(null)
const demoAddress = "9gZ2dA88NkKVST3mZVEFHz8g7PFhysNQbpbi88iMBMau5qH6WMB"
const targetAddress = ref(demoAddress)
const amount = ref(10)

function checkTargetAddress(): boolean {
    errorMsg.value = ""
    if (!targetAddress.value) {
        errorMsg.value = "Recipient is blank"
        return false
    }
    return true
}


function bytesToBigNumber(bytes: Uint8Array): BigNumber {
  let result = new BigNumber(0);
  for (let i = 0; i < bytes.length; i++) {
    result = result.multipliedBy(256).plus(bytes[i]);
  }
  return result;
}

function generateRandomBigInt(max: bigint): bigint {
    const bitLength = max.toString(2).length;
    const byteLength = Math.ceil(bitLength / 8);
    let result: bigint;
    do {
        const randomBytesArray = randomBytes(byteLength);
        result = 0n;
        for (let i = 0; i < randomBytesArray.length; i++) {
            result = (result << 8n) | BigInt(randomBytesArray[i]);
        }
        const mask = (1n << BigInt(bitLength)) - 1n;
        result = result & mask;
    } while (result >= max);
    return result;
}

function bytesToBigInt(bytes: Uint8Array): bigint {
     let result = 0n;
     for (let i = 0; i < bytes.length; i++) {
         result = (result << 8n) | BigInt(bytes[i]);
     }
     return result;
}

// For secp256k1 curve (common in blockchain)
// val g: GroupElement = CryptoConstants.dlogGroup.generator
//
//     val pk = g.exp(secretKey.bigInteger)
//
//     val r = randBigInt
//     val a: GroupElement = g.exp(r.bigInteger)
//     val e = scorex.crypto.hash.Blake2b256(a.getEncoded.toArray ++ msg ++ pk.getEncoded.toArray)
//     val z = (r + secretKey * BigInt(e)) % CryptoConstants.groupOrder
function signMessage(skBytes: Uint8Array, msg: Uint8Array): Promise<Uint8Array> {
// ): Promise<{
//   pk: Uint8Array;
//   a: Uint8Array;
//   e: Uint8Array;
//   z: BigNumber;
// }> {
  
    const secretKey = bytesToBigInt(skBytes)
    const groupOrder = secp256k1.Point.Fn.ORDER

    // pk = G * secretKey
    const pk = secp256k1.Point.BASE.multiply(secretKey)
    const pkBytes = pk.toBytes(true); // compressed form
  
    // Generate random r
    const r = bytesToBigInt(secp256k1.utils.randomSecretKey())
  
    // a = G * r
    const a = secp256k1.Point.BASE.multiply(r)
    const aBytes = a.toBytes(true);
  
    // e = Blake2b256(a || msg || pk)
    const hashInput = new Uint8Array(aBytes.length + msg.length + pkBytes.length);
    hashInput.set(aBytes, 0);
    hashInput.set(msg, aBytes.length);
    hashInput.set(pkBytes, aBytes.length + msg.length);
    
    const e = bytesToBigInt(blake2b(hashInput, undefined, 32))
  
    // z = (r + secretKey * BigInt(e)) % groupOrder
    const eBigInt = bytesToBigInt(e)
    const z = (r + secretKey * e) % groupOrder
  
    return a + z 
}

function checkAmount(): boolean {
    errorMsg.value = ""
    if (!amount.value) {
        errorMsg.value = "Amount is blank"
        return false
    }
    return true
}

function convertToBytes(inputNumber: integer, numBytes: integer): Uint8Array {
    const buffer = new ArrayBuffer(numBytes)
    const view = new DataView(buffer)
    view.setUint32(0, inputNumber, false) // false for big-endian
    return new Uint8Array(buffer)
}

function getUnixTime(): integer {
    return Math.floor(Date.now() / 1000)
}

function bytesToHex(input: uint8Array): string {
    return Array.from(input)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
}

async function onFormSubmit() {
    if (!checkTargetAddress() || !checkAmount()) {
        return
    }
    //bClient.createNote(skBytes, pkBytes, targetAddress.value, amount.value).then(data => {
    const sk = SecretKey.from_bytes(skBytes)
    const sks = new SecretKeys()
    sks.add(sk)
    const wallet = Wallet.from_secrets(sks)
    const targetAddressBytes = Address.from_base58(targetAddress.value).to_bytes()
    const targetPKBytes = targetAddressBytes.slice(1, targetAddressBytes.length - 4)
    const timestamp = getUnixTime()
    const payloadBytes = targetPKBytes + convertToBytes(amount.value, 8)
        + convertToBytes(timestamp, 8)
    //const sign = wallet.sign_message_using_p2pk(sk.get_address(), payloadBytes)
    const sign = signMessage(skBytes, payloadBytes)

    const url = bClient.baseUrl + "/notes"
    const payload = {
        "recipient_pubkey": bytesToHex(targetPKBytes),
        "amount": amount.value,
        "timestamp": timestamp,
        "signature": bytesToHex(sign),
        "issuer_pubkey": bytesToHex(pkBytes)
    }
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload),
        })
        const data = await res.json()
        return data
    } catch(error: unknown) {
        console.log('BasisClient/getNotesByIssuer: network error=', error)
        throw error;
    }
}
</script>
<template>
<div>
    <h2 class="h5">Create New Note</h2>
    <form @submit.stop.prevent="onFormSubmit">
        <div v-if="errorMsg">
            <span class="text-danger">{{ errorMsg }}</span>
        </div>
        <div class="mt-3">
            <label class="form-label">Recepient</label>
            <input class="form-control" v-model="targetAddress" type="text" />
        </div>
        <div class="mt-3">
            <label class="form-label">Amount</label>
            <input class="form-control" v-model="amount" type="text" />
        </div>
        <div class="mt-3">
            <button type="submit" class="btn btn-sm btn-primary">Create Note</button>
        </div>
    </form>
</div>
</template>
