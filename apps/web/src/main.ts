import Phaser from "phaser";
import { BootScene } from "./scenes/BootScene";
import { MainMenuScene } from "./scenes/MainMenuScene";
import { PlayScene } from "./scenes/play/PlayScene";
import { PreloadScene } from "./scenes/PreloadScene";
import { SettingsStubScene } from "./scenes/stubs/SettingsStubScene";
import { ShipStubScene } from "./scenes/stubs/ShipStubScene";
import { ShopStubScene } from "./scenes/stubs/ShopStubScene";

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
  scene: [
    BootScene,
    PreloadScene,
    MainMenuScene,
    PlayScene,
    ShipStubScene,
    ShopStubScene,
    SettingsStubScene,
  ],
});

export default game;
