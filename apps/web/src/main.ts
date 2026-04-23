import Phaser from "phaser";
import { BootScene } from "./scenes/BootScene";
import { MainMenuScene } from "./scenes/MainMenuScene";
import { PreloadScene } from "./scenes/PreloadScene";

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: "app",
  width: 1280,
  height: 720,
  backgroundColor: "#050021",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, PreloadScene, MainMenuScene],
});

export default game;
