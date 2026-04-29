import Phaser from "phaser";
import { getLocale, initLocale, setLocale, t } from "../i18n";
import { MenuArtButton } from "../ui/MenuArtButton";

export class MainMenuScene extends Phaser.Scene {
  private menuButtons: MenuArtButton[] = [];

  private bgImage!: Phaser.GameObjects.Image;

  private flagRu!: Phaser.GameObjects.Image;

  private flagEn!: Phaser.GameObjects.Image;

  private ringRu!: Phaser.GameObjects.Image;

  private ringEn!: Phaser.GameObjects.Image;

  private exitOverlay?: Phaser.GameObjects.Container;

  private exitInProgress = false;

  constructor() {
    super("main-menu");
  }

  create(): void {
    initLocale();

    const w = this.scale.width;
    const h = this.scale.height;

    this.bgImage = this.add.image(w / 2, h / 2, "menu-bg").setDisplaySize(w, h).setDepth(0);

    const menuKeys = [
      "menu.play",
      "menu.ship",
      "menu.shop",
      "menu.settings",
      "menu.exit",
    ] as const;

    const onPressHandlers: (() => void)[] = [
      () => this.scene.start("play"),
      () => this.scene.start("ship-stub"),
      () => this.scene.start("shop-stub"),
      () => this.scene.start("settings-stub"),
      () => {
        void this.handleExitFlow();
      },
    ];

    this.menuButtons = menuKeys.map((key, idx) => {
      return new MenuArtButton(this, {
        slotIndex: idx,
        label: t(key),
        onPress: onPressHandlers[idx],
      });
    });

    this.createLocaleSwitcher();

    this.scale.on("resize", this.handleResize, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off("resize", this.handleResize, this);
    });

    this.input.keyboard?.on("keydown-E", () => {
      void this.handleExitFlow();
    });
  }

  private handleResize(gameSize: Phaser.Structs.Size): void {
    const w = gameSize.width;
    const h = gameSize.height;

    this.bgImage.setPosition(w / 2, h / 2).setDisplaySize(w, h);

    this.menuButtons.forEach((button) => button.refreshLayout(w, h));

    const fy = Math.min(50, h * 0.06);
    this.flagRu.setPosition(52, fy);
    this.flagEn.setPosition(102, fy);
    this.positionLocaleRings(52, 102, fy);

    if (this.exitOverlay) {
      const [bg, txt] = this.exitOverlay.list;
      const rect = bg as Phaser.GameObjects.Rectangle;
      const textObj = txt as Phaser.GameObjects.Text;
      rect.setPosition(w / 2, h / 2);
      rect.setSize(w, h);
      textObj.setPosition(w / 2, h / 2);
    }
  }

  private createLocaleSwitcher(): void {
    const y = Math.min(50, this.scale.height * 0.06);
    this.ringRu = this.add.image(52, y, "locale-ring").setDisplaySize(48, 48).setAlpha(0).setDepth(10);
    this.ringEn = this.add.image(102, y, "locale-ring").setDisplaySize(48, 48).setAlpha(0).setDepth(10);

    this.flagRu = this.add.image(52, y, "flag-ru").setDisplaySize(40, 40).setDepth(11);
    this.flagEn = this.add.image(102, y, "flag-en").setDisplaySize(40, 40).setDepth(11);

    this.flagRu.setInteractive({ useHandCursor: true }).on("pointerdown", () => {
      setLocale("ru");
      this.refreshMenuLabels();
    });

    this.flagEn.setInteractive({ useHandCursor: true }).on("pointerdown", () => {
      setLocale("en");
      this.refreshMenuLabels();
    });

    this.updateLocaleSwitcherVisual();
  }

  private positionLocaleRings(ruX: number, enX: number, y: number): void {
    this.ringRu.setPosition(ruX, y);
    this.ringEn.setPosition(enX, y);
  }

  private updateLocaleSwitcherVisual(): void {
    const locale = getLocale();

    const active = 1;
    const inactive = 0.45;

    this.flagRu.setAlpha(locale === "ru" ? active : inactive);
    this.flagEn.setAlpha(locale === "en" ? active : inactive);

    this.ringRu.setAlpha(locale === "ru" ? 0.95 : 0);
    this.ringEn.setAlpha(locale === "en" ? 0.95 : 0);
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

    this.updateLocaleSwitcherVisual();
  }

  private async handleExitFlow(): Promise<void> {
    if (this.exitInProgress) {
      return;
    }

    this.exitInProgress = true;
    this.showExitOverlay();

    try {
      const maybeLogout = (window as typeof window & { sbLogout?: () => Promise<void> }).sbLogout;

      if (typeof maybeLogout === "function") {
        await maybeLogout();
      }
    } catch {
      // Fallback redirect below is mandatory even on logout failure.
    } finally {
      window.location.assign("/auth");
    }
  }

  private showExitOverlay(): void {
    if (this.exitOverlay) {
      return;
    }

    const w = this.scale.width;
    const h = this.scale.height;

    const bg = this.add.rectangle(w / 2, h / 2, w, h, 0x050021, 0.85).setInteractive();
    bg.on("pointerdown", () => {});

    const status = this.add
      .text(w / 2, h / 2, t("exit.status"), {
        fontFamily: "Arial",
        fontSize: "32px",
        color: "#c7f8ff",
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(1000);

    this.exitOverlay = this.add.container(0, 0, [bg, status]);
    this.exitOverlay.setDepth(1000);
  }
}
