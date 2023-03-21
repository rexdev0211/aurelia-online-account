import {BaseElement} from '../../../../../bases/base-element';
import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";
import {GenerateDigitalCertificateModel} from "./generate-digital-signature-model";
import clipboard from "clipboard-polyfill";
import * as FileSaver from "file-saver";
import {base64StringToBlob} from "blob-util";
import EnrollDigitalSignatureResponse = OnlineAccountApi.EnrollDigitalSignatureResponse;
import {dispatchify} from "aurelia-store";

export class GenerateDigitalCertificatesCustomElement extends BaseElement {

  csr;
  cert;
  error;
  model: GenerateDigitalCertificateModel;
  private commonName: string;

  constructor(...args) {
    super(...args);
    this.csr = null;
    this.model = new GenerateDigitalCertificateModel();
    this.validationController.addObject(this.model);
    this.commonName = `${this.state.customerSummary.nickName}-${this.state.customerSummary.ern.split('::')[3]}`.substr(0,64);
  }

  async copy() {
    if (this.cert)
      this.download();
    else
      history.back();
  }

  download() {
    let file = btoa(this.cert);
    FileSaver.saveAs(base64StringToBlob(file, 'application/x-509-server-cert'), `Enumis-${this.commonName}.crt`, false);
  }

  async copyCommonNameToClipboard() {
    try {
      await clipboard.writeText(this.commonName);
      await this.notificationService.showMessage(
        "success",
        "Success",
        'Common Name copied to clipboard'
      );
    } catch (e) {
      await this.notificationService.showMessage("error", "Error", `${e.message} -- Please try again.`);
    }
  }

  async copyCertificateToClipboard() {
    try {
      await clipboard.writeText(this.cert);
      await this.notificationService.showMessage(
        "success",
        "Success",
        'Certificate copied to clipboard'
      );
    } catch (e) {
      await this.notificationService.showMessage("error", "Error", `${e.message} -- Please try again.`);
    }
  }

  async submit() {
    this.error = null;
    if (this.cert) {
      location.hash = "#/manage/digital-certificates";
      return;
    }

    let validationResponse = await this.validationController.validate({object: this.model});
    if (!validationResponse.valid) return;

    let response: EnrollDigitalSignatureResponse = await this.serviceClients.onlineAccountApi.post(this.model);

    if (response.result)
    {
      await this.notificationService.showMessage(
        "success",
        "Success",
        'Certificate created successfully'
      );
      this.cert = response.result;
      await dispatchify('loadCertificates')();
    }
  }
}

