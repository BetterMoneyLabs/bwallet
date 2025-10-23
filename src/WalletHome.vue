<script setup lang="ts">
// https://github.com/ergoplatform/sigma-rust/blob/develop/bindings/ergo-lib-wasm/examples/address-generation-demo/index.ts
// import { generateMnemonic } from 'bip39'
import * as ergo from 'ergo-lib-wasm-browser'
// import { createSeed } from './util/seed'
import { useUserData } from './store/user.js'
// import BreadCrumb from './BreadCrumb.vue'
import { ref } from 'vue'
import WalletKeyStatus from './WalletKeyStatus.vue'
import WalletOutboundNotes from './WalletOutboundNotes.vue'
import WalletCreateNote from './WalletCreateNote.vue'
import useBasisClient from './BasisClient.ts'

//const mnemonic = generateMnemonic()
const userData = useUserData()
const walletAddress = ref("")
const reserves = ref({})
const recentTrackerEvents = ref({})
const pkBytes = ref(null);
const skBytes = ref(null);

const bClient = useBasisClient()
// Check for userData is required to conform type check for null
// const mnemonic = "liar exercise solve delay betray sheriff method empower disease river recall vacuum"
// const seedErgo = createSeed(mnemonic, '')
const rootSecretKey = ergo.ExtSecretKey.derive_master(userData.seed)
// This is using EIP-3 pathing: m/44'/429'/0'/0/0
// First param is 0' (account) and the last 0 (address index)
const changePath = ergo.DerivationPath.new(0, new Uint32Array([0]))
const walletSecretKey = rootSecretKey.derive(changePath)
const walletPublicKey = walletSecretKey.public_key()
// console.log(walletPublicKey)
// console.log(walletSecretKey)
walletAddress.value = ergo.NetworkAddress.new(
        ergo.NetworkPrefix.Mainnet, walletPublicKey.to_address()
    ).to_base58()
pkBytes.value = walletPublicKey.pub_key_bytes()
skBytes.value = walletSecretKey.secret_key_bytes()
// bClient.getReserves(walletPublicKey.pub_key_bytes()).then(data => {
//     reserves.value = data
// })
// bClient.getRecentTrackerEvents().then(data => {
//     recentTrackerEvents.value = data
// })

</script>

<template>
    <template v-if="walletAddress">
        <!-- <BreadCrumb> -->
        <!--     <li class="breadcrumb-item active">Wallet</li> -->
        <!-- </BreadCrumb> -->
        <div>
            <RouterLink :to="{'name': 'wallet-home'}">BWallet</RouterLink>
            | <RouterLink :to="{'name': 'auth-delete'}">Delete Wallet</RouterLink>
            | <RouterLink :to="{'name': 'auth-logout'}">Log Out</RouterLink>
        </div>
        <div class="mt-3">
            Wallet address: {{ walletAddress }}
        </div>
        <div class="mt-3">
            <WalletCreateNote :sk-bytes="skBytes" :pk-bytes="pkBytes" />
        </div>
        <div class="mt-3">
            <WalletKeyStatus :pk-bytes="pkBytes" />
        </div>
        <div class="mt-3">
            <WalletOutboundNotes :pk-bytes="pkBytes" />
        </div>
    </template>
</template>
