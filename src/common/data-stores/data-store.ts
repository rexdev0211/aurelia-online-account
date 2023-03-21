import {
    AddBusinessNotification,
    ApplicationState,
    BsBreakpoint, ConversationContext, Messaging,
    MfaSetup,
    Notifications,
    PaymentState,
    SelectedAccount,
    SelectedBeneficiary
} from "applicationState";
import {EventAggregator} from 'aurelia-event-aggregator';
import {Container, inject, TaskQueue} from "aurelia-framework";
import {Router} from "aurelia-router";
import {MiddlewarePlacement, Store} from "aurelia-store";
import {OnlineAccountApi} from "dtos/onlineaccount-api.dtos";
import * as jwtDecode from "jwt-decode";
import {DocumentStoreApi} from "../../dtos/documentstore-api.dtos";
import environment from "../../environment";
import {AccountsState} from "../../resources/elements/authenticated/account/accounts-state";
import {PermissionsState} from "../../resources/elements/authenticated/manage/permissions/permissions-state";
import {ManageRequestsState} from "../../resources/elements/authenticated/manage/requests/manage-requests-state";
import {WebhooksState, WebhookViewType} from "../../resources/elements/authenticated/manage/webhooks/webhooks-state";
import {
    BeneficiaryState,
    BeneficiaryViewType
} from "../../resources/elements/authenticated/payments/beneficiaries/beneficiary-state";
import {PaymentBulkState} from "../../resources/elements/authenticated/payments/send/bulk/payment-bulk-state";
import {PaymentOrderState} from "../../resources/elements/authenticated/payments/orders/payment-order-state";
import {BkaSendFundsModel} from "../../resources/elements/authenticated/payments/send/bka-send-funds-model";
import {PaymentSendState} from "../../resources/elements/authenticated/payments/send/payment-send-state";
import {PaymentTransferState} from "../../resources/elements/authenticated/payments/transfer/payment-transfer-state";
import {
    BannerNotificationState
} from "../../resources/elements/components/site/banner-notifications/banner-notification-state";
import {RegistrationState} from "../../resources/elements/unauthenticated/registration/registration-state";
import {CustomerSummaryModel} from "../models/customer/customer-summary-model";
import {AuthService, JwtClaim} from "../services/auth-service";
import {ServiceClients} from '../services/clients/service-clients';
import {NotificationService} from "../services/notification-service";
import {Utils} from "../services/utils";
import {EventService} from "../services/event-service";
import * as _ from 'lodash';
import {
    BeneficiaryBulkState
} from "../../resources/elements/authenticated/payments/beneficiaries/bulk/beneficiary-bulk-state";
import {JsvService} from "../services/jsv-service";
import modelJSON from "common/data/CRA-EMPTY-MODEL.json";
import countriesJSON from "common/data/CRA-COUNTRY.json";
import industriesJSON from "common/data/CRA-INDUSTRY.json";
import BeneficiaryAccount = OnlineAccountApi.BeneficiaryAccount;
import CustomerBusinessLookup = OnlineAccountApi.CustomerBusinessLookup;
import CustomerBusinessSummary = OnlineAccountApi.CustomerBusinessSummary;
import GetAuthBannerNotifications = OnlineAccountApi.GetAuthBannerNotifications;
import GetBannerNotifications = OnlineAccountApi.GetBannerNotifications;
import GetBannerNotificationsResponse = OnlineAccountApi.GetBannerNotificationsResponse;
import GetBusinessSummaryRequest = OnlineAccountApi.GetBusinessSummaryRequest;
import GetBusinessSummaryResponse = OnlineAccountApi.GetBusinessSummaryResponse;
import GetCustomerLimit = OnlineAccountApi.GetCustomerLimit;
import GetCustomerLimitResponse = OnlineAccountApi.GetCustomerLimitResponse;
import ListCustomerWebhooksRequest = OnlineAccountApi.ListCustomerWebhooksRequest;
import ListEnumsResponse = OnlineAccountApi.ListEnumsResponse;
import MemberSummary = OnlineAccountApi.MemberSummary;
import StartRegistrationRequest = OnlineAccountApi.StartRegistrationRequest;
import WebhookSummary = OnlineAccountApi.WebhookSummary;
import ListPkiCertificatesResponse = OnlineAccountApi.ListPkiCertificatesResponse;
import ListPkiCertificatesRequest = OnlineAccountApi.ListPkiCertificatesRequest;
import JobType = OnlineAccountApi.JobType;
import NotificationProfile = OnlineAccountApi.NotificationProfile;
import BusinessSummary = OnlineAccountApi.BusinessSummary;
import NotificationDelivery = OnlineAccountApi.NotificationDelivery;
import NotificationEvent = OnlineAccountApi.NotificationEvent;
import ListMailboxRequest = OnlineAccountApi.ListMailboxRequest;
import Enumerable from "linq";
import MailboxType = OnlineAccountApi.MailboxType;
import IMailbox = OnlineAccountApi.IMailbox;
import ListMailboxSubjectRequest = OnlineAccountApi.ListMailboxSubjectRequest;
import IMailboxSubject = OnlineAccountApi.IMailboxSubject;
import ListMailboxMessageRequest = OnlineAccountApi.ListMailboxMessageRequest;

@inject(Store, EventService)
export class DataStore {
    public state: ApplicationState;
    private store: Store<ApplicationState>

    // constructor(private store: Store<ApplicationState>, private  serviceClients: ServiceClients, private utils: Utils) {
    private normalizeUserRoles: Function;
    private normalizeUserPerms: Function;
    private notifyCustomerUpdated: Function;
    private getCertificates: Function;
    private eventService: EventService;


    constructor(...args) {
        this.store = args.find(x => x instanceof Store);
        this.eventService = args.find(x => x instanceof EventService);
        this.store.registerMiddleware(this.localStorageMiddleware, MiddlewarePlacement.After);
        this.registerStoreActions();

        this.store.state.subscribe(state => (this.state = state));
        this.store.dispatch(this.rehydrateFromLocalStorage);
    }

