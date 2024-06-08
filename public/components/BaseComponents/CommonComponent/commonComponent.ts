export default abstract class CommonComponent {
    protected componentText: string;
    protected componentClass: string[];
    protected componentAttrs: any;
    protected innerComponents: CommonComponent[];

    constructor(
        text: string,
        innerComponents: CommonComponent[],
        componentAttrs: any,
        componentClass: string[]
    ) {
        this.componentText = text;
        this.componentClass = componentClass;
        this.componentAttrs = componentAttrs;
        this.innerComponents = innerComponents;
    }

    addInnerComponents(newComponents: CommonComponent[], place: number = -1) {
        if (place === -1) {
            this.innerComponents.push(...newComponents);
        } else {
            this.innerComponents.splice(place, 0, ...newComponents);
        }
    }

    removeInnerComponents(place: number = -1, count: number = 1) {
        if (place === -1) {
            this.innerComponents.pop();
        } else {
            this.innerComponents.splice(place, count);
        }
    }

    exchangeInnerComponents(
        newComponents: CommonComponent[],
        place: number = -1
    ) {
        if (place === -1) {
            this.addInnerComponents(newComponents);
        }

        this.innerComponents.splice(
            place,
            newComponents.length,
            ...newComponents
        );
    }

    getAttr(attr: string): string {
        console.log(this.componentAttrs[attr]);
        return this.componentAttrs[attr];
    }

    toggleAttr(
        componentAttr: { key: string; value: string | null },
        force: number = 0
    ) {
        const place = this.componentAttrs[componentAttr.key];

        switch (force) {
            case 0:
                if (place === -1) {
                    force = 1;
                } else {
                    force = -1;
                }
            case 1:
                this.componentAttrs[componentAttr.key] = componentAttr.value;
                break;
            case -1:
                if (place !== -1) {
                    delete this.componentAttrs[componentAttr.key];
                }
                break;
        }
    }

    toggleClass(componentClass: string, force: number = 0) {
        const place = this.componentClass.indexOf(componentClass);

        switch (force) {
            case 0:
                if (place === -1) {
                    force = 1;
                } else {
                    force = -1;
                }
            case 1:
                if (place === -1) {
                    this.componentClass.push(componentClass);
                }
                break;
            case -1:
                if (place !== -1) {
                    this.componentClass.splice(place, 1);
                }
                break;
        }
    }

    toggleText(newText: string) {
        this.componentText = newText;
    }

    abstract render(): string;

    update(forceText: number = 0) {
        const component = document.getElementById(this.componentAttrs.id);

        if (!component) {
            return;
        }

        const componentAttrs = component.attributes;
        const componentClasses = Array.from(component.classList);

        for (const key of Object.keys(componentAttrs)) {
            if (!this.componentAttrs[key]) {
                component.removeAttribute(key);
            }
        }

        for (let [key, value] of Object.entries(this.componentAttrs)) {
            const value2 = String(value);
            component.setAttribute(key, value2);
        }

        for (let i of componentClasses) {
            if (!this.componentClass.includes(i)) {
                component.classList.remove(i);
            }
        }

        for (let i of this.componentClass) {
            component.classList.add(i);
        }

        switch (forceText) {
            case 0:
                break;
            case 1:
                component.innerHTML = this.componentText;
        }
    }

    addListeners(
        events: {
            event: string;
            func: (event?: MouseEvent | TouchEvent) => void;
        }[]
    ) {
        const component = document.getElementById(this.componentAttrs.id);

        events.forEach(({ event, func }) => {
            component?.addEventListener(event, func);
        });
    }
}
