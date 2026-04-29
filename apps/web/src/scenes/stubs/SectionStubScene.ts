import Phaser from "phaser";
import { t } from "../../i18n";
import { addStubSectionTitle } from "../../ui/menuTypography";
import { NeonButton, type NeonButtonVariant } from "../../ui/NeonButton";
import { backToMainMenu } from "./backToMainMenu";

export type SectionStubSceneConfig = {
  key: string;
  titleKey: string;
  bgColor?: number;
  backVariant?: NeonButtonVariant;
};

export class SectionStubScene extends Phaser.Scene {
  protected readonly stub: SectionStubSceneConfig;

  constructor(config: SectionStubSceneConfig) {
    super(config.key);
    this.stub = config;
  }

  create(): void {
    const bg = this.stub.bgColor ?? 0x0a0833;
    this.cameras.main.setBackgroundColor(bg);

    addStubSectionTitle(this, this.stub.titleKey, t);

    const variant = this.stub.backVariant ?? "secondaryRow";

    new NeonButton(this, {
      x: this.scale.width / 2,
      y: this.scale.height - 120,
      label: t("common.back"),
      variant,
      onPress: () => backToMainMenu(this),
    });
  }
}
