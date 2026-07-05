<template>
  <footer class="footer">
    <div class="footer__inner">
      <p class="footer__copyright">© {{ year }} Гончарка. Все права защищены.</p>
      <div class="footer__links">

        <span>автор: <a href="https://t.me/your_telegram" target="_blank" rel="noopener noreferrer">Аверкиева Екатерина</a></span>
               
        <span class="footer__divider">|</span>
        <span>Сделано с ❤️</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>

<style scoped>
.footer {
  background: rgba(255, 250, 243, 0.86);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1px solid var(--line);
  padding: 20px 40px;
  margin-top: auto;
}

.footer__inner {
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.footer__copyright {
  font-size: 14px;
  color: var(--muted);
  margin: 0;
}

.footer__links {
  font-size: 14px;
  color: var(--muted);
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.footer__divider {
  color: var(--line);
}

.footer__links a {
  color: var(--brand);
  text-decoration: none;
  transition: color 0.2s;
}

.footer__links a:hover {
  color: var(--brand-2);
  text-decoration: underline;
}

@media (max-width: 767px) {
  .footer {
    padding: 16px 20px;
  }
  .footer__inner {
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }
  .footer__links {
    justify-content: center;
  }
}
</style>