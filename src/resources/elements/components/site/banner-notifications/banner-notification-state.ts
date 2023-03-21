import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";
import BannerNotification = OnlineAccountApi.BannerNotification;

export class BannerNotificationState {
    live: BannerNotification[] = [];
    dismissed: BannerNotification[] = [];
    system: BannerNotification[] = [];

    constructor(init?: Partial<BannerNotificationState>) {
        (<any>Object).assign(this, init);
    }
}

