# Задачи: Поле 5×9 и универсальный drag-and-drop

**ID фичи:** 003-grid-and-drag-drop
**Связанная спека:** [`spec.md`](spec.md)
**План:** [`plan.md`](plan.md)

> Каждая задача атомарна (≤ 1–2 часа), с чётким действием и ссылкой на критерии приёмки. Галочка ставится только когда соответствующий AC из `spec.md §5` пройден.

---

## Порядок работы

1. **Setup** — каркас сцены и конфиг-константы.
2. **Contract** — клиентские контракты ввода (Pointer Events + drag-цепочка) и расположения экрана.
3. **Content** — i18n-ключи и графические ассеты.
4. **Core** — `GridSystem`, `InputSystem`, базовые типы и плейсхолдер-данные.
5. **UI** — сцена `PlayScene`, палитра, карточка, защитник на клетке, HUD энергии.
6. **Integration** — ручная проверка AC по `quickstart.md` (десктоп + мобила + ресайз).
7. **Deploy** — сборка, PR, CI, staging.

---

## Задачи

### Setup

- [x] **T-001** Создать каркас директорий `apps/web/src/scenes/play/`, `apps/web/src/systems/`, `apps/web/src/config/`. Подтвердить единый стиль именования файлов проекта (PascalCase для классов, kebab-case для assets). (AC-1, AC-10)
- [x] **T-002** Создать `apps/web/src/config/play.ts` с константами `GRID_ROWS=5`, `GRID_COLS=9`, `CELL_SIZE_VIRTUAL=96`, `BOARD_X`, `BOARD_Y`, `MIN_HITBOX_PX=64`, `ENERGY_PLACEHOLDER=50`. (AC-1, AC-3)
- [x] **T-003** В `apps/web/src/main.ts` зарегистрировать новую сцену `PlayScene` (ключ `"play"`); удалить `PlayStubScene` из массива `scene` и его импорт. (AC-1, AC-10)
- [x] **T-004** Удалить файл `apps/web/src/scenes/stubs/PlayStubScene.ts`; убедиться, что ни один импорт на него не остался (`pnpm --filter web build` должен пройти). (AC-1, AC-10)
- [x] **T-005** В `apps/web/src/scenes/MainMenuScene.ts` поменять обработчик «ИГРАТЬ» с `this.scene.start("play-stub")` на `this.scene.start("play")`. (AC-1, AC-10)

### Contract

- [x] **T-006** Зафиксировать клиентский контракт ввода для всей фичи: единственный путь — `this.input.setDraggable(...)` + события `dragstart`/`drag`/`dragenter`/`dragleave`/`drop`/`dragend`. Никаких раздельных веток `isMobile`/`isTouch` и никаких ручных `pointer*`-обработчиков для drag-цепочки. (AC-9, NFR-1)
- [x] **T-007** Зафиксировать контракт расположения сцены `play`: верх — HUD-энергия, низ — кнопка «Назад», слева — палитра шириной 280 px, центр — игровое поле 5×9 c фоном; depth-стек — `bg=0`, `grid=5`, `placed=10`, `palette=20`, `ghost=100`, `hud=200`. (AC-1, AC-2, AC-3, AC-10)
- [x] **T-008** Зафиксировать контракт состояния клетки: enum `"empty" | "occupied"`, переход `empty → occupied` синхронно в обработчике `drop`; повторный `drop` в занятую клетку — отказ + возврат карточки в палитру. (AC-6, AC-7)
- [x] **T-009** Зафиксировать контракт ресайза: при каждом `scale.on("resize")` пересчитываются позиции `GridSystem`, палитры, HUD и кнопки «Назад» через единый метод `layout(width, height)`; никаких «магических» констант, привязанных к 1280×720, в обработчиках событий. (NFR-3, NFR-4)

### Content

