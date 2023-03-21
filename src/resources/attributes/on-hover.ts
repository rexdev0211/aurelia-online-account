import {autoinject, bindable, bindingMode} from 'aurelia-framework';

@autoinject
export class OnHoverCustomAttribute {
    @bindable callback;
    @bindable({defaultBindingMode: bindingMode.twoWay, primaryProperty: true}) value: boolean;

    constructor(private element: Element) {
    }

    attached() {
        this.element.addEventListener("mouseover", () => this.hover(true));
        this.element.addEventListener("mouseout", () => this.hover(false));
    }

    detached() {
        this.element.removeEventListener("mouseover", () => this.hover(true));
        this.element.removeEventListener("mouseout", () => this.hover(false));
    }

    hover(value: boolean) {
        this.value = value;
    }
}

