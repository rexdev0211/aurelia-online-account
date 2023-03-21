import {IReturn, ISendRequest, JsonServiceClient} from "@servicestack/client";
import {Container, observable} from "aurelia-framework";
import {dispatchify, Store} from "aurelia-store";
import {ApplicationState} from "../../../applicationState";
import {AuthService} from "../auth-service";
import {NotificationService} from "../notification-service";
import {ProgressService} from "../progress-service";
import {StorageService} from "../storage-service";
import {Utils} from "../utils";

export class ProgressServiceClient extends JsonServiceClient {

    @observable state: ApplicationState;
    @observable bearerToken: string;

    @observable stateRefreshToken: string;
    @observable stateBearerToken: string;

    private progressService: ProgressService;
    private storageService: StorageService;
    private store: any;
    private subscription: any;
    private utils: Utils;

    constructor(...args) {
        super(args[0]);
        this.progressService = Container.instance.get(ProgressService);
        this.storageService = Container.instance.get(StorageService);
        this.store = Container.instance.get(Store);
        this.utils = Container.instance.get(Utils);

        this.subscription = this.store.state.subscribe(
            (state) => this.state = state
        );
    }

    async sendRequest<T>(info: ISendRequest): Promise<T> {
        try {
            this.progressService.startProgress();
            this.storageService.clearCookies();
            return await super.sendRequest<T>(info);
        } catch (e) {
            console.log(e);
            if (e.type === 'RefreshTokenException') {
                kendo.alert('Your token has expired!</br>Please log in again.');
                await this.utils.reloadAppAsync('unauthenticated');
                return;
            }
            Container.instance.get(NotificationService).showMessage('error',  e.responseStatus?.errorCode ?? e.name, e.responseStatus?.message ?? e.message);
            throw (e);
        } finally {
            this.progressService.stopProgress();
        }
    }

    async get<T>(request: IReturn<T> | string, args?: any): Promise<T> {
            return await super.get<T>(request);
    }

    async delete<T>(request: IReturn<T> | string, args?: any): Promise<T> {
            return await super.delete<T>(request);
    }

    async post<T>(request: IReturn<T>, args?: any): Promise<T> {
            return await super.post<T>(request);
    }

    async put<T>(request: IReturn<T>, args?: any): Promise<T> {
            return await super.put<T>(request);
    }


    stateChanged(newValue: ApplicationState, oldValue: ApplicationState) {
        if (this.utils.propExists(newValue, "authentication.user")) {
            this.stateRefreshToken = this.utils.getPropertyValue<string>(newValue, "authentication.user.refreshToken");
            this.stateBearerToken = this.utils.getPropertyValue<string>(newValue, "authentication.user.bearerToken");
        }
    }

    stateRefreshTokenChanged(newValue: string, oldValue: string) {
        if (newValue)
            this.refreshToken = newValue;
    }

    stateBearerTokenChanged(newValue: string, oldValue: string) {
        if (newValue)
            this.setBearerToken(newValue);
    }

    async bearerTokenChanged(newValue: string, oldValue: string) {
        if (newValue)
            await dispatchify('setBearerToken')(newValue);
    }

    useLocalhost(api: string) {
        this.baseUrl = `https://api.local.enumis.co.uk/${api}`;
        this.replyBaseUrl = `https://api.local.enumis.co.uk/${api}/json/reply`;
        this.oneWayBaseUrl = `https://api.local.enumis.co.uk/${api}/json/oneway`;

        return this;
    }
}
