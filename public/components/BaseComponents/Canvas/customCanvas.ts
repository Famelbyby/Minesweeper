import { joinClasses } from "../../../modules/joinClasses";
import {
    EMPTY_CEIL,
    FLAGGED_CEIL,
    MAX_FIELD_COLUMNS,
    MAX_FIELD_STRINGS,
    MINE_CEIL,
    MINE_FIELD_HEIGHT,
    MINE_FIELD_WIDTH,
    NEIGHBORS_CEILS,
    NEIGHBORS_COLORS,
    OPENED_CEIL,
    UNOPENED_CEIL,
    ceilType,
    fieldParametersType,
} from "../../consts";
import CommonComponent from "../CommonComponent/commonComponent";

export class CustomCanvas extends CommonComponent {
    private fieldParameters: fieldParametersType;
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private minesField: ceilType[][] = [];
    private hasGenerated: boolean = false;
    private flagImage: CanvasImageSource;
    private currentDifX: number = 0;
    private currentDifY: number = 0;

    constructor(
        fieldParameters: fieldParametersType,
        canvasAttrs: any,
        canvasClass: string[]
    ) {
        super("", [], canvasAttrs, canvasClass);

        this.fieldParameters = fieldParameters;
    }

    private generateField(clickedCeilX: number, clickedCeilY: number) {
        this.flagImage = document.getElementById(
            "flag-img"
        ) as CanvasImageSource;

        let leftMines: number = +this.fieldParameters.mines;
        const strings: number = +this.fieldParameters.strings;
        const columns: number = +this.fieldParameters.columns;
        let currentX: number = 0;
        let currentY: number = 0;
        let leftCeils: number = strings * columns;

        for (let i = 0; i < strings; ++i) {
            this.minesField.push([]);
        }

        this.minesField[clickedCeilY][clickedCeilX] = {
            fieldValue: EMPTY_CEIL,
            openState: UNOPENED_CEIL,
        };

        while (leftMines > 0) {
            if (currentX !== clickedCeilX || currentY !== clickedCeilY) {
                if (Math.random() > 0.85 || leftCeils === leftMines) {
                    this.minesField[currentY][currentX] = {
                        fieldValue: MINE_CEIL,
                        openState: UNOPENED_CEIL,
                    };
                    --leftMines;
                }
            }

            ++currentX;
            --leftCeils;

            if (currentX === columns) {
                currentX = 0;
                ++currentY;
            }
        }

        this.minesField.forEach((_: ceilType[], indexY: number) => {
            for (let i = 0; i < columns; ++i) {
                const minesCeil: number =
                    this.minesField[indexY][i]?.fieldValue || EMPTY_CEIL;
                if (minesCeil !== MINE_CEIL) {
                    let bombNeighbors = 0;
                    NEIGHBORS_CEILS.forEach((neighborCeil: number[]) => {
                        const nextY = indexY + neighborCeil[0];
                        const nextX = i + neighborCeil[1];
                        if (
                            nextY >= 0 &&
                            nextY < strings &&
                            nextX >= 0 &&
                            nextX < columns &&
                            this.minesField[nextY][nextX]?.fieldValue ===
                                MINE_CEIL
                        ) {
                            ++bombNeighbors;
                        }
                    });
                    this.minesField[indexY][i] = {
                        fieldValue: bombNeighbors,
                        openState: UNOPENED_CEIL,
                    };
                }
            }
        });
    }

