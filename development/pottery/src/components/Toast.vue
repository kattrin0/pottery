<script setup>
defineProps({ message: String })
</script>
<template><div v-if="message" class="toast" role="status">{{ message }}</div></template>
