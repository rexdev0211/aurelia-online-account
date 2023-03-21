import {autoinject, bindable} from 'aurelia-framework';
import {BaseElement} from '../../../../bases/base-element';

@autoinject
export class GridItemBoxCustomElement extends BaseElement {
  @bindable header;

  @bindable itemStyle;
  @bindable wrapperStyle;
  @bindable containerStyle;
  @bindable contentStyle;
  @bindable titleStyle;
  @bindable excerptStyle;

  private $slots: boolean;

  constructor(private element: Element, ...args) {
    super(...args);
  }

  attached() {
    // @ts-ignore
    let slot = this.element.au.controller.view.slots['__au-default-slot-key__'];
    this.$slots = slot.children.some(x => true);
    if (this.$slots && slot.children.length === 1) {
      if (slot.children[0] instanceof Text)
        this.$slots = slot.children[0].textContent.trim().length;
    }
  }
}

