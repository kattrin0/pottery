<script setup>
import { onMounted, ref } from 'vue'
import { getNotificationSettings, updateNotificationSettings } from '../api/mockApi'
const emit = defineEmits(['back','toast'])
const settings = ref(null), permission = ref('default')
onMounted(async()=>{ settings.value = await getNotificationSettings(); permission.value = 'Notification' in window ? Notification.permission : 'unsupported' })
async function enable(){ if(permission.value === 'unsupported'){ emit('toast','Ваш браузер не поддерживает push-уведомления'); return } const p = await Notification.requestPermission(); permission.value=p; if(p==='granted'){ settings.value = await updateNotificationSettings({ push_enabled:true, subscription_endpoint:'demo-endpoint' }); emit('toast','Уведомления включены') } }
async function patch(key){ const old = settings.value[key]; settings.value[key] = !old; try { settings.value = await updateNotificationSettings({ [key]: settings.value[key] }) } catch { settings.value[key]=old; emit('toast','Не удалось сохранить настройки') } }
</script>
<template>
  <button class="btn link back" @click="emit('back')">‹ Профиль</button>
  <section class="card panel center-card" style="width:min(560px,92vw); margin-top:0">
    <h1>Уведомления</h1>
    <div v-if="!settings" class="loading">Загружаем…</div>
    <template v-else>
      <div class="kv-row"><span>Push-уведомления</span><span class="badge" :class="permission==='denied' ? 'danger' : settings.push_enabled ? 'success' : 'neutral'">{{ permission==='denied' ? 'Заблокированы' : settings.push_enabled ? 'Включены' : 'Выключены' }}</span></div>
      <div v-if="permission==='unsupported'" class="notice warning">Ваш браузер не поддерживает push-уведомления.</div>
      <div v-else-if="permission==='denied'" class="notice warning">Вы запретили уведомления в настройках браузера. Нажмите на иконку замка в адресной строке.</div>
      <button v-else-if="!settings.push_enabled" class="btn primary full" style="margin:16px 0" @click="enable">Включить уведомления</button>
      <button class="toggle-row" :disabled="!settings.push_enabled" @click="patch('reminders_enabled')"><span><b>Напоминания о записи</b><br/><span class="meta">За день и за час до занятия</span></span><span class="switch" :class="{on: settings.reminders_enabled}"></span></button>
      <button class="toggle-row" :disabled="!settings.push_enabled" @click="patch('cancellation_enabled')"><span><b>Уведомления об отмене</b><br/><span class="meta">Мгновенное уведомление при отмене мастерской</span></span><span class="switch" :class="{on: settings.cancellation_enabled}"></span></button>
      <div class="notice">Уведомления приходят в браузер. В демо сохраняется только состояние настроек.</div>
    </template>
  </section>
</template>
