import {autoinject, bindable, bindingMode} from "aurelia-framework";

@autoinject
export class OnEnterCustomAttribute {
    @bindable({defaultBindingMode: bindingMode.twoWay, primaryProperty: true}) action: Function;

    constructor(private element: Element) {
    }

    onEnter(ev) {
        //Enter keyCode is 13
        if (ev.keyCode !== 13) return;
        if (this.action) this.action();
    }

    attached() {
        this.element.addEventListener("keyup", (ev) => this.onEnter(ev));
    }

    detached() {
        this.element.removeEventListener("keyup", (ev) => this.onEnter(ev));
    }
}
