import Phaser from "phaser";
import { backToMainMenu } from "../stubs/backToMainMenu";

export class PlayScene extends Phaser.Scene {
  constructor() {
    super("play");
  }

  create(): void {
    this.cameras.main.setBackgroundColor(0x050021);

    this.input.keyboard?.on("keydown-ESC", () => backToMainMenu(this));
  }
}
