# `.specify/` — инфраструктура Spec-Driven Development

Здесь живут **правила**, **шаблоны** и **память** проекта. Сами спецификации фич — в корневой папке [`../specs/`](../specs/).

## Структура

```
.specify/
├── README.md              # этот файл
├── memory/
│   └── constitution.md    # незыблемые принципы проекта (12 шт.)
└── templates/
    ├── spec-template.md   # скелет spec.md — что и зачем
    ├── plan-template.md   # скелет plan.md — как
    ├── tasks-template.md  # скелет tasks.md — пошаговый чек-лист
    ├── research-template.md
    ├── data-model-template.md
    └── quickstart-template.md
```

## Как использовать

1. Перед началом любой работы прочитайте [`memory/constitution.md`](memory/constitution.md).
2. Для новой фичи используйте slash-команды Cursor из [`../.cursor/commands/`](../.cursor/commands/):
   - `/specify` — создать `spec.md`.
   - `/plan` — создать `plan.md` + вспомогательные артефакты.
   - `/tasks` — разбить план на задачи.
   - `/implement` — выполнить задачи (переключается в agent mode).
3. Шаблоны из `templates/` копируются в `specs/NNN-slug/` и заполняются.
4. Все изменения в `.specify/` — через PR с меткой `governance`.

## Ссылки

- [Конституция](memory/constitution.md)
- [Папка спек](../specs/)
- [Slash-команды](../.cursor/commands/)
- [Гайд разработчика](../README.md)
