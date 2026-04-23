# Задачи: [Название фичи]

**ID фичи:** NNN-slug
**Связанная спека:** [`spec.md`](spec.md)
**План:** [`plan.md`](plan.md)

> Каждая задача атомарна (≤ 1–2 часа), с чёткой командой/действием. Галочка ставится только когда AC из `spec.md` соответствующий этой задаче проходит.

---

## Порядок работы

1. **Setup** — подготовка зависимостей, типов, схем.
2. **Contract** — API-контракты и Zod-схемы (если есть бэкенд).
3. **Content** — JSON-файлы контента и ассеты.
4. **Core** — основная логика (entities, systems).
5. **UI** — визуальная часть.
6. **Integration** — склейка, проверка AC.
7. **Deploy** — обновлённый staging.

---

## Задачи

### Setup

- [ ] **T-001** В `packages/shared/src/content/defender.ts` добавить discriminator `'generator'` в `defenderSchema`. (AC-1, AC-2)
- [ ] **T-002** Выполнить `pnpm --filter shared build`.

### Contract

- [ ] **T-010** В `apps/api/src/routes/content.ts` прочитать `content/defenders/*.json` и валидировать `defenderSchema.array()`.
- [ ] **T-011** Добавить e2e-тест эндпоинта: `pnpm --filter api test`.

### Content

- [ ] **T-020** Создать `content/defenders/sun.json`.
- [ ] **T-021** Сгенерировать `content/images/sun-idle.png` (промпт из `plan.md §7`).
- [ ] **T-022** Оптимизировать PNG: `pnpm assets:optimize`.

### Core

- [ ] **T-030** Реализовать `apps/web/src/systems/InputSystem.ts` с drag-and-drop на Pointer Events.
- [ ] **T-031** Реализовать `DefenderFactory.create(id, cell)` с чтением поведения из `behavior.kind`.
- [ ] **T-032** Реализовать поведение `generator` в `Defender.update()`.

### UI

- [ ] **T-040** Компонент `CardBar` с 8 слотами.
- [ ] **T-041** Компонент `EnergyOrb` (кликабельный, +25).
- [ ] **T-042** Подсветка клетки под указателем.

### Integration

- [ ] **T-050** Проверить AC-1 вручную на десктопе.
- [ ] **T-051** Проверить AC-1 на iPhone (через staging URL).
- [ ] **T-052** Проверить AC-2, AC-3, AC-4.

### Deploy

- [ ] **T-060** `pnpm build` проходит без ошибок.
- [ ] **T-061** Открыть PR с пометкой `spec: NNN-slug`.
- [ ] **T-062** Дождаться прохождения CI и деплоя на staging.
- [ ] **T-063** Визуальная проверка на staging URL.

---

## Прогресс

- Всего задач: NN
- Выполнено: 0 / NN
- Текущий блокер: —
