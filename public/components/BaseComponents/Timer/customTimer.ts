import { joinClasses } from "../../../modules/joinClasses";
import { FORCE_TOGGLE_TEXT } from "../../consts";
import CommonComponent from "../CommonComponent/commonComponent";

export class CustomTimer extends CommonComponent {
    private intervalId: NodeJS.Timeout;

    constructor(startTime: number, timerAttrs: any, timerClass: string[]) {
        super(String(startTime), [], timerAttrs, timerClass);
    }

    setStartTime(startTime: string) {
        this.componentText = startTime;
    }

    start(delay: number = 1) {
        this.intervalId = setInterval(() => {
            this.componentText = String(Number(this.componentText) + 1);
            this.update(FORCE_TOGGLE_TEXT);
        }, delay * 1000);
    }

    render(): string {
        let timer = "<span ";

        for (const [key, value] of Object.entries(this.componentAttrs)) {
            timer += `${key}="${value}" `;
        }

        timer += `class="${joinClasses(this.componentClass)}">`;

        return timer + `${this.componentText}</span>`;
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }
}
