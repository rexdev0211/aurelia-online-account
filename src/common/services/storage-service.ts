import * as moment from 'moment';
import environment from "../../environment";

export class StorageService {
    public index: any;
    public session: any;
    public storage: any;

    constructor() {
        this.index = {};
        this.storage = window.localStorage;
        this.session = window.sessionStorage;

        // reload index if needed
        this.loadIndex();
    }

    loadIndex() {
        let x = Object.keys(this.storage);

        for (let i = 0; i < x.length; i++) {
            this.index[x[i]] = true;
        }
    }

    setLocalStorage(key, value) {
        return this.set(key, value, (60 * 60 * 24 * 14), false);
    }

    set(key, value, expiration = (60 * 60 * 24 * 14), session = true) { // expiration default is 14 days multiplied by seconds
        if (value === null || value === undefined) {
            this.remove(key);
            return;
        }

        let date = new Date();
        date.setSeconds(date.getSeconds() + expiration);

        let item = JSON.stringify({stamp: date.getTime(), data: value});

        if (!session) {
            this.index[key] = true;
            this.storage.setItem(key, item);
        } else {
            this.session.setItem(key, item);
        }
    }

    get(key) {
        let returnItem = JSON.parse(this[this.index[key] ? 'storage' : 'session'].getItem(key));

        // if exists and not expired then return value
        if (returnItem) {
            let date = new Date(returnItem.stamp);
            if (new Date().getTime() <= date.getTime()) {
                return returnItem.data;
            }
        }

        // else, clear from storage and return null
        this.remove(key);

        return null;
    }

    remove(key) {
        this[this.index[key] ? 'storage' : 'session'].removeItem(key);
        delete this.index[key];
    }

    clear() {
        this.storage.clear();
        this.session.clear();
        this.clearCookies();
    }

    clearCookies() {
        if (document.cookie) {
            let cookies = document.cookie.split(';').map(Function.prototype.call, String.prototype.trim);
            for (let i = 0; i < cookies.length; i++) {
                let cookie = cookies[i].split('=');

                // Only remove Service Stack cookies
                if (cookie[0].toLowerCase().startsWith('ss-')) {
                    this.removeCookie(cookie[0]);
                }
            }
        }
    }

    removeCookie(sKey, sPath?, sDomain?) {
        document.cookie = encodeURIComponent(sKey) +
            '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' +
            (sDomain ? '; domain=' + sDomain : '') +
            (sPath ? '; path=' + sPath : '');
    }
}
