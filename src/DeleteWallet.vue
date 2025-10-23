<script setup lang="ts">
import { ref } from 'vue'
import { useUserData } from './store/user'
import BreadCrumb from './BreadCrumb.vue'

const userData = useUserData()
const msg = ref("");

function deleteStorageData(): void {
    userData.deleteStorageData()
    msg.value = "Wallet data has been deleted!"
}

</script>
<template>
    <BreadCrumb>
        <li class="breadcrumb-item active">Delete Wallet</li>
    </BreadCrumb>
    <div class="alert alert-primary" v-if="msg">{{ msg }}</div>
    <div v-if="!userData.hasStorageData()">
        There is no wallet data stored in browser local storage.
    </div>
    <div v-else>
        <div>
            Make sure you have downloaded wallet data file.
        </div>
        <div class="mt-3">
            <a class="btn btn-sm btn-danger" href="#" @click="deleteStorageData">Delete Wallet Data</a>
            <span class="ps-2">
                or <RouterLink :to="{'name': 'home'}">go home</RouterLink>
            </span>
        </div>
    </div>
</template>
