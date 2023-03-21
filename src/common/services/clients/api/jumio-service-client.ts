import environment from "environment";
import {ProgressServiceClient} from "../progress-service-client";

export class JumioServiceClient extends ProgressServiceClient {
  constructor(...args) {
    super(...[`${environment().apiRoot}/vendors-jumio-api`, ...args]);
  }
}
