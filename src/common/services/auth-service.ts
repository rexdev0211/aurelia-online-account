import {autoinject, Container} from 'aurelia-framework';
import {dispatchify, Store} from "aurelia-store";
import {ApplicationState} from "../../applicationState";
import {OnlineAccountApi} from "../../dtos/onlineaccount-api.dtos";
import {ServiceClients} from "./clients/service-clients";
import {StorageService} from "./storage-service";
import {Utils} from "./utils";

@autoinject
export class AuthService {
    private initialized;
    private initializing;
    private state: ApplicationState;
    private noSleepEnabled: boolean = false;
    private serviceClients: ServiceClients;

    constructor(private store: Store<ApplicationState>, private cache: StorageService, private utils: Utils) {
        this.serviceClients = Container.instance.get(ServiceClients);
        this.store.state.subscribe((newState: ApplicationState) => this.stateChanged(newState));
        // this.noSleep = new NoSleep();
    }

    stateChanged(newState: ApplicationState) {
        this.state = newState;
    }

    // Looks for specific scope
    hasScope(resource: string) {
        return this.isAdmin(resource)
            ? true
            : this.state.authentication.claims.some(x => x.resource.startsWith(resource));
    }

    // Looks for specific resource
    hasResource(resource: string) {
        return this.isAdmin(resource)
            ? true
            : this.state.authentication.claims.some(x => x.resource === resource);
    }

    // Looks for specific claim
    hasClaim(resource: string, claim: string) {
        return this.isAdmin(resource)
            ? true
            : this.state.authentication.claims.some(x => x.resource === resource && x.claim === claim);
    }

    // Looks for specific claim
    hasAnyClaim(claim: string | Array<string>) {
        if (!Array.isArray(claim)) claim = [claim];
        return this.isAdmin()
            ? true
            : this.state.authentication.claims.some(x => (claim as Array<string>).some(xx => xx == x.claim));
    }

    isAdmin(resource?: string) {
        // lets check for system admin
        if (this.state && this.state.authentication && this.state.authentication.claims
            && this.state.authentication.claims.some(x => x.resource === 'system' && x.claim === 'admin')) return true;

        if (!resource || resource.indexOf(':') === -1) return false;

        let resourceArray = resource.split(':');
        let searchResource = resourceArray.slice(0, -1).join(':');
        let searchClaim = resourceArray.slice(-1).join(':');

        return this.state.authentication.claims.some(x => x.resource === searchResource && x.claim === searchClaim);
    }

    async initializeAsync(force?: boolean) {
        if (this.initializing) return this.initializing;
        if (this.initialized && !force) return Promise.resolve(true);

        this.initializing = new Promise(async (resolve, reject) => {
            try {

                // We are logged in so lets enable No Sleep
                // this.enableNoSleep();

                resolve(this.initialized = true);
            } catch (e) {
            } finally {
                this.initializing = null;
            }
        });

        return this.initializing;
    }

    async logoutUser(localOnly: boolean = false) {
        try {
            if (!localOnly) await this.serviceClients.onlineAccountApi.post(new OnlineAccountApi.MfaLogout());
        } finally {
            await dispatchify('logoff')();
            this.cache.clear();
            // this.disableNoSleep();
            location.hash='/';
            location.reload();
            await this.utils.reloadAppAsync('unauthenticated');
        }
    }

    async refreshBearerToken(refreshToken?: string, dispatch: boolean = true) {
        refreshToken = refreshToken || this.utils.getPropertyValue<string>(this.state, '.authentication.user.refreshToken');
        if (!refreshToken) {
            kendo.alert('Your token has expired!</br>Please log in again.');
            return await this.utils.reloadAppAsync('unauthenticated');
        }

        try {
            let request = new OnlineAccountApi.GetAccessToken({refreshToken: this.state.authentication.user.refreshToken});
            let response = await this.serviceClients.onlineAccountApi.post(request);
            if (dispatch) await dispatchify('setBearerToken')(response.accessToken);
            return response.accessToken;
        } catch (e) {
            return null;
        }
    }

}

export class JwtClaim {
    resource: string;
    claim: string;

    constructor(value: string) {
        this.resource = value.split(':').slice(0, -1).join(':');
        this.claim = value.split(':').slice(-1).join(':');
    }
}
