import Phaser from "phaser";
import { DEPTH, PALETTE_WIDTH } from "../config/play";
import { t } from "../i18n";
import { DefenderCard } from "./DefenderCard";

export class CardPalette {
  private readonly scene: Phaser.Scene;

  private readonly bg: Phaser.GameObjects.Graphics;

  readonly earthCard: DefenderCard;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.bg = scene.add.graphics().setDepth(DEPTH.palette - 1);
    this.earthCard = new DefenderCard(scene, {
      cardId: "earth",
      homeX: 0,
      homeY: 0,
      label: t("play.card.earth"),
      onLabelRequest: () => t("play.card.earth"),
    });
  }

  layout(viewportHeight: number, paletteCenterX: number): void {
    this.redrawBg(viewportHeight, paletteCenterX);
    this.earthCard.setHome(paletteCenterX, viewportHeight / 2);
  }

  refreshLabels(): void {
    this.earthCard.refreshLabel();
  }

  destroy(): void {
    this.bg.destroy();
    this.earthCard.destroy();
  }

  private redrawBg(viewportHeight: number, centerX: number): void {
    const w = PALETTE_WIDTH;
    const x = centerX - w / 2;

    const g = this.bg;
    g.clear();
    g.fillStyle(0x100530, 0.55);
    g.fillRoundedRect(x + 12, 24, w - 24, viewportHeight - 48, 18);
    g.lineStyle(3, 0x66e0ff, 0.7);
    g.strokeRoundedRect(x + 12, 24, w - 24, viewportHeight - 48, 18);
    g.lineStyle(1, 0xff66ff, 0.5);
    g.strokeRoundedRect(x + 18, 30, w - 36, viewportHeight - 60, 14);
  }
}
