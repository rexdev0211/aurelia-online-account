import {inject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';

@inject(DialogController)
export class AutoLogoffDialog {
    secondsTotal;
    secondsLeft;
    secondsLeftInterval;

    constructor(private controller: DialogController) {
        this.controller.settings.startingZIndex = 10000;
    }

    activate() {
        let secondsLeft = (parseInt(sessionStorage.getItem("auto-logoff")) - new Date().getTime()) / 1000;
        this.secondsLeft = this.secondsTotal = parseInt('' + secondsLeft);
        this.secondsLeftInterval = setInterval(async () => {
            this.secondsLeft--;
            if (this.secondsLeft <= 0) {
                await this.controller.cancel();
            }
        }, 1000);
    }

    deactivate() {
        clearInterval(this.secondsLeftInterval);
        this.secondsLeftInterval = undefined;
    }
}
