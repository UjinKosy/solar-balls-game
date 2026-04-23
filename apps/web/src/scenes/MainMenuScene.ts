import Phaser from "phaser";

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super("main-menu");
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#050021");

    this.add
      .text(this.scale.width / 2, this.scale.height / 2, "Шаранутые игры", {
        fontFamily: "Arial",
        fontSize: "56px",
        color: "#c7f8ff",
      })
      .setOrigin(0.5);

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
