import Phaser from "phaser";

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super("main-menu");
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#050021");

    this.add
      .text(this.scale.width / 2, this.scale.height / 2, "Шаранутые игры", {
        fontFamily: "Arial",
        fontSize: "56px",
        color: "#c7f8ff",
      })
      .setOrigin(0.5);
  }
}