    registerStoreActions() {
        this.store.registerAction("rehydrateFromLocalStorage", this.rehydrateFromLocalStorage);


        this.store.registerAction("setAuthUser", this.setAuthUser);
        this.store.registerAction("setJobViewerERN", this.setJobViewerERN);
        this.store.registerAction("setAuthClaims", this.setAuthClaims);
        this.store.registerAction("setAuthAttributes", this.setAuthAttributes);
        this.store.registerAction("setRefreshToken", this.setRefreshToken);
        this.store.registerAction("setBearerToken", this.setBearerToken);

        this.store.registerAction("updateCustomerSummary", this.updateCustomerSummary);
        this.store.registerAction("selectAccount", this.selectAccount);

        // this.store.registerAction("selectSourceAccount", this.selectSourceAccount);
        // this.store.registerAction("selectTransferToAccount", this.selectTransferToAccount);
        // this.store.registerAction("selectDestinationAccount", this.selectDestinationAccount);
        // this.store.registerAction("clearSourceAccount", this.clearSourceAccount);
        // this.store.registerAction("setBeneficiaryPaymentRequest", this.setBeneficiaryPaymentRequest);

        this.store.registerAction("reloadCustomer", this.reloadCustomer);
        this.store.registerAction("reloadSpending", this.reloadSpending);
        this.store.registerAction("reloadJwt", this.reloadJwt);

        this.store.registerAction("logoff", this.logoff);
        this.store.registerAction("appInitialized", this.appInitialized);

        this.store.registerAction("isAuthenticated", this.isAuthenticated);

        this.store.registerAction("showNavbar", this.showNavbar);
        this.store.registerAction("mfaSetup", this.mfaSetup);
        this.store.registerAction("mfaTypeSelected", this.mfaTypeSelected);
        this.store.registerAction("setOnlineState", this.setOnlineState);
        this.store.registerAction("upsertJob", this.upsertJob);
        this.store.registerAction("clearCurrentJob", this.clearCurrentJob);
        this.store.registerAction("setCurrentJob", this.setCurrentJob);
        this.store.registerAction("fetchDocumentTypes", this.fetchDocumentTypes);
        this.store.registerAction("fetchEnumTypes", this.fetchEnumTypes);
        // this.store.registerAction("selectBeneficiary", this.selectBeneficiary);
        // this.store.registerAction("addBeneficiaryRedirectTo", this.addBeneficiaryRedirectTo);

        this.store.registerAction("saveEmailAddress", this.saveEmailAddress);
        this.store.registerAction("clearRegistrationRequest", this.clearRegistrationRequest);
        this.store.registerAction("saveRegistrationRequest", this.saveRegistrationRequest);


        this.store.registerAction("setBreakpoint", this.setBreakpoint);

        this.store.registerAction("clearPayments", this.clearPayments);
        this.store.registerAction("setPaymentTransferSource", this.setPaymentTransferSource);
        this.store.registerAction("setPaymentTransferDestination", this.setPaymentTransferDestination);
        this.store.registerAction("setPaymentSendSource", this.setPaymentSendSource);
        this.store.registerAction("setPaymentSendDestination", this.setPaymentSendDestination);
        this.store.registerAction("setPaymentSendBeneficiary", this.setPaymentSendBeneficiary);
        this.store.registerAction("setPaymentSendRequest", this.setPaymentSendRequest);
        this.store.registerAction("setPaymentOrdersSource", this.setPaymentOrdersSource);


        this.store.registerAction("clearBeneficiaries", this.clearBeneficiaries);
        this.store.registerAction("setBeneficiariesView", this.setBeneficiariesView);
        this.store.registerAction("setBeneficiariesSource", this.setBeneficiariesSource);
        this.store.registerAction("setBeneficiariesSelected", this.setBeneficiariesSelected);


        this.store.registerAction("clearManageWebhooks", this.clearManageWebhooks);
        this.store.registerAction("fetchWebhooks", this.fetchWebhooks);
        this.store.registerAction("selectWebhook", this.selectWebhook);
        this.store.registerAction("setManageWebhooksView", this.setManageWebhooksView);
        this.store.registerAction("setManageWebhooksSource", this.setManageWebhooksSource);


        this.store.registerAction("clearPermissions", this.clearPermissions);
        this.store.registerAction("setPermissionsSelectedBusiness", this.setPermissionsSelectedBusiness);
        this.store.registerAction("setPermissionsSelectedMember", this.setPermissionsSelectedMember);
        this.store.registerAction("clearPermissionsBeneficiaryAccounts", this.clearPermissionsBeneficiaryAccounts);
        this.store.registerAction("setPermissionsBeneficiaryAccounts", this.setPermissionsBeneficiaryAccounts);


        this.store.registerAction("clearRequests", this.clearRequests);
        this.store.registerAction("setRequestsSelectedBusiness", this.setRequestsSelectedBusiness);

        this.store.registerAction("clearBulkPayments", this.clearBulkPayments);
        this.store.registerAction("setBulkPayments", this.setBulkPayments);

        this.store.registerAction("clearBulkBeneficiaries", this.clearBulkBeneficiaries);
        this.store.registerAction("setBulkBeneficiaries", this.setBulkBeneficiaries);

        this.store.registerAction("fetchBannerNotifications", this.fetchBannerNotifications);
        this.store.registerAction("dismissBannerNotifications", this.dismissBannerNotifications);
        this.store.registerAction("getAuthDevices", this.getAuthDevices);

        this.store.registerAction("loadCertificates", this.loadCertificates);
        this.store.registerAction("refreshPendingPayments", this.refreshPendingPayments);

        this.store.registerAction("reloadMailbox", this.reloadMailbox);
        this.store.registerAction("setMailbox", this.setMailbox);
        this.store.registerAction("setMailboxView", this.setMailboxView);
        this.store.registerAction("setMailboxConversation", this.setMailboxConversation);
        this.store.registerAction("setMailboxSubject", this.setMailboxSubject);
        this.store.registerAction("setMailboxMessages", this.setMailboxMessages);
        this.store.registerAction("setMailboxFilter", this.setMailboxFilter);
        this.store.registerAction("fetchMailboxes", this.fetchMailboxes);
        this.store.registerAction("fetchMailboxSubjects", this.fetchMailboxSubjects);
        this.store.registerAction("fetchMailboxMessages", this.fetchMailboxMessages);

        this.store.registerAction("resetNotificationsContext", this.resetNotificationsContext);
        this.store.registerAction("setNotificationsContext", this.setNotificationsContext);
        this.store.registerAction("setNotificationsProfile", this.setNotificationsProfile);
        this.store.registerAction("setNotificationsBusiness", this.setNotificationsBusiness);
        this.store.registerAction("setNotificationsBusinessEvent", this.setNotificationsBusinessEvent);
        this.store.registerAction("setNotificationsBusinessPrincipal", this.setNotificationsBusinessPrincipal);
        this.store.registerAction("addNotificationProfile", this.addNotificationProfile);
        this.store.registerAction("delNotificationProfile", this.delNotificationProfile);
        this.store.registerAction("toggleNotificationProfileDelivery", this.toggleNotificationProfileDelivery);
        this.store.registerAction("addNotificationProfileTransaction", this.addNotificationProfileTransaction);
        this.store.registerAction("delNotificationProfileTransaction", this.delNotificationProfileTransaction);
        this.store.registerAction("replaceNotificationProfileTransaction", this.replaceNotificationProfileTransaction);
        this.store.registerAction("refreshNotifications", this.refreshNotifications);
        this.store.registerAction("setGoFast", this.setGoFast);

        // @leonid: register your actions under this line using pattern above
        this.store.registerAction('getCRAModel', this.getCRAModel);
        this.store.registerAction('getCRACountries', this.getCRACountries);
        this.store.registerAction('getCRAIndustries', this.getCRAIndustries);
        this.store.registerAction('setCRAModel', this.setCRAModel);

        // @leonid: register your actions above this line using pattern above

        this.normalizeUserRoles = _.debounce(async (key) => await this.getNormalizedUserRoles(key), 1000, {
            leading: true,
            trailing: false
        });

        this.normalizeUserPerms = _.debounce(async (key) => await this.getNormalizedUserRoles(key), 1000, {
            leading: true,
            trailing: false
        });

        this.notifyCustomerUpdated = _.debounce((key) => Container.instance.get(NotificationService).showMessage('success', 'Record Updated', 'Your customer record has been updated'), 15000, {
            leading: true,
            trailing: false
        });

        // this.getCertificates = _.debounce(async (key) => await Container.instance.get(ServiceClients).onlineAccountApi.get(new ListPkiCertificatesRequest({userAuthId: this.state.customerSummary.userAuthId})), 60000, {
        //   leading: true,
        //   trailing: false
        // });

    }

