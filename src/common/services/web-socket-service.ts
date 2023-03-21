import {autoinject} from 'aurelia-framework';
import {dispatchify} from 'aurelia-store';
import * as signalR from "@microsoft/signalr";
import {HubConnection} from "@microsoft/signalr";
import {BaseProperties} from '../../bases/base-properties';
import environment from '../../environment';

@autoinject
export class WebSocketService extends BaseProperties {
    private ws: HubConnection;

    constructor(...args) {
        super(...args);

        this.eventService.subscribe('websocket:disconnect', () => this.disconnect());

        let _this = this;

        window.onbeforeunload = () => {
            if (_this.ws) _this.disconnect();
        };

        this.reconnect();
    }

    async onMessage(e) {
        let msg = JSON.parse(e);
        if (this.auth.isAdmin() || environment().debug) console.log('Incoming Message => ', msg);
        if (msg && msg.Data) {
            let msgDataType = msg.Data.getProp('Type');
            switch (msgDataType) {
                case 'SystemMessage':
                    await this.notificationService.showMessage('success', msgDataType, msg.Data.Payload.message,
                        {
                            timeOut: 0,
                            extendedTimeOut: 0,
                            closeButton: true,
                            tapToDismiss: false
                        });
                    break;
                case 'DataStoreCommand':
                    await dispatchify(msg.Data.Payload.command)(msg.Data.Payload.args);
                    break;
            }
        }
    }


    async onOpen(e) {
        console.log(`WebSocket Connected...`);
        await dispatchify('setOnlineState')(true);
    }

    async onClose(e) {
        console.log('WebSocket Closed...');
        await dispatchify('setOnlineState')(false);
    }

    onError(e) {
        console.log('WebSocket Error... ', e);
    }

    async onReconnect(e) {
        console.log('WebSocket Disconnected...');
        await dispatchify('setOnlineState')(false);
    }

    getWssUri() {
        return `${environment()['wssRoot']}?ss-tok=${this.state.authentication.user.bearerToken}`;
    }

    async reconnect() {
        if (this.ws) await this.ws.stop();

        this.ws = new signalR.HubConnectionBuilder()
            .withUrl(this.getWssUri())
            // .configureLogging(signalR.LogLevel.Information)
            .withAutomaticReconnect()
            .build();

        this.ws.onclose((e) => this.onClose(e));
        this.ws.onreconnecting((e) => this.onReconnect(e));
        this.ws.onreconnected((e) => this.onOpen(e));
        this.ws.on("EmitMessage", (e) => this.onMessage(e));

        try {
            await this.ws.start();
            await this.onOpen(this.ws);
        } catch (e) {
            setTimeout(() => this.reconnect(), 15 * 1000);
        }
    }

    async disconnect() {
        if (this.ws) await this.ws.stop();
        this.ws = null;
    }

}
