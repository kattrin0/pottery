<script setup>
import { ref } from 'vue'
import { createRating } from '../api/mockApi.js'
import Modal from './Modal.vue'
const props = defineProps({ booking: Object })
const emit = defineEmits(['close', 'saved', 'toast'])
const score = ref(0), comment = ref(''), saving = ref(false)
const labels = ['', 'Очень плохо', 'Плохо', 'Нормально', 'Хорошо', 'Отлично']
async function submit(){ saving.value=true; try { await createRating({ booking_id: props.booking.id, score: score.value, comment: comment.value }); emit('toast','Спасибо за оценку!'); emit('saved') } catch(e){ emit('toast', e.message || 'Не удалось сохранить оценку. Попробуйте позже') } finally { saving.value=false } }
</script>
<template>
  <Modal title="Оценка мастера" @close="emit('close')">
    <p>{{ booking.slot.program.name }} · {{ booking.slot.master.name }}</p>
    <template v-if="booking.rating"><div class="notice success">Вы уже оставили оценку: {{ booking.rating.score }} из 5</div></template>
    <template v-else>
      <h3 style="text-align:center">Как прошло занятие?</h3>
      <div class="stars"><button v-for="n in 5" :key="n" class="star" :class="{active:n<=score}" @click="score=n" :aria-label="`${n} из 5`">★</button></div>
      <p style="text-align:center"><b>{{ labels[score] || 'Выберите оценку' }}</b></p>
      <div class="form-row"><label>Поделитесь впечатлением</label><textarea v-model="comment" placeholder="Комментарий необязателен"></textarea></div>
      <button class="btn primary full" :disabled="!score || saving" @click="submit">{{ saving ? 'Сохраняем…' : 'Отправить оценку' }}</button>
      <button class="btn link full" @click="emit('close')">Пропустить</button>
    </template>
  </Modal>
</template>