    getNormalizedUserRoles = async roleKey => {
        let split = roleKey.split(':');
        let request = new OnlineAccountApi.NormalizeUserRolesRequest({
            key: roleKey,
            userAuthId: split[2]
        });
        let response: OnlineAccountApi.NormalizeUserRolesResponse = await Container.instance.get(ServiceClients).onlineAccountApi.get(request);
        return response.results;
    };

    setAuthUser = (state: ApplicationState, value: OnlineAccountApi.AuthenticateResponse) => {
        const newState = Object.assign({}, state);
        newState.authentication.user = value;
        return newState;
    };

    setJobViewerERN = (state: ApplicationState, value: string = null) => {
        const newState = Object.assign({}, state);
        newState.jobViewerERN = value;
        return newState;
    };

    setAuthClaims = (state: ApplicationState, value: Array<JwtClaim>, append: boolean = true) => {
        const newState = Object.assign({}, state);
        if (value.length && append)
            newState.authentication.claims = [...newState.authentication.claims, ...value];
        else
            newState.authentication.claims = value;
        return newState;
    };

    setAuthAttributes = (state: ApplicationState, value: any) => {
        const newState = Object.assign({}, state);
        newState.authentication.attributes = value;
        return newState;
    };

    private localStorageMiddleware(state: ApplicationState, _: any, settings: any) {
        if (window.sessionStorage) {
            const key = settings && settings.key && typeof settings.key === "string" ? settings.key : "aurelia-store-state";
            const value = JSON.stringify(state);
            window.sessionStorage.removeItem(key);
            window.sessionStorage.setItem(key, value);

            const versionKey = `${key}-version`;
            if (value === JSON.stringify(new ApplicationState()))
                window.sessionStorage.removeItem(versionKey);
            else
                window.sessionStorage.setItem(versionKey, environment().buildNumber);
        }
    }

    private rehydrateFromLocalStorage(state: ApplicationState, key: string = "aurelia-store-state"): ApplicationState {
        const newState = Object.assign({}, state, new ApplicationState());
        if (!window.sessionStorage) return newState;

        const versionKey = `${key}-version`;
        const stateVersion = window.sessionStorage.getItem(versionKey);
        const appVersion = environment().buildNumber;
        const storedState = window.sessionStorage.getItem(key);

        if (!storedState || !stateVersion) {
            return newState;
        }
        if (stateVersion !== appVersion) {
            try {
                window.setTimeout(() => {
                    kendo.alert(`This site was just updated.</br>Now using Enumis ${environment().appName} version ${appVersion}.`);
                }, 5000);
                newState.authentication = (JSON.parse(storedState) as ApplicationState).authentication;
            } finally {
                window.sessionStorage.clear();
                location.hash = '#/';
                return newState;
            }
        }

        try {
            let oldState = JSON.parse(storedState);
            oldState.initialized = false;
            return oldState;
        } catch (e) {
            console.log(e);
        }

        return newState;
    }

    private setBreakpoint = async (state: ApplicationState, breakpoint: string) => {
        const newState: ApplicationState = Object.assign({}, state);

        switch (breakpoint) {
            case 'xSmall':
                newState.breakpoint = new BsBreakpoint('xs', 0);
                break;
            case 'small':
                newState.breakpoint = new BsBreakpoint('sm', 1);
                break;
            case 'medium':
                newState.breakpoint = new BsBreakpoint('md', 2);
                break;
            case 'large':
                newState.breakpoint = new BsBreakpoint('lg', 3);
                break;
            case 'xLarge':
                newState.breakpoint = new BsBreakpoint('xl', 4);
                break;
        }

        return newState;
    }

    private reloadJwt = async (state: ApplicationState) => {
        const newState: ApplicationState = Object.assign({}, state);
        kendo.confirm('Your customer record has been updated.  Reload?')
            .then(t => Container.instance.get(TaskQueue).queueMicroTask(() => $('.header-logo-image').click()));
        return newState;
    }

    private reloadCustomer = async (state: ApplicationState) => {
        const newState: ApplicationState = Object.assign({}, state);

        // Let's load our customer record
        let res: OnlineAccountApi.CustomerResponse = await Container.instance.get(ServiceClients).onlineAccountApi.get(new OnlineAccountApi.CustomerRequest());
        newState.customerSummary = new CustomerSummaryModel(res.result);

        this.notifyCustomerUpdated();

        return this.reloadSpending(newState);
    }

    private reloadSpending = async (state: ApplicationState) => {
        const newState: ApplicationState = Object.assign({}, state);

        let res: GetCustomerLimitResponse = await Container.instance.get(ServiceClients).onlineAccountApi.get(new GetCustomerLimit());
        newState.customerSpending = res.result

        return newState;
    }

    private selectAccount = (state: ApplicationState, selectedAccount: OnlineAccountApi.AccountSummary) => {
        const newState = Object.assign({}, state);
        if (!newState.accounts) newState.accounts = new AccountsState();
        newState.accounts.sourceAccount = new SelectedAccount(selectedAccount);
        this.eventService.publish('"router:navigation:processing"', null);
        return newState;
    }

    private updateCustomerSummary = async (state: ApplicationState, customerSummary?: OnlineAccountApi.CustomerSummary) => {
        const newState = Object.assign({}, state);

        // Let's load our customer record
        let res: OnlineAccountApi.CustomerResponse = await Container.instance.get(ServiceClients).onlineAccountApi.get(new OnlineAccountApi.CustomerRequest());

        newState.customerSummary = new CustomerSummaryModel(res.result);

        // Lets Load Select Business
        let selectedBusiness = Container.instance.get(Utils).getPropertyValue<CustomerBusinessSummary>(this.state, '.permissions.selectedBusiness');
        if (selectedBusiness) {
            let state: ApplicationState = await this.setPermissionsSelectedBusiness(newState, new CustomerBusinessLookup({ern: selectedBusiness.ern}));
            newState.permissions.selectedBusiness = state.permissions.selectedBusiness;
        }

        if (customerSummary)
            this.notifyCustomerUpdated();

        // Update Selected Account
        if (state.accounts.sourceAccount) {
            let account = newState.customerSummary.accounts.find(x => x.ern == state.accounts.sourceAccount.ern);
            if (account) newState.accounts.sourceAccount = new SelectedAccount(account);
        }

        Container.instance.get(EventAggregator).publish('refresh:grid');
        return this.reloadSpending(newState);
    }

