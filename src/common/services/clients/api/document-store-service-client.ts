import environment from "environment";
import {ProgressServiceClient} from "../progress-service-client";

export class DocumentStoreServiceClient extends ProgressServiceClient {
  constructor(...args) {
    super(...[`${environment().apiRoot}/documentstore-api`, ...args]);
  }
}
