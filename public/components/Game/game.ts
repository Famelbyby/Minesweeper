import { CustomButton } from "../BaseComponents/Button/customButton";
import { CustomCanvas } from "../BaseComponents/Canvas/customCanvas";
import { CustomImage } from "../BaseComponents/Image/customImage";
import { CustomPanel } from "../BaseComponents/Panel/customPanel";
import { CustomSpan } from "../BaseComponents/Span/customSpan";
import { CustomTimer } from "../BaseComponents/Timer/customTimer";
import renderMenu from "../Menu/menu";
import {
    GAME_IS_ACTIVE,
    GAME_IS_LOST,
    GAME_IS_NOT_STARTED,
    GAME_IS_WINNED,
    MINE_CEIL,
    SLIDE_DOWN,
    SLIDE_EVENT_CODES,
    SLIDE_LEFT,
    SLIDE_NEITHER,
    SLIDE_RIGHT,
    SLIDE_UP,
} from "../consts";
import "./game.scss";

export default function renderGame() {
    const strings = localStorage.getItem("strings") || 9;
    const columns = localStorage.getItem("columns") || 9;
    const mines = localStorage.getItem("mines") || 10;
    const theme = localStorage.getItem("theme") || "moon";
    let needOpenCeils = +strings * +columns;
    let gameState: number = GAME_IS_NOT_STARTED;

    const flagImage = new CustomImage(
        { id: "flag-img", src: "dist/images/flag.webp" },
        ["game-field__flag-img"]
    );
    const bombImage = new CustomImage(
        { id: "bomb-img", src: "dist/images/bomb.webp" },
        ["game-field__bomb-img"]
    );
    const smileImage = new CustomImage(
        { id: "smile-img", src: "dist/images/smile.webp" },
        ["game-field__smile-img"]
    );
    const smileButton = new CustomButton([smileImage], { id: "smile-button" }, [
        "game-field__smile-button",
        `game-field__smile-button_${theme}`,
    ]);
    const gameTimer = new CustomTimer(0, { id: "game-timer" }, [
        "game-field__timer",
        `game-field__timer_${theme}`,
    ]);
    const exitButton = new CustomButton(
        [new CustomSpan("Выйти в меню", {}, ["game-field__restart-span"])],
        { id: "exit-button" },
        ["game-field__exit-button", `game-field__exit-button_${theme}`]
    );
    const gameHeader = new CustomPanel(
        [flagImage, bombImage, smileButton, gameTimer, exitButton],
        { id: "game-field__header-panel" },
        ["game-field__header-panel"]
    );
    const minesField = new CustomCanvas(
        { strings, columns, mines },
        { id: "mines-field__canvas", width: 600, height: 600 },
        ["mines-field__canvas"]
    );

    document.body.innerHTML = gameHeader.render() + minesField.render();

    minesField.fillCanvas();

    smileButton.addListeners([
        {
            event: "click",
            func: () => {
                switch (gameState) {
                    case GAME_IS_NOT_STARTED:
                        gameTimer.start();
                        smileImage.toggleAttr({
                            key: "src",
                            value: "dist/images/happy-face.webp",
                        });
                        gameState = 0;
                        break;
                    case GAME_IS_WINNED:
                    case GAME_IS_LOST:
                    case GAME_IS_ACTIVE:
                        gameTimer.stop();
                        renderGame();
                        return;
                }

                smileImage.update();
                ++gameState;
            },
        },
    ]);

    exitButton.addListeners([
        {
            event: "click",
            func: () => {
                gameTimer.stop();
                renderMenu();
            },
        },
    ]);

    minesField.addListeners([
        {
            event: "mousedown",
            func: (event: any) => {
                event.preventDefault();

                switch (gameState) {
                    case GAME_IS_WINNED:
                    case GAME_IS_NOT_STARTED:
                    case GAME_IS_LOST:
                        break;
                    case GAME_IS_ACTIVE:
                        if (event.buttons === 2) {
                            minesField.addFlagAtCeil(event);
                            return;
                        }

                        const resultOpening =
                            minesField.pressEventHandler(event);

                        if (resultOpening === MINE_CEIL) {
                            minesField.openAllCeils();
                            gameState = GAME_IS_LOST;
                            smileImage.toggleAttr({
                                key: "src",
                                value: "dist/images/sad.webp",
                            });
                            smileImage.update();
                            gameTimer.stop();
                        } else {
                            needOpenCeils -= resultOpening;

                            if (needOpenCeils === +mines) {
                                gameState = GAME_IS_WINNED;
                                smileImage.toggleAttr({
                                    key: "src",
                                    value: "dist/images/cool.webp",
                                });
                                minesField.openAllCeils();
                                smileImage.update();
                                gameTimer.stop();
                            }
                        }
                        break;
                }
            },
        },
    ]);

    let ticker: boolean = false;

    document.onkeydown = (event: KeyboardEvent) => {
        if (gameState !== GAME_IS_ACTIVE) {
            return;
        }

        if (!ticker) {
            ticker = true;

            switch (event.code) {
                case "KeyW":
                case "ArrowUp":
                    minesField.refillCanvas(SLIDE_NEITHER, SLIDE_UP);
                    break;
                case "KeyA":
                case "ArrowLeft":
                    minesField.refillCanvas(SLIDE_LEFT, SLIDE_NEITHER);
                    break;
                case "KeyS":
                case "ArrowDown":
                    minesField.refillCanvas(SLIDE_NEITHER, SLIDE_DOWN);
                    break;
                case "KeyD":
                case "ArrowRight":
                    minesField.refillCanvas(SLIDE_RIGHT, SLIDE_NEITHER);
                    break;
            }

            setTimeout(() => {
                ticker = false;
            }, 100);
        }
    };
}
