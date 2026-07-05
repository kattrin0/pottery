<script setup>
import { onMounted, ref } from 'vue'
import { getPrograms, getSlots } from '../api/mockApi.js'
import { daysFromToday, toDateInput, dateShort } from '../utils/format.js'
import SlotCard from '../components/SlotCard.vue'

const emit = defineEmits(['open-slot'])

const slots = ref([])
const programs = ref([])
const loading = ref(true)
const error = ref('')
const showFilters = ref(window.innerWidth >= 1024)

const defaultFrom = toDateInput(new Date())
const defaultTo = toDateInput(new Date(Date.now() + 30 * 86400000))
const filters = ref({
  from: defaultFrom,
  to: defaultTo,
  programIds: [],
  onlyFree: false
})

const activeFilters = () =>
  filters.value.programIds.length ||
  filters.value.onlyFree ||
  filters.value.from !== defaultFrom ||
  filters.value.to !== defaultTo

async function load() {
  loading.value = true
  error.value = ''
  try {
    programs.value = await getPrograms()
    slots.value = await getSlots(filters.value)
  } catch (err) {
    error.value = 'Не удалось загрузить расписание. Попробуйте позже.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

function toggleProgram(id) {
  const a = filters.value.programIds
  a.includes(id) ? a.splice(a.indexOf(id), 1) : a.push(id)
}

function reset() {
  filters.value = {
    from: defaultFrom,
    to: defaultTo,
    programIds: [],
    onlyFree: false
  }
  load()
}

onMounted(load)
</script>

<template>
  <div class="page-title">
    <div>
      <h1>Расписание</h1>
      <p>Слоты на ближайший месяц. Выберите занятие и запишитесь.</p>
        <button class="btn secondary" @click="showFilters = !showFilters">
      Фильтры <span v-if="activeFilters()">●</span>
    </button>
    </div>
  </div>

  <div class="filter-layout" :class="{ 'no-filters': !showFilters }">
    <aside v-if="showFilters" class="card panel filter-panel">
      <div style="display:flex; justify-content:space-between; align-items:center">
        <h2>Фильтры</h2>
        <button class="btn link" :disabled="!activeFilters()" @click="reset">Сбросить</button>
      </div>
      <div class="form-row">
        <label>Дата старта</label>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:5px">
          <input v-model="filters.from" type="date" />
          <input v-model="filters.to" type="date" />
        </div>
      </div>
      <div class="form-row">
        <label>Программа занятия</label>
        <div style="display:flex; flex-wrap:wrap; gap:8px">
          <button
            v-for="p in programs"
            :key="p.id"
            class="chip"
            :class="{active: filters.programIds.includes(p.id)}"
            @click="toggleProgram(p.id)"
          >
            {{ p.name }}
          </button>
        </div>
      </div>
      <label class="radio-card">
        <input v-model="filters.onlyFree" type="checkbox" /> Только со свободными местами
      </label>
      <button class="btn primary full" @click="load">Применить</button>
    </aside>

    <section>
      <div class="toolbar" aria-label="Быстрый выбор даты">
        <button
          v-for="d in daysFromToday(7)"
          :key="d.toISOString()"
          class="chip"
          @click="filters.from = toDateInput(d); filters.to = toDateInput(d); load()"
        >
          {{ dateShort(d) }}
        </button>
        <button v-if="activeFilters()" class="chip active" @click="reset">Сбросить фильтры</button>
      </div>

      <div v-if="loading" class="grid slots">
        <div v-for="i in 4" :key="i" class="skeleton"></div>
      </div>
      <div v-else-if="error" class="card error">
        <p>{{ error }}</p>
        <button class="btn primary" @click="load">Повторить</button>
      </div>
      <div v-else-if="!slots.length" class="card empty">
        <h2>{{ activeFilters() ? 'Нет слотов по условиям. Попробуйте изменить фильтры.' : 'Пока нет доступных занятий' }}</h2>
        <button v-if="activeFilters()" class="btn secondary" @click="reset">Сбросить фильтры</button>
      </div>
      <div v-else class="grid slots">
        <SlotCard v-for="slot in slots" :key="slot.id" :slot="slot" @open="emit('open-slot', $event)" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.filter-panel {
  padding-left: 16px !important;
}

.filter-layout {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 28px;
  align-items: start;
}

/* Когда фильтры скрыты, секция с расписанием занимает всю ширину */
.no-filters {
  grid-template-columns: 1fr !important;
}

/* Убеждаемся, что сетка с карточками работает правильно в обоих режимах */
.grid.slots {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}
</style>