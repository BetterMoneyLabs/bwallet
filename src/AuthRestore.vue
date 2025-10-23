<script setup lang="ts">
import { ref } from 'vue'
import BreadCrumb from './BreadCrumb.vue'
import { useUserData } from './store/user'
import { useRouter } from 'vue-router'
import { isValidMnemonic, createSeed } from './util/ergo'

const pwd = ref('')
const mnemonic = ref('')
const errorMsg = ref('')
const userData = useUserData()
const router = useRouter()

function validatePwd(): boolean {
    errorMsg.value = ""
    if (!pwd.value) {
        errorMsg.value = 'Password field is empty'
        return false
    }
    return true
}

function validateMnemonic(): boolean {
    errorMsg.value = ""
    if (!isValidMnemonic(mnemonic.value)) {
        errorMsg.value = "Incorrect format of mnemonic data"
        return false
    }
    return true
}

async function onFormSubmit(): Promise<void> {
    errorMsg.value = ""
    if (userData.hasStorageData()) {
        router.push({'name': 'auth-restore'})
    }
    if (validatePwd() && validateMnemonic()) {
        userData.setPassword(pwd.value)
        const seed = createSeed(mnemonic.value)
        await userData.setSeedAsync(seed)
        router.push({'name': 'wallet-home'})
    }
}
</script>
<template>
    <BreadCrumb>
        <li class="breadcrumb-item active">Restore Wallet</li>
    </BreadCrumb>
    <template v-if="userData.hasStorageData()">
        <div>
            There is encrypted wallet data stored in local browser storage. 
            To restore a wallet from mnemonic you have to delete existing wallet first.
            Make sure you have downloaded backup file, if you need  the wallet you are gonna delete.
            Do you want to <RouterLink :to="{'name': 'auth-delete'}">delete</RouterLink> wallet data?
        </div>
    </template>
    <template v-else>
        <form @submit.stop.prevent="onFormSubmit">
            <div v-if="errorMsg">
                <span class="text-danger">{{ errorMsg }}</span>
            </div>
            <div class="mt-3">
                <label class="form-label">Password</label>
                <input class="form-control" v-model="pwd" type="password" />
            </div>
            <div class="mt-3">
                <label class="form-label">Mnemonic</label>
                <input class="form-control" v-model="mnemonic" type="text" />
            </div>
            <div class="mt-3">
                <button type="submit" class="btn btn-sm btn-primary">Restore Wallet</button>
            </div>
        </form>
    </template>
</template>
