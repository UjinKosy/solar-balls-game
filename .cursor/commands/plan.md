# /plan

Создай технический план для текущей фичи. Выполни строго по шагам:

## Шаг 1. Найди активную спеку

1. Если пользователь явно указал `NNN-slug` — используй её.
2. Иначе посмотри `specs/` и предложи выбрать последнюю с `Статус: Approved` или `Draft`.
3. Проверь, что `specs/NNN-slug/spec.md` существует. Если нет — предложи сначала вызвать `/specify`.

## Шаг 2. Загрузи контекст

1. Прочитай [`.specify/memory/constitution.md`](../../.specify/memory/constitution.md).
2. Прочитай `specs/NNN-slug/spec.md` целиком.
3. Прочитай [`docs/plans/solar-balls-plan.md`](../../docs/plans/solar-balls-plan.md).
4. Прочитай [`.specify/templates/plan-template.md`](../../.specify/templates/plan-template.md).
5. Если релевантно — [`.specify/templates/data-model-template.md`](../../.specify/templates/data-model-template.md), [`.specify/templates/quickstart-template.md`](../../.specify/templates/quickstart-template.md), [`.specify/templates/research-template.md`](../../.specify/templates/research-template.md).

## Шаг 3. Constitution Check

Пройдись по 12 принципам. Если фича противоречит хоть одному — **остановись** и предложи либо:
- переделать спеку,
- выпустить поправку к конституции (отдельный PR с меткой `governance`).

## Шаг 4. Сгенерируй `plan.md`

В `specs/NNN-slug/plan.md`:
- Технический контекст (Phaser, Fastify, Prisma).
- Таблица Constitution Check с отметками «Да/Нет/Как».
- Архитектурное решение (при необходимости mermaid).
- Затрагиваемые файлы: новые и изменяемые.
- Data Model (если трогает БД/схемы).
- API-контракты (если есть бэкенд).
- Контент и ассеты (список JSON + промпты AI для недостающих картинок).
- Quickstart (ссылка на `quickstart.md`).
- Риски и откат.

## Шаг 5. Сгенерируй вспомогательные артефакты

- `specs/NNN-slug/quickstart.md` — ручная проверка.
- `specs/NNN-slug/data-model.md` — **только если** меняет БД или Zod-схемы контента.
- `specs/NNN-slug/research.md` — **только если** были альтернативы.
- `specs/NNN-slug/contracts/*.ts` — **только если** есть API-контракты (Zod-схемы запрос/ответ).

## Шаг 6. Отчитайся

Перечисли созданные файлы. Предложи:
1. Проверить план.
2. Вызвать `/tasks` для разбивки на задачи.

## Что НЕ делать

- Не пиши код реализации.
- Не запускай `pnpm` и не ставь зависимости.
- Не меняй `spec.md` без явной просьбы (если всплыли изменения — укажи их в «Открытых вопросах»).