    private refreshPendingPayments = async (state: ApplicationState) => {
        const newState = Object.assign({}, state);

        Container.instance.get(EventAggregator).publish('refresh:grid:pending:payments');

        return newState;
    }

    private logoff = async (state: ApplicationState) => {
        let newState = new ApplicationState();
        Container.instance.get(EventService).publish('websocket:disconnect', null);
        newState.banners = state.banners;
        return newState;
    }

    private appInitialized = (state: ApplicationState) => {
        const newState = Object.assign({}, state);
        newState.initialized = true;
        return newState;
    }

    // private addOrUpdateJob = (state: ApplicationState, job: OnlineAccountApi.Job) => {
    //     const newState = Object.assign({}, state);
    //
    //     if (state.currentJob && state.currentJob.jobERN == job.jobERN
    //         && (state.currentJob.modifiedDate && state.currentJob.modifiedDate > job.modifiedDate)) return newState;
    //
    //     let jobChain = new JobChain(job);
    //
    //     // Set Jobs
    //     if (state.jobs.find(x => x.jobERN == job.jobERN)) {
    //         newState.jobs = [...state.jobs.filter(x => x.jobERN !== job.jobERN), jobChain];
    //     } else {
    //         newState.jobs = [...state.jobs, jobChain];
    //     }
    //     newState.jobs.sort((x, y) => y.createdDate - x.createdDate);
    //
    //     // Set Current Job
    //     if (newState.jobs[0].ern == jobChain.ern)
    //         newState.currentJob = jobChain;
    //
    //     return newState;
    // }

    private setBearerToken = async (state: ApplicationState, token: string) => {
        const newState = Object.assign({}, state);
        newState.authentication.user.bearerToken = token;
        let jwt = jwtDecode(token);
        newState.authentication.attributes = jwt;

        if (jwt.jid)
            newState.authentication.user.sessionId = jwt.jid;

        newState.authentication.claims = [];


        if (jwt.perms && jwt.perms.length && jwt.roles && jwt.roles.length) {
            let [normalizedPerms, normalizedRoles] = await Promise.all([this.normalizeUserPerms(jwt.perms[0]), this.normalizeUserRoles(jwt.roles[0])]);
            newState.authentication.claims = [...newState.authentication.claims, ...normalizedPerms.map(x => new JwtClaim(x))];
            newState.authentication.claims = [...newState.authentication.claims, ...normalizedRoles.map(x => new JwtClaim(x))];
        } else if (jwt.perms && jwt.perms.length) {
            let normalizedPerms = await this.normalizeUserPerms(jwt.perms[0]);
            newState.authentication.claims = [...newState.authentication.claims, ...normalizedPerms.map(x => new JwtClaim(x))];
        } else if (jwt.roles && jwt.roles.length) {
            let normalizedRoles = await this.normalizeUserRoles(jwt.roles[0]);
            newState.authentication.claims = [...newState.authentication.claims, ...normalizedRoles.map(x => new JwtClaim(x))];
        }

        return newState;
    }

    private setRefreshToken = (state: ApplicationState, token: string) => {
        const newState = Object.assign({}, state);
        newState.authentication.user.refreshToken = token;
        return newState;
    }

    // private selectSourceAccount = (state: ApplicationState, value: AccountSummary) => {
    //     const newState = Object.assign({}, state);
    //
    //     newState.sourceAccount = value != null
    //         ? new SelectedAccount(value)
    //         : null;
    //
    //     return newState;
    // }

    // private selectTransferToAccount = (state: ApplicationState, value: AccountSummary) => {
    //     const newState = Object.assign({}, state);
    //
    //     newState.transferToAccount = value != null
    //         ? new SelectedAccount(value)
    //         : null;
    //
    //     return newState;
    // }

    private isAuthenticated = (state: ApplicationState, isAuthenticated: boolean) => {
        const newState = Object.assign({}, state);
        newState.isAuthenticated = isAuthenticated;
        return newState;
    }

    private showNavbar = (state: ApplicationState, showNavbar: boolean) => {
        const newState = Object.assign({}, state);
        newState.showNavbar = showNavbar;
        return newState;
    }


    // private async selectWebhook(state: ApplicationState, webhook: WebhookSubscription) {
    //     const newState = Object.assign({}, state);
    //     try {
    //         newState.selectWebhook = webhook;
    //         return newState;
    //     } catch (e) {
    //         return newState;
    //     }
    // }
    //
    // private async selectBeneficiary(state: ApplicationState, beneficiary: OnlineAccountApi.BeneficiaryAccount, beneficiarySummary?: OnlineAccountApi.BeneficiarySummary) {
    //     const newState = Object.assign({}, state);
    //
    //     if (beneficiarySummary) {
    //         newState.selectedBeneficiary = new SelectedBeneficiary(beneficiarySummary);
    //         return newState;
    //     }
    //
    //     try {
    //         let response = await Container.instance.get(ServiceClients).onlineAccountApi.get(new OnlineAccountApi.GetBeneficiaryRequest({ern: beneficiary.ern}));
    //         newState.selectedBeneficiary = new SelectedBeneficiary(response.result);
    //         return newState;
    //     } catch (e) {
    //         return newState;
    //     }
    // }

    // private async addBeneficiaryRedirectTo(state: ApplicationState, redirectTo: string) {
    //     const newState = Object.assign({}, state);
    //     newState.addBeneficiaryRedirectTo = redirectTo;
    //     return newState;
    // }

    // private selectDestinationAccount = (state: ApplicationState, value: OnlineAccountApi.BeneficiaryAccount) => {
    //     const newState = Object.assign({}, state);
    //     value != null ? newState.destinationAccount = new SelectedBeneficiary(value) : newState.destinationAccount = null;
    //     return newState;
    // }
    //
    // private setBeneficiaryPaymentRequest = (state: ApplicationState, value: BkaSendFundsModel) => {
    //     const newState = Object.assign({}, state);
    //     value != null ? newState.beneficiaryPaymentRequest = value : newState.beneficiaryPaymentRequest = null;
    //     return newState;
    // }
    //
    // private clearSourceAccount = (state: ApplicationState) => {
    //     const newState = Object.assign({}, state);
    //     newState.sourceAccount = null;
    //     newState.destinationAccount = null;
    //     newState.beneficiaryPaymentRequest = null;
    //     return newState;
    // }

    private saveEmailAddress = (state: ApplicationState, emailAddress: string) => {
        const newState = Object.assign({}, state);
        newState.emailAddress = emailAddress;
        return newState;
    }

    private clearRegistrationRequest = (state: ApplicationState) => {
        const newState = Object.assign({}, state);
        newState.registration = null;
        return newState;
    }

    private saveRegistrationRequest = (state: ApplicationState, value: StartRegistrationRequest) => {
        const newState = Object.assign({}, state);
        if (!newState.registration) newState.registration = new RegistrationState();
        newState.registration.request = value;
        return newState;
    }

    private mfaSetup = (state: ApplicationState, mfaSetup: boolean) => {
        const newState = Object.assign({}, state);
        newState.mfaSetup = mfaSetup ? new MfaSetup() : null;
        return newState;
    }

