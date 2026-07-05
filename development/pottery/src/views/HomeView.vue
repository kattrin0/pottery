<template>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Ruslan+Display&display=swap" rel="stylesheet">
  
  <div class="home">
    <!-- Блок 1: Герой (цветной фон) -->
    <section class="cta full-width">
      <div class="container">
        <span class="ruslan-display-regular">Гончарка</span>
        <p>Творческое пространство, где глина превращается в искусство.<br>Мастер-классы для всех уровней, опытные мастера и уютная атмосфера.</p>
      </div>
    </section>
    

    <!-- Блок 2: О нас (белый фон) с картинкой справа -->
    <section class="about full-width">
      <div class="container">
        <div class="about-wrapper">
          <div class="about-text">
            <h2>О мастерской</h2>
            <p>Мы — команда профессиональных гончаров, которые влюблены в своё дело. Наша мастерская открыта для всех, кто хочет попробовать себя в работе с глиной, независимо от возраста и опыта. Мы предоставляем все необходимые материалы, инструменты и, конечно, душевную атмосферу.</p>
            <p>Занятия проходят в просторной светлой студии с видом на город. У нас есть всё для комфортного творчества: гончарные круги, печи для обжига, большой выбор глазурей и формочек.</p>
            <p><strong>Наш адрес:</strong> г. Воронеж, ул. Гончарная, 12, цех 3, вход со двора. Мы работаем ежедневно с 10:00 до 21:00, по предварительной записи.</p>
          </div>
          <div class="about-image">
            <img src="/src/assets/about-placeholder.jpg" alt="Гончарная мастерская" />
          </div>
        </div>
      </div>
    </section>

    <!-- Блок 3: Преимущества (цветной фон) -->
    <section class="features full-width">
      <div class="container">
        <div class="section-header">
          <h2>Почему выбирают нас</h2>
          <p class="section-subtitle">
            Гончарная мастерская предлагает уникальный подход к творчеству, сочетая теорию и практику, что помогает раскрыть талант и получить удовольствие от процесса.
          </p>
        </div>

        <div class="features-list">
          <div class="feature-item">
            <span class="feature-check">✓</span>
            <div class="feature-text">
              <h3>Живой результат</h3>
              <p>Каждое занятие заканчивается готовым изделием, которое можно забрать с собой, — вы видите плоды своих рук уже через несколько часов.</p>
            </div>
          </div>

          <div class="feature-item">
            <span class="feature-check">✓</span>
            <div class="feature-text">
              <h3>Разнообразие техник</h3>
              <p>Мастерская предлагает широкий выбор техник работы с глиной, от лепки руками до работы на гончарном круге.</p>
            </div>
          </div>

          <div class="feature-item">
            <span class="feature-check">✓</span>
            <div class="feature-text">
              <h3>Экспертность наставников</h3>
              <p>Мастер-классы ведут действующие керамисты с многолетним стажем, которые не просто показывают приёмы, но и делятся профессиональными хитростями, сокращающими путь к красивому результату.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  <!-- Блок 4: Галерея (белый фон) -->
    <section class="gallery full-width">
      <div class="container">
        <h2>Фотографии мастерской</h2>
        <div class="gallery-grid">
          <!-- Замените src на реальные пути к картинкам -->
          <div class="gallery-item"><img src="/src/assets/gallery1.jpg" alt="Фото 1" /></div>
          <div class="gallery-item"><img src="/src/assets/gallery2.jpg" alt="Фото 2" /></div>
          <div class="gallery-item"><img src="/src/assets/gallery3.jpg" alt="Фото 3" /></div>
          <div class="gallery-item"><img src="/src/assets/gallery4.jpg" alt="Фото 4" /></div>
        </div>
      </div>
    </section>

    <!-- Блок 4: Призыв к действию (цветной фон) -->
    <section class="cta full-width">
      <div class="container">
        <h2>Готовы попробовать?</h2>
        <p>Выберите удобное время и запишитесь на занятие прямо сейчас.</p>
        <button class="btn primary large" @click="$emit('navigate', 'schedule')">Перейти к расписанию</button>
      </div>
    </section>
  </div>
</template>

<script setup>
defineEmits(['navigate'])
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* Общий класс для полноэкранных блоков */
.full-width {
  width: 100%;
  padding: 60px 20px;
  display: flex;
  justify-content: center;
}

.container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

