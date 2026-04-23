import Phaser from "phaser";
import { NeonButton } from "../ui/NeonButton";

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super("main-menu");
  }

  create(): void {
    this.add
      .image(this.scale.width / 2, this.scale.height / 2, "menu-bg")
      .setDisplaySize(this.scale.width, this.scale.height);

    this.add
      .image(this.scale.width - 210, this.scale.height / 2 + 70, "astrochel-thumbsup")
      .setDisplaySize(260, 260);

    this.add
      .text(this.scale.width / 2, 90, "Шаранутые игры", {
        fontFamily: "Arial",
        fontSize: "64px",
        color: "#c7f8ff",
        stroke: "#1f0042",
        strokeThickness: 8,
      })
      .setOrigin(0.5);

    const startX = this.scale.width / 2 - 120;
    const startY = 210;
    const gap = 102;

    new NeonButton(this, {
      x: startX,
      y: startY + gap * 0,
      label: "ИГРАТЬ",
      variant: "blue",
      onPress: () => this.scene.start("play-stub"),
    });

    new NeonButton(this, {
      x: startX,
      y: startY + gap * 1,
      label: "КОРАБЛЬ АСТРОЧЕЛА",
      variant: "pink",
      onPress: () => this.scene.start("ship-stub"),
    });

    new NeonButton(this, {
      x: startX,
      y: startY + gap * 2,
      label: "МАГАЗИН АСТРОЧЕЛА",
      variant: "blue",
      onPress: () => this.scene.start("shop-stub"),
    });

    new NeonButton(this, {
      x: startX,
      y: startY + gap * 3,
      label: "НАСТРОЙКИ",
      variant: "pink",
      onPress: () => this.scene.start("settings-stub"),
    });

    new NeonButton(this, {
      x: startX,
      y: startY + gap * 4,
      label: "ВЫХОД",
      variant: "blue",
      onPress: () => {
        void this.handleExitFlow();
      },
    });

    this.input.keyboard?.on("keydown-E", () => {
      void this.handleExitFlow();
    });
  }

  private async handleExitFlow(): Promise<void> {
    try {
      const maybeLogout = (window as typeof window & { sbLogout?: () => Promise<void> })
        .sbLogout;

      if (typeof maybeLogout === "function") {
        await maybeLogout();
      }
    } catch {
      // Fallback redirect below is mandatory even on logout failure.
    } finally {
      window.location.assign("/auth");
    }
  }
}
