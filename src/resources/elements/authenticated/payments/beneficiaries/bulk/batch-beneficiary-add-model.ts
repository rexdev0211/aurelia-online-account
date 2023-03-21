import {Container} from 'aurelia-framework';
import {dispatchify, Store} from "aurelia-store";
import {ValidationRules} from "aurelia-validation";
import {ApplicationState} from "../../../../../../applicationState";
import {ServiceClients} from "../../../../../../common/services/clients/service-clients";
import {NotificationService} from "../../../../../../common/services/notification-service";
import {OnlineAccountApi} from "../../../../../../dtos/onlineaccount-api.dtos";
import {DateFormatValueConverter} from "../../../../../value-converters/date-format";
import BatchBeneficiaryAddRequest = OnlineAccountApi.BatchBeneficiaryAddRequest;
import JobState = OnlineAccountApi.JobState;
import PendingApproval = OnlineAccountApi.PendingApproval;
import BatchBeneficiaryAddResponse = OnlineAccountApi.BatchBeneficiaryAddResponse;

export class BatchBeneficiaryAddModel extends BatchBeneficiaryAddRequest {

    public constructor(init?: Partial<BatchBeneficiaryAddRequest>) {
        super(init);
    }

    static async post(validationController, model) {
        let validationResult = await validationController.validate({object: model});
        if (validationResult.valid) {

            // @ts-ignore
            let state: ApplicationState = Container.instance.get(Store).state.source.value;

            let request = new BatchBeneficiaryAddRequest(model);

            try {
                let response: BatchBeneficiaryAddResponse = await Container.instance.get(ServiceClients).onlineAccountApi.post(request);

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
                    `Batch Beneficiary Request Scheduled Successfully`,
                    message
                );

                return response.result.jobERN;
            } catch (e) {

            }
        }
    }
}

ValidationRules
    .ensure((x: BatchBeneficiaryAddRequest) => x.csvContents).required()
    .ensure((x: BatchBeneficiaryAddRequest) => x.csvFileName).required()
    .on(BatchBeneficiaryAddRequest);
