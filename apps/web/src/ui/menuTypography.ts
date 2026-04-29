/** Как у референса ScYXV6KJ: заголовок — розово-сиреневая «заливка», толстая бирюзовая обводка; подстрочник — бирюза. */

import Phaser from "phaser";
import type { TFunction } from "../i18n";

export const MENU_HERO_TITLE_STYLE: Phaser.Types.GameObjects.Text.TextStyle = {
  fontFamily: "Arial Black, Arial",
  fontSize: "64px",
  fontStyle: "bold",
  color: "#e8aaff",
  stroke: "#00f5ff",
  strokeThickness: 10,
  shadow: {
    offsetX: 0,
    offsetY: 6,
    color: "#441166",
    blur: 0,
    fill: true,
  },
};

export const MENU_HERO_SUBTITLE_STYLE: Phaser.Types.GameObjects.Text.TextStyle = {
  fontFamily: "Arial",
  fontSize: "30px",
  fontStyle: "bold",
  color: "#54f5ff",
  stroke: "#100828",
  strokeThickness: 4,
};

export const STUB_TITLE_STYLE: Phaser.Types.GameObjects.Text.TextStyle = {
  fontFamily: "Arial",
  fontSize: "62px",
  color: "#e8c5ff",
  stroke: "#00d8f0",
  strokeThickness: 6,
};

export function addStubSectionTitle(scene: Phaser.Scene, titleKey: string, t: TFunction): Phaser.GameObjects.Text {
  return scene.add
    .text(scene.scale.width / 2, 170, t(titleKey), STUB_TITLE_STYLE)
    .setOrigin(0.5);
}
