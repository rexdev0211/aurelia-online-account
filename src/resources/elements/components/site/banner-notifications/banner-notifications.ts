import {observable} from 'aurelia-framework';
import {dispatchify} from "aurelia-store";
import {ApplicationState} from "../../../../../applicationState";
import {BaseElement} from '../../../../../bases/base-element';
import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";
import BannerNotification = OnlineAccountApi.BannerNotification;

export class BannerNotificationsCustomElement extends BaseElement {

    @observable systemBanner: BannerNotification;
    private delay: number;

    constructor(...args) {
        super(...args);
    }

    stateChanged(state: ApplicationState, oldState: ApplicationState) {
        if (state.banners.system.length)
            this.systemBanner = state.banners.system[0];
    }

    systemBannerChanged(banner: BannerNotification, oldBanner?: BannerNotification) {
        if (banner.ern !== oldBanner?.ern) this.updateUI();
    }

    attached() {
        dispatchify('fetchBannerNotifications')();
    }

    dismissBanner(banner: BannerNotification) {
        dispatchify('dismissBannerNotifications')(banner);
    }

    updateUI() {
        if (this.delay) window.clearTimeout(this.delay)

        this.delay = this.state.banners.system.length
            ? window.setTimeout(async () => {
                await dispatchify('fetchBannerNotifications')();
                this.updateUI();
            }, 60000)
            : 0;
    }
}

