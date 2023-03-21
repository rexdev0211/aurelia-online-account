import {dispatchify} from "aurelia-store";
import {BaseElement} from "../../../../bases/base-element";

export class LoginCustomElement extends BaseElement {
  constructor(...args) {
    super(...args);
  }

  async attached(){
    await dispatchify('logoff')();
  }
}

