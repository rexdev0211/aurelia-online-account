import {dispatchify} from "aurelia-store";
import {BaseElement} from "../../../bases/base-element";

export class MaintenanceCustomElement extends BaseElement {
  constructor(...args) {
    super(...args);
  }

  attached() {
    this.hotReload();
  }

  hotReload() {
    setTimeout(() => {
      location.reload();
    }, 60 * 1000);
  }
}

