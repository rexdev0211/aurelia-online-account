import environment from "environment";
import {ProgressServiceClient} from "../progress-service-client";

export class OnlineAccountServiceClient extends ProgressServiceClient {
  constructor(...args) {
    super(...[`https://sim-enumis-api-onlineaccount.sim.enumis.co.uk`, ...args]);
  }
}
