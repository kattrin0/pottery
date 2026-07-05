<script setup>
import { ref, computed } from 'vue'
import { sendOtp, verifyOtp } from '../api/mockApi'
import { phonePretty } from '../utils/format'
const emit = defineEmits(['logged-in', 'toast'])
const step = ref('phone')
const phone = ref('+7 ')
const code = ref('')
const loading = ref(false)
const error = ref('')
const validPhone = computed(() => phone.value.replace(/\D/g, '').length >= 11)
async function requestCode() {
  error.value = ''
  if (!validPhone.value) { error.value = 'Похоже, номер введён не полностью'; return }
  loading.value = true
  try { await sendOtp(phone.value); step.value = 'code'; emit('toast', 'Демо-код: 1111') }
  catch { error.value = 'Не удалось войти. Попробуйте ещё раз' }
  finally { loading.value = false }
}
async function login() {
  error.value = ''
  if (code.value.length < 4) return
  loading.value = true
  try { const { user } = await verifyOtp(phone.value, code.value); emit('logged-in', user) }
  catch { error.value = 'Неверный код. Проверьте и введите ещё раз'; code.value = '' }
  finally { loading.value = false }
}
</script>
<template>
  <main class="center-card card panel">
    <div class="login-art"><div class="logo" style="justify-content:center"><span class="logo-mark"></span>Гончарка</div></div>
    <template v-if="step === 'phone'">
      <h1>Вход</h1>
      <p>Введите номер телефона</p>
      <div class="form-row"><label for="phone">Телефон</label><input id="phone" v-model="phone" inputmode="tel" placeholder="+7 (___) ___-__-__" autofocus /></div>
      <div v-if="error" class="input-error">{{ error }}</div>
      <button class="btn primary full" :disabled="!validPhone || loading" @click="requestCode">{{ loading ? 'Отправляем…' : 'Получить код' }}</button>
    </template>
    <template v-else>
      <button class="btn link back" @click="step = 'phone'">‹ Изменить номер</button>
      <h1>Код из SMS</h1>
      <p>Мы отправили код на {{ phonePretty(phone) }}. В демо используйте <b>1111</b>.</p>
      <div class="form-row"><label for="code">Код из SMS</label><input id="code" v-model="code" maxlength="4" inputmode="numeric" placeholder="1111" autofocus @keyup.enter="login" /></div>
      <div v-if="error" class="input-error">{{ error }}</div>
      <button class="btn primary full" :disabled="code.length < 4 || loading" @click="login">{{ loading ? 'Проверяем…' : 'Войти' }}</button>
      <button class="btn link full" style="margin-top:12px" @click="requestCode">Отправить код повторно</button>
    </template>
  </main>
</template>
