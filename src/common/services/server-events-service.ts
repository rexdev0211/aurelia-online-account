import {dispatchify} from "aurelia-store";
import {BaseProperties} from "../../bases/base-properties";

export class ServerEventsService extends BaseProperties {
    initialized: boolean;
    initializing: Promise<boolean>;
    lastMsg: string;

    constructor(...args) {
        super(...args);
    }

    async initializeAsync(force: boolean = false) {
        if (this.initializing) return this.initializing;
        if (this.initialized && !force) return Promise.resolve(true);

        dispatchify("setOnlineState")(false);

        this.initializing = new Promise(async (resolve, reject) => {
            try {
                resolve((this.initialized = true));
            } catch (err) {
                console.log(err);
                reject(err);
            } finally {
                this.initializing = null;
            }
        });

        return this.initializing;
    }
}