- [x] **T-010** Дополнить `apps/web/src/i18n/ru.json` ключами `play.title`, `play.energy`, `play.card.earth`. (AC-11)
- [x] **T-011** Дополнить `apps/web/src/i18n/en.json` зеркальным набором (`Game Board`, `Energy`, `Earth`). (AC-11)
- [x] **T-012** Подготовить `apps/web/public/assets/play/board-bg.png` (фон поля 1280×720, прозрачный или с тёмным неоновым оформлением). (AC-1, NFR-4)
- [x] **T-013** Подготовить `apps/web/public/assets/play/cell-highlight.png` (160×160, неоновая обводка, прозрачная заливка). (AC-5)
- [x] **T-014** Подготовить `apps/web/public/assets/play/earth-card.png` (256×360, прозрачный фон, kawaii-Earth в карточной рамке). (AC-2, NFR-4)
- [x] **T-015** Подготовить `apps/web/public/assets/play/earth-idle.png` (256×256, прозрачный, защитник на поле). (AC-6, NFR-4)
- [x] **T-016** Подготовить `apps/web/public/assets/ui/energy-icon.png` (64×64, прозрачный, иконка-орб). (AC-3)
- [x] **T-017** Оптимизировать все новые PNG до ≤ 200 КБ без потери читаемости (Принцип 9). (NFR-4)
- [x] **T-018** В `apps/web/src/scenes/PreloadScene.ts` добавить `this.load.image(...)` для ключей `board-bg`, `cell-highlight`, `earth-card`, `earth-idle`, `energy-icon`. (AC-1, AC-2, AC-3, AC-5, AC-6)

### Core

- [x] **T-019** Реализовать `apps/web/src/systems/GridSystem.ts`: инициализация 5×9 клеток, метод `layout(width, height)`, `cellAt(x, y): CellAddress | null`, `cellCenter(addr): {x, y}`, `isOccupied(addr)`, `markOccupied(addr)`. Все размеры берутся из `play.ts`. (AC-1, AC-5, AC-6, AC-7, NFR-3)
- [x] **T-020** В `GridSystem` добавить отрисовку видимой сетки клеток поверх `board-bg` (тонкая неоновая линия на границах клеток, depth=5). (AC-1)
- [x] **T-021** Реализовать `apps/web/src/ui/CellHighlight.ts` — одна переиспользуемая инстанция спрайта `cell-highlight`, методы `showAt(addr)` / `hide()`; одновременно подсвечивает не более одной клетки. (AC-5)
- [x] **T-022** Реализовать `apps/web/src/systems/InputSystem.ts` — тонкая обёртка над `this.input.setDraggable(...)` и drag-цепочкой; принимает источник (карточку) и цель (Grid), проксирует события без игровой логики внутри. (AC-4, AC-5, AC-6, AC-7, AC-8, AC-9, NFR-1)
- [x] **T-023** В `InputSystem` обеспечить `dragstart` → создание «призрака» с `depth=100` и follow-pointer; `dragend` всегда снимает «призрак», даже при ошибке drop. (AC-4, AC-7, AC-8)
- [x] **T-024** В `InputSystem` подписать `pointermove` через `drag` так, чтобы `GridSystem` получал актуальную клетку под указателем для подсветки и решения о drop. (AC-5)
- [x] **T-025** В `apps/web/index.html` (или через стиль на `#app`) выставить `touch-action: none` на канвасе, чтобы тач-жест на мобиле не вызывал прокрутку страницы во время drag. (AC-9, NFR-1)

### UI

