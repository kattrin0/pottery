self.addEventListener('install', (event) => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))
self.addEventListener('push', (event) => {
  const data = event.data?.json?.() || { title: 'Гончарка', body: 'Новое уведомление' }
  event.waitUntil(self.registration.showNotification(data.title, { body: data.body, icon: '/favicon.ico' }))
})
