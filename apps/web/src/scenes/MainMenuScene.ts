import Phaser from "phaser";
import { initLocale, setLocale, t } from "../i18n";
import { NeonButton } from "../ui/NeonButton";

export class MainMenuScene extends Phaser.Scene {
  private menuButtons: NeonButton[] = [];

  constructor() {
    super("main-menu");
  }

  create(): void {
    initLocale();

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

    this.menuButtons = [
      new NeonButton(this, {
      x: startX,
      y: startY + gap * 0,
      label: t("menu.play"),
      variant: "blue",
      onPress: () => this.scene.start("play-stub"),
    }),

      new NeonButton(this, {
      x: startX,
      y: startY + gap * 1,
      label: t("menu.ship"),
      variant: "pink",
      onPress: () => this.scene.start("ship-stub"),
    }),

      new NeonButton(this, {
      x: startX,
      y: startY + gap * 2,
      label: t("menu.shop"),
      variant: "blue",
      onPress: () => this.scene.start("shop-stub"),
    }),

      new NeonButton(this, {
      x: startX,
      y: startY + gap * 3,
      label: t("menu.settings"),
      variant: "pink",
      onPress: () => this.scene.start("settings-stub"),
    }),

      new NeonButton(this, {
      x: startX,
      y: startY + gap * 4,
      label: t("menu.exit"),
      variant: "blue",
      onPress: () => {
        void this.handleExitFlow();
      },
    }),
    ];

    this.createLocaleSwitcher();

    this.input.keyboard?.on("keydown-E", () => {
      void this.handleExitFlow();
    });
  }

  private createLocaleSwitcher(): void {
    const ru = this.add.image(52, 50, "flag-ru").setDisplaySize(40, 40);
    const en = this.add.image(102, 50, "flag-en").setDisplaySize(40, 40);

    ru.setInteractive({ useHandCursor: true }).on("pointerdown", () => {
      setLocale("ru");
      this.refreshMenuLabels();
    });

    en.setInteractive({ useHandCursor: true }).on("pointerdown", () => {
      setLocale("en");
      this.refreshMenuLabels();
    });
  }

  private refreshMenuLabels(): void {
    const keys = [
      "menu.play",
      "menu.ship",
      "menu.shop",
      "menu.settings",
      "menu.exit",
    ] as const;

    this.menuButtons.forEach((button, index) => {
      button.setLabel(t(keys[index]));
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
