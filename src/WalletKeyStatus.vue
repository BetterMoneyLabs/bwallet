<script setup lang="ts">
import { ref } from 'vue'
import useBasisClient from './BasisClient.ts'

const keyStatus = ref<null|object>(null)
const bClient = useBasisClient()
const { pkBytes } = defineProps<{
    pkBytes: Uint8Array,
}>()

bClient.getKeyStatus(pkBytes).then(data => {
    keyStatus.value = data
})
</script>
<template>
<div>
    Key Status:
    <pre>{{ keyStatus }}</pre>
</div>
</template>
