<script setup lang="ts">
</script>
<template>
    <h1 class="h3">BWallet</h1>
    <div>
        <RouterLink :to="{'name': 'auth-login'}" custom v-slot="{navigate, href}">
            <a class="mb-2 btn btn-sm btn-primary" @click="navigate" :href="href">Log In</a>
        </RouterLink>
        or
        <RouterLink :to="{'name': 'auth-create'}" custom v-slot="{navigate, href}">
            <a class="mb-2 btn btn-sm btn-primary" :href="href" @click="navigate">Create New Wallet</a>
        </RouterLink>
        or
        <RouterLink :to="{'name': 'auth-restore'}" custom v-slot="{navigate, href}">
            <a class="mb-2 btn btn-sm btn-primary" :href="href" @click="navigate">Restore Wallet</a>
        </RouterLink>
    </div>
</template>
