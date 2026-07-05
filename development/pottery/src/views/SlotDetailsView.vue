<script setup>
import { onMounted, ref } from 'vue'
import { getSlot } from '../api/mockApi.js'
import { dateLong, time, addMinutes, durationText, rub } from '../utils/format.js'
import StatusBadge from '../components/StatusBadge.vue'

const props = defineProps({ id: String })
const emit = defineEmits(['back', 'book'])

const slot = ref(null)
const loading = ref(true)

const initials = (name) => {
  if (!name) return '??'
  return name.split(' ').map(x => x[0]).join('').slice(0, 2)
}

onMounted(async () => {
  try {
    slot.value = await getSlot(props.id)
  } catch (e) {
    // ошибка останется, но компонент покажет "Слот не найден"
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <button class="btn link back" @click="emit('back')">‹ Назад к расписанию</button>
  <div v-if="loading" class="skeleton"></div>
  <div v-else-if="!slot" class="card error">Слот не найден</div>
  <div v-else class="two-col">
    <section class="card panel">
      <div style="display:flex; justify-content:space-between; gap:12px">
        <h1>Занятие</h1>
        <StatusBadge :free-seats="slot.free_seats" :slot-status="slot.status" />
      </div>
      <h2>{{ dateLong(slot.start_at) }}</h2>
      <div class="price">{{ time(slot.start_at) }} — {{ time(addMinutes(slot.start_at, slot.duration_minutes)) }} · {{ durationText(slot.duration_minutes) }}</div>
      <h2 style="margin-top:24px">{{ slot.program?.name || 'Без названия' }}</h2>
      <p>{{ slot.description }}</p>
      <div v-if="slot.status === 'cancelled'" class="notice danger">
        <b>Занятие отменено мастерской.</b><br/>
        Причина: {{ slot.cancellation_reason }}
      </div>
    </section>
    <aside class="card panel">
      <div class="master">
        <span class="avatar lg">{{ initials(slot.master?.name) }}</span>
        <div>
          <h3>{{ slot.master?.name || 'Мастер не указан' }}</h3>
          <div class="meta">Мастер</div>
        </div>
      </div>
      <div class="kv" style="margin-top:20px">
        <div class="kv-row"><span>Места</span><b>{{ slot.free_seats }} из {{ slot.total_seats }} свободно</b></div>
        <div class="kv-row"><span>Адрес</span><b>{{ slot.address }}</b></div>
        <div class="kv-row"><span>Цена</span><b>{{ rub(slot.price) }}</b></div>
      </div>
      <button class="btn primary full" style="margin-top:22px" :disabled="slot.status === 'cancelled' || slot.free_seats === 0" @click="emit('book', slot.id)">
        {{ slot.status === 'cancelled' ? 'Отменено мастерской' : slot.free_seats === 0 ? 'Мест нет' : 'Записаться' }}
      </button>
    </aside>
  </div>
</template>