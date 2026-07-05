<script setup>
import { onMounted, ref } from 'vue'
import { getProfile, getNotificationSettings, logout } from '../api/mockApi'
import { phonePretty } from '../utils/format'
const emit = defineEmits(['notifications','logged-out','toast','back'])
const user = ref(null), settings = ref(null)
onMounted(async()=>{ user.value = await getProfile(); settings.value = await getNotificationSettings() })
async function doLogout(){ await logout(); emit('logged-out') }
</script>
<template>
  <button class="btn link back" @click="emit('back')">‹ Назад</button>
  <section class="card panel center-card" style="margin-top:0">
    <h1>Профиль</h1>
    <div v-if="!user" class="loading">Загружаем…</div>
    <template v-else><div style="text-align:center; margin:24px 0"><div class="avatar lg" style="margin:auto">{{ phonePretty(user.phone).slice(-2) }}</div><h2 style="margin-top:12px">{{ phonePretty(user.phone) }}</h2></div>
    <button class="radio-card full" @click="emit('notifications')"><span>Уведомления</span><span class="badge" :class="settings?.push_enabled ? 'success' : 'neutral'" style="margin-left:auto">{{ settings?.push_enabled ? 'Включены' : 'Выключены' }}</span></button>
    <button class="btn ghost full" style="margin-top:18px" @click="doLogout">Выйти</button></template>
  </section>
</template>
