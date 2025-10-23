<script setup lang="ts">
import { useUserData } from './store/user'
import BreadCrumb from './BreadCrumb.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { DecryptOperationError } from './crypto.js'

const errorMsg = ref("")
const pwd = ref("")
const router = useRouter()
const userData = useUserData()

function checkPwd(): boolean {
    errorMsg.value = ""
    if (!pwd.value.length) {
        errorMsg.value = "Password field is blank"
    }
    return true
}

async function onFormSubmit(): Promise<void> {
    errorMsg.value = ""
    if (!checkPwd()) {
        return
    }
    userData.setPassword(pwd.value)
    try {
        await userData.loadDataAsync()
    } catch(error) {
        if (error instanceof DecryptOperationError) {
            errorMsg.value = "Incorrect password"
        } else {
            console.log('Login/onFormSubmit: catch error', error)
            errorMsg.value = "Failed to load storage data"
        }
    }
    router.push({'name': 'wallet-home'})
}

</script>
<template>
    <BreadCrumb>
        <li class="breadcrumb-item active">Log In</li>
    </BreadCrumb>
    <div class="mt-3" v-if="userData.hasStorageData()">
        <form @submit.stop.prevent="onFormSubmit">
            <div v-if="errorMsg">
                <span class="text-danger">{{ errorMsg }}</span>
            </div>
            <div class="mt-3">
                <label class="form-label">Password</label>
                <input class="form-control" v-model="pwd" type="password" />
            </div>
            <div class="mt-3">
                <button type="submit" class="btn btn-sm btn-primary">Log In</button>
            </div>
        </form>
        <hr>
        There is encrypted wallet data stored in local browser storage. You
        can <RouterLink :to="{'name': 'auth-delete'}">delete it</RouterLink>. Make sure
        you have backup file downloaded.
    </div>
    <div v-else>
        There is not wallet data in local browser storage. Would you like to
        <RouterLink :to="{'name': 'auth-create'}">create</RouterLink> new wallet?
    </div>
</template>
