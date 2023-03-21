import {DialogController, DialogService} from "aurelia-dialog";
import {autoinject, bindable} from 'aurelia-framework';
import {ServiceClients} from "../../../common/services/clients/service-clients";
import {OnlineAccountApi} from "../../../dtos/onlineaccount-api.dtos";
import {PendingTransactionMessageCustomElement} from "./pending-transaction-message";

@autoinject()
export class PendingTransactionModal {
    @bindable innerHeight = window.innerHeight * 0.70;
    source: any;
    display: string = 'Messages';
    private messageIn: PendingTransactionMessageCustomElement;

    constructor(private dialogService: DialogService, private dialogController: DialogController, private serviceClients: ServiceClients, ...args) {
        window.onresize = this.onresize;
    }

    attached(){

    }

    detached(){

    }

    onresize() {
        this.innerHeight = window.innerHeight * 0.70;
    }

    setDisplay(view: string) {
        this.display = view;
    }

    async saveResponse() {
        let _this = this;
        if (!await this.messageIn.validate()) return;
        let message = this.messageIn.model.message;

        kendo.confirm(`Save Response?<br>${message}`)
            .then(async () => {
                debugger;
                let request = new OnlineAccountApi.PendingTransactionClientMessageRequest({
                    pendingTransactionERN: this.source.pendingTransactionERN,
                    message: message
                });
                let response = await _this.serviceClients.onlineAccountApi.post(request);
                if (response.result) {
                    this.source = response.result;
                    this.display = "Messages";
                }
            });
    }

    activate(activation) {
        this.source = activation.source;
        this.display = activation.display
    }

}
