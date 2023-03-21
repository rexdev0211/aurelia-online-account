import {dispatchify} from "aurelia-store";
import {ControllerValidateResult} from "aurelia-validation";
import {StartRegistrationModel} from "resources/elements/unauthenticated/registration/start-registration-model";
import {BaseElement} from "../../../../bases/base-element";

export class StartRegistrationCustomElement extends BaseElement {
    private model: StartRegistrationModel;
    private birthDate: HTMLElement;

    constructor(...args) {
        super(...args);
        let _this = this;
        this.model = new StartRegistrationModel();

        // this.model.emailAddress = "charles.lindsay+biz3@intelligentmedia.io";
        // this.model.confirmEmailAddress = "charles.lindsay+biz3@intelligentmedia.io";
        // this.model.mobilePhone = "+17024917734";
        // this.model.confirmMobilePhone = "+17024917734";
        // this.model.birthDate = 156470400000;
        // this.model.accountCode = "PO0A8KY1C8";
        // this.model.accessCode = "979887";

        this.validationController.addObject(this.model);

    }

    attached() {
        let _this = this;
        // this.datepickerObject = new DatePicker({
        //   // sets the placeholder
        //
        //   placeholder: "enter your birthdate (DD-MM-YYYY)",
        //   format: "dd-MM-yyyy",
        //   change: args => {
        //     //this.model.birthDateFormatted = moment.utc(args.value).format("DD-MM-YYYY");
        //     this.model.birthDate = moment.utc(args.value).format("MM-DD-YYYY");
        //   }
        // });
        // this.datepickerObject.appendTo(this.birthDate);
    }

    async submit() {
        let validationResult: ControllerValidateResult = await this.validationController.validate();
        if (validationResult.valid) {
            try {
                // let registeredUser = new OnlineAccountApi.StartRegistrationRequest();
                // registeredUser.accessCode = this.model.accessCode;
                // registeredUser.accountCode = this.model.accountCode;
                // registeredUser.birthDate = `${this.model.dobMonth}-${this.model.dobDay}-${this.model.dobYear}`;
                // registeredUser.emailAddress = this.model.emailAddress;
                // registeredUser.mobilePhone = this.model.mobilePhone;
                await this.serviceClients.onlineAccountApi.post(this.model);
                await dispatchify("saveRegistrationRequest")(this.model);

                this.notificationService.showMessage(
                    "success",
                    "Success",
                    `Please check your email [${this.model.emailAddress}] and mobile phone [${this.model.mobilePhone}] for your verification codes`,
                    null
                );
                location.hash = "#/confirm/registration";
            } catch (e) {
                if (e.responseStatus) {

                    if (e.responseStatus.message == "Verification Codes Resent") {
                        await dispatchify("saveRegistrationRequest")(this.model);
                        this.notificationService.showMessage(
                            "success",
                            "Success",
                            `Please check your email [${this.model.emailAddress}] and mobile phone [${this.model.mobilePhone}] for your verification codes`,
                            null
                        );
                        location.hash = "#/confirm/registration";
                        return;
                    }

                    let messageSplit = e.responseStatus.message.split("|");
                    if (messageSplit.length) {
                        let errorMessage = messageSplit[1];
                        validationResult.results.push(
                            this.validationController.addError(
                                errorMessage,
                                this.model,
                                messageSplit[0]
                            )
                        );
                    } else {
                        validationResult.results.push(
                            this.validationController.addError(
                                e.responseStatus.message,
                                this.model,
                                "emailAddress"
                            )
                        );
                    }
                }
                validationResult.valid = false;
            }
        }
    }
}
