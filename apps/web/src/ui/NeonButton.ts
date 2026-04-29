import Phaser from "phaser";

/**
 * Retro / synthwave (референс ScYXV6KJ):
 * - primaryCta — «ИГРАТЬ»: розово-фуксиевая подложка, двойная жёлто-золотая обводка, жёлтый текст.
 * - secondaryRow — прочие пункты: сине-бирюзовая подложка, двойная циановая обводка, белый текст.
 * Legacy (текстуры PNG): blue | pink — для совместимости, если понадобятся наружу.
 */
export type NeonButtonVariant = "blue" | "pink" | "primaryCta" | "secondaryRow";

type NeonButtonOptions = {
  x: number;
  y: number;
  label: string;
  variant?: NeonButtonVariant;
  /** Ширина плашки в пикселях сцены (по умолчанию ~41% ширины экрана под макет 2752px). */
  width?: number;
  /** Высота плашки. По умолчанию: primaryCta 112, secondaryRow 90. */
  height?: number;
  onPress: () => void;
};

export class NeonButton extends Phaser.GameObjects.Container {
  private readonly legacyBg?: Phaser.GameObjects.Image;

  private readonly retroGraphics?: Phaser.GameObjects.Graphics;

  private readonly text: Phaser.GameObjects.Text;

  private readonly hitArea: Phaser.GameObjects.Zone;

  private readonly onPress: () => void;

  private readonly synthRetro: "primaryCta" | "secondaryRow" | null;

  private pixelWidth = 460;

  private pixelHeight = 96;

  constructor(scene: Phaser.Scene, options: NeonButtonOptions) {
    super(scene, options.x, options.y);

    const variant = options.variant ?? "blue";
    const isRetro = variant === "primaryCta" || variant === "secondaryRow";

    this.onPress = options.onPress;
    this.synthRetro = isRetro ? variant : null;

    if (isRetro) {
      const h =
        options.height ??
        (variant === "primaryCta" ? 112 : 90);
      this.pixelHeight = h;
      this.pixelWidth = options.width ?? Math.round(scene.scale.width * 0.414);

      this.retroGraphics = scene.add.graphics();
      const textStyles =
        variant === "primaryCta"
          ? {
              fontFamily: "Arial Black, Arial",
              fontSize: `${Math.round(h * 0.38)}px`,
              fontStyle: "bold" as const,
              color: "#ffe566",
              stroke: "#553300",
              strokeThickness: 4,
              align: "center" as const,
            }
          : {
              fontFamily: "Arial",
              fontSize: `${Math.round(h * 0.34)}px`,
              fontStyle: "bold" as const,
              color: "#ffffff",
              stroke: "#002233",
              strokeThickness: 3,
              align: "center" as const,
            };

      this.text = scene.add.text(0, 0, options.label, textStyles).setOrigin(0.5);

      this.paintRetro(this.retroGraphics, variant);
      this.hitArea = scene.add
        .zone(0, 0, this.pixelWidth, this.pixelHeight)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

      this.add([this.retroGraphics, this.text, this.hitArea]);
    } else {
      const textureKey = variant === "pink" ? "btn-neon-pink" : "btn-neon-blue";
      const displayH = options.height ?? 96;

      this.legacyBg = scene.add.image(0, 0, textureKey).setDisplaySize(420, displayH);

      this.text = scene.add
        .text(0, 0, options.label, {
          fontFamily: "Arial",
          fontSize: "34px",
          color: "#ffffff",
          stroke: "#120025",
          strokeThickness: 6,
        })
        .setOrigin(0.5);

      this.hitArea = scene.add
        .zone(0, 0, 420, displayH)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

      this.add([this.legacyBg, this.text, this.hitArea]);
    }

    this.bindPointerStates();
    scene.add.existing(this);
  }

  setLabel(value: string): void {
    this.text.setText(value);
  }

  /**
   * Обновить размеры векторной кнопки (например после resize), чтобы совпадать с макетом.
   */
  applyRetroLayout(width: number, height: number): void {
    if (!this.retroGraphics || !this.synthRetro) {
      return;
    }

    this.pixelWidth = width;
    this.pixelHeight = height;

    this.paintRetro(this.retroGraphics, this.synthRetro);
    this.hitArea.setSize(width, height);

    const h = height;
    if (this.synthRetro === "primaryCta") {
      this.text.setFontSize(`${Math.round(h * 0.38)}px`);
    } else {
      this.text.setFontSize(`${Math.round(h * 0.34)}px`);
    }
  }

  private paintRetro(g: Phaser.GameObjects.Graphics, variant: "primaryCta" | "secondaryRow"): void {
    const bw = this.pixelWidth;
    const bh = this.pixelHeight;
    const radius = Math.min(26, Math.floor(bh / 4.8));
    const left = -bw / 2;
    const top = -bh / 2;

    g.clear();

    if (variant === "primaryCta") {
      g.fillStyle(0x883388, 0.52);
      g.fillRoundedRect(left, top, bw, bh, radius);
      g.lineStyle(6, 0xffbb22, 1);
      g.strokeRoundedRect(left + 2, top + 2, bw - 4, bh - 4, radius - 2);
      g.lineStyle(2, 0xffeeaa, 0.9);
      g.strokeRoundedRect(left + 6, top + 6, bw - 12, bh - 12, Math.max(radius - 5, 6));
      g.fillStyle(0xffffff, 0.12);
      g.fillRoundedRect(left + bh * 0.12, top + bh * 0.2, bw - bh * 0.24, bh * 0.18, radius);
    } else {
      g.fillStyle(0x061c40, 0.58);
      g.fillRoundedRect(left, top, bw, bh, radius);
      g.lineStyle(5, 0x00ffc8, 1);
      g.strokeRoundedRect(left + 2, top + 2, bw - 4, bh - 4, radius - 2);
      g.lineStyle(2, 0x88ffff, 0.85);
      g.strokeRoundedRect(left + 5, top + 5, bw - 10, bh - 10, Math.max(radius - 4, 6));
      g.fillStyle(0xffffff, 0.1);
      g.fillRoundedRect(left + bh * 0.11, top + bh * 0.22, bw - bh * 0.22, bh * 0.16, radius);
    }
  }

  private bindPointerStates(): void {
    this.hitArea.on("pointerover", () => this.setScale(1.03));
    this.hitArea.on("pointerout", () => this.setScale(1));
    this.hitArea.on("pointerdown", () => this.setScale(0.97));
    this.hitArea.on("pointerup", (pointer: Phaser.Input.Pointer, _lx: number, _ly: number, event?: Phaser.Types.Input.EventData) => {
      const rect = this.hitArea.getBounds();
      const stillOver =
        pointer != null && Phaser.Geom.Rectangle.Contains(rect, pointer.worldX, pointer.worldY);

      this.setScale(stillOver ? 1.03 : 1);
      if (stillOver) {
        this.onPress();
      }

      event?.stopPropagation();
    });

    this.hitArea.on("pointercancel", () => this.setScale(1));
  }
}
