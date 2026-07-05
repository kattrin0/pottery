<script setup>
defineProps({ title: String, closeable: { type: Boolean, default: true } })
defineEmits(['close'])
</script>
<template>
  <div class="modal-backdrop" @click.self="closeable && $emit('close')">
    <section class="modal" role="dialog" aria-modal="true" :aria-label="title">
      <div class="modal-header">
        <h2>{{ title }}</h2>
        <button v-if="closeable" class="icon-btn" @click="$emit('close')" aria-label="Закрыть">×</button>
      </div>
      <div class="modal-body"><slot /></div>
    </section>
  </div>
</template>
