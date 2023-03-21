import {CustomerSummaryModel} from "./common/models/customer/customer-summary-model";
import {JwtClaim} from "./common/services/auth-service";
import {DocumentStoreApi} from "./dtos/documentstore-api.dtos";
import {AccountsState} from "./resources/elements/authenticated/account/accounts-state";
import {PermissionsState} from "./resources/elements/authenticated/manage/permissions/permissions-state";
import {ManageRequestsState} from "./resources/elements/authenticated/manage/requests/manage-requests-state";
import {WebhooksState} from "./resources/elements/authenticated/manage/webhooks/webhooks-state";
import {BeneficiaryState} from "./resources/elements/authenticated/payments/beneficiaries/beneficiary-state";
import {PaymentBulkState} from "./resources/elements/authenticated/payments/send/bulk/payment-bulk-state";
import {PaymentOrderState} from "./resources/elements/authenticated/payments/orders/payment-order-state";
import {PaymentSendState} from "./resources/elements/authenticated/payments/send/payment-send-state";
import {PaymentTransferState} from "./resources/elements/authenticated/payments/transfer/payment-transfer-state";
import {
    BannerNotificationState
} from "./resources/elements/components/site/banner-notifications/banner-notification-state";
import {RegistrationState} from "./resources/elements/unauthenticated/registration/registration-state";
import {CurrencyFormatValueConverter} from "./resources/value-converters/currency-format";
import {OnlineAccountApi} from "./dtos/onlineaccount-api.dtos";
import CustomerLimit = OnlineAccountApi.CustomerLimit;
import EnumPropertyValue = OnlineAccountApi.EnumPropertyValue;
import Job = OnlineAccountApi.Job;
import AuthDeviceSummary = OnlineAccountApi.AuthDeviceSummary;
import CertificateSummary = OnlineAccountApi.CertificateSummary;
import NotificationEvent = OnlineAccountApi.NotificationEvent;

//import MailboxConversations = OnlineAccountApi.Mailbox;

import { RiskProfileManagerState } from "resources/elements/authenticated/risk/risk-profile-manager-state";
import IMailbox = OnlineAccountApi.IMailbox;
import IMailboxSubject = OnlineAccountApi.IMailboxSubject;
import IMailboxMessage = OnlineAccountApi.IMailboxMessage;
export class ApplicationState {
    // selectedAccount: SelectedAccount = null;
    // webhooks: Array<WebhookSubscription> = [];
    accounts: AccountsState = new AccountsState();
    authentication: Authentication = new Authentication();
    banners: BannerNotificationState = new BannerNotificationState();
    beneficiaries: BeneficiaryState = null;
    breakpoint: BsBreakpoint = null;
    certificates: Array<CertificateSummary> = [];
    currentJob: Job = null;
    customerSpending: CustomerLimit = null;
    customerSummary: CustomerSummaryModel = null;
    documentTypes: Array<DocumentStoreApi.DocumentType> = null;
    emailAddress: string = null;
    enums: { [index: string]: EnumPropertyValue[]; }
    initialized: boolean = false;
    isAuthenticated: boolean = false;
    jobViewerERN: string;
    jobs: Array<Job> = [];
    notifications: Notifications = new Notifications();
    messaging: Messaging = new Messaging();
    mfaSetup: MfaSetup = null;
    mobilePhone: string = null;
    payments: PaymentState = null;
    permissions: PermissionsState = null;
    registration: RegistrationState = null;
    requests: ManageRequestsState = null;
    showNavbar: boolean = false;
    webhooks: WebhooksState = null;
    websocketOnline: boolean = false;
    goFast: boolean = false;
    cra: RiskProfileManagerState = {
        model: null,
        countries: [],
        industries: []
    };
}

export class Notifications {
    principal: { text: string, value: string };
    profile: OnlineAccountApi.NotificationProfile;
    business: OnlineAccountApi.BusinessSummary;
    add: AddBusinessNotification;
    transaction: OnlineAccountApi.TransactionNotifications;
}

export class AddBusinessNotification {
    event: { name: NotificationEvent, text: string }
    principal: { name: string, ern: string }
}

export class Messaging {
    systemMailboxes: Array<IMailbox> = [];
    userMailboxes: Array<IMailbox> = [];
    mailboxFilter: string;
    mailboxView: string = 'Conversations';
    selectedConversation: ConversationContext;
    mailboxConversations: Array<ConversationContext> = [];
    mailboxSubjects: Array<IMailboxSubject>;
    selectedMailbox: IMailbox;
    selectedSubject: IMailboxSubject;
    mailboxMessages: Array<IMailboxMessage>;
    totalUnread: number = 0;
}

export class ConversationContext {
    owner: { ern: string, name: string };
    subjects: Array<IMailboxSubject>;
    unread:number;
    lwt:number;

    constructor(init?: Partial<ConversationContext>) {
        (<any>Object).assign(this, init);
    }
}

export class PaymentState {
    transfer: PaymentTransferState;
    send: PaymentSendState;
    orders: PaymentOrderState;
    bulk: PaymentBulkState;

    constructor(init?: Partial<PaymentState>) {
        (<any>Object).assign(this, init);
    }
}


export class BsBreakpoint {
    constructor(public breakpoint: string, public bp: number) {
    }
}

export class Authentication {
    public user: OnlineAccountApi.AuthenticateResponse = null;
    public claims: Array<JwtClaim> = [];
    public attributes: any;
    public devices: Array<AuthDeviceSummary> = [];
}

export class MfaSetup {
    setupType: string;
    verificationCode: string;
}

export class SelectedAccount extends OnlineAccountApi.AccountSummary {
    displayName: string;
    public readonly isClearBankAccount: boolean;
    public readonly isInternalAccount: boolean;
    public readonly isManagedAccount: boolean;

    constructor(source: OnlineAccountApi.AccountSummary) {
        super();
        Object.assign(this, source);

        if (this.code) {
            this.displayName = `${this.code}   ${new CurrencyFormatValueConverter().toView(this.availableBalance, this.currencySymbol)}`;
            this.isClearBankAccount = this.code.length > 12;
            this.isInternalAccount = (this.isClearBankAccount && (this.code.substr(8, 6) == '040476' || this.code.substr(8, 6) == '040477'))
            this.isManagedAccount = !!this.businessERN;
        }
    }

    displayAmount(value: number) {
        if (this.displayPoints && value)
            return `${parseFloat(value.toString()).toFixed(2)} ${this.currencySymbol}`;
        else if (value)
            return `${this.currencySymbol}${parseFloat(value.toString()).toFixed(2)}`;
    }
}

export class SelectedBeneficiary extends OnlineAccountApi.BeneficiarySummary {
    public readonly isInternalAccount: boolean;
    public readonly isManagedAccount: boolean;

    constructor(value?: (OnlineAccountApi.BeneficiarySummary | OnlineAccountApi.BeneficiaryAccount)) {
        super();
        Object.assign(this, value);

        this.isInternalAccount = this.GetInternalAccount();
    }

    private GetInternalAccount(): boolean {
        if (this.iban) return (this.iban.startsWith('GB') && this.iban.substr(8, 6) == '040476' || this.iban.substr(8, 6) == '040477');
        if (this.sortCode) return (this.sortCode == '040476' || this.sortCode == '040477')
        return false;
    }
}
