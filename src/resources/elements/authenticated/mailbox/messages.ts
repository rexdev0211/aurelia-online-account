import {BaseElement} from "../../../../bases/base-element";
import {MailboxMessageModel} from "./new-message-model";
import {ControllerValidateResult} from "aurelia-validation";
import {dispatchify} from "aurelia-store";
import {FilterMailboxSubjectValueConverter} from "../../../value-converters/filter-mailbox";
import {computedFrom, inject} from "aurelia-framework";
import {MailboxService} from "./mailbox-service";

@inject(FilterMailboxSubjectValueConverter, MailboxService)
export class MessagesCustomElement extends BaseElement {

    model: MailboxMessageModel;
    private refreshSubject: string;
    private newestFirst: boolean = true;

    constructor(private filterMailboxSubject: FilterMailboxSubjectValueConverter, private mailboxService: MailboxService, ...args) {
        super(...args);

    }


    @computedFrom('newestFirst')
    get sortOrder() {
        return this.newestFirst ? '-date' : 'date';
    }

    toggleSort() {
        this.newestFirst = !this.newestFirst;
    }

    canAttach() {
        return false;
    }

    attached() {
        if (!this.state.messaging.selectedSubject?.ern) return;

        this.model = new MailboxMessageModel({
            from: this.state.messaging.selectedMailbox.ern,
            subject: this.state.messaging.selectedSubject.ern
        });
        this.addSubscription("selected:message:refresh", async (subject: string) => {
            if (this.refreshSubject !== subject)
                await this.refresh(subject)
        });
        this.refresh(null);
    }

    async save() {
        console.log('Model: ', this.model);
        let validationResult: ControllerValidateResult = await this.validationController.validate({object: this.model});
        if (!validationResult.valid) return;
        // @ts-ignore
        kendo.confirm(`Post new Message:<br>${this.model.message}`)
            .then(async () => {
                let response = await this.serviceClients.onlineAccountApi.put(this.model);
                if (response.result) {
                    this.model = new MailboxMessageModel({
                        from: this.state.messaging.selectedMailbox.ern,
                        subject: this.state.messaging.selectedSubject.ern
                    })
                    await this.refresh(null);
                }
            });
    }

    async refresh(subject) {
        await dispatchify('fetchMailboxMessages')();
    }

    async clearConversation() {
        await dispatchify('setMailboxConversation')(null);
        await dispatchify('fetchMailboxes')();
    }

    async clearSubject() {
        await dispatchify('setMailboxSubject')(null);
    }

    downloadPdf() {
        // @ts-ignore
        kendo.confirm(`Download Conversation:<br>${this.filterMailboxSubject.toView(this.state.messaging.selectedSubject.subject)}`)
            .then(async () => {
                // TODO: Need to wire back up the conversation pdf download
                // let response = await this.serviceClients.onlineAccountApi.get(new OnlineAccountApi.MailboxConversationPdfRequest({
                //     to: this.state.messaging.selectedSubject.to,
                //     from: this.state.messaging.selectedSubject.from,
                //     subject: this.state.messaging.selectedSubject.subject
                // }));
                //
                // if (response.result) {
                //     FileSaver.saveAs(base64StringToBlob(response.result.base64Pdf, 'application/pdf'), response.result.filename, false);
                // }
            });
    }

}
