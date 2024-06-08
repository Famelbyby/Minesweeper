import { joinClasses } from "../../../modules/joinClasses";
import CommonComponent from "../CommonComponent/commonComponent";

export class CustomImage extends CommonComponent {
    constructor(imgAttrs: any, imgClass: string[]) {
        super("", [], imgAttrs, imgClass);
    }

    render(): string {
        let img = "<img ";

        for (const [key, value] of Object.entries(this.componentAttrs)) {
            img += `${key}="${value}" `;
        }

        return img + `class="${joinClasses(this.componentClass)}" />`;
    }
}
