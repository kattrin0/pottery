# Реестр экранов и модальных окон – десктоп-версия

Единый индекс постановок на дизайн в папке `3-design-brief/`. Сквозные правила – в [00-foundations.md](00-foundations.md).

**Версия: 0.2** – обновлено для десктоп-первого подхода.

## Экраны (SCR)

| № | ID | Название | Файл | FR / BR | Приоритет |
|---|-----|----------|------|---------|-----------|
| 1 | SCR-001 | Вход | [scr-001-login.md](scr-001-login.md) | FR-001, FR-002 | Must |
| 2 | SCR-002 | Расписание | [scr-002-schedule.md](scr-002-schedule.md) | FR-003…FR-012 | Must |
| 3 | SCR-003 | Карточка слота | [scr-003-slot-card.md](scr-003-slot-card.md) | FR-008, FR-009, FR-012 | Must |
| 4 | SCR-004 | Оформление записи | [scr-004-booking.md](scr-004-booking.md) | FR-013…FR-019 | Must |
| 5 | SCR-005 | Мои записи | [scr-005-my-bookings.md](scr-005-my-bookings.md) | BR-005, FR-023 | Must |
| 6 | SCR-006 | Детали записи | [scr-006-booking-details.md](scr-006-booking-details.md) | FR-020…FR-024 | Must |
| 7 | SCR-007 | Профиль | [scr-007-profile.md](scr-007-profile.md) | — | Should |
| 8 | SCR-008 | Оценка мастера | [scr-008-rating.md](scr-008-rating.md) | FR-025, BR-010 | Should |
| 9 | SCR-009 | Настройки уведомлений | [scr-009-notification.md](scr-009-notification.md) | FR-026…FR-028, BR-011 | Should |

## Модальные окна / панели (BS)

| № | ID | Название | Файл | FR / BR | Приоритет |
|---|-----|----------|------|---------|-----------|
| 1 | BS-001 | Фильтры (панель/блок) | [BS-001-filters.md](BS-001-filters.md) | FR-005, FR-006 | Must |
| 2 | BS-002 | Подтверждение записи (модальное окно) | [BS-002-booking-success.md](BS-002-booking-success.md) | FR-017, FR-026 | Must |
| 3 | BS-003 | Подтверждение отмены (модальное окно) | [BS-003-cancel-confirm.md](BS-003-cancel-confirm.md) | FR-020…FR-022, BR-008 | Must |

## Навигация (кратко) – десктоп

```text
SCR-001 (вход)
  └→ SCR-002 «Расписание» ←── вкладки в хедере ──→ SCR-005 «Мои записи»
        ├→ BS-001 (фильтры – панель/блок)
        ├→ SCR-003 (детали слота) → SCR-004 (бронирование) → BS-002 (модалка успеха)
        └→ SCR-007 (профиль) → SCR-009 (уведомления)

SCR-005 → SCR-006 → BS-003 (модалка отмены)
                  └→ SCR-008 (модалка оценки)