import {Container} from 'aurelia-framework';
import {dispatchify, Store} from "aurelia-store";
import {ValidationRules} from "aurelia-validation";
import {ApplicationState} from "../../../../../applicationState";
import {ServiceClients} from "../../../../../common/services/clients/service-clients";
import {NotificationService} from "../../../../../common/services/notification-service";
import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";
import {DateFormatValueConverter} from "../../../../value-converters/date-format";
import BkaSendFundsRequest = OnlineAccountApi.BkaSendFundsRequest;
import BkaSendFundsResponse = OnlineAccountApi.BkaSendFundsResponse;
import ClearBankPaymentScheme = OnlineAccountApi.ClearBankPaymentScheme;
import ForTransferFundsRequest = OnlineAccountApi.ForTransferFundsRequest;
import JobState = OnlineAccountApi.JobState;
import PendingApproval = OnlineAccountApi.PendingApproval;

export class BkaSendFundsModel extends BkaSendFundsRequest {

    amountFormatted: string;
    requireSmsVerificationCode: boolean;

    public constructor(init?: Partial<ForTransferFundsRequest>) {
        super(init);
    }

    static async post(validationController, model) {
        let validationResult = await validationController.validate({object: model});
        if (validationResult.valid) {

            // @ts-ignore
            let state: ApplicationState = Container.instance.get(Store).state.source.value;

            let request = new BkaSendFundsRequest(model);

            try {
                let response: BkaSendFundsResponse = await Container.instance.get(ServiceClients).onlineAccountApi.post(request);

                await dispatchify("upsertJob")(response.result);
                await dispatchify('setPaymentSendRequest')(null);

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
    .ensure((x: BkaSendFundsModel) => x.accountERN).required()
    .ensure((x: BkaSendFundsModel) => x.beneficiaryAccountERN).required().withMessage('Beneficiary is required.')
    .ensure((x: BkaSendFundsModel) => x.paymentDate).required()
    .ensure((x: BkaSendFundsModel) => x.amount).required().withMessage('Amount to send is required.').min(0.01)
    .ensure((x: BkaSendFundsModel) => x.amount).max(250000).when(job => job.scheme === ClearBankPaymentScheme.FPS).withMessage('Maximum payment amount 250K')
    .ensure((x: BkaSendFundsModel) => x.paymentReference).required()
    .maxLength(18).when(job => job.scheme === ClearBankPaymentScheme.FPS)
    .maxLength(35).when(job => job.scheme !== ClearBankPaymentScheme.FPS)

    .on(BkaSendFundsModel);
