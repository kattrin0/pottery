<script setup>
import StatusBadge from './StatusBadge.vue'
import { dateShort, time, durationText, rub } from '../utils/format.js'

defineProps({ slot: Object })
defineEmits(['open'])

const initials = (name) => {
  if (!name) return '??'
  return name.split(' ').map(x => x[0]).join('').slice(0, 2)
}
</script>

<template>
  <button class="slot-card card" @click="$emit('open', slot.id)">
    <div class="slot-top">
      <div>
        <div class="slot-date">{{ dateShort(slot.start_at) }}</div>
        <div class="price">{{ time(slot.start_at) }}</div>
      </div>
      <StatusBadge :free-seats="slot.free_seats" :slot-status="slot.status" />
    </div>
    <div>
      <h3>{{ slot.program?.name || 'Без названия' }}</h3>
      <div class="meta">{{ durationText(slot.duration_minutes) }} · {{ slot.address }}</div>
    </div>
    <div class="master">
      <span class="avatar">{{ initials(slot.master?.name) }}</span>
      <div>
        <b>{{ slot.master?.name || 'Мастер не указан' }}</b>
        <div class="meta">Мастер</div>
      </div>
    </div>
    <div class="kv-row">
      <span>Места</span>
      <b>{{ slot.free_seats }} из {{ slot.total_seats }} свободно</b>
    </div>
    <div class="kv-row">
      <span>Цена</span>
      <b>{{ rub(slot.price) }}</b>
    </div>
  </button>
</template>