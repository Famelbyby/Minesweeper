import { CustomButton } from "../BaseComponents/Button/customButton";
import { CustomImage } from "../BaseComponents/Image/customImage";
import { CustomInput } from "../BaseComponents/Input/customInput";
import { CustomPanel } from "../BaseComponents/Panel/customPanel";
import { CustomSpan } from "../BaseComponents/Span/customSpan";
import renderGame from "../Game/game";
import { FORCE_ADD, FORCE_REMOVE } from "../consts";
import "./menu.scss";

export default function renderMenu() {
    const theme: string = localStorage.getItem("theme") || "moon";

    document.body.classList.remove("body_moon", "body_sunny");

    document.body.classList.add(`body_${theme}`);

    const easyPanel = new CustomPanel(
        [
            new CustomSpan("Начинающий", {}, ["mode__header-span"]),
            new CustomSpan(
                "Строк: 9",
                { id: "mode__span-strings_easy", "data-value": 9 },
                ["mode__content-span", `mode__content-span_${theme}`]
            ),
            new CustomSpan(
                "Столбцов: 9",
                { id: "mode__span-columns_easy", "data-value": 9 },
                ["mode__content-span", `mode__content-span_${theme}`]
            ),
            new CustomSpan(
                "Мин: 10",
                { id: "mode__span-mines_easy", "data-value": 10 },
                ["mode__content-span", `mode__content-span_${theme}`]
            ),
        ],
        { id: "mode__panel_easy" },
        ["mode__panel", `mode__panel_${theme}`]
    );
    const middlePanel = new CustomPanel(
        [
            new CustomSpan("Продвинутый", {}, ["mode__header-span"]),
            new CustomSpan(
                "Строк: 16",
                { id: "mode__span-strings_middle", "data-value": 16 },
                ["mode__content-span", `mode__content-span_${theme}`]
            ),
            new CustomSpan(
                "Столбцов: 16",
                { id: "mode__span-columns_middle", "data-value": 16 },
                ["mode__content-span", `mode__content-span_${theme}`]
            ),
            new CustomSpan(
                "Мин: 40",
                { id: "mode__span-mines_middle", "data-value": 40 },
                ["mode__content-span", `mode__content-span_${theme}`]
            ),
        ],
        { id: "mode__panel_middle" },
        ["mode__panel", `mode__panel_${theme}`]
    );
    const hardPanel = new CustomPanel(
        [
            new CustomSpan("Эксперт", {}, ["mode__header-span"]),
            new CustomSpan(
                "Строк: 16",
                { id: "mode__span-strings_hard", "data-value": 16 },
                ["mode__content-span", `mode__content-span_${theme}`]
            ),
            new CustomSpan(
                "Столбцов: 30",
                { id: "mode__span-columns_hard", "data-value": 30 },
                ["mode__content-span", `mode__content-span_${theme}`]
            ),
            new CustomSpan(
                "Мин: 99",
                { id: "mode__span-mines_hard", "data-value": 99 },
                ["mode__content-span", `mode__content-span_${theme}`]
            ),
        ],
        { id: "mode__panel_hard" },
        ["mode__panel", `mode__panel_${theme}`]
    );
    const stringsSpan = new CustomSpan(
        "Строк: ",
        { id: "mode__span-strings_custom", "data-value": 16 },
        ["mode__content-span", `mode__content-span_${theme}`]
    );
    const stringsInput = new CustomInput(
        {
            id: "mode__input-strings_custom",
            value: "16",
            type: "number",
            max: 1000,
            min: 10,
        },
        ["mode__content-input"]
    );
    const columnsSpan = new CustomSpan(
        "Столбцов: ",
        { id: "mode__span-columns_custom", "data-value": 16 },
        ["mode__content-span", `mode__content-span_${theme}`]
    );
    const columnsInput = new CustomInput(
        {
            id: "mode__input-columns_custom",
            value: "16",
            type: "number",
            max: 1000,
            min: 10,
        },
        ["mode__content-input"]
    );
    const minesSpan = new CustomSpan(
        "Мин: ",
        { id: "mode__span-mines_custom", "data-value": 50 },
        ["mode__content-span", `mode__content-span_${theme}`]
    );
    const minesInput = new CustomInput(
        {
            id: "mode__input-mines_custom",
            value: "50",
            type: "number",
        },
        ["mode__content-input"]
    );
    const customModePanel = new CustomPanel(
        [
            new CustomSpan("Свой режим", {}, ["mode__header-span"]),
            new CustomPanel(
                [stringsSpan, stringsInput],
                { id: "mode__panel-strings_custom" },
                ["mode__content-panel"]
            ),
            new CustomPanel(
                [columnsSpan, columnsInput],
                { id: "mode__panel-columns_custom" },
                ["mode__content-panel"]
            ),
            new CustomPanel(
                [minesSpan, minesInput],
                { id: "mode__panel-columns_custom" },
                ["mode__content-panel"]
            ),
        ],
        { id: "mode__panel_custom" },
        ["mode__panel", `mode__panel_${theme}`]
    );
    const themeImage = new CustomImage({ src: `dist/images/${theme}.webp` }, [
        "theme-mode__img",
    ]);
    const themeButton = new CustomButton(
        [themeImage],
        { id: "theme-mode__button" },
        ["theme-mode__button", `theme-mode__button_${theme}`]
    );
    const goButton = new CustomButton(
        [new CustomSpan("Начать игру", {}, [])],
        { id: "footer-menu__button", type: "button" },
        ["footer-menu__button", `footer-menu__button_${theme}`]
    );

    function setModeParameters(mode: "easy" | "middle" | "hard" | "custom") {
        const strings = document.getElementById(`mode__span-strings_${mode}`)
            .dataset.value;
        const columns = document.getElementById(`mode__span-columns_${mode}`)
            .dataset.value;
        const mines = document.getElementById(`mode__span-mines_${mode}`)
            .dataset.value;

        localStorage.setItem("strings", strings);
        localStorage.setItem("columns", columns);
        localStorage.setItem("mines", mines);

        middlePanel.toggleClass(`mode__panel_focused_${theme}`, FORCE_REMOVE);
        hardPanel.toggleClass(`mode__panel_focused_${theme}`, FORCE_REMOVE);
        easyPanel.toggleClass(`mode__panel_focused_${theme}`, FORCE_REMOVE);
        customModePanel.toggleClass(
            `mode__panel_focused_${theme}`,
            FORCE_REMOVE
        );

        switch (mode) {
            case "easy":
                easyPanel.toggleClass(
                    `mode__panel_focused_${theme}`,
                    FORCE_ADD
                );
                break;
            case "middle":
                middlePanel.toggleClass(
                    `mode__panel_focused_${theme}`,
                    FORCE_ADD
                );
                break;
            case "hard":
                hardPanel.toggleClass(
                    `mode__panel_focused_${theme}`,
                    FORCE_ADD
                );
                break;
            case "custom":
                customModePanel.toggleClass(
                    `mode__panel_focused_${theme}`,
                    FORCE_ADD
                );
                break;
        }

        middlePanel.update();
        hardPanel.update();
        easyPanel.update();
        customModePanel.update();
    }

    const newMenu = new CustomPanel(
        [
            new CustomPanel(
                [
                    new CustomSpan(
                        "Выберите сложность",
                        { id: "header-menu__span" },
                        ["header-menu__span", `header-menu__span_${theme}`]
                    ),
                ],
                { id: "header-menu__panel" },
                ["header-menu__panel", `header-menu__panel_${theme}`]
            ),
            themeButton,
            new CustomPanel(
                [easyPanel, middlePanel, hardPanel, customModePanel],
                { id: "content-menu__panel" },
                ["content-menu__panel", `content-menu__panel_${theme}`]
            ),
            new CustomPanel([goButton], { id: "footer-menu__panel" }, [
                "footer-menu__panel",
                `footer-menu__panel_${theme}`,
            ]),
        ],
        { id: "menu-choose-mode" },
        ["menu-choose-mode", `menu-choose-mode_${theme}`]
    );

    document.body.innerHTML = newMenu.render();

    setModeParameters("easy");

    themeButton.addListeners([
        {
            event: "click",
            func: () => {
                if (themeImage.getAttr("src") === "dist/images/moon.webp") {
                    themeImage.toggleAttr({
                        key: "src",
                        value: "dist/images/sun.webp",
                    });
                    localStorage.setItem("theme", "sunny");
                } else {
                    themeImage.toggleAttr({
                        key: "src",
                        value: "dist/images/moon.webp",
                    });
                    localStorage.setItem("theme", "moon");
                }

                renderMenu();
            },
        },
    ]);

    easyPanel.addListeners([
        {
            event: "click",
            func: () => {
                setModeParameters("easy");
            },
        },
    ]);

    middlePanel.addListeners([
        {
            event: "click",
            func: () => {
                setModeParameters("middle");
            },
        },
    ]);

    hardPanel.addListeners([
        {
            event: "click",
            func: () => {
                setModeParameters("hard");
            },
        },
    ]);

    stringsInput.addListeners([
        {
            event: "change",
            func: () => {
                stringsSpan.toggleAttr({
                    key: "data-value",
                    value: stringsInput.updateValue("strings"),
                });
                stringsSpan.update();
                setModeParameters("custom");
            },
        },
    ]);

    columnsInput.addListeners([
        {
            event: "change",
            func: () => {
                columnsSpan.toggleAttr({
                    key: "data-value",
                    value: columnsInput.updateValue("columns"),
                });
                columnsSpan.update();
                setModeParameters("custom");
            },
        },
    ]);

    minesInput.addListeners([
        {
            event: "change",
            func: () => {
                minesSpan.toggleAttr({
                    key: "data-value",
                    value: minesInput.updateValue(
                        "mines",
                        +localStorage.getItem("strings"),
                        +localStorage.getItem("columns")
                    ),
                });
                minesSpan.update();
                setModeParameters("custom");
            },
        },
    ]);

    customModePanel.addListeners([
        {
            event: "click",
            func: () => {
                setModeParameters("custom");
            },
        },
    ]);

    goButton.addListeners([
        {
            event: "click",
            func: () => {
                renderGame();
            },
        },
    ]);
}
