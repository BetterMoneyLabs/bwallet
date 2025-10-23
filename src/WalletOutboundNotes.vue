<script setup lang="ts">
import { ref } from 'vue'
import useBasisClient from './BasisClient.ts'

const outboundNotes = ref<null|object>(null)
const bClient = useBasisClient()
const { pkBytes } = defineProps<{
    pkBytes: Uint8Array,
}>()

bClient.getNotesByIssuer(pkBytes).then(data => {
    outboundNotes.value = data
})
</script>
<template>
<div>
    Outbound Notes:
    <pre>{{ outboundNotes }}</pre>
</div>
</template>
