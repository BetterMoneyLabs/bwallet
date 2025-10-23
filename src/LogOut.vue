<script setup lang="ts">
import { useUserData }  from './store/user'
import { useRouter } from 'vue-router'

const router = useRouter()
const userData = useUserData()
userData.setPassword(null)
router.push({'name': 'home'})
</script>
<template>
    <div><!-- empty --></div>
</template>