    private setOnlineState = (state: ApplicationState, websocketOnline: boolean) => {
        const newState = Object.assign({}, state);
        newState.websocketOnline = websocketOnline;
        return newState;
    }

    private mfaTypeSelected = (state: ApplicationState, mfaSetupSelected: string) => {
        const newState = Object.assign({}, state);

        if (!newState.mfaSetup) newState.mfaSetup = new MfaSetup();

        newState.mfaSetup.setupType = mfaSetupSelected;
        return newState;
    }

    private upsertJob = (state: ApplicationState, jobValue: OnlineAccountApi.Job) => {
        const newState = Object.assign({}, state);
        let job = Container.instance.get(Utils).toCamel(jobValue);

        if (job.type == JobType.BatchSendFunds)
            Container.instance.get(EventAggregator).publish('refresh:grid:batch:payments');

        if (state.currentJob && state.currentJob.jobERN == job.jobERN
            && (state.currentJob.modifiedDate && state.currentJob.modifiedDate > job.modifiedDate)) return newState;

        // Set Jobs
        if (state.jobs.find(x => x.jobERN == job.jobERN)) {
            newState.jobs = [...state.jobs.filter(x => x.jobERN !== job.jobERN), job];
        } else {
            newState.jobs = [...state.jobs, job];
        }

        newState.jobs.sort((x, y) => y.modifiedDate - x.modifiedDate);

        // Set Current Job
        if (newState.jobs[0].jobERN == job.jobERN)
            newState.currentJob = job;

        return newState;
    }

    private clearCurrentJob = (state: ApplicationState) => {
        const newState = Object.assign({}, state);
        newState.currentJob = null;
        return newState;
    }

    private setCurrentJob = (state: ApplicationState, job: OnlineAccountApi.Job) => {
        const newState = Object.assign({}, state);
        newState.currentJob = job;
        return newState;
    }

    private async fetchDocumentTypes(state: ApplicationState) {
        const newState = Object.assign({}, state);
        try {
            let response = await Container.instance.get(ServiceClients).documentStoreApi.get(new DocumentStoreApi.ListDocumentTypesRequest());
            newState.documentTypes = response.results;
            return newState;
        } catch (e) {
            return newState;
        }
    }

    private async fetchEnumTypes(state: ApplicationState) {
        const newState = Object.assign({}, state);
        try {
            let response: ListEnumsResponse = await Container.instance.get(ServiceClients).onlineAccountApi.get(new OnlineAccountApi.ListEnumsRequest());
            newState.enums = response.result;
            return newState;
        } catch (e) {
            return newState;
        }
    }

    private clearPayments = (state: ApplicationState) => {
        const newState = Object.assign({}, state);
        newState.payments = null;
        return newState;
    }

    private setPaymentTransferSource = (state: ApplicationState, value: SelectedAccount) => {
        const newState = Object.assign({}, state);
        if (!newState.payments) newState.payments = new PaymentState({transfer: new PaymentTransferState()});
        newState.payments.transfer.sourceAccount = value;
        return newState;
    }

    private setPaymentTransferDestination = (state: ApplicationState, value: SelectedAccount) => {
        const newState = Object.assign({}, state);
        if (!newState.payments) newState.payments = new PaymentState({transfer: new PaymentTransferState()});
        newState.payments.transfer.destinationAccount = value;
        return newState;
    }

    private setPaymentSendSource = (state: ApplicationState, value: SelectedAccount) => {
        const newState = Object.assign({}, state);
        if (!newState.payments) newState.payments = new PaymentState({send: new PaymentSendState()});
        newState.payments.send.sourceAccount = value;
        return newState;
    }

    private setPaymentSendDestination = (state: ApplicationState, value: SelectedAccount) => {
        const newState = Object.assign({}, state);
        if (!newState.payments) newState.payments = new PaymentState({send: new PaymentSendState()});
        newState.payments.send.destinationAccount = value;
        return newState;
    }

    private setPaymentSendBeneficiary = (state: ApplicationState, value: BeneficiaryAccount) => {
        const newState = Object.assign({}, state);
        if (!newState.payments) newState.payments = new PaymentState({send: new PaymentSendState()});

        newState.payments.send.beneficiaryAccount = value != null
            ? new SelectedBeneficiary(value)
            : null;

        return newState;
    }

    private setPaymentSendRequest = (state: ApplicationState, value: BkaSendFundsModel) => {
        const newState = Object.assign({}, state);
        if (!newState.payments) newState.payments = new PaymentState({send: new PaymentSendState()});

        newState.payments.send.paymentRequest = value != null
            ? value
            : null;

        return newState;
    }

    private setPaymentOrdersSource = (state: ApplicationState, value: SelectedAccount) => {
        const newState = Object.assign({}, state);
        if (!newState.payments) newState.payments = new PaymentState({orders: new PaymentOrderState()});
        newState.payments.orders.sourceAccount = value;
        return newState;
    }

    private clearBeneficiaries = (state: ApplicationState) => {
        const newState = Object.assign({}, state);
        newState.beneficiaries = new BeneficiaryState();
        return newState;
    }

    private setBeneficiariesView = (state: ApplicationState, value: BeneficiaryViewType) => {
        const newState = Object.assign({}, state);
        if (!newState.beneficiaries) newState.beneficiaries = new BeneficiaryState();
        newState.beneficiaries.view = value;
        return newState;
    }

    private setBeneficiariesSource = (state: ApplicationState, value: SelectedAccount) => {
        const newState = Object.assign({}, state);
        if (!newState.beneficiaries) newState.beneficiaries = new BeneficiaryState();
        newState.beneficiaries.sourceAccount = value;
        return newState;
    }

    private setBeneficiariesSelected = (state: ApplicationState, value: BeneficiaryAccount) => {
        const newState = Object.assign({}, state);
        if (!newState.beneficiaries) newState.beneficiaries = new BeneficiaryState();
        newState.beneficiaries.selectedBeneficiary = value;
        return newState;
    }

    private clearManageWebhooks = (state: ApplicationState) => {
        const newState = Object.assign({}, state);
        if (!newState.webhooks) {
            newState.webhooks = new WebhooksState({
                view: WebhookViewType.Manage,
                items: state.webhooks.items
            });
        } else {
            newState.webhooks = new WebhooksState({
                view: WebhookViewType.Manage,
                items: state.webhooks.items
            });
        }

        return newState;
    }

    private setManageWebhooksView = (state: ApplicationState, value: WebhookViewType) => {
        const newState = Object.assign({}, state);
        if (!newState.webhooks) newState.webhooks = new WebhooksState();
        newState.webhooks.view = value;
        return newState;
    }

    private setManageWebhooksSource = (state: ApplicationState, value: SelectedAccount) => {
        const newState = Object.assign({}, state);
        if (!newState.webhooks) newState.webhooks = new WebhooksState({view: WebhookViewType.Manage});
        newState.webhooks.sourceAccount = value;
        return newState;
    }

