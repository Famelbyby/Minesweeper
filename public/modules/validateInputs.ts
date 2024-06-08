import {
    MAX_COLUMNS,
    MAX_STRINGS,
    MIN_COLUMNS,
    MIN_MINES,
    MIN_STRINGS,
} from "../components/consts";

export function validateStringsOrColumns(
    value: string,
    type: "strings" | "columns"
): number {
    let numberValue = Number(value);

    switch (type) {
        case "strings":
            if (numberValue > MAX_STRINGS) {
                numberValue = MAX_STRINGS;
            }

            if (numberValue < MIN_STRINGS) {
                numberValue = MIN_STRINGS;
            }
        case "columns":
            if (numberValue > MAX_COLUMNS) {
                numberValue = MAX_COLUMNS;
            }

            if (numberValue < MIN_COLUMNS) {
                numberValue = MIN_COLUMNS;
            }
    }

    return numberValue;
}

export function validateMines(
    mines: string,
    strings: number,
    columns: number
): number {
    let numberMines = Number(mines);

    if (numberMines >= strings * columns) {
        numberMines = strings * columns - 1;
    }

    if (numberMines < MIN_MINES) {
        numberMines = MIN_MINES;
    }

    return numberMines;
}
