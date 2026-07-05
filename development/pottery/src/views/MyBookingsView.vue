<script setup>
import { computed, onMounted, ref } from 'vue'
import { getBookings } from '../api/mockApi.js'
import { dateShort, time, rub } from '../utils/format.js'
import StatusBadge from '../components/StatusBadge.vue'
const emit = defineEmits(['open', 'schedule'])
const bookings = ref([]), loading = ref(true), tab = ref('upcoming')
async function load(){ loading.value=true; bookings.value = await getBookings(); loading.value=false }
onMounted(load)
const upcoming = computed(()=> bookings.value.filter(b => b.status === 'active' && new Date(b.slot.start_at) > new Date()).sort((a,b)=>new Date(a.slot.start_at)-new Date(b.slot.start_at)))
const past = computed(()=> bookings.value.filter(b => b.status !== 'active' || new Date(b.slot.start_at) <= new Date()).sort((a,b)=>new Date(b.slot.start_at)-new Date(a.slot.start_at)))
const visible = computed(()=> tab.value === 'upcoming' ? upcoming.value : past.value)
</script>
<template>
  <div class="page-title"><div><h1>Мои записи</h1><p>Предстоящие активные записи и история отменённых/прошедших занятий.</p><button class="btn ghost" @click="load">Обновить</button></div></div>
  <div class="segment" style="margin-bottom:18px">
    <button :class="{active: tab === 'upcoming'}" @click="tab='upcoming'">Предстоящие</button>
    <button :class="{active: tab === 'past'}" @click="tab='past'">Прошедшие</button>
  </div>
  <div v-if="loading" class="skeleton"></div>
  <div v-else-if="!bookings.length" class="card empty"><h2>У вас пока нет записей</h2><button class="btn primary" @click="emit('schedule')">Записаться на занятие</button></div>
  <div v-else-if="!visible.length" class="card empty"><h2>{{ tab === 'upcoming' ? 'Нет предстоящих записей' : 'Нет прошедших записей' }}</h2><button class="btn secondary" @click="emit('schedule')">Записаться на занятие</button></div>
  <div v-else class="card"><table class="table"><thead><tr><th>Дата</th><th>Программа</th><th>Мастер</th><th>Инструменты</th><th>Цена</th><th>Статус</th></tr></thead><tbody><tr v-for="b in visible" :key="b.id" class="clickable" @click="emit('open', b.id)"><td><b>{{ dateShort(b.slot.start_at) }}</b><br/><span class="meta">{{ time(b.slot.start_at) }}</span></td><td>{{ b.slot.program.name }}</td><td>{{ b.slot.master.name }}</td><td>{{ b.use_rental ? 'Прокат' : 'Свои' }}</td><td>{{ rub(b.price_total) }}</td><td><StatusBadge :status="b.status" /></td></tr></tbody></table></div>
</template>