    openAllCeils() {
        let currentY: number = 0;

        const bombImage = document.getElementById(
            "bomb-img"
        ) as CanvasImageSource;

        this.minesField.forEach((minesString: ceilType[], indexY: number) => {
            let currentX: number = 0;

            minesString.forEach((minesCeil: ceilType, indexX: number) => {
                if (minesCeil.openState === 0) {
                    this.minesField[indexY][indexX].openState = 1;

                    this.context.fillStyle = "#d1d1d1";
                    this.context.fillRect(
                        currentX,
                        currentY,
                        MINE_FIELD_WIDTH,
                        MINE_FIELD_HEIGHT
                    );
                    this.context.strokeRect(
                        currentX,
                        currentY,
                        MINE_FIELD_WIDTH,
                        MINE_FIELD_HEIGHT
                    );

                    switch (minesCeil.fieldValue) {
                        case EMPTY_CEIL:
                            break;
                        case MINE_CEIL:
                            this.context.drawImage(
                                bombImage,
                                currentX,
                                currentY,
                                MINE_FIELD_WIDTH,
                                MINE_FIELD_HEIGHT
                            );
                            break;
                        default:
                            this.context.strokeStyle =
                                NEIGHBORS_COLORS[minesCeil.fieldValue];
                            this.context.strokeText(
                                String(minesCeil.fieldValue),
                                currentX + MINE_FIELD_WIDTH / 2,
                                currentY + MINE_FIELD_HEIGHT / 2
                            );

                            this.context.strokeStyle = "white";
                            this.context.fillStyle = "gray";
                    }
                }

                currentX += MINE_FIELD_WIDTH;
            });

            currentY += MINE_FIELD_HEIGHT;
        });
    }

    openCurrentCeil(
        currentX: number,
        currentY: number,
        clickedCeilY: number,
        clickedCeilX: number
    ): number {
        const minesNeighbors: ceilType =
            this.minesField[clickedCeilY][clickedCeilX];

        if (minesNeighbors.fieldValue === MINE_CEIL) {
            return MINE_CEIL;
        }

        if (minesNeighbors.openState === OPENED_CEIL) {
            return 0;
        }

        const queueToOpenCeils = [
            {
                yCeil: clickedCeilY,
                xCeil: clickedCeilX,
                yCoor: currentY,
                xCoor: currentX,
            },
        ];
        let openedCeils = 0;

        while (queueToOpenCeils.length > 0) {
            const cC = queueToOpenCeils[0];

            queueToOpenCeils.shift();

            const currentFieldValue =
                this.minesField[cC.yCeil][cC.xCeil].fieldValue;
            const currentOpenState =
                this.minesField[cC.yCeil][cC.xCeil].openState;

            if (
                currentFieldValue === MINE_CEIL ||
                currentOpenState !== UNOPENED_CEIL
            ) {
                continue;
            }

            ++openedCeils;

            this.minesField[cC.yCeil][cC.xCeil].openState = OPENED_CEIL;

            this.context.fillStyle = "#d1d1d1";
            this.context.fillRect(
                cC.xCoor,
                cC.yCoor,
                MINE_FIELD_WIDTH,
                MINE_FIELD_HEIGHT
            );
            this.context.strokeRect(
                cC.xCoor,
                cC.yCoor,
                MINE_FIELD_WIDTH,
                MINE_FIELD_HEIGHT
            );

            if (currentFieldValue !== EMPTY_CEIL) {
                this.context.strokeStyle = NEIGHBORS_COLORS[currentFieldValue];
                this.context.strokeText(
                    String(currentFieldValue),
                    cC.xCoor + MINE_FIELD_WIDTH / 2,
                    cC.yCoor + MINE_FIELD_HEIGHT / 2
                );

                this.context.strokeStyle = "white";
                this.context.fillStyle = "gray";
            } else {
                NEIGHBORS_CEILS.forEach((neighborCeil: number[]) => {
                    const difY = neighborCeil[0];
                    const difX = neighborCeil[1];
                    const nextYCeil = difY + cC.yCeil;
                    const nextXCeil = difX + cC.xCeil;

                    if (
                        nextYCeil >= 0 &&
                        nextYCeil < +this.fieldParameters.strings &&
                        nextXCeil >= 0 &&
                        nextXCeil < +this.fieldParameters.columns &&
                        this.minesField[nextYCeil][nextXCeil].openState ===
                            UNOPENED_CEIL &&
                        this.minesField[nextYCeil][nextXCeil].fieldValue !==
                            MINE_CEIL
                    ) {
                        queueToOpenCeils.push({
                            yCeil: nextYCeil,
                            xCeil: nextXCeil,
                            yCoor: cC.yCoor + difY * MINE_FIELD_HEIGHT,
                            xCoor: cC.xCoor + difX * MINE_FIELD_WIDTH,
                        });
                    }
                });
            }
        }

        return openedCeils;
    }

