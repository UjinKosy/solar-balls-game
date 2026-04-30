import Phaser from "phaser";
import { ASSET_KEYS, DEPTH, ENERGY_PLACEHOLDER } from "../config/play";
import { t } from "../i18n";

export class EnergyHud {
  private readonly scene: Phaser.Scene;

  private readonly bg: Phaser.GameObjects.Graphics;

  private readonly icon: Phaser.GameObjects.Image;

  private readonly valueText: Phaser.GameObjects.Text;

  private readonly captionText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.bg = scene.add.graphics().setDepth(DEPTH.hud - 1);

    this.icon = scene.add
      .image(0, 0, ASSET_KEYS.energyIcon)
      .setDisplaySize(48, 48)
      .setDepth(DEPTH.hud);

    this.valueText = scene.add
      .text(0, 0, String(ENERGY_PLACEHOLDER), {
        fontFamily: "Arial Black, Arial",
        fontSize: "32px",
        color: "#ffe566",
        stroke: "#553300",
        strokeThickness: 4,
      })
      .setOrigin(0, 0.5)
      .setDepth(DEPTH.hud);

    this.captionText = scene.add
      .text(0, 0, t("play.energy"), {
        fontFamily: "Arial",
        fontSize: "20px",
        color: "#c7f8ff",
        stroke: "#120025",
        strokeThickness: 3,
      })
      .setOrigin(0, 0.5)
      .setDepth(DEPTH.hud);
  }

  layout(centerX: number, topY: number): void {
    const iconR = 24;
    const valueOffsetX = iconR + 12;
    const captionOffsetX = valueOffsetX + 70;

    const totalWidth = captionOffsetX + 140;
    const left = centerX - totalWidth / 2 + iconR;

    this.icon.setPosition(left, topY);
    this.valueText.setPosition(left + valueOffsetX, topY);
    this.captionText.setPosition(left + captionOffsetX, topY);

    const padding = 14;
    const boxLeft = left - iconR - padding;
    const boxRight = this.captionText.x + this.captionText.width + padding;
    const boxTop = topY - 28;
    const boxHeight = 56;

    const g = this.bg;
    g.clear();
    g.fillStyle(0x100530, 0.6);
    g.fillRoundedRect(boxLeft, boxTop, boxRight - boxLeft, boxHeight, 16);
    g.lineStyle(2, 0x66e0ff, 0.75);
    g.strokeRoundedRect(boxLeft, boxTop, boxRight - boxLeft, boxHeight, 16);
  }

  refreshLabels(): void {
    this.captionText.setText(t("play.energy"));
    this.valueText.setText(String(ENERGY_PLACEHOLDER));
  }

  destroy(): void {
    this.bg.destroy();
    this.icon.destroy();
    this.valueText.destroy();
    this.captionText.destroy();
  }
}
