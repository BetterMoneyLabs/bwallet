<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserData } from './store/user'
import { createRandomSeed } from './util/ergo'
import BreadCrumb from './BreadCrumb.vue'

const router = useRouter()
const userData = useUserData()
if (userData.hasStorageData() || !userData.password) {
    router.push({'name': 'auth-create'})
}
const seed = createRandomSeed();

async function finishWalletCreation(): Promise<void> {
    await userData.setSeedAsync(seed.seed)
    router.push({'name': 'wallet-home'})
}
</script>
<template>
    <BreadCrumb>
        <li class="breadcrumb-item active">Generate Mnemonic</li>
    </BreadCrumb>
    <div>
        These 12 words phrase is called mnemonic.
        You can use it to restore your wallet. Keep it in a secret place.
    </div>
    <div class="mt-3">
        <code>{{ seed.mnemonic }}</code>
    </div>
    <div>
        <a href="#" @click="finishWalletCreation" class="mt-3 btn btn-sm btn-primary">I have rembmered mnemonic</a>
    </div>
</template>
