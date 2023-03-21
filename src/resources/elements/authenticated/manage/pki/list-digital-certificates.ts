import {autoinject, observable} from 'aurelia-framework';
import {BaseElement} from '../../../../../bases/base-element';
import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";
import {pagable} from "../../../../../common/services/shared";
import {dispatchify} from "aurelia-store";
import CertificateSummary = OnlineAccountApi.CertificateSummary;
import PkiCertificateResponse = OnlineAccountApi.PkiCertificateResponse;
import PkiCertificateRequest = OnlineAccountApi.PkiCertificateRequest;

@autoinject
// @ts-ignore
export class ListDigitalCertificatesCustomElement extends BaseElement {
  @observable certificates;
  // @ts-ignore
  private grid: kendo.ui.Grid;
  private pageable: kendo.ui.GridPageable;
  private hasResults: boolean;

  constructor(...args) {
    super(...args);
    this.pageable = pagable;
  }

  stateChanged(newState, oldState) {
    this.certificates = newState.certificates;
  }

  certificatesChanged(newValue, oldValue) {
    if (this.grid) this.grid.dataSource.data(newValue);
  }

  onReady(e) {
    this.grid = e;
    this.grid.dataSource.data(this.state.certificates);
  }

  async attached() {
    if (!this.state.certificates.length)
      await dispatchify('loadCertificates')();
  }

  close() {
    location.hash = '#/';
  }

  addNew() {
    location.hash = '#/manage/digital-certificates/generate';
  }

  async gridCommand(e) {
    e.preventDefault();
    // @ts-ignore
    let certificateSummary: CertificateSummary = this.grid.dataItem($(e.currentTarget).closest("tr"));
    switch (e.data.commandName) {
      case 'delete':
        kendo.confirm(`Are you sure you want to remove the certificate: <strong>${certificateSummary.thumbprint}</strong><br/>with common name: <strong>${certificateSummary.friendlyName}</strong>`)
          .then(async t => {
            let response: PkiCertificateResponse = await this.serviceClients.onlineAccountApi.delete(new PkiCertificateRequest({
              certificateThumbprint: certificateSummary.thumbprint,
              userAuthId: this.state.customerSummary.userAuthId
            }));
            if (response.result) {
              await dispatchify('loadCertificates')();
              await this.notificationService.showMessage(
                "success",
                "Success",
                'Certificate removed successfully'
              );
            }
          })
        break;
    }
  }

}
