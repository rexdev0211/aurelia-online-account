import {Container} from 'aurelia-framework';
import {dispatchify} from "aurelia-store";
import {ValidationRules} from "aurelia-validation";
import {ServiceClients} from "../../../../../common/services/clients/service-clients";
import {NotificationService} from "../../../../../common/services/notification-service";
import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";
import BusinessGrantAclRequest = OnlineAccountApi.BusinessGrantAclRequest;
import PendingApproval = OnlineAccountApi.PendingApproval;

export class GrantBusinessPermissionsModel extends BusinessGrantAclRequest {

    constructor(init) {
        super(init)
    }

    static async postJob(validationController, model, message) {
        let validationResult = await validationController.validate({object: model});
        if (validationResult.valid) {
            let request = new BusinessGrantAclRequest(model);
            let response = await Container.instance.get(ServiceClients).onlineAccountApi.post(request);

            if (!response.result) return;

            if (response.result.requestedBy.approvalState === PendingApproval.Approved)
                await dispatchify("upsertJob")(response.result);

            Container.instance.get(NotificationService).showMessage(
                "success",
                `Grant Business Permission Scheduled Successfully`,
                message
            );
        }
    }
}

ValidationRules
    .ensure((x: GrantBusinessPermissionsModel) => x.businessERN).required()
    .ensure((x: GrantBusinessPermissionsModel) => x.principalERN).required()
    .ensure((x: GrantBusinessPermissionsModel) => x.resourceERN).required()
    .ensure((x: GrantBusinessPermissionsModel) => x.aclOperation).required()
    .ensure((x: GrantBusinessPermissionsModel) => x.limitValue).required().when(x => x.aclOperation.toString().endsWith("Limit"))
    .on(GrantBusinessPermissionsModel);
