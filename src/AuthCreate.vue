<script setup lang="ts">
import { ref } from 'vue'
import BreadCrumb from './BreadCrumb.vue'
import { useUserData } from './store/user'
import { useRouter } from 'vue-router'

const PWD_MIN_LEN = 3
const pwd = ref('')
const pwdDup = ref('')
const errorMsg = ref('')
const userData = useUserData()
const router = useRouter()

function validatePwd(): boolean {
    errorMsg.value = ""
    if (pwd.value.length < PWD_MIN_LEN) {
        errorMsg.value = `Password must be not less than ${PWD_MIN_LEN} symbols`;
        return false
    }
    return true
}

function validatePwdDup(): boolean {
    errorMsg.value = ""
    if (pwd.value != pwdDup.value) {
        errorMsg.value = "Password confirmation is wrong"
        return false
    }
    return true
}

function onFormSubmit(): void {
    errorMsg.value = ""
    if (userData.hasStorageData()) {
        router.push({'name': 'auth-create'})
    }
    if (validatePwd() && validatePwdDup()) {
        userData.setPassword(pwd.value)
        router.push({'name': 'auth-mnemonic'})
    }
}
</script>
<template>
    <BreadCrumb>
        <li class="breadcrumb-item active">Create New Wallet</li>
    </BreadCrumb>
    <template v-if="userData.hasStorageData()">
        <div>
            There is encrypted wallet data stored in local browser storage. 
            To create new wallet you have to delete existing wallet.
            Make sure you have downloaded backup file.
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
                <label class="form-label">Password</label>
                <input class="form-control" v-model="pwdDup" type="password" />
            </div>
            <div class="mt-3">
                <button type="submit" class="btn btn-sm btn-primary">Create Wallet</button>
                <span class="ps-2">
                    or <RouterLink :to="{'name': 'auth-login'}">log in</RouterLink>
                </span>
            </div>
        </form>
    </template>
</template>
