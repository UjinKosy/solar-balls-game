import Phaser from "phaser";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super("preload");
  }

  preload(): void {
    this.load.image("menu-bg", "/assets/menu/menu-bg.png");
    this.load.image("btn-neon-blue", "/assets/menu/btn-neon-blue.png");
    this.load.image("btn-neon-pink", "/assets/menu/btn-neon-pink.png");
    this.load.image("astrochel-thumbsup", "/assets/menu/astrochel-thumbsup.png");
    this.load.image("flag-ru", "/assets/ui/flag-ru.png");
    this.load.image("flag-en", "/assets/ui/flag-en.png");
  }

  create(): void {
    this.scene.start("main-menu");
  }
}
