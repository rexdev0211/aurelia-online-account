import { BaseProperties } from "./base-properties";

export class BaseRouter extends BaseProperties {
  constructor(...args) {
    super(...args);
  }

  bind(bindingContext?: any, overrideContext?: any): any {
    if (overrideContext.parentOverrideContext) overrideContext.parentOverrideContext.bindingContext.router.childRouter = this.router;
    super.bind(bindingContext, overrideContext);
  }
}