    pressEventHandler(e: MouseEvent | TouchEvent): number {
        let mouseX = (e as TouchEvent).changedTouches
            ? (e as TouchEvent).changedTouches[0].pageX
            : (e as MouseEvent).pageX;
        let mouseY = (e as TouchEvent).changedTouches
            ? (e as TouchEvent).changedTouches[0].pageY
            : (e as MouseEvent).pageY;
        mouseX -= this.canvas.offsetLeft + 12;
        mouseY -= this.canvas.offsetTop + 12;

        const currentX = mouseX - (mouseX % MINE_FIELD_WIDTH);
        const currentY = mouseY - (mouseY % MINE_FIELD_HEIGHT);
        const clickedCeilX = this.currentDifX + Math.floor(currentX / MINE_FIELD_WIDTH);
        const clickedCeilY = this.currentDifY + Math.floor(currentY / MINE_FIELD_HEIGHT);

        if (!this.hasGenerated) {
            this.generateField(clickedCeilX, clickedCeilY);
            this.hasGenerated = true;
        }

        return this.openCurrentCeil(
            currentX,
            currentY,
            clickedCeilY,
            clickedCeilX
        );
    }

    addFlagAtCeil(e: any) {
        let mouseX = (e as TouchEvent).changedTouches
            ? (e as TouchEvent).changedTouches[0].pageX
            : (e as MouseEvent).pageX;
        let mouseY = (e as TouchEvent).changedTouches
            ? (e as TouchEvent).changedTouches[0].pageY
            : (e as MouseEvent).pageY;
        mouseX -= this.canvas.offsetLeft + 12;
        mouseY -= this.canvas.offsetTop + 12;

        const currentX = mouseX - (mouseX % MINE_FIELD_WIDTH);
        const currentY = mouseY - (mouseY % MINE_FIELD_HEIGHT);
        const clickedCeilX = this.currentDifX + Math.floor(currentX / MINE_FIELD_WIDTH);
        const clickedCeilY = this.currentDifY + Math.floor(currentY / MINE_FIELD_HEIGHT);

        if (!this.hasGenerated) {
            this.generateField(clickedCeilX, clickedCeilY);
            this.hasGenerated = true;
        }

        switch (this.minesField[clickedCeilY][clickedCeilX].openState) {
            case UNOPENED_CEIL:
                this.context.drawImage(
                    this.flagImage,
                    currentX,
                    currentY,
                    MINE_FIELD_WIDTH,
                    MINE_FIELD_HEIGHT
                );
                this.minesField[clickedCeilY][clickedCeilX].openState =
                    FLAGGED_CEIL;
                break;
            case FLAGGED_CEIL:
                this.context.strokeStyle = "white";
                this.context.fillStyle = "gray";
                this.context.lineWidth = 1;
                this.context.fillRect(
                    currentX,
                    currentY,
                    MINE_FIELD_WIDTH,
                    MINE_FIELD_HEIGHT
                );
                this.context.strokeRect(
                    currentX,
                    currentY,
                    MINE_FIELD_WIDTH,
                    MINE_FIELD_HEIGHT
                );
                this.minesField[clickedCeilY][clickedCeilX].openState =
                    UNOPENED_CEIL;
                break;
        }
    }

