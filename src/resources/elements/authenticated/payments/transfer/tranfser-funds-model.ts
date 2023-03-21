import {Container} from 'aurelia-framework';
import {dispatchify, Store} from "aurelia-store";
import {ValidationRules} from "aurelia-validation";
import {ApplicationState} from "../../../../../applicationState";
import {ServiceClients} from "../../../../../common/services/clients/service-clients";
import {NotificationService} from "../../../../../common/services/notification-service";
import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";
import BkaTransferFundsRequest = OnlineAccountApi.BkaTransferFundsRequest;
import BkaTransferFundsResponse = OnlineAccountApi.BkaTransferFundsResponse;
import ForTransferFundsRequest = OnlineAccountApi.ForTransferFundsRequest;
import ForTransferFundsResponse = OnlineAccountApi.ForTransferFundsResponse;
import JobState = OnlineAccountApi.JobState;
import PendingApproval = OnlineAccountApi.PendingApproval;

export class TransferFundsModel extends ForTransferFundsRequest {
    public constructor(init?: Partial<ForTransferFundsRequest>) {
        super(init);
    }

    static async post(validationController, model) {
        let validationResult = await validationController.validate({object: model});
        if (validationResult.valid) {
            // @ts-ignore
            let state: ApplicationState = Container.instance.get(Store).state.source.value;

            let request = state.payments.transfer.sourceAccount.isClearBankAccount
                ? new BkaTransferFundsRequest(model)
                : new ForTransferFundsRequest(model);

            try {
                let response: (BkaTransferFundsResponse | ForTransferFundsResponse) = await Container.instance.get(ServiceClients).onlineAccountApi.post(request);

                await dispatchify("upsertJob")(response.result);

                if (response.result.state === JobState.Scheduled || response.result.requestedBy.approvalState === PendingApproval.Pending) {
                    location.hash = "#";
                } else {
                    location.hash = "#/job/status";
                }

                Container.instance.get(NotificationService).showMessage(
                    "success",
                    `Transfer Request Received Successfully`,
                    `<b>From:</b> ${state.payments.transfer.sourceAccount.code}</br><b>To:</b> ${state.payments.transfer.destinationAccount.code}</br><b>Amount:</b> ${state.payments.transfer.sourceAccount.displayAmount(model.amount)}`
                );

                return response.result.jobERN;
            } catch (e) {

            }
        }
    }
}

ValidationRules
    .ensure((x: TransferFundsModel) => x.accountERN).required().withMessage('Source account is required.')
    .ensure((x: TransferFundsModel) => x.toAccountERN).required().withMessage('Destination account is required.')
    .ensure((x: TransferFundsModel) => x.amount).required().withMessage('Amount to transfer is required.').min(0.01)
    .on(TransferFundsModel);
