import Phaser from "phaser";
import { ASSET_KEYS, DEPTH } from "../config/play";
import type { CellAddress } from "../scenes/play/contracts";
import type { GridSystem } from "../systems/GridSystem";

export class CellHighlight {
  private readonly scene: Phaser.Scene;

  private readonly grid: GridSystem;

  private readonly sprite: Phaser.GameObjects.Image;

  private current: CellAddress | null = null;

  constructor(scene: Phaser.Scene, grid: GridSystem) {
    this.scene = scene;
    this.grid = grid;
    this.sprite = scene.add
      .image(0, 0, ASSET_KEYS.cellHighlight)
      .setVisible(false)
      .setDepth(DEPTH.grid + 1);

    const cellSize = grid.getLayout().cellSize;
    this.sprite.setDisplaySize(cellSize, cellSize);
  }

  showAt(addr: CellAddress): void {
    if (!this.grid.isInBounds(addr)) {
      this.hide();
      return;
    }

    if (this.current && this.grid.cellsEqual(this.current, addr)) {
      return;
    }

    const { x, y } = this.grid.cellCenter(addr);
    const cellSize = this.grid.getLayout().cellSize;
    this.sprite.setDisplaySize(cellSize, cellSize);
    this.sprite.setPosition(x, y);
    this.sprite.setVisible(true);
    this.current = addr;
  }

  hide(): void {
    this.sprite.setVisible(false);
    this.current = null;
  }

  destroy(): void {
    this.sprite.destroy();
  }
}
