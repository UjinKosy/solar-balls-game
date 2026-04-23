import Phaser from "phaser";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super("preload");
  }

  create(): void {
    this.scene.start("main-menu");
  }
}
