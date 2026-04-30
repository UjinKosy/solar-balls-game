import Phaser from "phaser";
import {
  ASSET_KEYS,
  BACK_BUTTON_BOTTOM_OFFSET,
  CELL_SIZE_VIRTUAL,
  DEPTH,
  GRID_COLS,
  GRID_ROWS,
  HUD_HEIGHT,
  PALETTE_WIDTH,
} from "../../config/play";
import { getLocale, initLocale, t } from "../../i18n";
import { CardPalette } from "../../ui/CardPalette";
import { CellHighlight } from "../../ui/CellHighlight";
import { NeonButton } from "../../ui/NeonButton";
import { PlacedDefender } from "../../ui/PlacedDefender";
import { EnergyHud } from "../../ui/EnergyHud";
import { GridSystem } from "../../systems/GridSystem";
import { InputSystem } from "../../systems/InputSystem";
import { backToMainMenu } from "../stubs/backToMainMenu";
import type { CellAddress, DropOutcome } from "./contracts";

export class PlayScene extends Phaser.Scene {
  private bgImage!: Phaser.GameObjects.Image;

  private grid!: GridSystem;

  private highlight!: CellHighlight;

  private palette!: CardPalette;

  private hud!: EnergyHud;

  private input2!: InputSystem;

  private backButton!: NeonButton;

  private titleText!: Phaser.GameObjects.Text;

  private placed: PlacedDefender[] = [];

  constructor() {
    super("play");
  }

  create(): void {
    initLocale();

    this.cameras.main.setBackgroundColor(0x050021);

    this.bgImage = this.add
      .image(0, 0, ASSET_KEYS.boardBg)
      .setOrigin(0.5)
      .setDepth(DEPTH.background);

    this.titleText = this.add
      .text(0, 0, t("play.title"), {
        fontFamily: "Arial Black, Arial",
        fontSize: "26px",
        color: "#c7f8ff",
        stroke: "#120025",
        strokeThickness: 4,
      })
      .setOrigin(0.5, 0.5)
      .setDepth(DEPTH.hud);

    this.grid = new GridSystem(this);
    this.highlight = new CellHighlight(this, this.grid);
    this.hud = new EnergyHud(this);
    this.palette = new CardPalette(this);

    this.input2 = new InputSystem(this, this.grid);
    this.registerEarthCardDrag();

    this.backButton = new NeonButton(this, {
      x: 0,
      y: 0,
      label: t("common.back"),
      variant: "secondaryRow",
      onPress: () => backToMainMenu(this),
    });
    this.backButton.setDepth(DEPTH.hud);

    this.applyLayout(this.scale.width, this.scale.height);

    this.scale.on("resize", this.onResize, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.onShutdown, this);

    this.input.keyboard?.on("keydown-ESC", () => backToMainMenu(this));

    this.events.on(Phaser.Scenes.Events.WAKE, this.refreshAfterWake, this);
    this.events.on(Phaser.Scenes.Events.RESUME, this.refreshAfterWake, this);
  }

  private registerEarthCardDrag(): void {
    const card = this.palette.earthCard;

    this.input2.registerDragSource(card.getDragSource(), {
      onDragStart: () => {
        card.setDragVisual(true);
      },
      onDrag: (pointer) => {
        card.followPointer(pointer.worldX, pointer.worldY);
      },
      onDragOver: (cell: CellAddress | null) => {
        if (cell) {
          this.highlight.showAt(cell);
        } else {
          this.highlight.hide();
        }
      },
      onDrop: (outcome: DropOutcome) => {
        this.highlight.hide();

        if (outcome.kind === "placed") {
          this.placeDefender(outcome.cell);
          card.snapHome();
        } else {
          card.returnHome();
        }
      },
      onDragEnd: () => {
        card.setDragVisual(false);
      },
    });
  }

  private placeDefender(cell: CellAddress): void {
    if (this.grid.isOccupied(cell)) {
      return;
    }

    this.grid.markOccupied(cell);

    const { x, y } = this.grid.cellCenter(cell);
    const size = this.grid.getLayout().cellSize;
    const sprite = new PlacedDefender(this, {
      cardId: this.palette.earthCard.cardId,
      cell,
      x,
      y,
      size,
    });
    this.placed.push(sprite);
  }

  private onResize(gameSize: Phaser.Structs.Size): void {
    this.applyLayout(gameSize.width, gameSize.height);
  }

  private applyLayout(width: number, height: number): void {
    this.bgImage.setPosition(width / 2, height / 2).setDisplaySize(width, height);

    const paletteCenterX = PALETTE_WIDTH / 2;

    const availableW = width - PALETTE_WIDTH - 32;
    const availableH = height - HUD_HEIGHT - BACK_BUTTON_BOTTOM_OFFSET - 40;

    const cellByW = Math.floor(availableW / GRID_COLS);
    const cellByH = Math.floor(availableH / GRID_ROWS);
    const cellSize = Math.max(48, Math.min(CELL_SIZE_VIRTUAL, cellByW, cellByH));

    const boardW = cellSize * GRID_COLS;
    const boardH = cellSize * GRID_ROWS;
    const originX = PALETTE_WIDTH + (width - PALETTE_WIDTH - boardW) / 2;
    const originY = HUD_HEIGHT + (availableH - boardH) / 2 + 10;

    this.grid.layout({
      originX,
      originY,
      cellSize,
      width: boardW,
      height: boardH,
    });

    this.placed.forEach((p) => {
      const center = this.grid.cellCenter(p.cell);
      p.layoutAt(center.x, center.y, cellSize);
    });

    this.titleText.setPosition(originX + boardW / 2, 32);

    this.hud.layout(originX + boardW / 2, HUD_HEIGHT - 24);

    this.palette.layout(height, paletteCenterX);

    this.backButton.setPosition(width / 2, height - BACK_BUTTON_BOTTOM_OFFSET);
  }

  private refreshAfterWake(): void {
    initLocale();
    this.titleText.setText(t("play.title"));
    this.backButton.setLabel(t("common.back"));
    this.palette.refreshLabels();
    this.hud.refreshLabels();
    void getLocale();
  }

  private onShutdown(): void {
    this.scale.off("resize", this.onResize, this);
    this.events.off(Phaser.Scenes.Events.WAKE, this.refreshAfterWake, this);
    this.events.off(Phaser.Scenes.Events.RESUME, this.refreshAfterWake, this);

    this.placed.forEach((p) => p.destroy());
    this.placed = [];

    this.highlight.destroy();
    this.grid.destroy();
    this.hud.destroy();
    this.palette.destroy();
  }
}