    private async fetchWebhooks(state: ApplicationState) {
        const newState = Object.assign({}, state);
        try {
            let request = new ListCustomerWebhooksRequest({customerERN: state.customerSummary.ern});
            let response = await Container.instance.get(ServiceClients).onlineAccountApi.get(request);
            if (!newState.webhooks) newState.webhooks = new WebhooksState({view: WebhookViewType.Manage});
            newState.webhooks.items = response.results
            return newState;
        } catch (e) {
            return newState;
        }
    }

    private async selectWebhook(state: ApplicationState, value: WebhookSummary) {
        const newState = Object.assign({}, state);
        if (!newState.webhooks) newState.webhooks = new WebhooksState({view: WebhookViewType.Manage});
        newState.webhooks.selectedWebhook = value;
        return newState;
    }

    private clearPermissions = (state: ApplicationState) => {
        const newState = Object.assign({}, state);
        newState.permissions = null;
        return newState;
    }

    private setPermissionsSelectedBusiness = async (state: ApplicationState, value: CustomerBusinessLookup) => {
        const newState = Object.assign({}, state);
        if (!newState.permissions) newState.permissions = new PermissionsState();

        let response: GetBusinessSummaryResponse = await Container.instance.get(ServiceClients).onlineAccountApi.get(new GetBusinessSummaryRequest({businessERN: value.ern}));
        newState.permissions.selectedBusiness = response.result;

        return newState;
    }

    private setPermissionsSelectedMember = (state: ApplicationState, value: MemberSummary) => {
        const newState = Object.assign({}, state);
        if (!newState.permissions) newState.permissions = new PermissionsState();
        newState.permissions.selectedMember = value;
        return newState;
    }

    private clearPermissionsBeneficiaryAccounts = (state: ApplicationState) => {
        const newState = Object.assign({}, state);
        if (!newState.permissions) newState.permissions = new PermissionsState();
        newState.permissions.beneficiaryAccounts = [];
        return newState;
    }

    private setPermissionsBeneficiaryAccounts = (state: ApplicationState, value: BeneficiaryAccount[]) => {
        const newState = Object.assign({}, state);
        if (!newState.permissions) newState.permissions = new PermissionsState();

        let results = newState.permissions.beneficiaryAccounts
            ? [...newState.permissions.beneficiaryAccounts, ...value]
            : [...value];

        newState.permissions.beneficiaryAccounts = results.filter((item, index) => results.indexOf(item) === index);
        return newState;
    }

    private clearRequests = (state: ApplicationState) => {
        const newState = Object.assign({}, state);
        newState.requests = null;
        return newState;
    }

    private setRequestsSelectedBusiness = async (state: ApplicationState, value: CustomerBusinessLookup) => {
        const newState = Object.assign({}, state);
        if (!newState.requests) newState.requests = new ManageRequestsState();

        newState.requests.selectedBusiness = value;

        return newState;
    }

    private clearBulkPayments = (state: ApplicationState) => {
        const newState = Object.assign({}, state);
        newState.payments = new PaymentState({bulk: new PaymentBulkState()});
        return newState;
    }

    private setBulkPayments = (state: ApplicationState, fileName: string, fileContents: string) => {
        const newState = Object.assign({}, state);
        if (!newState.payments) newState.payments = new PaymentState({bulk: new PaymentBulkState()});
        newState.payments.bulk.csvFileName = fileName;
        newState.payments.bulk.csvContents = fileContents;
        return newState;
    }

    private clearBulkBeneficiaries = (state: ApplicationState) => {
        const newState = Object.assign({}, state);
        newState.beneficiaries = new BeneficiaryState({bulk: new BeneficiaryBulkState()});
        return newState;
    }

    private setBulkBeneficiaries = (state: ApplicationState, fileName: string, fileContents: string) => {
        const newState = Object.assign({}, state);
        if (!newState.beneficiaries) newState.beneficiaries = new BeneficiaryState({bulk: new BeneficiaryBulkState()});
        newState.beneficiaries.bulk.csvFileName = fileName;
        newState.beneficiaries.bulk.csvContents = fileContents;
        return newState;
    }

    private dismissBannerNotifications = async (state: ApplicationState, banner: OnlineAccountApi.BannerNotification) => {
        const newState = Object.assign({}, state);

        if (newState?.banners === null)
            newState.banners = new BannerNotificationState();

        newState.banners.dismissed.push(banner);
        newState.banners.live = newState.banners.live.filter(x => x.ern != banner.ern)

        return newState;
    }

    private fetchBannerNotifications = async (state: ApplicationState) => {
        const newState = Object.assign({}, state);

        if (newState?.banners === null)
            newState.banners = new BannerNotificationState();

        let response: GetBannerNotificationsResponse;
        if (newState.authentication?.user?.bearerToken?.length) {
            // Hit Private Route
            response = await Container.instance.get(ServiceClients).onlineAccountApi.get(new GetAuthBannerNotifications());
        } else {
            // Hit Public Route
            response = await Container.instance.get(ServiceClients).onlineAccountApi.get(new GetBannerNotifications());
        }

        newState.banners.live = response?.results !== null
            ? response.results.filter(value => !newState.banners.dismissed.some(x => x.ern === value.ern && (x.modifiedDate || x.createdDate) >= (value.modifiedDate || value.createdDate)))
            : [];

        newState.banners.system = response?.results !== null
            ? response.results.filter(value => value.suspendActivity)
            : [];

        newState.banners.live = newState.banners.live.filter(x => !x.suspendActivity);

        if (!newState.banners.system.length) {
            Container.instance.get(Utils).systemMaintenance = false;
            return newState;
        }

        Container.instance.get(Utils).systemMaintenance = true;

        if (newState.authentication?.user?.bearerToken?.length) {
            kendo.alert(`You have been logged off as the system is going down for maintenance.`);
            Container.instance.get(AuthService).logoutUser();
            return;
        }

        let router = Container.instance.get(Router);
        router.reset();

        return newState;
    }

    private reloadMailbox = async (state: ApplicationState) => {
        const newState = Object.assign({}, state);
        let fetchMailboxState = await this.fetchMailboxes(newState);
        let fetchMailboxSubjectState = await this.fetchMailboxSubjects(fetchMailboxState);
        if (fetchMailboxSubjectState.messaging.selectedConversation?.unread) this.eventService.publish('selected:message:refresh', new Date().getTime())

        return Object.assign({}, fetchMailboxSubjectState);
    }

    private getMailboxCounterparty = (counterPartyERN) => {
        let userMailbox = Enumerable.from(this.state.messaging.userMailboxes).firstOrDefault(x => x.ern == counterPartyERN);
        let systemMailbox = Enumerable.from(this.state.messaging.systemMailboxes).firstOrDefault(x => x.ern == counterPartyERN);
        return userMailbox?.owner.name || userMailbox?.owner.email || userMailbox?.owner.code || systemMailbox?.owner.name || systemMailbox?.owner.email || systemMailbox?.owner.code || '<Private>';
    }

