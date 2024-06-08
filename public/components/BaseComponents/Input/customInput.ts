import { joinClasses } from "../../../modules/joinClasses";
import {
    validateMines,
    validateStringsOrColumns,
} from "../../../modules/validateInputs";
import CommonComponent from "../CommonComponent/commonComponent";

export class CustomInput extends CommonComponent {
    constructor(inputAttrs: any, inputClass: string[]) {
        super("", [], inputAttrs, inputClass);
    }

    updateValue(type: "strings" | "columns" | "mines", strings: number = 1, columns: number = 1): string {
        const input = document.getElementById(
            this.componentAttrs.id
        ) as HTMLInputElement;
        let newValue: string;
        if (type === "mines") {
            newValue = String(validateMines(input.value, strings, columns));
        } else {
            newValue = String(validateStringsOrColumns(input.value, type));
        }

        this.toggleAttr({ key: "value", value: newValue });

        return newValue;
    }

    render(): string {
        let input = "<input ";

        for (const [key, value] of Object.entries(this.componentAttrs)) {
            input += `${key}="${value}" `;
        }

        return `${input} class="${joinClasses(this.componentClass)}" />`;
    }
}
