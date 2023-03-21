import {FrameworkConfiguration} from 'aurelia-framework';
import {PLATFORM} from "aurelia-pal";

export function configure(config: FrameworkConfiguration): void {
  config.globalResources([
    PLATFORM.moduleName('./custom-elements/cra/cra-live'),
    PLATFORM.moduleName('./custom-elements/cra/cra-builder'),
  ]);
}
