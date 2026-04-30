import Phaser from "phaser";
import {
  ASSET_KEYS,
  DEPTH,
  MIN_HITBOX_PX,
  RETURN_HOME_DURATION_MS,
} from "../config/play";
import type { CardId } from "../scenes/play/contracts";

export type DefenderCardOptions = {
  cardId: CardId;
  homeX: number;
  homeY: number;
  label: string;
  onLabelRequest: () => string;
};

const CARD_DISPLAY_WIDTH = 180;

const CARD_DISPLAY_HEIGHT = 252;

export class DefenderCard extends Phaser.GameObjects.Container {
  readonly cardId: CardId;

  private readonly imageBg: Phaser.GameObjects.Image;

  private readonly nameText: Phaser.GameObjects.Text;

  private readonly labelProvider: () => string;

  private homeX: number;

  private homeY: number;

  private dragging = false;

  constructor(scene: Phaser.Scene, options: DefenderCardOptions) {
    super(scene, options.homeX, options.homeY);

    this.cardId = options.cardId;
    this.homeX = options.homeX;
    this.homeY = options.homeY;
    this.labelProvider = options.onLabelRequest;

    this.imageBg = scene.add
      .image(0, 0, ASSET_KEYS.earthCard)
      .setDisplaySize(CARD_DISPLAY_WIDTH, CARD_DISPLAY_HEIGHT);

    this.nameText = scene.add
      .text(0, CARD_DISPLAY_HEIGHT / 2 + 18, options.label, {
        fontFamily: "Arial Black, Arial",
        fontSize: "20px",
        color: "#c7f8ff",
        stroke: "#120025",
        strokeThickness: 4,
        align: "center",
      })
      .setOrigin(0.5);

    this.add([this.imageBg, this.nameText]);

    this.setSize(
      Math.max(CARD_DISPLAY_WIDTH, MIN_HITBOX_PX),
      Math.max(CARD_DISPLAY_HEIGHT, MIN_HITBOX_PX)
    );
    this.setInteractive(
      new Phaser.Geom.Rectangle(
        -CARD_DISPLAY_WIDTH / 2,
        -CARD_DISPLAY_HEIGHT / 2,
        CARD_DISPLAY_WIDTH,
        CARD_DISPLAY_HEIGHT
      ),
      Phaser.Geom.Rectangle.Contains
    );

    this.setDepth(DEPTH.palette);
    scene.add.existing(this);
  }

  setHome(x: number, y: number): void {
    this.homeX = x;
    this.homeY = y;
    if (!this.dragging) {
      this.setPosition(x, y);
    }
  }

  refreshLabel(): void {
    this.nameText.setText(this.labelProvider());
  }

  setDragVisual(active: boolean): void {
    this.dragging = active;

    if (active) {
      this.setDepth(DEPTH.ghost);
      this.setScale(1.06);
      this.imageBg.setAlpha(0.92);
    } else {
      this.setDepth(DEPTH.palette);
      this.setScale(1);
      this.imageBg.setAlpha(1);
    }
  }

  followPointer(x: number, y: number): void {
    this.setPosition(x, y);
  }

  returnHome(): void {
    this.scene.tweens.killTweensOf(this);
    this.scene.tweens.add({
      targets: this,
      x: this.homeX,
      y: this.homeY,
      duration: RETURN_HOME_DURATION_MS,
      ease: Phaser.Math.Easing.Cubic.Out,
    });
  }

  snapHome(): void {
    this.scene.tweens.killTweensOf(this);
    this.setPosition(this.homeX, this.homeY);
  }
}
