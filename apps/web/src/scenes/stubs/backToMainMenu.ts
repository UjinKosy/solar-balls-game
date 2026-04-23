import Phaser from "phaser";

export const backToMainMenu = (scene: Phaser.Scene): void => {
  scene.scene.start("main-menu");
};
