# Sequence-диаграммы API

Этап 4. Проектирование. Взаимодействие **клиентского сайта (Vue.js SPA)** с **клиентским API**
при ключевых сценариях. Существующий бэкенд мастерской — black-box за API (NFR-007).

**Источники:** [UC-004](../2-requirements/use-cases.md) · [data-model.md](./data-model.md) ·
[scr-004-booking.md](../3-design-brief/scr-004-booking.md) · [BS-002-booking-success.md](../3-design-brief/BS-002-booking-success.md)

---

## createBooking — создание брони

Сценарий: клиент на SCR-004 подтверждает запись на выбранный слот (UC-004, FR-013…FR-019).

**Предусловия:** аутентифицированная сессия; слот `scheduled`; в UI слот доступен для записи.

**Запрос (концептуально):**

```http
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "slot_id": "<uuid>",
  "use_rental": true
}
```

**Успешный ответ:** `201 Created` + тело `Booking` (`status: active`, `price_total`, вложенный `slot`).

---

### Диаграмма с ветками

```mermaid
sequenceDiagram
    autonumber
    actor User as Клиент
    participant SPA as Vue.js SPA
    participant API as Клиентский API
    participant BE as Бэкенд мастерской

    Note over User,BE: Предзагрузка (READ-only)
    User->>SPA: Открывает SCR-003 / SCR-004
    SPA->>API: GET /slots/{id}
    API->>BE: чтение слота, программы, мастера
    BE-->>API: Slot + Program + Master
    API-->>SPA: 200 Slot
    SPA->>API: GET /rental
    API->>BE: чтение проката
    BE-->>API: Rental
    API-->>SPA: 200 Rental
    SPA-->>User: Форма: свои / прокат, итоговая цена (локальный preview)

    User->>SPA: Нажимает «Записаться» (SCR-004)
    SPA->>SPA: Loading на CTA

    alt Нет сессии / токен истёк
        SPA->>API: POST /bookings
        API-->>SPA: 401 Unauthorized
        SPA-->>User: Редирект на SCR-001
    else Слот отменён мастерской (гонка / устаревшие данные)
        SPA->>API: POST /bookings
        API->>BE: проверка Slot.status
        BE-->>API: cancelled
        API-->>SPA: 409 Conflict / 422 slot_cancelled
        SPA-->>User: Сообщение «Занятие отменено мастерской» → SCR-002
    else Нет свободных мест
        SPA->>API: POST /bookings
        API->>BE: атомарная проверка free_seats
        BE-->>API: free_seats = 0
        API-->>SPA: 409 Conflict / 422 no_seats
        SPA-->>User: Modal «Мест уже нет» + «К расписанию» (SCR-004, FR-019)
    else Прокат недоступен (use_rental = true, free_count = 0)
        SPA->>API: POST /bookings
        API->>BE: проверка rental.free_count
        BE-->>API: free_count = 0
        API-->>SPA: 409 Conflict / 422 rental_unavailable
        SPA-->>User: «Прокатных комплектов нет» — остаётся на SCR-004
    else Ошибка сети / сервер недоступен
        SPA->>API: POST /bookings
        API--xSPA: timeout / 5xx
        SPA-->>User: Toast «Ошибка соединения. Попробуйте позже» (SCR-004)
    else Успех — бронь подтверждена сразу
        SPA->>API: POST /bookings { slot_id, use_rental }
        API->>BE: атомарно: проверка мест, резерв, расчёт price_total
        BE-->>API: Booking (status=active)
        API-->>SPA: 201 Created + Booking
        SPA-->>User: Открывает BS-002 «Вы записаны» (FR-017)
        opt Первая успешная запись в сессии
            SPA-->>User: BS-002: запрос разрешения Web Push (FR-026)
        end
        User->>SPA: «Мои записи» / «Готово»
        SPA-->>User: SCR-005 / SCR-002
    end
```

---

### Ветки и коды ответа (сводка)

| Ветка | HTTP | Действие SPA | Требования |
| --- | --- | --- | --- |
| Успех | `201` | BS-002, обновление списка записей | FR-017, BR-006 |
| Нет мест | `409` / `422` | Modal на SCR-004 | FR-018, FR-019 |
| Слот отменён | `409` / `422` | Сообщение + возврат к расписанию | FR-024, FR-023 |
| Прокат недоступен | `409` / `422` | Остаётся на SCR-004, смена выбора | FR-016 |
| Не авторизован | `401` | SCR-001 | FR-002 |
| Сеть / 5xx | — / `5xx` | Toast, повтор | FR-029 |

Точные коды и тела ошибок — в контракте OpenAPI; клиент показывает **понятные тексты**,
не технические детали (NFR-003, FR-029).

---

### Что меняется в данных (успешная ветка)

| Сущность | Операция | Кто |
| --- | --- | --- |
| **Booking** | CREATE (`status = active`) | API / бэкенд |
| **Slot** | READ → обновление `free_seats` (−1) | Бэкенд |
| **Rental** | READ → при `use_rental`: `free_count` (−1) | Бэкенд |
| Program, Master, Client | без изменений со стороны сайта | — |

Сайт **не пишет** в Slot/Rental напрямую — только `POST /bookings`; денормализованные
счётчики обновляет бэкенд атомарно.

---

### Экранная трассировка

| Шаг | Экран / компонент |
| --- | --- |
| Выбор слота | SCR-002 → SCR-003 |
| Форма брони | SCR-004 |
| Успех | BS-002 |
| Ошибка «нет мест» | SCR-004 (modal) |
| Список после записи | SCR-005 |

---

## Связанные артефакты

| Артефакт | Связь |
| --- | --- |
| [data-model.md](./data-model.md) | Сущности Booking, Slot, Rental |
| [use-cases.md](../2-requirements/use-cases.md) | UC-004 Бронирование занятия |
| [functional-requirements.md](../2-requirements/functional-requirements.md) | FR-013…FR-019 |