    private fetchMailboxes = async (state: ApplicationState) => {
        const newState = Object.assign({}, state);
        if (!environment().features['mailbox']) return newState;

        if (!newState.messaging) newState.messaging = new Messaging();

        try {
            let request = new ListMailboxRequest();
            let response = await Container.instance.get(ServiceClients).onlineAccountApi.get(request);
            let results = Enumerable.from(response.results);

            newState.messaging.userMailboxes = results
                .where(x => x.type === MailboxType.User)
                .toArray();

            newState.messaging.totalUnread = results
                .where(x => x.type === MailboxType.User)
                .sum(x => x.unread);

            newState.messaging.systemMailboxes = results
                .where(x => x.type !== MailboxType.User)
                .toArray();

            if (newState.messaging.userMailboxes.length === 1) {
                newState.messaging.selectedMailbox = newState.messaging.userMailboxes[0];
            }

            return newState;
        } catch (e) {
            return newState;
        }
    }

    private setMailbox = async (state: ApplicationState, mailbox: IMailbox) => {
        const newState = Object.assign({}, state);
        if (!environment().features['mailbox']) return newState;

        newState.messaging.selectedMailbox = mailbox;
        if (mailbox) {
            newState.messaging.mailboxView = 'Conversations';
        } else {
            newState.messaging.mailboxConversations = [];
        }
        return newState;
    }

    private fetchMailboxSubjects = async (state: ApplicationState) => {
        const newState = Object.assign({}, state);
        if (!environment().features['mailbox']) return newState;

        try {
            let request = new ListMailboxSubjectRequest({owner: state.messaging.selectedMailbox.ern});
            let response = await Container.instance.get(ServiceClients).onlineAccountApi.get(request);
            let results = Enumerable.from(response.results);
            newState.messaging.mailboxSubjects = results.toArray();
            newState.messaging.mailboxConversations = results
                .groupBy(x => Enumerable.from(x.owners).firstOrDefault(x => x !== this.state.messaging.selectedMailbox.ern))
                .select(x => new ConversationContext({
                        owner: {
                            ern: x.key(),
                            name: this.getMailboxCounterparty(x.key())
                        },
                        lwt: x.maxBy(xx => xx.messageCount?.writeTime).messageCount?.writeTime,
                        subjects: x.orderByDescending(xx => xx.messageCount?.writeTime).toArray(),
                        unread: x.sum(xx => xx.messageCount.unread)
                    })
                )
                .orderByDescending(x => x.lwt)
                .toArray();

            if (newState.messaging.selectedConversation) {
                newState.messaging.selectedConversation = newState.messaging.mailboxConversations.find(x => x.owner.ern === newState.messaging.selectedConversation.owner.ern);
            }

            return newState;
        } catch (e) {
            return newState;
        }
    }

    private setMailboxSubject = async (state: ApplicationState, subject: IMailboxSubject) => {
        const newState = Object.assign({}, state);
        if (!environment().features['mailbox']) return newState;

        newState.messaging.selectedSubject = subject;
        if (subject) {
            newState.messaging.mailboxView = 'Messages';
        } else {
            newState.messaging.mailboxMessages = [];
        }
        return newState;
    }

    private setMailboxConversation = async (state: ApplicationState, context: ConversationContext) => {
        const newState = Object.assign({}, state);
        if (!environment().features['mailbox']) return newState;

        newState.messaging.selectedConversation = context;
        if (context) {
            newState.messaging.mailboxView = 'Subjects';
        } else {
            newState.messaging.mailboxSubjects = [];
        }
        return newState;
    }

    private fetchMailboxMessages = async (state: ApplicationState) => {
        const newState = Object.assign({}, state);
        if (!environment().features['mailbox']) return newState;

        try {
            let request = new ListMailboxMessageRequest({
                mailboxERN: state.messaging.selectedMailbox.ern,
                subjectERN: state.messaging.selectedSubject.ern
            });
            let response = await Container.instance.get(ServiceClients).onlineAccountApi.get(request);
            newState.messaging.mailboxMessages = response.results;
            return newState;
        } catch (e) {
            return newState;
        }
    }

    private setMailboxFilter = async (state: ApplicationState, mailboxFilter: string) => {
        const newState = Object.assign({}, state);
        try {
            newState.messaging.mailboxFilter = mailboxFilter;
            return newState;
        } catch (e) {
            return newState;
        }
    }

    private setMailboxMessages = async (state: ApplicationState, value: any) => {
        const newState = Object.assign({}, state);
        try {
            if (!value) {
                newState.messaging.mailboxMessages = [];
            }
            return newState;
        } catch (e) {
            return newState;
        }
    }

    private setMailboxView = async (state: ApplicationState, view: string) => {
        const newState = Object.assign({}, state);
        try {
            newState.messaging.mailboxView = view;
            newState.messaging.mailboxFilter = null;
            return newState;
        } catch (e) {
            return newState;
        }
    }

    private resetNotificationsContext = async (state: ApplicationState) => {
        const newState = Object.assign({}, state);
        try {
            this.eventService.publish("update:auto:logoff:timeout", null);
            newState.notifications = new Notifications();
            return newState;
        } catch (e) {
            return newState;
        }
    }

    private setNotificationsContext = async (state: ApplicationState, principal: { text: string, value: string }) => {
        const newState = Object.assign({}, state);
        try {
            this.eventService.publish("update:auto:logoff:timeout", null);
            newState.notifications.principal = principal;
            return newState;
        } catch (e) {
            return newState;
        }
    }

    private setGoFast = async (state: ApplicationState, goFast: boolean | null) => {
        const newState = Object.assign({}, state);
        try {
            newState.goFast = goFast === true;
            return newState;
        } catch (e) {
            return newState;
        }
    }

    private refreshNotifications = async (state: ApplicationState, ern: string) => {
        const newState = Object.assign({}, state);
        try {
            if (newState.notifications.principal.value !== ern) return newState;
            this.eventService.publish("refresh:notifications", null);
            return newState;
        } catch (e) {
            return newState;
        }
    }

    private addNotificationProfile = async (state: ApplicationState, raw) => {
        const newState = Object.assign({}, state);
        try {
            this.eventService.publish("update:auto:logoff:timeout", null);
            let destination = raw ? `${newState.notifications.add.principal.ern}${raw}` : `${newState.notifications.add.principal.ern}`;
            let profileEvent = newState.notifications.profile.events.find(x => x.event == newState.notifications.add.event.name);
            if (!profileEvent) {
                profileEvent = new OnlineAccountApi.NotificationProfileEvent({
                    event: newState.notifications.add.event.name,
                    destination: []
                });
                newState.notifications.profile.events.push(profileEvent)
            }

            profileEvent.destination = [...profileEvent.destination.filter(x => x !== destination), ...[destination]];

            // if (!raw) newState.notifications.profile.events[newState.notifications.add.event.name][newState.notifications.add.principal.ern] = null;
            // else newState.notifications.profile.events[newState.notifications.add.event.name][`${newState.notifications.add.principal.ern}${raw}`] = null;
            return newState;
        } catch (e) {
            return newState;
        }
    }

