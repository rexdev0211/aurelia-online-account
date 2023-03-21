import {dispatchify} from "aurelia-store";
import {BasePage} from '../../../../../bases/base-page';

export class BulkBeneficiariesPage extends BasePage {

    constructor(...args) {
        super(...args);
    }

    async activate() {
        await dispatchify('clearBulkBeneficiaries')();
    }

    async deactivate() {
        await dispatchify('clearBulkBeneficiaries')();
    }
}

