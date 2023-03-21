import {OnlineAccountApi} from "../../../../dtos/onlineaccount-api.dtos";
import StartRegistrationRequest = OnlineAccountApi.StartRegistrationRequest;

export class RegistrationState {
    request: StartRegistrationRequest;

    constructor(init?: Partial<RegistrationState>) {
        (<any>Object).assign(this, init);
    }
}