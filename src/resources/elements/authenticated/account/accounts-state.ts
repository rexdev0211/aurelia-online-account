import {SelectedAccount} from "../../../../applicationState";

export class AccountsState {
    sourceAccount: SelectedAccount;

    constructor(init?: Partial<AccountsState>) {
        (<any>Object).assign(this, init);
    }
}

