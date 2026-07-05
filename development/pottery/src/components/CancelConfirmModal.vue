<script setup>
import { onMounted, ref } from 'vue'
import { previewCancelBooking, cancelBooking } from '../api/mockApi.js'
import { dateShort, time, rub } from '../utils/format.js'
import Modal from './Modal.vue'
const props = defineProps({ id: String })
const emit = defineEmits(['close', 'cancelled', 'toast'])
const data = ref(null), loading = ref(true), checked = ref(false), saving = ref(false)
onMounted(async()=>{ data.value = await previewCancelBooking(props.id); loading.value=false })
async function confirm(){ saving.value=true; try{ await cancelBooking(props.id); emit('toast','Бронь отменена'); emit('cancelled') } catch(e){ emit('toast', e.message || 'Не удалось отменить бронь. Попробуйте позже') } finally { saving.value=false } }
</script>
<template>
  <Modal title="Отмена записи" :closeable="false">
    <div v-if="loading" class="loading">Загружаем условия…</div>
    <template v-else>
      <p><b>{{ dateShort(data.booking.slot.start_at) }}, {{ time(data.booking.slot.start_at) }}</b><br/>{{ data.booking.slot.program.name }} · {{ data.booking.slot.master.name }}<br/>{{ rub(data.booking.price_total) }}</p>
      <div class="notice" :class="data.is_late ? 'warning' : 'success'"><b>{{ data.is_late ? 'Поздняя отмена' : 'Отмена без штрафа' }}</b><p v-if="data.is_late">До начала менее {{ data.policy.threshold_hours }} часов. Штраф: {{ data.policy.penalty_percent }}% от стоимости. Сумма: {{ rub(data.penalty_amount) }}.</p><p v-else>До начала более {{ data.policy.threshold_hours }} часов. Место освободится.</p></div>
      <label class="radio-card"><input type="checkbox" v-model="checked" /> Я понимаю условия отмены</label>
      <div style="display:grid; gap:10px"><button class="btn danger full" :disabled="!checked || saving" @click="confirm">{{ saving ? 'Отменяем…' : 'Подтвердить отмену' }}</button><button class="btn ghost full" @click="emit('close')">Оставить бронь</button></div>
    </template>
  </Modal>
</template>
