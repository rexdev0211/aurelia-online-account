import {BaseElement} from "../../../../bases/base-element";
import {ControllerValidateResult} from "aurelia-validation";
import {dispatchify} from "aurelia-store";
import {NewConversationModel} from "./new-conversation-model";
import {KendoDropDownList} from "../../components/kendo/kendo-drop-down-list";
import {OnlineAccountApi} from "../../../../dtos/onlineaccount-api.dtos";
import {computedFrom} from "aurelia-framework";

export class NewConversationCustomElement extends BaseElement {

    model: NewConversationModel;
    private kddl: KendoDropDownList;

    constructor(...args) {
        super(...args);
    }

    @computedFrom('state.messaging.systemMailboxes')
    get systemMailboxes() {
        return this.state.messaging.systemMailboxes.filter(x => x.type !== OnlineAccountApi.MailboxType.InformationRequest);
    }

    attached() {
        this.model = new NewConversationModel();
        this.model.from = this.state.messaging.selectedMailbox.ern;
        this.model.to = this.state.messaging.selectedConversation?.owner.ern;

        setTimeout(() => {
            if (!!this.kddl?.widget) {
                this.kddl.widget.enable(!this.model.to);
            }
        }, 50);

        // if (this.state.messaging.mailboxSubject) {
        //     this.model.to = this.state.messaging.mailboxSubject.mailbox;
        // }
    }

    async save() {
        let validationResult: ControllerValidateResult = await this.validationController.validate({object: this.model});
        if (!validationResult.valid) return;

        // let request = new MailboxMessageRequest({
        //     context: new OnlineAccountApi.ConversationContext({
        //         to: this.model.to,
        //         from: this.model.from,
        //         subject: Humanizer(this.model.subject)
        //     }),
        //     message: new MessageRecord({
        //         message: this.model.value
        //     })
        // });

        // @ts-ignore
        kendo.confirm(`Confirm new Message:<br>${this.model.message}`)
            .then(async () => {
                let response = await this.serviceClients.onlineAccountApi.post(this.model);

                if (response.result) {
                    this.model = new NewConversationModel();
                    // await dispatchify('setNewConversation')({mailbox: request.context.to});
                    // await dispatchify('reloadMailbox')(request.context);
                }
            });
    }

    async clearConversation() {
        if (!!this.state.messaging.selectedConversation) {
            await dispatchify('setMailboxView')('Subjects');
        } else {
            await dispatchify('setMailboxView')('Conversations');
        }
    }

    async clearSubject() {
        await dispatchify('setMailboxSubject')(null);
    }

}
