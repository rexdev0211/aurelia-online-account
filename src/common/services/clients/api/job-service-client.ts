import environment from "environment";
import {ProgressServiceClient} from "../progress-service-client";

export class JobServiceClient extends ProgressServiceClient {
  constructor(...args) {
    super(...[`${environment().apiRoot}/job-api`, ...args]);
  }
}
