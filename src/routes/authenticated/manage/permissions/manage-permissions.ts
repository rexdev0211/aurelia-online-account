import {dispatchify} from "aurelia-store";
import {BasePage} from '../../../../bases/base-page';

export class ManagePermissionsPage extends BasePage {

    constructor(...args) {
        super(...args);
    }

    async deactivate() {
        await dispatchify('clearPermissions')();
    }
}

