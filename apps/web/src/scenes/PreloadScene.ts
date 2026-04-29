import Phaser from "phaser";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super("preload");
  }

  preload(): void {
    this.load.image("menu-bg", "/assets/menu/menu-bg.png");
    this.load.image("flag-ru", "/assets/ui/flag-ru.png");
    this.load.image("flag-en", "/assets/ui/flag-en.png");
    this.load.image("locale-ring", "/assets/ui/locale-ring.png");
  }

  create(): void {
    this.scene.start("main-menu");
  }
}
