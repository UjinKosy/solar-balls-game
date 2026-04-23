# Data Model: [Название фичи]

**ID фичи:** NNN-slug

> Создаётся, если фича меняет БД или контент-схемы.

---

## Изменения в Prisma

```prisma
// apps/api/prisma/schema.prisma
model NewModel {
  id        String   @id @default(cuid())
  // ...
}
```

- Миграция: `pnpm --filter api prisma migrate dev -n <имя>`.

## Изменения в Zod-схемах контента

Файл: `packages/shared/src/content/<entity>.ts`

```ts
export const entitySchema = z.object({
  // ...
});
```

## Примеры JSON

```json
{
  "id": "example",
  "field": "value"
}
```

## Обратная совместимость

- Как мигрируются старые данные?
- Нужен ли скрипт?
