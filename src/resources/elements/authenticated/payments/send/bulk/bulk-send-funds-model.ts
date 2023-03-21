import {Container} from 'aurelia-framework';
import {dispatchify, Store} from "aurelia-store";
import {ValidationRules} from "aurelia-validation";
import {ApplicationState} from "../../../../../../applicationState";
import {ServiceClients} from "../../../../../../common/services/clients/service-clients";
import {NotificationService} from "../../../../../../common/services/notification-service";
import {OnlineAccountApi} from "../../../../../../dtos/onlineaccount-api.dtos";
import {DateFormatValueConverter} from "../../../../../value-converters/date-format";
import BatchSendFundsRequest = OnlineAccountApi.BatchSendFundsRequest;
import BatchSendFundsResponse = OnlineAccountApi.BatchSendFundsResponse;
import JobState = OnlineAccountApi.JobState;
import PendingApproval = OnlineAccountApi.PendingApproval;

export class BatchSendFundsModel extends BatchSendFundsRequest {

    public constructor(init?: Partial<BatchSendFundsRequest>) {
        super(init);
    }

    static async post(validationController, model) {
        let validationResult = await validationController.validate({object: model});
        if (validationResult.valid) {

            // @ts-ignore
            let state: ApplicationState = Container.instance.get(Store).state.source.value;

            let request = new BatchSendFundsRequest(model);

            try {
                let response: BatchSendFundsResponse = await Container.instance.get(ServiceClients).onlineAccountApi.post(request);

                await dispatchify("upsertJob")(response.result);
                // await dispatchify('setPaymentSendRequest')(null);

                let message = `<b>From:</b> ${state.payments.send.sourceAccount.code}</br><b>To:</b> ${state.payments.send.beneficiaryAccount.nickName}</br><b>Amount:</b> ${state.payments.send.sourceAccount.displayAmount(model.amount)}`;
                if (response.result.state === JobState.Scheduled || response.result.requestedBy.approvalState === PendingApproval.Pending) {
                    let scheduleDate = Container.instance.get(DateFormatValueConverter).toView(response.result.scheduleDate);
                    message = `<b>From:</b> ${state.payments.send.sourceAccount.code}</br><b>To:</b> ${state.payments.send.beneficiaryAccount.nickName}</br><b>Amount:</b> ${state.payments.send.sourceAccount.displayAmount(model.amount)}</br><b>On:</b> ${scheduleDate}`;
                    location.hash = "#";
                } else {
                    location.hash = "#/job/status";
                }

                Container.instance.get(NotificationService).showMessage(
                    "success",
                    `Send Funds Request Scheduled Successfully`,
                    message
                );

                return response.result.jobERN;
            } catch (e) {

            }
        }
    }
}

ValidationRules
    .ensure((x: BatchSendFundsModel) => x.mfaVerificationCode).required()
    .ensure((x: BatchSendFundsModel) => x.smsVerificationCode).required()
// .ensure((x: BatchSendFundsModel) => x.accountERN).required()
// .ensure((x: BatchSendFundsModel) => x.beneficiaryAccountERN).required().withMessage('Beneficiary is required.')
// .ensure((x: BatchSendFundsModel) => x.paymentDate).required()
// .ensure((x: BatchSendFundsModel) => x.amount).required().withMessage('Amount to send is required.').min(0.01)
// .ensure((x: BatchSendFundsModel) => x.paymentReference).required()
// .maxLength(18).when(job => job.scheme === ClearBankPaymentScheme.FPS)
// .maxLength(35).when(job => job.scheme !== ClearBankPaymentScheme.FPS)

    .on(BatchSendFundsModel);
