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

const CARD_DISPLAY_WIDTH = 200;

const CARD_DISPLAY_HEIGHT = 252;

const NAME_OFFSET_Y = CARD_DISPLAY_HEIGHT / 2 + 18;

const HIT_PADDING_X = 24;

const HIT_PADDING_TOP = 16;

const HIT_PADDING_BOTTOM = 36;

const DRAG_GHOST_SCALE = 0.45;

const DRAG_GHOST_ALPHA = 0.55;

const DRAG_GHOST_OFFSET_Y = -56;

export class DefenderCard extends Phaser.GameObjects.Container {
  readonly cardId: CardId;

  private readonly imageBg: Phaser.GameObjects.Image;

  private readonly nameText: Phaser.GameObjects.Text;

  private readonly hitZone: Phaser.GameObjects.Zone;

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
      .text(0, NAME_OFFSET_Y, options.label, {
        fontFamily: "Arial Black, Arial",
        fontSize: "20px",
        color: "#c7f8ff",
        stroke: "#120025",
        strokeThickness: 4,
        align: "center",
      })
      .setOrigin(0.5);

    const hitW = Math.max(CARD_DISPLAY_WIDTH + HIT_PADDING_X * 2, MIN_HITBOX_PX);
    const imageTop = -CARD_DISPLAY_HEIGHT / 2 - HIT_PADDING_TOP;
    const textBottom = NAME_OFFSET_Y + HIT_PADDING_BOTTOM;
    const hitH = Math.max(textBottom - imageTop, MIN_HITBOX_PX);
    const hitCenterY = (imageTop + textBottom) / 2;

    this.hitZone = scene.add
      .zone(0, hitCenterY, hitW, hitH)
      .setOrigin(0.5);
    this.hitZone.setInteractive({ useHandCursor: true });

    this.add([this.imageBg, this.nameText, this.hitZone]);

    this.setDepth(DEPTH.palette);
    scene.add.existing(this);
  }

  getDragSource(): Phaser.GameObjects.Zone {
    return this.hitZone;
  }

  getDisplayHeight(): number {
    return CARD_DISPLAY_HEIGHT;
  }

  getDisplayWidth(): number {
    return CARD_DISPLAY_WIDTH;
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
      this.imageBg.setScale(DRAG_GHOST_SCALE);
      this.imageBg.setAlpha(DRAG_GHOST_ALPHA);
      this.imageBg.setY(DRAG_GHOST_OFFSET_Y);
      this.nameText.setVisible(false);
    } else {
      this.setDepth(DEPTH.palette);
      this.imageBg.setScale(1);
      this.imageBg.setAlpha(1);
      this.imageBg.setY(0);
      this.nameText.setVisible(true);
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
