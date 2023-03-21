import {DialogController} from 'aurelia-dialog';
import {inject, observable} from 'aurelia-framework';
import {BaseProperties} from "../../../bases/base-properties";
import {JumioApi} from "../../../dtos/jumio-api.dtos";
import InitiateRequest = JumioApi.InitiateRequest;
import InitiateResponse = JumioApi.InitiateResponse;

@inject(DialogController)
export class InitiateModal extends BaseProperties {
  @observable iframeLocation: string;
  initiateResponse: InitiateResponse;
  private frameWidth: number;
  private frameHeight: number;
  private iframe: any;
  private closeCount: number;

  constructor(...args) {
    super(...args);
    this.dialogController.settings.startingZIndex = 10000;
    this.closeCount = 2;
  }

  async activate(dto) {
    let request: InitiateRequest = new InitiateRequest();
    request.customerInternalReference = this.state.customerSummary.ern;
    request.userReference = this.state.customerSummary.emailAddress;

    try {
      this.frameWidth = window.innerWidth * 0.7;
      this.frameHeight = window.innerHeight * 0.6;

      this.initiateResponse = await this.serviceClients.jumioApi.post(request);
    } catch (e) {
      alert(e);
    }
  }

  attached() {
    this.iframe.addEventListener('load', () => this.close());
  }

  close() {
    if (--this.closeCount > 0) return;
    this.dialogController.ok(this.initiateResponse);
  }

}

