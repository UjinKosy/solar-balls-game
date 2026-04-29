/**
 * Разметка главного меню по референсу `ScYXV6KJ.png` (2752×1536 логических единиц).
 * Реальный `menu-bg.png` может быть другого px-размера — позиции считаем от размеров сцены.
 */
export const MENU_REF = { W: 2752, H: 1536 } as const;

/** Ширина колонки плашек на арте */
export const BUTTON_ART_WIDTH_REF = 1140;

/**
 * Вертикальные центры плашек кнопок сверху вниз (ИГРАТЬ … ВЫХОД), в пикселях макета.
 */
export const BUTTON_CENTERS_REF_Y = [474, 614, 734, 852, 974] as const;

/** Условные высоты плашек на арте (верхняя крупнее). */
export const BUTTON_HEIGHTS_REF = [126, 106, 106, 106, 106] as const;

export function layoutYFromRef(refY: number, sceneH: number): number {
  return (refY / MENU_REF.H) * sceneH;
}

export function buttonWidthFromRef(sceneW: number): number {
  return Math.round(sceneW * (BUTTON_ART_WIDTH_REF / MENU_REF.W));
}
