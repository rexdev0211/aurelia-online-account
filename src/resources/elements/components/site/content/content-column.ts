import {bindable} from 'aurelia-framework';
import {BaseElement} from '../../../../../bases/base-element';
import * as $ from 'jquery';

export class ContentColumnCustomElement extends BaseElement {
  @bindable isCollapsible: boolean = false;
  @bindable header: string;
  @bindable xsWidth: string;
  @bindable smWidth: string;
  @bindable mdWidth: string;
  @bindable lgWidth: string;
  @bindable xlWidth: string;
  @bindable buttonIcon: string;
  @bindable buttonText: string;
  @bindable buttonClick: Function;
  @bindable collapsiblePanel: HTMLElement;

  private xsWidthClass: string;
  private smWidthClass: string;
  private mdWidthClass: string;
  private lgWidthClass: string;
  private xlWidthClass: string;
  private widthClasses: string;

  constructor(...args) {
    super(...args);
  }

  bind(bindingContext?: any, overrideContext?: any): any {
    if (overrideContext.parentOverrideContext)
      overrideContext.parentOverrideContext.bindingContext.router.childRouter = this.router;

    super.bind(bindingContext, overrideContext);
    this.updateClasses();
  }

  click() {
    if (this.buttonClick) this.buttonClick();
  }

  attached() {
    // @ts-ignore
    $(this.collapsiblePanel).collapse();
  }

  toggleCollapse() {
    // @ts-ignore
    $(this.collapsiblePanel).collapse('toggle');
  }

  xsWidthChanged(newValue) {
    this.updateClasses();
  }

  smWidthChanged(newValue) {
    this.updateClasses();
  }

  mdWidthChanged(newValue) {
    this.updateClasses();
  }

  lgWidthChanged(newValue) {
    this.updateClasses();
  }

  xlWidthChanged(newValue) {
    this.updateClasses();
  }

  private updateClasses() {

    if (typeof this.xsWidth === "undefined") {
      this.xsWidthClass = "";
    }
    else {
      this.xsWidthClass = "col-xs-" + this.xsWidth + " ";
    }

    if (typeof this.smWidth === "undefined") {
      this.smWidthClass = "";
    }
    else {
      this.smWidthClass = "col-sm-" + this.smWidth + " ";
    }

    if (typeof this.mdWidth === "undefined") {
      this.mdWidthClass = "";
    }
    else {
      this.mdWidthClass = "col-md-" + this.mdWidth + " ";
    }

    if (typeof this.lgWidth === "undefined") {
      this.lgWidthClass = "";
    }
    else {
      this.lgWidthClass = "col-lg-" + this.lgWidth + " ";
    }

    if (typeof this.xlWidth === "undefined") {
      this.xlWidthClass = "";
    }
    else {
      this.xlWidthClass = "col-xl-" + this.xlWidth + " ";
    }

    this.widthClasses = this.xsWidthClass + this.smWidthClass + this.mdWidthClass + this.lgWidthClass + this.xlWidthClass;
  }
}

