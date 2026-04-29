import { SectionStubScene } from "./SectionStubScene";

export class PlayStubScene extends SectionStubScene {
  constructor() {
    super({
      key: "play-stub",
      titleKey: "stub.playTitle",
      bgColor: 0x0a0833,
    });
  }
}
