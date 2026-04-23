import Phaser from "phaser";
import { t } from "../../i18n";
import { NeonButton } from "../../ui/NeonButton";
import { backToMainMenu } from "./backToMainMenu";

export class ShopStubScene extends Phaser.Scene {
  constructor() {
    super("shop-stub");
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#140e4b");

    this.add
      .text(this.scale.width / 2, 170, t("stub.shopTitle"), {
        fontFamily: "Arial",
        fontSize: "62px",
        color: "#c7f8ff",
      })
      .setOrigin(0.5);

    new NeonButton(this, {
      x: this.scale.width / 2,
      y: this.scale.height - 120,
      label: t("common.back"),
      variant: "pink",
      onPress: () => backToMainMenu(this),
    });
  }
}
