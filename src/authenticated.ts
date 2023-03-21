import {ApplicationInsights} from '@microsoft/applicationinsights-web'
import {autoinject, Container} from 'aurelia-framework';
import {PLATFORM} from "aurelia-pal";
import {NavigationInstruction, Router, RouterConfiguration} from "aurelia-router";
import {dispatchify} from "aurelia-store";
import bsBreakpoints from 'bs-breakpoints'
import * as $ from 'jquery';
import {BaseRouter} from "./bases/base-router";
import {AutoLogoffService} from './common/services/auto-logoff-service';
import {
    canAuthorizeBusiness,
    canAuthorizePayments,
    canManageBusiness,
    canManageNotifications,
    canManageRiskProfiles,
    canManageWebhooks,
    canUsePki,
    filterClearBankAccounts,
    filterLocalAccounts,
    filterManagedAccounts,
    hasAccounts,
    hasBeneficiaryAccounts,
    hasMultipleAccounts
} from "./common/services/shared";
import {WebSocketService} from "./common/services/web-socket-service";
import environment from "./environment";
import {NavbarCustomElement} from "./resources/elements/components/site/navbar/navbar";

@autoinject
export class AuthenticatedRouter extends BaseRouter {
    router: Router;
    initializing: Promise<boolean>;
    initialized: boolean;

    constructor(private wss: WebSocketService, private autoLogoff: AutoLogoffService, private applicationInsights: ApplicationInsights, ...args) {
        super(...args);
        let userAuthId = this.utils.getPropertyValue<string>(this.state, '.authentication.user.userId')
        let userName = this.utils.getPropertyValue<string>(this.state, '.authentication.user.userName')
        this.applicationInsights.setAuthenticatedUserContext(userAuthId);
        this.applicationInsights.trackEvent({
            name: `${environment().appName} Authenticated Router Loaded`,
            properties: {message: `User ${userAuthId} (${userName}) logged in @ ${new Date().toISOString()}`}
        });

        // goFastAll
        if (environment().features['goFastAll']) {
            dispatchify('setGoFast')(true);
        }
    }

    attached() {
        $(function () {
            $(window).on('init.bs.breakpoint', function (e: any) {
                dispatchify('setBreakpoint')(e.breakpoint);
            });
            $(window).on('new.bs.breakpoint', function (e: any) {
                dispatchify('setBreakpoint')(e.breakpoint);
            });
            bsBreakpoints.init()
        })
    }

    async activate() {
        return await this.initializeAsync(true);
    }

    async initializeAsync(force) {
        if (this.initializing) return this.initializing;
        if (this.initialized && !force) return Promise.resolve(this.initialized);

        let _this = this;
        this.initializing = new Promise<boolean>(async (resolve, reject) => {
            try {
                // initialize essential services
                await Promise.all([this.autoLogoff.initializeAsync(), this.auth.initializeAsync(), dispatchify('fetchEnumTypes')(), dispatchify('fetchMailboxes')()]);
                await dispatchify("appInitialized")();
                resolve((_this.initialized = true));
            } catch (err) {
                console.log(err);
                reject(err);
            } finally {
                this.initializing = null;
            }
        });

        return this.initializing;
    }

