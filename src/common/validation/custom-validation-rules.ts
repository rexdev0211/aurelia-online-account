import {Container} from 'aurelia-framework';
import {Store} from "aurelia-store";
import {ValidationRules} from "aurelia-validation";
import {ApplicationState} from "../../applicationState";
import {OnlineAccountApi} from "../../dtos/onlineaccount-api.dtos";
import {ServiceClients} from "../services/clients/service-clients";
import ListAccountOwnerBeneficiaryAccountsResponse = OnlineAccountApi.ListAccountOwnerBeneficiaryAccountsResponse;

export class CustomValidationRules {

    static loadRules() {

        let isValidDate = (dateString: string) => {
            let regEx = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateString.match(regEx)) return false; // Invalid format
            let d = new Date(dateString);
            if (!d.getTime()) return false; // Invalid date (or this could be epoch)
            return d.toISOString().slice(0, 10) === dateString;
        };

        let isIntlPhone = (phoneNumber: string) => {
            return (phoneNumber.startsWith("+") && phoneNumber.length >= 10);
        };

        let _this = this;

        ValidationRules.customRule(
            "matchesProperty",
            (value: string, obj: any, otherPropertyName: string) =>
                value === null ||
                value === undefined ||
                value === "" ||
                obj[otherPropertyName] === null ||
                obj[otherPropertyName] === undefined ||
                obj[otherPropertyName] === "" ||
                value === obj[otherPropertyName],
            "${$displayName} must match ${$getDisplayName($config.otherPropertyName)}",
            otherPropertyName => ({otherPropertyName})
        );

        ValidationRules.customRule(
            "notMatchesProperty",
            (value: string, obj: any, otherPropertyName: string) =>
                value === null ||
                value === undefined ||
                value === "" ||
                obj[otherPropertyName] === null ||
                obj[otherPropertyName] === undefined ||
                obj[otherPropertyName] === "" ||
                value !== obj[otherPropertyName],
            "${$displayName} must NOT match ${$getDisplayName($config.otherPropertyName)}",
            otherPropertyName => ({otherPropertyName})
        );

        ValidationRules.customRule(
            "matchesAccountCodeCurrency",
            (value: string, obj: any) =>
                value === null ||
                value === undefined ||
                value === "" ||
                obj.accountCode.substr(2, 2) === value.slice(-3, -1),
            "Bank account must match account currency"
        );

        ValidationRules.customRule(
            "uniqueBeneficiaryNickName",
            async (value: string, obj: any) => {
                // @ts-ignore
                let state: ApplicationState = Container.instance.get(Store).state.source.value;

                let response: ListAccountOwnerBeneficiaryAccountsResponse = await Container.instance.get(ServiceClients).onlineAccountApi.post(new OnlineAccountApi.ListAccountOwnerBeneficiaryAccountsRequest({
                    accountERN: state.beneficiaries.sourceAccount.ern,
                    nickName: value
                }));

                let res =
                    value === null ||
                    value === undefined ||
                    value === "" ||
                    !response.results.some(ba => ba.nickName.trim().toLowerCase() === value.trim().toLowerCase() && ba.ern !== obj.ern)

                return res;
            },
            "Beneficiary Nick Name must be unique"
        );

        ValidationRules.customRule(
            "isValidDate",
            (value: string, obj: any) => {
                return (
                    value === null ||
                    value === undefined ||
                    value === "" ||
                    isValidDate(value)
                );
            },
            "${$displayName} must be a valid date"
        );

        ValidationRules.customRule(
            "isIntlPhone",
            (value: string, obj: any) => {
                return (
                    value === null ||
                    value === undefined ||
                    value === "" ||
                    isIntlPhone(value)
                );
            },
            "${$displayName} must be a valid PhoneNumber"
        );
    }
}
