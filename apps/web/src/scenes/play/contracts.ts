/**
 * Клиентские контракты сцены "play". Менять только через PR в spec-003.
 *
 * T-006 — Контракт ввода:
 *   Единственный путь drag-and-drop — `this.input.setDraggable(...)` и события
 *   `dragstart` / `drag` / `dragenter` / `dragleave` / `drop` / `dragend`.
 *   Ручные `pointerdown`/`pointermove`/`pointerup`-обработчики для drag-цепочки
 *   запрещены. Никаких ветвлений `isMobile` / `isTouch` (Принцип 5).
 *
 * T-007 — Контракт layout:
 *   - верх:    HUD энергии        (depth=hud)
 *   - низ:     кнопка «Назад»     (depth=hud)
 *   - слева:   палитра 280px      (depth=palette)
 *   - центр:   игровое поле 5x9   (depth=grid)
 *   - фон:     board-bg           (depth=background)
 *   - ghost:   призрак карточки   (depth=ghost)
 *   - placed:  установленные      (depth=placedDefender)
 *
 * T-008 — Контракт состояния клетки:
 *   - тип CellState: "empty" | "occupied".
 *   - переход empty -> occupied синхронно в обработчике `drop`.
 *   - повторный drop в occupied — отказ + возврат карточки в палитру.
 *   - переход occupied -> empty в этой спеке не определён.
 *
 * T-009 — Контракт resize:
 *   Любая координата экрана пересчитывается через единый layout(width, height).
 *   Магических констант 1280/720 в обработчиках событий быть не должно.
 */

export type CellAddress = { row: number; col: number };

export type CellState = "empty" | "occupied";

export type CardId = "earth";

export type DragSource = {
  readonly cardId: CardId;
};

export type DropOutcome =
  | { kind: "placed"; cell: CellAddress }
  | { kind: "rejected"; reason: "occupied" | "out-of-board" };

export type LayoutBox = {
  width: number;
  height: number;
};

export const cellAddressEquals = (a: CellAddress, b: CellAddress): boolean =>
  a.row === b.row && a.col === b.col;
