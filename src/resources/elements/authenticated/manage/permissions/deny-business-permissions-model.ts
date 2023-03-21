import {Container} from 'aurelia-framework';
import {dispatchify} from "aurelia-store";
import {ValidationRules} from "aurelia-validation";
import {ServiceClients} from "../../../../../common/services/clients/service-clients";
import {NotificationService} from "../../../../../common/services/notification-service";
import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";
import BusinessDenyAclRequest = OnlineAccountApi.BusinessDenyAclRequest;
import BusinessDenyAclResponse = OnlineAccountApi.BusinessDenyAclResponse;
import PendingApproval = OnlineAccountApi.PendingApproval;

export class DenyBusinessPermissionsModel extends BusinessDenyAclRequest {

    constructor(init) {
        super(init)
    }

    static async postJob(validationController, model, message) {
        let validationResult = await validationController.validate({object: model});
        if (validationResult.valid) {
            let request = new BusinessDenyAclRequest(model);
            let response: BusinessDenyAclResponse = await Container.instance.get(ServiceClients).onlineAccountApi.post(request);

            if (!response.result) return;

            if (response.result.requestedBy.approvalState === PendingApproval.Approved)
                await dispatchify("upsertJob")(response.result);

            Container.instance.get(NotificationService).showMessage(
                "success",
                `Deny Business Permission Scheduled Successfully`,
                message
            );
        }
    }
}

ValidationRules
    .ensure((x: DenyBusinessPermissionsModel) => x.businessERN).required()
    .ensure((x: DenyBusinessPermissionsModel) => x.principalERN).required()
    .ensure((x: DenyBusinessPermissionsModel) => x.resourceERN).required()
    .ensure((x: DenyBusinessPermissionsModel) => x.aclOperation).required()
    .on(DenyBusinessPermissionsModel);