    private delNotificationProfile = async (state: ApplicationState, event: string, subscriber: { name: string, text: string }) => {
        const newState = Object.assign({}, state);
        try {
            this.eventService.publish("update:auto:logoff:timeout", null);
            let profileEvent = newState.notifications.profile.events.find(x => x.event == event);
            if (!profileEvent) {
                profileEvent = new OnlineAccountApi.NotificationProfileEvent({
                    event: event as NotificationEvent,
                    destination: []
                });
                newState.notifications.profile.events.push(profileEvent)
            }
            profileEvent.destination = [...profileEvent.destination.filter(x => x !== subscriber.name)];
            return newState;
        } catch (e) {
            return newState;
        }
    }

    private toggleNotificationProfileDelivery = async (state: ApplicationState, event: string, input: NotificationDelivery) => {
        const newState = Object.assign({}, state);
        try {
            this.eventService.publish("update:auto:logoff:timeout", null);

            if (!event || !input) return newState;
            if (!newState.notifications.profile.ern.includes('::Customer::')) return newState;

            let profileEvent = newState.notifications.profile.events.find(x => x.event === event);
            if (!profileEvent.destination.includes(input)) profileEvent.destination.push(input);
            else profileEvent.destination = [...profileEvent.destination.filter(x => x !== input)];
            setTimeout(() => this.eventService.publish("refresh:notifications:dirty", null), 500);
            return newState;
        } catch (e) {
            return newState;
        }
    }

    private setNotificationsProfile = async (state: ApplicationState, profile: NotificationProfile) => {
        const newState = Object.assign({}, state);
        try {
            this.eventService.publish("update:auto:logoff:timeout", null);
            newState.notifications.profile = profile;
            if (profile?.meta?.TransactionNotifications)
                newState.notifications.transaction = Container.instance.get(JsvService).parse(profile.meta.TransactionNotifications);
            return newState;
        } catch (e) {
            return newState;
        }
    }

    private setNotificationsBusiness = async (state: ApplicationState, businessSummary: BusinessSummary) => {
        const newState = Object.assign({}, state);
        try {
            this.eventService.publish("update:auto:logoff:timeout", null);
            newState.notifications.business = businessSummary;
            return newState;
        } catch (e) {
            return newState;
        }
    }

    private setNotificationsBusinessEvent = async (state: ApplicationState, businessEvent: { name: NotificationEvent, text: string }) => {
        const newState = Object.assign({}, state);
        try {
            this.eventService.publish("update:auto:logoff:timeout", null);
            if (!newState.notifications.add) newState.notifications.add = new AddBusinessNotification();
            newState.notifications.add.event = businessEvent || {name: null, text: null};
            return newState;
        } catch (e) {
            return newState;
        }
    }

    private setNotificationsBusinessPrincipal = async (state: ApplicationState, businessPrincipal: { name: string, ern: string }) => {
        const newState = Object.assign({}, state);
        try {
            this.eventService.publish("update:auto:logoff:timeout", null);
            if (!newState.notifications.add) newState.notifications.add = new AddBusinessNotification();
            newState.notifications.add.principal = businessPrincipal || {name: null, ern: null};
            return newState;
        } catch (e) {
            return newState;
        }
    }
    private addNotificationProfileTransaction = async (state: ApplicationState, event: OnlineAccountApi.TransactionNotificationEvent) => {
        const newState = Object.assign({}, state);
        try {
            this.eventService.publish("update:auto:logoff:timeout", null);
            if (!newState.notifications.transaction) newState.notifications.transaction = new OnlineAccountApi.TransactionNotifications({events: []});
            (event as any).editMode = true;
            newState.notifications.transaction.events.push(event);
            return newState;
        } catch (e) {
            return newState;
        }
    }

    private replaceNotificationProfileTransaction = async (state: ApplicationState, newEvent: OnlineAccountApi.TransactionNotificationEvent, oldEvent: OnlineAccountApi.TransactionNotificationEvent) => {
        const newState = Object.assign({}, state);
        try {
            this.eventService.publish("update:auto:logoff:timeout", null);
            if (!newState.notifications.transaction) newState.notifications.transaction = new OnlineAccountApi.TransactionNotifications({events: []});
            let findIdx = newState.notifications.transaction.events.indexOf(oldEvent);
            if (findIdx !== -1) newState.notifications.transaction.events.splice(findIdx, 1, newEvent);
            setTimeout(() => this.eventService.publish("refresh:notifications:dirty", null), 500);
            return newState;
        } catch (e) {
            return newState;
        }
    }

    private delNotificationProfileTransaction = async (state: ApplicationState, event: OnlineAccountApi.TransactionNotificationEvent) => {
        const newState = Object.assign({}, state);
        try {
            this.eventService.publish("update:auto:logoff:timeout", null);
            if (!newState.notifications.transaction) newState.notifications.transaction = new OnlineAccountApi.TransactionNotifications({events: []});
            let findIdx = newState.notifications.transaction.events.indexOf(event);
            if (findIdx !== -1) newState.notifications.transaction.events.splice(findIdx, 1);
            return newState;
        } catch (e) {
            return newState;
        }
    }

    private getAuthDevices = async (state: ApplicationState) => {
        const newState = Object.assign({}, state);

        let response = await Container.instance.get(ServiceClients).onlineAccountApi.get(new OnlineAccountApi.GetAuthDevicesRequest());
        newState.authentication.devices = response.results;

        return newState;
    }

    private loadCertificates = async (state: ApplicationState) => {
        const newState = Object.assign({}, state);

        let response: ListPkiCertificatesResponse = await Container.instance.get(ServiceClients).onlineAccountApi.get(new ListPkiCertificatesRequest({userAuthId: this.state.customerSummary.userAuthId}))

        newState.certificates = response.results;

        return newState;
    }

    // @leonid: define your actions under this line using pattern above
    private getCRAModel = async (state: ApplicationState) => {
        const newState = Object.assign({}, state);

        // @Leonid, this should all be in state, which will preserve itself in session storage automatically.
        const modelSavedInSessionStorage = sessionStorage.getItem('model');

        if (!modelSavedInSessionStorage) {
            newState.cra.model = <any>modelJSON;
        } else {
            newState.cra.model = JSON.parse(modelSavedInSessionStorage);
        }

        return newState;
    }

    private getCRACountries = async (state: ApplicationState) => {
        const newState = Object.assign({}, state);

        // @Leonid, these should be loaded once from the service.  We no longer need these json files.
        newState.cra.countries = <any>countriesJSON;

        return newState;
    }

    private getCRAIndustries = async (state: ApplicationState) => {
        const newState = Object.assign({}, state);

        // @Leonid, these should be loaded once from the service.  We no longer need these json files.
        newState.cra.industries = <any>industriesJSON;

        return newState;
    }

    private setCRAModel = async (state: ApplicationState, model) => {
        const newState = Object.assign({}, state);

        // Let's show the auto-logoff service we are still alive.
        // You can place this line at places where we are getting user interaction to extend the auto-logoff timeout.
        this.eventService.publish("update:auto:logoff:timeout", null);

        sessionStorage.setItem('model', JSON.stringify(model));

        newState.cra.model = model;

        return newState;
    }

    // @leonid: define your actions above this line using pattern above

}
