import {ApplicationState} from "../applicationState";
import {BaseProperties} from "./base-properties";

export class BasePage extends BaseProperties {
  constructor(...args) {
    super(...args);
  }

  canActivateState(action: (state: ApplicationState) => boolean, locationHash: string): boolean {
    let res: boolean = action(this.state);
    if (!res && locationHash) {
      location.hash = locationHash;
    }
    return res;
  }
}
