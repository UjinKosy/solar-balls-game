import Phaser from "phaser";

export type NeonButtonVariant = "blue" | "pink";

type NeonButtonOptions = {
  x: number;
  y: number;
  label: string;
  variant?: NeonButtonVariant;
  onPress: () => void;
};

export class NeonButton extends Phaser.GameObjects.Container {
  private readonly bg: Phaser.GameObjects.Image;
  private readonly text: Phaser.GameObjects.Text;
  private readonly hitArea: Phaser.GameObjects.Zone;
  private readonly onPress: () => void;

  constructor(scene: Phaser.Scene, options: NeonButtonOptions) {
    super(scene, options.x, options.y);

    const textureKey =
      options.variant === "pink" ? "btn-neon-pink" : "btn-neon-blue";

    this.bg = scene.add.image(0, 0, textureKey).setDisplaySize(420, 96);
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
      .zone(0, 0, 420, 96)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    this.onPress = options.onPress;

    this.add([this.bg, this.text, this.hitArea]);
    this.bindPointerStates();
    scene.add.existing(this);
  }

  setLabel(value: string): void {
    this.text.setText(value);
  }

  private bindPointerStates(): void {
    this.hitArea.on("pointerover", () => this.setScale(1.03));
    this.hitArea.on("pointerout", () => this.setScale(1));
    this.hitArea.on("pointerdown", () => this.setScale(0.97));
    this.hitArea.on("pointerup", () => {
      this.setScale(1.03);
      this.onPress();
    });
  }
}
