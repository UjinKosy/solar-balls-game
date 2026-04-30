import Phaser from "phaser";
import { ASSET_KEYS, DEPTH } from "../config/play";
import type { CardId, CellAddress } from "../scenes/play/contracts";

export type PlacedDefenderOptions = {
  cardId: CardId;
  cell: CellAddress;
  x: number;
  y: number;
  size: number;
};

export class PlacedDefender extends Phaser.GameObjects.Image {
  readonly cell: CellAddress;

  readonly cardId: CardId;

  constructor(scene: Phaser.Scene, options: PlacedDefenderOptions) {
    const textureKey =
      options.cardId === "earth" ? ASSET_KEYS.earthIdle : ASSET_KEYS.earthIdle;

    super(scene, options.x, options.y, textureKey);

    this.cardId = options.cardId;
    this.cell = options.cell;

    this.setDisplaySize(options.size * 0.92, options.size * 0.92);
    this.setDepth(DEPTH.placedDefender);

    scene.add.existing(this);
  }

  layoutAt(x: number, y: number, size: number): void {
    this.setPosition(x, y);
    this.setDisplaySize(size * 0.92, size * 0.92);
  }
}
