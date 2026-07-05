<script setup>
import { computed, onMounted, ref } from 'vue'
import { getSession } from './api/mockApi.js'
import AppHeader from './components/AppHeader.vue'
import Toast from './components/Toast.vue'
import BookingSuccessModal from './components/BookingSuccessModal.vue'
import LoginView from './views/LoginView.vue'
import HomeView from './views/HomeView.vue' // ← добавить
import ScheduleView from './views/ScheduleView.vue'
import SlotDetailsView from './views/SlotDetailsView.vue'
import BookingView from './views/BookingView.vue'
import MyBookingsView from './views/MyBookingsView.vue'
import BookingDetailsView from './views/BookingDetailsView.vue'
import ProfileView from './views/ProfileView.vue'
import NotificationsView from './views/NotificationsView.vue'
import AppFooter from './components/AppFooter.vue' //

const user = ref(null)
const route = ref({ name: 'loading' })
const toast = ref('')
const successBooking = ref(null)
let toastTimer = null

function showToast(message) {
  toast.value = message
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = '' }, 3200)
}

function navigate(name, params = {}) {
  route.value = { name, ...params }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const activeNav = computed(() => {
  if (route.value.name === 'bookings' || route.value.name === 'booking-details') return 'bookings'
  if (route.value.name === 'home') return 'home'
  if (route.value.name === 'profile' || route.value.name === 'notifications') return 'profile'
  return 'schedule'
})

onMounted(async () => {
  user.value = await getSession()
  navigate(user.value ? 'home' : 'login')
})
</script>

<template>
  <div class="app-shell">
    <AppHeader
      v-if="user && route.name !== 'login'"
      :user="user"
      :active="activeNav"
      @navigate="navigate"
      @go-home="navigate('home')"
    />
    
    <!-- Главная страница без обертки .main -->
    <HomeView
      v-if="route.name === 'home' && user"
      @navigate="navigate"
    />

    <!-- Остальные страницы внутри .main -->
    <main v-else-if="route.name !== 'login'" class="main">
      <div v-if="route.name === 'loading'" class="card loading">Загружаем…</div>
      <ScheduleView v-else-if="route.name === 'schedule'" @open-slot="navigate('slot', { id: $event })" />
      <SlotDetailsView v-else-if="route.name === 'slot'" :id="route.id" @back="navigate('schedule')" @book="navigate('booking', { id: $event })" />
      <BookingView v-else-if="route.name === 'booking'" :id="route.id" @back="navigate('slot', { id: route.id })" @success="successBooking = $event" @to-schedule="navigate('schedule')" @toast="showToast" />
      <MyBookingsView v-else-if="route.name === 'bookings'" @open="navigate('booking-details', { id: $event })" @schedule="navigate('schedule')" />
      <BookingDetailsView v-else-if="route.name === 'booking-details'" :id="route.id" @back="navigate('bookings')" @toast="showToast" />
      <ProfileView v-else-if="route.name === 'profile'" @notifications="navigate('notifications')" @logged-out="user=null; navigate('login')" @back="navigate('schedule')" @toast="showToast" />
      <NotificationsView v-else-if="route.name === 'notifications'" @back="navigate('profile')" @toast="showToast" />
    </main>

    <LoginView v-else @logged-in="user=$event; navigate('home')" @toast="showToast" />
    <BookingSuccessModal v-if="successBooking" :booking="successBooking" @toast="showToast" @close="successBooking=null; navigate('schedule')" @bookings="successBooking=null; navigate('bookings')" />
    <Toast :message="toast" />
     <AppFooter v-if="route.name !== 'login'" />
  </div>
</template>