import {Container} from 'aurelia-framework';
import {dispatchify, Store} from "aurelia-store";
import {ValidationRules} from "aurelia-validation";
import {ApplicationState} from "../../../../../applicationState";
import {ServiceClients} from "../../../../../common/services/clients/service-clients";
import {NotificationService} from "../../../../../common/services/notification-service";
import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";
import ForSendFundsRequest = OnlineAccountApi.ForSendFundsRequest;
import ForSendFundsResponse = OnlineAccountApi.ForSendFundsResponse;
import ForTransferFundsRequest = OnlineAccountApi.ForTransferFundsRequest;

export class ForSendFundsModel extends ForSendFundsRequest {
    public constructor(init?: Partial<ForTransferFundsRequest>) {
        super(init);
    }

    static async post(validationController, model) {
        let validationResult = await validationController.validate({object: model});
        if (validationResult.valid) {
            // @ts-ignore
            let state: ApplicationState = Container.instance.get(Store).state.source.value;

            let request = new ForSendFundsRequest(model);

            try {
                let response: ForSendFundsResponse = await Container.instance.get(ServiceClients).onlineAccountApi.post(request);

                await dispatchify("upsertJob")(response.result);
                location.hash = "#/job/status";

                Container.instance.get(NotificationService).showMessage(
                    "success",
                    `Send Funds Request Scheduled Successfully`,
                    `<b>From:</b> ${state.payments.send.sourceAccount.code}</br><b>To:</b> ${state.payments.send.destinationAccount.code}</br><b>Amount:</b> ${state.payments.send.sourceAccount.displayAmount(model.amount)}`
                );

                return response.result.jobERN;
            } catch (e) {

            }
        }
    }
}

ValidationRules
    .ensure((x: ForSendFundsModel) => x.accountERN).required().withMessage('Source account is required.')
    .ensure((x: ForSendFundsModel) => x.toAccountCode).required().withMessage('Destination account number is required.')
    .ensure((x: ForSendFundsModel) => x.lastName).required().withMessage('Account holder\'s name is required.')
    .ensure((x: ForSendFundsModel) => x.amount).required().withMessage('Amount to send is required.').min(0.01)
    .on(ForSendFundsModel);
