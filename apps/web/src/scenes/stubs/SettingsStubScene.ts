import { SectionStubScene } from "./SectionStubScene";

export class SettingsStubScene extends SectionStubScene {
  constructor() {
    super({
      key: "settings-stub",
      titleKey: "stub.settingsTitle",
      bgColor: 0x1b1455,
    });
  }
}
