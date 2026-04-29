export const GRID_ROWS = 5;

export const GRID_COLS = 9;

export const CELL_SIZE_VIRTUAL = 96;

export const BOARD_WIDTH = GRID_COLS * CELL_SIZE_VIRTUAL;

export const BOARD_HEIGHT = GRID_ROWS * CELL_SIZE_VIRTUAL;

export const PALETTE_WIDTH = 280;

export const HUD_HEIGHT = 96;

export const BACK_BUTTON_BOTTOM_OFFSET = 80;

export const MIN_HITBOX_PX = 64;

export const ENERGY_PLACEHOLDER = 50;

export const RETURN_HOME_DURATION_MS = 200;

export const DEPTH = {
  background: 0,
  grid: 5,
  placedDefender: 10,
  palette: 20,
  ghost: 100,
  hud: 200,
} as const;

export const ASSET_KEYS = {
  boardBg: "play-board-bg",
  cellHighlight: "play-cell-highlight",
  earthCard: "play-earth-card",
  earthIdle: "play-earth-idle",
  energyIcon: "play-energy-icon",
} as const;
