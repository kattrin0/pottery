<script setup>
defineProps({ active: String, user: Object })
defineEmits(['navigate', 'go-home'])
</script>

<template>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Ruslan+Display&display=swap" rel="stylesheet">
  <header class="header">
    <div class="header-inner">
      <div class="logo" @click="$emit('go-home')">
        <span class="ruslan-display-regular">Гончарка</span>
      </div>
      <nav class="nav" aria-label="Основная навигация">
        <button :class="{ active: active === 'home' }" @click="$emit('go-home')">Главная</button>
        <button :class="{ active: active === 'schedule' }" @click="$emit('navigate', 'schedule')">Расписание</button>
        <button :class="{ active: active === 'bookings' }" @click="$emit('navigate', 'bookings')">Мои записи</button>
        <!-- Профиль – внутри nav, но с классом для позиционирования -->
        <button class="profile-btn" :class="{ active: active === 'profile' }" @click="$emit('navigate', 'profile')">
           Профиль
        </button>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.ruslan-display-regular {
  font-family: "Ruslan Display", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 2.2rem;
}
</style>