/* Блок 1 – Герой */
.hero {
  background: linear-gradient(135deg, #7a4e2d, #a86f3c);
  color: white;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px 20px;
}

.hero .ruslan-display-regular {
  font-family: "Ruslan Display", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: clamp(48px, 8vw, 80px);
  display: block;
  margin-bottom: 16px;
  
}

.hero p {
  font-size: 20px;
  max-width: 700px;
  margin: 0 auto 28px;
  color: rgba(255,255,255,0.9);
}

.hero .btn {
  background: white;
  color: #7a4e2d;
  border: none;
  padding: 14px 40px;
  border-radius: 40px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.hero .btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
}
/* Блок 4 – Галерея (белый) */
.gallery {
  background: white;
  padding: 80px 20px;
}
.gallery h2 {
  text-align: center;
  font-size: 32px;
  margin-bottom: 32px;
}
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}
.gallery-item {
  border-radius: 16px;
  overflow: hidden;
  aspect-ratio: 1 / 1;
  background: #f0ebe5;
}
.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Блок 2 – О нас (белый) с картинкой справа */
.about {
  background: white;
  padding: 80px 20px;
}

.about-wrapper {
  display: flex;
  align-items: center;
  gap: 40px;
}

.about-text {
  flex: 1;
}

.about-text h2 {
  font-size: 32px;
  margin-bottom: 20px;
  color: #2b2118;
}

.about-text p {
  font-size: 18px;
  line-height: 1.7;
  color: #4a3f36;
  max-width: 800px;
}

.about-image {
  flex: 0 0 320px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
}

.about-image img {
  width: 100%;
  height: 240px;
  object-fit: cover;
  display: block;
}

/* Блок 3 – Преимущества (цветной) */
.features {
  background: #f2e3d2;
  padding: 80px 20px;
}

.section-header {
  text-align: center;
  margin-bottom: 48px;
}

.section-header h2 {
  font-size: 32px;
  font-weight: 700;
  color: #2b2118;
  margin-bottom: 16px;
}

.section-subtitle {
  font-size: 18px;
  color: #6f6258;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.5;
}

.features-list {
  display: flex;
  flex-direction: column;
  padding-left: 0px; 
  gap: 32px;
}

.feature-item {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.feature-check {
  font-size: 24px;
  color: #7a4e2d;
  font-weight: 700;
  flex-shrink: 0;
  background: white;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.feature-text {
  flex: 1;
}

.feature-text h3 {
  font-size: 22px;
  font-weight: 600;
  color: #2b2118;
  margin-bottom: 8px;
}

.feature-text p {
  font-size: 16px;
  color: #6f6258;
  line-height: 1.5;
  max-width: 600px;
}

/* Блок 5 – Призыв (цветной) */
.cta {
  background: #7a4e2d;
  color: white;
  text-align: center;
  padding: 80px 20px;
}
.cta h2 {
  font-size: 36px;
  margin-bottom: 12px;
}
.cta p {
  font-size: 20px;
  margin-bottom: 28px;
  color: rgba(255,255,255,0.9);
}
.cta .btn {
  background: white;
  color: #7a4e2d;
  border: none;
  padding: 14px 40px;
  border-radius: 40px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.cta .btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
}

/* Адаптивность */
@media (max-width: 768px) {
  .full-width {
    padding: 40px 16px;
  }
  
  .hero .ruslan-display-regular {
    font-size: 36px;
  }
  .hero p {
    font-size: 16px;
  }
  
  .about-wrapper {
    flex-direction: column;
    gap: 30px;
  }
  
  .about-image {
    flex: 0 0 auto;
    width: 100%;
    max-width: 400px;
  }
  
  .about-image img {
    height: 180px;
  }
  
  .about h2, .section-header h2, .cta h2 {
    font-size: 26px;
  }
  .about p {
    font-size: 16px;
  }
  
  .section-subtitle {
    font-size: 16px;
  }
  
  .feature-item {
    gap: 14px;
  }
  .feature-check {
    width: 34px;
    height: 34px;
    font-size: 20px;
  }
  .feature-text h3 {
    font-size: 20px;
  }
  .feature-text p {
    font-size: 14px;
  }
}

/* Блок с изображением */
.image-block {
  background: white;
  padding: 0 20px 60px 20px;
}
.image-block .hero-image {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
}
.image-block .hero-image img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  display: block;
}

.ruslan-display-regular {
  font-family: "Ruslan Display", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 3rem;
}
</style>