import Phaser from "phaser";
import type { CellAddress, DropOutcome } from "../scenes/play/contracts";
import type { GridSystem } from "./GridSystem";

/**
 * T-006 Контракт: единственный путь drag-and-drop — `setDraggable` + drag-цепочка.
 * Никаких ручных `pointerdown/move/up`-обработчиков для перетаскивания.
 *
 * InputSystem не принимает решений о размещении защитника. Он только:
 *  - регистрирует объект как drag-source через `setDraggable`,
 *  - проксирует drag-цепочку Grid'у (для подсветки) и владельцу (для drop-результата).
 */
export type DragSourceHooks = {
  onDragStart: (pointer: Phaser.Input.Pointer) => void;
  onDrag: (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => void;
  onDragOver: (cell: CellAddress | null) => void;
  onDrop: (outcome: DropOutcome) => void;
  onDragEnd: () => void;
};

export class InputSystem {
  private readonly scene: Phaser.Scene;

  private readonly grid: GridSystem;

  constructor(scene: Phaser.Scene, grid: GridSystem) {
    this.scene = scene;
    this.grid = grid;

    this.scene.input.dragDistanceThreshold = 4;
  }

  registerDragSource(target: Phaser.GameObjects.GameObject, hooks: DragSourceHooks): void {
    this.scene.input.setDraggable(target);

    let lastReportedCell: CellAddress | null = null;

    target.on(Phaser.Input.Events.DRAG_START, (pointer: Phaser.Input.Pointer) => {
      lastReportedCell = null;
      hooks.onDragStart(pointer);
    });

    target.on(
      Phaser.Input.Events.DRAG,
      (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        hooks.onDrag(pointer, dragX, dragY);

        const cell = this.grid.cellAt(pointer.worldX, pointer.worldY);

        const same =
          (cell === null && lastReportedCell === null) ||
          (cell !== null &&
            lastReportedCell !== null &&
            this.grid.cellsEqual(cell, lastReportedCell));

        if (!same) {
          lastReportedCell = cell;
          hooks.onDragOver(cell);
        }
      }
    );

    target.on(Phaser.Input.Events.DRAG_END, (pointer: Phaser.Input.Pointer) => {
      const cell = this.grid.cellAt(pointer.worldX, pointer.worldY);

      let outcome: DropOutcome;

      if (cell === null) {
        outcome = { kind: "rejected", reason: "out-of-board" };
      } else if (this.grid.isOccupied(cell)) {
        outcome = { kind: "rejected", reason: "occupied" };
      } else {
        outcome = { kind: "placed", cell };
      }

      hooks.onDrop(outcome);
      hooks.onDragEnd();
    });
  }

  unregisterDragSource(target: Phaser.GameObjects.GameObject): void {
    target.off(Phaser.Input.Events.DRAG_START);
    target.off(Phaser.Input.Events.DRAG);
    target.off(Phaser.Input.Events.DRAG_END);
    this.scene.input.setDraggable(target, false);
  }
}
