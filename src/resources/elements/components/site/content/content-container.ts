import {bindable} from "aurelia-framework";
import * as $ from "jquery";
import {BaseElement} from "../../../../../bases/base-element";

export class ContentContainerCustomElement extends BaseElement {
    @bindable header: string;
    @bindable subHeader: string;
    @bindable isCollapsible: boolean = false;
    @bindable buttonDisabled: boolean = false;
    @bindable buttonText: string;
    @bindable buttonIcon: string;
    @bindable buttonClick: Function;
    @bindable backButtonDisabled: boolean = true;
    @bindable backButtonText: string = "Back";
    @bindable backButtonIcon: string = "fa fa-undo";
    @bindable backButtonClick: Function;

    @bindable actionButtonDisabled: boolean = true;
    @bindable actionButtonText: string = "Go";
    @bindable actionButtonIcon: string = "fa fa-bolt";
    @bindable actionButtonClick: Function;
    @bindable actionButtonSize: string;

    @bindable buttonSize: string;
    @bindable showButtons: boolean = true;

    private collapsiblePanel: HTMLElement;

    constructor(...args) {
        super(...args);
    }

    attached() {
        // @ts-ignore
        $(this.collapsiblePanel).collapse();
        if (!this.buttonSize) this.calculateMinButtonSize()
    }

    toggleCollapse() {
        // @ts-ignore
        $(this.collapsiblePanel).collapse("toggle");
    }

    click() {
        if (this.buttonClick) this.buttonClick();
    }

    action() {
        if (this.actionButtonClick) this.actionButtonClick();
    }

    back() {
        if (this.backButtonClick) this.backButtonClick();
        else history.back();
    }

    private calculateMinButtonSize() {
        if (this.buttonText) {
            let maxLength = this.buttonText.length;
            if (!this.backButtonDisabled && this.backButtonText && this.backButtonText.length > maxLength) maxLength = this.backButtonText.length;
            this.buttonSize = `${28 + (maxLength * 15)}px`;
        }
    }
}
