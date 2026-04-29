import Phaser from "phaser";
import {
  BUTTON_CENTERS_REF_Y,
  BUTTON_HEIGHTS_REF,
  MENU_REF,
  buttonWidthFromRef,
  layoutYFromRef,
} from "./menuLayout";

/**
 * Векторная кнопка главного меню по референсу `ScYXV6KJ.png`:
 * - тёмная полупрозрачная плашка с лёгким просвечиванием артовой подложки;
 * - первичная (slot 0, «ИГРАТЬ») — двойная неоново-розовая обводка + жёлто-золотой текст;
 * - вторичная — одинарная мягко-розовая обводка + белый текст.
 *
 * Размеры/позиции — из `menuLayout` (масштабируются к фактическому размеру сцены).
 */
export class MenuArtButton extends Phaser.GameObjects.Container {
  private readonly graphics: Phaser.GameObjects.Graphics;

  private readonly label: Phaser.GameObjects.Text;

  private readonly slotIndex: number;

  private readonly isPrimary: boolean;

  private readonly onPressCb: () => void;

  private buttonHeight = 88;

  private inputWired = false;

  constructor(
    scene: Phaser.Scene,
    options: {
      slotIndex: number;
      label: string;
      onPress: () => void;
    },
  ) {
    super(scene, 0, 0);

    this.slotIndex = options.slotIndex;
    this.isPrimary = options.slotIndex === 0;
    this.onPressCb = options.onPress;

    this.graphics = scene.add.graphics();

    this.label = scene.add
      .text(0, 0, options.label, MenuArtButton.makeLabelStyle(this.isPrimary, 88))
      .setOrigin(0.5);

    this.add([this.graphics, this.label]);
    scene.add.existing(this);

    this.depth = 8;
    this.label.setDepth(1);

    this.refreshLayout(scene.scale.width, scene.scale.height);
  }

  refreshLayout(gameW: number, gameH: number): void {
    const w = buttonWidthFromRef(gameW);
    const h = Math.round((BUTTON_HEIGHTS_REF[this.slotIndex] / MENU_REF.H) * gameH);

    this.buttonHeight = h;

    this.paintButton(w, h);

    this.setPosition(gameW / 2, layoutYFromRef(BUTTON_CENTERS_REF_Y[this.slotIndex], gameH));

    this.label.setStyle(MenuArtButton.makeLabelStyle(this.isPrimary, h));

    const hitArea = new Phaser.Geom.Rectangle(-w / 2, -h / 2, w, h);

    if (!this.input) {
      this.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
      MenuArtButton.attachPointerHandlers(this);
    } else {
      this.input.hitArea = hitArea;
    }
  }

  private paintButton(w: number, h: number): void {
    const g = this.graphics;
    g.clear();

    const radius = Math.min(28, Math.max(10, Math.round(h * 0.32)));
    const left = -w / 2;
    const top = -h / 2;

    if (this.isPrimary) {
      g.fillStyle(0x0d0518, 0.82);
      g.fillRoundedRect(left, top, w, h, radius);

      const outerW = Math.max(4, Math.round(h * 0.07));
      const outerHalf = outerW / 2;

      g.lineStyle(outerW, 0xff2dcd, 1);
      g.strokeRoundedRect(
        left + outerHalf,
        top + outerHalf,
        w - outerW,
        h - outerW,
        Math.max(radius - outerHalf, 6),
      );

      const inset = Math.max(7, Math.round(h * 0.13));

      g.lineStyle(2, 0xffb8e8, 0.9);
      g.strokeRoundedRect(
        left + inset,
        top + inset,
        w - inset * 2,
        h - inset * 2,
        Math.max(radius - inset / 2, 5),
      );
    } else {
      g.fillStyle(0x0d0518, 0.8);
      g.fillRoundedRect(left, top, w, h, radius);

      const strokeW = Math.max(2, Math.round(h * 0.05));
      const strokeHalf = strokeW / 2;

      g.lineStyle(strokeW, 0xb158c8, 1);
      g.strokeRoundedRect(
        left + strokeHalf,
        top + strokeHalf,
        w - strokeW,
        h - strokeW,
        Math.max(radius - strokeHalf, 5),
      );
    }
  }

  private static makeLabelStyle(
    primary: boolean,
    buttonDisplayH: number,
  ): Phaser.Types.GameObjects.Text.TextStyle {
    const fontPx = primary
      ? Math.max(30, Math.round(buttonDisplayH * 0.5))
      : Math.max(22, Math.round(buttonDisplayH * 0.4));

    return primary
      ? {
          fontFamily: "Arial Black, Arial",
          fontStyle: "bold",
          fontSize: `${fontPx}px`,
          color: "#ffd23f",
          stroke: "#5a0e0e",
          strokeThickness: 5,
          align: "center",
        }
      : {
          fontFamily: "Arial",
          fontStyle: "bold",
          fontSize: `${fontPx}px`,
          color: "#ffffff",
          stroke: "#1a0626",
          strokeThickness: 3,
          align: "center",
        };
  }

  private static attachPointerHandlers(btn: MenuArtButton): void {
    if (btn.inputWired) {
      return;
    }

    btn.inputWired = true;

    btn.on("pointerover", () => btn.setScale(1.02));
    btn.on("pointerout", () => btn.setScale(1));
    btn.on("pointerdown", () => btn.setScale(0.983));
    btn.on("pointerup", (pointer: Phaser.Input.Pointer) => {
      btn.setScale(1.02);

      const hit = btn.input?.hitArea as Phaser.Geom.Rectangle | undefined;

      const pt = btn.getLocalPoint(pointer.worldX, pointer.worldY);

      if (hit === undefined) {
        return;
      }

      if (Phaser.Geom.Rectangle.Contains(hit, pt.x, pt.y)) {
        btn.onPressCb();
      }
    });

    btn.on("pointercancel", () => btn.setScale(1));
  }

  setLabel(txt: string): void {
    this.label.setText(txt);
    this.label.setStyle(MenuArtButton.makeLabelStyle(this.isPrimary, this.buttonHeight));
  }
}
