import { joinClasses } from "../../../modules/joinClasses";
import CommonComponent from "../CommonComponent/commonComponent";

export class CustomSpan extends CommonComponent {
    constructor(text: string, spanAttrs: any, spanClass: string[]) {
        super(text, [], spanAttrs, spanClass);
    }

    render(): string {
        let span = "<span ";

        for (const [key, value] of Object.entries(this.componentAttrs)) {
            span += `${key}="${value}" `;
        }

        return (
            span +
            `class="${joinClasses(this.componentClass)}">${this.componentText}</span>`
        );
    }
}