- [x] **T-026** Реализовать `apps/web/src/ui/DefenderCard.ts` — UI-карточка-источник drag; параметризуется `cardId`, ключом спрайта и текстовой подписью; hitbox ≥ `MIN_HITBOX_PX`. (AC-2, AC-4, NFR-2)
- [x] **T-027** В `DefenderCard` реализовать «возврат домой» с короткой обратной анимацией (≤ 200 мс) при неудачном drop. (AC-7, AC-8)
- [x] **T-028** Реализовать `apps/web/src/ui/CardPalette.ts` — контейнер слева шириной 280 px с одной `DefenderCard` (Земля), читаемая локализованная подпись, depth=20. Карточка остаётся доступной после успешного размещения. (AC-2, AC-11, AC-12)
- [x] **T-029** Реализовать `apps/web/src/ui/PlacedDefender.ts` — спрайт защитника на клетке, depth=10, центр привязан к `GridSystem.cellCenter(addr)`. (AC-6)
- [x] **T-030** Реализовать `apps/web/src/ui/EnergyHud.ts` — иконка `energy-icon` + цифра `50` + локализованная подпись `play.energy`, depth=200. Значение статично, без подписки на события. (AC-3, AC-11)
- [x] **T-031** Реализовать `apps/web/src/scenes/play/PlayScene.ts` (ключ `"play"`): подключить `board-bg`, `GridSystem`, `CardPalette`, `EnergyHud`, `InputSystem`, `CellHighlight`; обработать `scene.shutdown` (off-listeners). (AC-1, AC-2, AC-3, AC-5, AC-10, NFR-3)
- [x] **T-032** В `PlayScene` подписать `dragenter`/`dragleave` на `CellHighlight.showAt`/`hide`, `drop` — на установку `PlacedDefender` через `GridSystem.markOccupied`. (AC-5, AC-6)
- [x] **T-033** В `PlayScene` обработать ветку «отпустили над занятой клеткой» и «отпустили вне поля» — карточка возвращается в палитру через `DefenderCard` (T-027). (AC-7, AC-8)
- [x] **T-034** В `PlayScene` добавить кнопку «Назад» через существующий `NeonButton` + `backToMainMenu(scene)` (как в `SectionStubScene`). (AC-10, AC-11)
- [x] **T-035** В `PlayScene` подписаться на `scale.on("resize", layout)` и при shutdown отписаться (по образцу `MainMenuScene`). (NFR-3, NFR-4)
- [x] **T-036** Прогнать `MainMenuScene` после изменений: смена локали ru/en на фоне открытой/закрытой `PlayScene` не оставляет непереведённых строк. (AC-11) — статически: все тексты в `PlayScene` идут через `t()`; `scene.start("play")` пере-создаёт сцену, поэтому актуальная локаль подхватывается автоматически. Динамическая проверка — в Integration (T-039).

### Integration

- [ ] **T-037** Прогнать **Сценарий 1** из `quickstart.md` на десктопе мышью — закрыть AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, AC-10, AC-12. (AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, AC-10, AC-12)
- [ ] **T-038** Прогнать **Сценарий 2** (возврат карточки на занятую клетку и за пределы поля) — закрыть AC-7, AC-8. (AC-7, AC-8)
- [ ] **T-039** Прогнать **Сценарий 3** (локализация ru ↔ en на сцене `play`) — закрыть AC-11. (AC-11)
- [ ] **T-040** Прогнать **Сценарий 4** на iPhone SE (или iPhone 12) в ландшафтной ориентации через staging URL: жест работает, страница не скроллится, hitbox удобный. Закрыть AC-9, NFR-1, NFR-2, NFR-6. (AC-9)
- [ ] **T-041** Прогнать **Сценарий 5** (ресайз окна десктопа во время и после установки защитников) — подтвердить NFR-3 и NFR-4. (NFR-3, NFR-4)
- [ ] **T-042** Сверить итоговое поведение с `spec.md §5`, отметить все 12 AC и пройденные ревью-чеклисты в `spec.md §11`. (AC-1…AC-12)

### Deploy

- [ ] **T-043** `pnpm --filter web build` проходит без ошибок и предупреждений TypeScript/ESLint. (AC-1)
- [ ] **T-044** Подготовить PR `feature/003-grid-and-drag-drop` со ссылками на `spec.md`, `plan.md`, `tasks.md`, `quickstart.md`; в описании отметить, что бэкенд/БД не затронуты. (AC-1, AC-10)
- [ ] **T-045** Дождаться прохождения CI и доступности staging-демо со сценой `play`; запустить **Сценарий 4** (мобила) именно на staging URL. (AC-9, AC-10)
- [ ] **T-046** Перевести статус `spec.md` и `plan.md` в `Implemented` после merge в `main`. (—)

---

## Прогресс

- Всего задач: 46
- Выполнено: 36 / 46 (Setup, Contract, Content, Core, UI)
- Текущий блокер: Integration (T-037…T-042) — пользователь сообщил о расхождениях при ручной проверке quickstart-сценариев. Ждём детали в чате; правки пойдут отдельными коммитами с привязкой к конкретным AC.
