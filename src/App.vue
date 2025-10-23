<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserData } from './store/user.ts'

const router = useRouter()
const userData = useUserData()

router.beforeEach((to, _from) => {
    if (
        (
            to.meta['requiresAuth'] === undefined
            || to.meta['requiresAuth'] === true
        ) && !userData.isAuthenticated()
    ) {
        console.log('App/beforeEach: user is not authenticated, redirecting to auth-log')
        return {
            name: 'auth-login',
            query: {
                redirect: to.fullPath
            },
        }
    }
    return true
})
</script>

<template>
    <router-view/>
</template>
