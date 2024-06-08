import { joinClasses } from "../../../modules/joinClasses";
import CommonComponent from "../CommonComponent/commonComponent";

export class CustomPanel extends CommonComponent {
    constructor(
        innerComponents: CommonComponent[],
        panelAttrs: any,
        panelClass: string[]
    ) {
        super("", innerComponents, panelAttrs, panelClass);
    }

    render(): string {
        let panel = "<div ";

        for (const [key, value] of Object.entries(this.componentAttrs)) {
            panel += `${key}="${value}" `;
        }

        panel += `class="${joinClasses(this.componentClass)}">`;

        this.innerComponents.forEach((element: CommonComponent) => {
            panel += element.render();
        });

        return panel + "</div>";
    }
}