    refillCanvas(difX: number, difY: number) {
        this.currentDifX += difX;

        if (
            this.currentDifX + MAX_FIELD_COLUMNS >
            +this.fieldParameters.columns
        ) {
            this.currentDifX =
                +this.fieldParameters.columns - MAX_FIELD_COLUMNS;
        }

        if (this.currentDifX < 0) {
            this.currentDifX = 0;
        }

        this.currentDifY += difY;

        if (
            this.currentDifY + MAX_FIELD_STRINGS >
            +this.fieldParameters.strings
        ) {
            this.currentDifY =
                +this.fieldParameters.strings - MAX_FIELD_STRINGS;
        }

        if (this.currentDifY < 0) {
            this.currentDifY = 0;
        }

        this.context.strokeStyle = "white";
        this.context.fillStyle = "gray";
        this.context.lineWidth = 1;

        let currentY: number = 0;

        for (
            let j = 0;
            j < Math.min(MAX_FIELD_STRINGS, +this.fieldParameters.strings);
            ++j
        ) {
            let currentX = 0;

            for (
                let i = 0;
                i < Math.min(MAX_FIELD_COLUMNS, +this.fieldParameters.columns);
                ++i
            ) {
                const currentCeil =
                    this.minesField[this.currentDifY + j][this.currentDifX + i];

                if (currentCeil.openState === OPENED_CEIL) {
                    this.context.fillStyle = "#d1d1d1";
                }
                this.context.fillRect(
                    currentX,
                    currentY,
                    MINE_FIELD_WIDTH,
                    MINE_FIELD_HEIGHT
                );
                this.context.strokeRect(
                    currentX,
                    currentY,
                    MINE_FIELD_WIDTH,
                    MINE_FIELD_HEIGHT
                );

                switch (currentCeil.openState) {
                    case OPENED_CEIL:
                        if (currentCeil.fieldValue !== EMPTY_CEIL) {
                            this.context.strokeStyle =
                                NEIGHBORS_COLORS[currentCeil.fieldValue];
                            this.context.strokeText(
                                String(currentCeil.fieldValue),
                                currentX + MINE_FIELD_WIDTH / 2,
                                currentY + MINE_FIELD_HEIGHT / 2
                            );

                            this.context.strokeStyle = "white";
                            this.context.fillStyle = "gray";
                        }
                        break;
                    case FLAGGED_CEIL:
                        this.context.drawImage(
                            this.flagImage,
                            currentX,
                            currentY,
                            MINE_FIELD_WIDTH,
                            MINE_FIELD_HEIGHT
                        );
                        break;
                }

                this.context.fillStyle = "gray";
                currentX += MINE_FIELD_WIDTH;
            }

            currentY += MINE_FIELD_HEIGHT;
        }
    }

    fillCanvas() {
        this.canvas = document.getElementById(
            this.componentAttrs.id
        ) as HTMLCanvasElement;
        this.context = this.canvas.getContext("2d");
        const { strings, columns } = this.fieldParameters;
        const maxCanvasWidth = MINE_FIELD_WIDTH * +columns;
        const maxCanvasHeight = MINE_FIELD_HEIGHT * +strings;

        if (maxCanvasWidth > 600) {
            this.canvas.style.width = "600px";
        } else {
            this.toggleAttr({ key: "width", value: `${maxCanvasWidth}` });
            this.canvas.style.width = `${maxCanvasWidth}px`;
        }

        if (maxCanvasHeight > 600) {
            this.canvas.style.height = "600px";
        } else {
            this.toggleAttr({ key: "height", value: `${maxCanvasHeight}` });
            this.canvas.style.height = `${maxCanvasHeight}px`;
        }

        this.update();

        this.context.strokeStyle = "white";
        this.context.fillStyle = "gray";
        this.context.lineWidth = 1;

        let currentY: number = 0;

        for (let j = 0; j < +strings; ++j) {
            let currentX = 0;

            for (let i = 0; i < +columns; ++i) {
                this.context.fillRect(
                    currentX,
                    currentY,
                    MINE_FIELD_WIDTH,
                    MINE_FIELD_HEIGHT
                );
                this.context.strokeRect(
                    currentX,
                    currentY,
                    MINE_FIELD_WIDTH,
                    MINE_FIELD_HEIGHT
                );
                currentX += MINE_FIELD_WIDTH;
            }

            currentY += MINE_FIELD_HEIGHT;
        }
    }

    render(): string {
        let canvas = "<canvas ";

        for (const [key, value] of Object.entries(this.componentAttrs)) {
            canvas += `${key}="${value}" `;
        }

        return canvas + `class="${joinClasses(this.componentClass)}"></canvas>`;
    }
}
