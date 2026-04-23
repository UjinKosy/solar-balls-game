import Phaser from "phaser";
import { t } from "../../i18n";
import { NeonButton } from "../../ui/NeonButton";
import { backToMainMenu } from "./backToMainMenu";

export class ShipStubScene extends Phaser.Scene {
  constructor() {
    super("ship-stub");
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#0e0a3f");

    this.add
      .text(this.scale.width / 2, 170, t("stub.shipTitle"), {
        fontFamily: "Arial",
        fontSize: "62px",
        color: "#c7f8ff",
      })
      .setOrigin(0.5);

    new NeonButton(this, {
      x: this.scale.width / 2,
      y: this.scale.height - 120,
      label: t("common.back"),
      variant: "blue",
      onPress: () => backToMainMenu(this),
    });
  }
}
