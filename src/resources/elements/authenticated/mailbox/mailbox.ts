import {BaseElement} from "../../../../bases/base-element";
import {dispatchify} from "aurelia-store";
import {inject, observable} from "aurelia-framework";
import {ApplicationState} from "../../../../applicationState";
import {MailboxService} from "./mailbox-service";

@inject(MailboxService)
export class MailboxCustomElement extends BaseElement {
    @observable searchValue: string;
    @observable currentView: string;

    constructor(private mailboxService: MailboxService, ...args) {
        super(...args);
    }

    stateChanged(newValue: ApplicationState) {
        if (newValue)
            this.currentView = newValue.messaging.mailboxView;
    }

    currentViewChanged(newValue) {
        this.searchValue = null;
    }

    attached() {
        // dispatchify('setMailboxView')(this.mailboxService.views[0]);
    }

    detached() {
        dispatchify('reloadMailbox')();
    }

    searchValueChanged(newValue) {
        dispatchify('setMailboxFilter')(newValue);
    }


    clearFilter() {
        this.searchValue = null;
    }

    async refreshMailbox() {
        await dispatchify('fetchMailboxes')();
    }

}
