import {DialogController, DialogService} from "aurelia-dialog";
import {autoinject, bindable} from 'aurelia-framework';
import {ServiceClients} from "../../../../../common/services/clients/service-clients";

@autoinject()
export class PaymentDetailModal {
    @bindable innerHeight = window.innerHeight * 0.70;

    constructor(private dialogService: DialogService, private dialogController: DialogController, private serviceClients: ServiceClients, ...args) {
        window.onresize = this.onresize;
    }

    onresize() {
        this.innerHeight = window.innerHeight * 0.70;
    }

    activate(activation) {
    }

}
