import { joinClasses } from "../../../modules/joinClasses";
import CommonComponent from "../CommonComponent/commonComponent";

export class CustomButton extends CommonComponent {
    constructor(
        innerComponents: CommonComponent[],
        buttonAttrs: any,
        buttonClass: string[]
    ) {
        super("", innerComponents, buttonAttrs, buttonClass);
    }

    render(): string {
        let button = "<button ";

        for (const [key, value] of Object.entries(this.componentAttrs)) {
            button += `${key}="${value}" `;
        }

        button += `class="${joinClasses(this.componentClass)}">`;

        Array.from(this.innerComponents).forEach((element: CommonComponent) => {
            button += element.render();
        });

        return button + `</button>`;
    }
}
