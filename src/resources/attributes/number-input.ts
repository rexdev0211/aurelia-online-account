import {inject, bindable} from "aurelia-framework";

@inject(Element)
export class NumberInputCustomAttribute {
  constructor(private element: HTMLInputElement) {
    this.element = element;
  }

  @bindable({primaryProperty: true})
  exclude;

  @bindable decimal: boolean = true;


  attached() {
    this.element.addEventListener("keydown", this.keydown);
  }

  detached() {
    this.element.removeEventListener("keydown", this.keydown);
  }

  isNavigationOrSelectionKey = e => {
    // Allow: backspace, delete, tab, escape, enter and .
    if (
      [46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A/X/C/V, Command+A/X/C/V
      ([65, 67, 86, 88].indexOf(e.keyCode) !== -1 &&
        (e.ctrlKey === true || e.metaKey === true)) ||
      // Allow: home, end, left, right, down, up
      (e.keyCode >= 35 && e.keyCode <= 40)
    ) {
      // Swallow decimal
      if ([110, 190].indexOf(e.keyCode) !== -1 && !this.decimal) {
        return false;
      }

      // let it happen, don't do anything
      return true;
    }
    return false;
  };

  // http://stackoverflow.com/a/995193/725866
  keydown = e => {
    if (this.isNavigationOrSelectionKey(e)) {
      return;
    }

    if (this.exclude) {
      if (this.exclude.includes("+")) {
        if (e.keyCode === 107 || (e.shiftKey && e.keyCode === 187)) {
          return;
        }
      }

      if (this.exclude.includes("-")) {
        if (e.keyCode === 109 || e.keyCode === 189) {
          return;
        }
      }
    }

    // If it's not a number, prevent the keypress...
    if (
      (e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) &&
      (e.keyCode < 96 || e.keyCode > 105)
    ) {
      e.preventDefault();
    }
  };
}
