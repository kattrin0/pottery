<script setup>
const props = defineProps({ status: String, freeSeats: Number, slotStatus: String })
const map = {
  active: ['success', 'активна'], cancelled: ['neutral', 'отменена'],
  late_cancel: ['warning', 'поздняя отмена'], cancelled_by_workshop: ['danger', 'отменено мастерской'],
  scheduled: ['success', 'доступно'], cancelledSlot: ['danger', 'отменено мастерской'], noSeats: ['danger', 'мест нет'], lowSeats: ['warning', 'мало мест']
}
function info() {
  if (props.status) return map[props.status] || ['neutral', props.status]
  if (props.slotStatus === 'cancelled') return map.cancelledSlot
  if (props.freeSeats === 0) return map.noSeats
  if (props.freeSeats <= 2) return map.lowSeats
  return map.scheduled
}
</script>
<template>
  <span class="badge" :class="info()[0]">{{ info()[1] }}</span>
</template>