    async configureRouter(config: RouterConfiguration, router: Router): Promise<any> {
        let _this = this;
        this.router = router;

        await dispatchify("updateCustomerSummary")();

        if (this.dataStore.state.customerSummary.accounts.some(x => x.code.length > 12) && !(this.dataStore.state.documentTypes && this.dataStore.state.documentTypes.length)) {
            dispatchify('fetchDocumentTypes')();
        }

        let showDocumentsMenu = this.state.customerSummary.accounts
            .filter(filterLocalAccounts())
            .filter(filterClearBankAccounts())
            .concat(this.state.customerSummary.accounts
                .filter(filterManagedAccounts(['View Account Documents']))
                .filter(filterClearBankAccounts())).length > 0;

        let riskAssessmentOnly = canManageRiskProfiles(this.state);
        if (riskAssessmentOnly && this.state.customerSummary.accounts.length) riskAssessmentOnly = false;

        let routes = [
            {
                route: "",
                redirect: riskAssessmentOnly ? 'risk/welcome' : 'accounts',
            },
            {
                route: "accounts",
                name: "accounts",
                moduleId: PLATFORM.moduleName("./routes/authenticated/account/accounts"),
                nav: true,
                title: "Accounts",
                settings: {
                    icon: "fa fa-list-alt fa-lg fa-fw",
                    auth: (): boolean => !riskAssessmentOnly
                }
            },


            {
                route: "risk-assessments-menu",
                name: "risk-assessments-menu",
                redirect: null,
                nav: true,
                title: "Risk Assessments",
                settings: {
                    icon: "fa-solid fa-id-card",
                    auth: (): boolean => canManageRiskProfiles(this.state) && environment().features['riskAssessment']
                }
            },
            {
                route: "risk/welcome",
                name: "risk-welcome",
                moduleId: PLATFORM.moduleName("./routes/authenticated/risk/risk-landing"),
                nav: true,
                title: "Getting started",
                settings: {
                    parent: 'risk-assessments-menu',
                    icon: "fa-solid fa-magnifying-glass-chart fa-lg fa-fw",
                    auth: (): boolean => canManageRiskProfiles(this.state) && environment().features['riskAssessment']
                }
            },
            {
                route: "risk/config",
                name: "risk-configuration",
                moduleId: PLATFORM.moduleName("./routes/authenticated/risk/risk-config"),
                nav: true,
                title: "Risk Configuration",
                settings: {
                    parent: 'risk-assessments-menu',
                    icon: "fa-solid fa-clipboard-check fa-lg fa-fw",
                    auth: (): boolean => canManageRiskProfiles(this.state) && environment().features['riskAssessment']
                }
            },
            {
                route: "risk/profiles",
                name: "risk-profile-manager",
                moduleId: PLATFORM.moduleName("./routes/authenticated/risk/risk-profile-manager"),
                nav: true,
                title: "Risk Model Builder",
                settings: {
                    parent: 'risk-assessments-menu',
                    icon: "fa-solid fa-list-alt fa-lg fa-fw",
                    auth: (): boolean => canManageRiskProfiles(this.state) && environment().features['riskAssessment']
                }
            },
            {
                route: "risk/lists",
                name: "risk-list-manager",
                moduleId: PLATFORM.moduleName("./routes/authenticated/risk/risk-list-manager"),
                nav: true,
                title: "Risk List Builder",
                settings: {
                    parent: 'risk-assessments-menu',
                    icon: "fa-solid fa-table-list fa-lg fa-fw",
                    auth: (): boolean => canManageRiskProfiles(this.state) && environment().features['riskAssessment']
                }
            },
            {
                route: "risk/bwra",
                name: "risk-bwra-manager",
                moduleId: PLATFORM.moduleName("./routes/authenticated/risk/bwra-profile-manager"),
                nav: true,
                title: "Business Wide Risk Assessment",
                settings: {
                    parent: 'risk-assessments-menu',
                    icon: "fa-solid fa-city fa-lg fa-fw",
                    auth: (): boolean => canManageRiskProfiles(this.state) && environment().features['riskAssessment']
                }
            },
            {
                route: "risk/cra",
                name: "risk-cra-manager",
                moduleId: PLATFORM.moduleName("./routes/authenticated/risk/cra-profile-manager"),
                nav: true,
                title: "Customer Risk Assessment",
                settings: {
                    parent: 'risk-assessments-menu',
                    icon: "fa-solid fa-users fa-lg fa-fw",
                    auth: (): boolean => canManageRiskProfiles(this.state) && environment().features['riskAssessment']
                }
            },


            {
                route: "payments-menu",
                name: "payments-menu",
                redirect: null,
                nav: true,
                title: "Payments",
                settings: {
                    icon: "fas fa-money-check-alt fa-lg fa-fw",
                    auth: (): boolean => hasAccounts(this.dataStore.state)
                }
            },
            {
                route: "payments/transfer",
                name: "payments-transfer",
                moduleId: PLATFORM.moduleName("./routes/authenticated/payments/transfer/payment-transfer"),
                nav: true,
                title: "Transfer Money",
                settings: {
                    parent: 'payments-menu',
                    icon: "fa fa-exchange-alt fa-lg fa-fw",
                    auth: (): boolean => hasMultipleAccounts(this.dataStore.state)
                }
            },
            {
                route: "payments/send",
                name: "payments-send",
                moduleId: PLATFORM.moduleName("./routes/authenticated/payments/send/payment-send"),
                nav: true,
                title: "Send Payment",
                settings: {
                    parent: 'payments-menu',
                    icon: "fa fa-sign-out-alt fa-lg fa-fw",
                }
            },
            {
                route: "payments/bulk",
                name: "payments-bulk",
                moduleId: PLATFORM.moduleName("./routes/authenticated/payments/bulk/payment-bulk"),
                nav: true,
                title: "Bulk Payment",
                settings: {
                    parent: 'payments-menu',
                    icon: "fa fa-sign-out-alt fa-lg fa-fw",
                    auth: (): boolean => true//environment().region !== 'prd'
                }
            },
            {
                route: "payments/authorize",
                name: "payments-authorize",
                moduleId: PLATFORM.moduleName("./routes/authenticated/payments/authorize/payment-authorize"),
                nav: true,
                title: "Authorize Payment",
                settings: {
                    parent: 'payments-menu',
                    icon: "fas fa-check-double fa-lg fa-fw",
                    auth: (): boolean => canAuthorizePayments(this.state)
                }
            },
            {
                route: "payments/beneficiaries",
                name: "payments-beneficiaries",
                moduleId: PLATFORM.moduleName("./routes/authenticated/payments/beneficiaries/payment-beneficiaries"),
                nav: true,
                title: "Manage Beneficiaries",
                settings: {
                    parent: 'payments-menu',
                    icon: "fa fa-users fa-lg",
                    auth: (): boolean => hasBeneficiaryAccounts(this.dataStore.state)
                }
            },
            {
                route: "beneficiaries/bulk",
                name: "beneficiaries-bull",
                moduleId: PLATFORM.moduleName("./routes/authenticated/payments/beneficiaries/bulk/bulk-beneficiaries"),
                nav: true,
                title: "Bulk Add Beneficiaries",
                settings: {
                    parent: 'payments-menu',
                    icon: "fa fa-users fa-lg",
                    auth: (): boolean => true
                }
            },
            {
                route: "payments/orders",
                name: "payments-orders",
                moduleId: PLATFORM.moduleName("./routes/authenticated/payments/orders/payment-orders"),
                nav: true,
                title: "View Payment Orders",
                settings: {
                    parent: 'payments-menu',
                    icon: "fas fa-receipt fa-lg fa-fw",
                }
            },

            {
                route: "documents-menu",
                name: "documents-menu",
                redirect: null,
                nav: true,
                title: "Documents",
                settings: {
                    icon: "fas fa-file-alt fa-lg fa-fw",
                    auth: (): boolean => showDocumentsMenu
                }
            },
            {
                route: "account/statements",
                name: "account-statements",
                moduleId: PLATFORM.moduleName("./routes/authenticated/account/statements"),
                nav: true,
                title: "View Account Statements",
                settings: {
                    parent: 'documents-menu',
                    icon: "fa fa-list-alt fa-lg fa-fw",
                    auth: (): boolean => showDocumentsMenu
                }
            },


            {
                route: "mailbox",
                name: "mailbox",
                moduleId: PLATFORM.moduleName("./routes/authenticated/customer/mailbox"),
                nav: true,
                title: "Mailbox",
                settings: {
                    icon: "fas fa-envelope fa-lg fa-fw",
                    auth: (): boolean => environment().features['mailbox']
                }
            },


            {
                route: "manage-menu",
                name: "manage-menu",
                redirect: null,
                nav: true,
                title: "Manage",
                settings: {
                    icon: "fas fa-tasks fa-lg fa-fw"
                }
            },
            {
                route: "manage/digital-certificates",
                name: "manage-digital-certificates",
                moduleId: PLATFORM.moduleName("./routes/authenticated/manage/pki/manage-digital-certificates"),
                nav: true,
                title: "Digital Certificates",
                settings: {
                    parent: 'manage-menu',
                    icon: "fas fa-fingerprint fa-lg fa-fw",
                    auth: (): boolean => canUsePki(this.state)
                }
            },
            {
                route: "manage/digital-certificates/generate",
                name: "generate-digital-certificates",
                moduleId: PLATFORM.moduleName("./routes/authenticated/manage/pki/generate-digital-certificates"),
                nav: false,
                title: "Generate Digital Certificate",
                settings: {
                    auth: (): boolean => canUsePki(this.state)
                }
            },
            {
                route: "manage/authenticator",
                name: "manage-authenticator",
                moduleId: PLATFORM.moduleName("./routes/authenticated/manage/authenticator/manage-authenticator"),
                nav: true,
                title: "Authenticator",
                settings: {
                    parent: 'manage-menu',
                    icon: "fas fa-user-lock fa-lg fa-fw",
                    auth: (): boolean => environment().debug
                }
            },
            {
                route: "manage/permissions",
                name: "manage-permissions",
                moduleId: PLATFORM.moduleName("./routes/authenticated/manage/permissions/manage-permissions"),
                nav: true,
                title: "Permissions",
                settings: {
                    parent: 'manage-menu',
                    icon: "fas fa-user-lock fa-lg fa-fw",
                    auth: (): boolean => canManageBusiness(this.state)
                }
            },
            {
                route: "manage/requests",
                name: "manage-requests",
                moduleId: PLATFORM.moduleName("./routes/authenticated/manage/requests/manage-requests"),
                nav: true,
                title: "Authorize Requests",
                settings: {
                    parent: 'manage-menu',
                    icon: "fas fa-check-double fa-lg fa-fw",
                    auth: (): boolean => canAuthorizeBusiness(this.state)
                }
            },
            {
                route: "manage/webhooks",
                name: "manage-webhooks",
                moduleId: PLATFORM.moduleName("./routes/authenticated/manage/webhooks/manage-webhooks"),
                nav: true,
                title: "Webhooks",
                settings: {
                    parent: 'manage-menu',
                    icon: "fa fa-bolt fa-lg fa-fw",
                    auth: (): boolean => canManageWebhooks(this.dataStore.state)
                }
            },
            {
                route: "manage/password",
                name: "manage-password",
                moduleId: PLATFORM.moduleName("./routes/authenticated/manage/password/manage-password"),
                nav: true,
                title: "Password",
                settings: {
                    parent: 'manage-menu',
                    icon: "fas fa-unlock-alt fa-lg fa-fw"
                }
            },
            {
                route: "manage/mfa",
                name: "manage-mfa",
                moduleId: PLATFORM.moduleName("./routes/authenticated/manage/mfa/manage-mfa"),
                nav: true,
                title: "MFA",
                settings: {
                    parent: 'manage-menu',
                    icon: "fas fa-key fa-lg fa-fw"
                }
            },
            {
                route: "manage/sms",
                name: "manage-sms",
                moduleId: PLATFORM.moduleName("./routes/authenticated/manage/sms/manage-sms"),
                nav: true,
                title: "SMS",
                settings: {
                    parent: 'manage-menu',
                    icon: "fas fa-sms fa-lg fa-fw"
                }
            },

            {
                route: "manage/business-notifications",
                name: "manage-business-notifications",
                moduleId: PLATFORM.moduleName("./routes/authenticated/manage/notifications/business-notifications"),
                nav: true,
                title: "Business Notifications",
                settings: {
                    parent: 'manage-menu',
                    icon: "fas fa-rss-square fa-lg fa-fw",
                    auth: (): boolean => environment().features['notifications'] && canManageNotifications(this.dataStore.state)
                }
            },
            {
                route: "manage/notifications",
                name: "manage-notifications",
                moduleId: PLATFORM.moduleName("./routes/authenticated/manage/notifications/customer-notifications"),
                nav: true,
                title: "Notifications",
                settings: {
                    parent: 'manage-menu',
                    icon: "fas fa-rss fa-lg fa-fw",
                    auth: (): boolean => environment().features['notifications']
                }
            },


            {
                route: "job/status",
                name: "job-status",
                moduleId: PLATFORM.moduleName("./routes/job/job-viewer"),
                nav: false,
                title: "Job Status",
                settings: {
                    icon: "fa-sign-out-alt"
                }
            },

        ].filter(r => {
            return (!(r['settings'] && r['settings']['auth'])) || r['settings'].auth();
        });

        config.mapUnknownRoutes((instruction: NavigationInstruction) => {
            return routes[0];
        });

        config.map(routes);

        await dispatchify("showNavbar")(true);
        await dispatchify("isAuthenticated")(true);

        Container.instance.get(NavbarCustomElement).buildMenu();
    }
}
