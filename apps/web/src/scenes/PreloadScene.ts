import Phaser from "phaser";
import { ASSET_KEYS } from "../config/play";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super("preload");
  }

  preload(): void {
    this.load.image("menu-bg", "/assets/menu/menu-bg.png");
    this.load.image("flag-ru", "/assets/ui/flag-ru.png");
    this.load.image("flag-en", "/assets/ui/flag-en.png");
    this.load.image("locale-ring", "/assets/ui/locale-ring.png");

    this.load.image(ASSET_KEYS.boardBg, "/assets/play/board-bg.png");
    this.load.image(ASSET_KEYS.cellHighlight, "/assets/play/cell-highlight.png");
    this.load.image(ASSET_KEYS.earthCard, "/assets/play/earth-card.png");
    this.load.image(ASSET_KEYS.earthIdle, "/assets/play/earth-idle.png");
    this.load.image(ASSET_KEYS.energyIcon, "/assets/ui/energy-icon.png");
  }

  create(): void {
    this.scene.start("main-menu");
  }
}
