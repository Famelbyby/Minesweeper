export const FORCE_ADD = 1;
export const FORCE_REMOVE = -1;
export const FORCE_TOGGLE_TEXT = 1;
export type fieldParametersType = {
    strings: number | string;
    columns: number | string;
    mines: number | string;
};
export type ceilType = {
    openState: number;
    fieldValue: number;
};
export const GAME_IS_NOT_STARTED = 0;
export const GAME_IS_ACTIVE = 1;
export const GAME_IS_WINNED = 3;
export const GAME_IS_LOST = 4;
export const MINE_FIELD_WIDTH: number = 30;
export const MINE_FIELD_HEIGHT: number = 30;
export const MINE_CEIL = -1;
export const EMPTY_CEIL = 0;
export const UNOPENED_CEIL = 0;
export const OPENED_CEIL = 1;
export const FLAGGED_CEIL = 2;
export const MAX_FIELD_STRINGS: number = 20;
export const MAX_FIELD_COLUMNS: number = 20;
export const MAX_STRINGS = 1000;
export const MIN_STRINGS = 10;
export const MAX_COLUMNS = 1000;
export const MIN_COLUMNS = 10;
export const MIN_MINES = 1;
export const SLIDE_DOWN = 1;
export const SLIDE_RIGHT = 1;
export const SLIDE_LEFT = -1;
export const SLIDE_UP = -1;
export const SLIDE_NEITHER = 0;
export const SLIDE_EVENT_CODES = [
    "KeyW",
    "KeyA",
    "KeyS",
    "KeyD",
    "ArrowDown",
    "ArrowUp",
    "ArrowLeft",
    "ArrowRight",
];
export const NEIGHBORS_CEILS = [
    [0, 1],
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, -1],
    [-1, 0],
    [-1, 1],
];
export const NEIGHBORS_COLORS: string[] = [
    "",
    "deepskyblue",
    "blue",
    "darkblue",
    "indianred",
    "firebrick",
    "darkred",
    "brown",
    "black",
];
