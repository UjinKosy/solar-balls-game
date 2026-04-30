import Phaser from "phaser";
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  CELL_SIZE_VIRTUAL,
  DEPTH,
  GRID_COLS,
  GRID_ROWS,
} from "../config/play";
import type { CellAddress, CellState } from "../scenes/play/contracts";
import { cellAddressEquals } from "../scenes/play/contracts";

export type GridLayout = {
  originX: number;
  originY: number;
  cellSize: number;
  width: number;
  height: number;
};

export class GridSystem {
  private readonly scene: Phaser.Scene;

  private readonly states: CellState[][];

  private gridGfx: Phaser.GameObjects.Graphics;

  private layoutBox: GridLayout = {
    originX: 0,
    originY: 0,
    cellSize: CELL_SIZE_VIRTUAL,
    width: BOARD_WIDTH,
    height: BOARD_HEIGHT,
  };

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.states = Array.from({ length: GRID_ROWS }, () =>
      Array.from({ length: GRID_COLS }, (): CellState => "empty")
    );

    this.gridGfx = scene.add.graphics().setDepth(DEPTH.grid);
  }

  layout(box: GridLayout): void {
    this.layoutBox = box;
    this.redraw();
  }

  getLayout(): GridLayout {
    return this.layoutBox;
  }

  cellAt(worldX: number, worldY: number): CellAddress | null {
    const { originX, originY, cellSize } = this.layoutBox;

    const dx = worldX - originX;
    const dy = worldY - originY;

    if (dx < 0 || dy < 0) {
      return null;
    }

    const col = Math.floor(dx / cellSize);
    const row = Math.floor(dy / cellSize);

    if (row < 0 || row >= GRID_ROWS || col < 0 || col >= GRID_COLS) {
      return null;
    }

    return { row, col };
  }

  cellCenter(addr: CellAddress): { x: number; y: number } {
    const { originX, originY, cellSize } = this.layoutBox;

    return {
      x: originX + addr.col * cellSize + cellSize / 2,
      y: originY + addr.row * cellSize + cellSize / 2,
    };
  }

  isOccupied(addr: CellAddress): boolean {
    return this.states[addr.row]?.[addr.col] === "occupied";
  }

  markOccupied(addr: CellAddress): void {
    if (!this.isInBounds(addr)) {
      return;
    }

    this.states[addr.row][addr.col] = "occupied";
  }

  isInBounds(addr: CellAddress): boolean {
    return (
      addr.row >= 0 && addr.row < GRID_ROWS && addr.col >= 0 && addr.col < GRID_COLS
    );
  }

  cellsEqual(a: CellAddress, b: CellAddress): boolean {
    return cellAddressEquals(a, b);
  }

  destroy(): void {
    this.gridGfx.destroy();
  }

  private redraw(): void {
    const { originX, originY, cellSize } = this.layoutBox;
    const w = cellSize * GRID_COLS;
    const h = cellSize * GRID_ROWS;

    const g = this.gridGfx;
    g.clear();

    g.fillStyle(0x06122a, 0.55);
    g.fillRoundedRect(originX, originY, w, h, 12);

    g.lineStyle(2, 0x66e0ff, 0.55);

    for (let c = 0; c <= GRID_COLS; c += 1) {
      const x = originX + c * cellSize;
      g.lineBetween(x, originY, x, originY + h);
    }

    for (let r = 0; r <= GRID_ROWS; r += 1) {
      const y = originY + r * cellSize;
      g.lineBetween(originX, y, originX + w, y);
    }

    g.lineStyle(3, 0xff66ff, 0.7);
    g.strokeRoundedRect(originX, originY, w, h, 12);
  }
}
