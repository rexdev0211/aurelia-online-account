/* Options:
Date: 2022-11-25 11:44:47
Version: 6.21
Tip: To override a DTO option, remove "//" prefix before updating
BaseUrl: https://localhost:5011
GlobalNamespace: OnlineAccountApi
//MakePropertiesOptional: False
AddServiceStackTypes: True
AddResponseStatus: True
//AddImplicitVersion: 
AddDescriptionAsComments: True
//IncludeTypes: 
//ExcludeTypes: 
DefaultImports: HashSet from "./hash-set",ConcurrentHashSet from "./concurrent-hashset",ConcurrentDictionary from "./concurrent-dictionary",SortedDictionary from "./sorted-dictionary",ObservableCollection from "./observable-collection",HttpStatusCode from "./http-status-codes",WebhookEvents from "./webhook-events",IList from "./i-list",IEnumerable from "./i-enumerable"
*/
import HashSet from "./hash-set";
import ConcurrentHashSet from "./concurrent-hashset";
import ConcurrentDictionary from "./concurrent-dictionary";
import SortedDictionary from "./sorted-dictionary";
import ObservableCollection from "./observable-collection";
import HttpStatusCode from "./http-status-codes";
import WebhookEvents from "./webhook-events";
import IList from "./i-list";
import IEnumerable from "./i-enumerable";
export module OnlineAccountApi
{
    export interface IReturn<T>
    {
        createResponse(): T;
    }
    export interface IReturnVoid
    {
        createResponse(): void;
    }
    export interface IHasVersion
    {
        version: number;
    }
    export interface IHasBearerToken
    {
        bearerToken: string;
    }
    export interface IHasSessionId
    {
        sessionId: string;
    }
    export interface IPost
    {
    }
    export interface IGet
    {
    }
    export interface IHasUserAuthId
    {
        userAuthId: string;
    }
    export interface IHasUserName
    {
        userName: string;
    }
    export interface IHasPassword
    {
        password: string;
    }
    export interface IHasMfaVerificationCode
    {
        mfaVerificationCode: string;
    }
    export interface IHasEmailAddress
    {
        emailAddress: string;
    }
    export interface IHasEmailVerificationCode
    {
        emailVerificationCode: string;
    }
    export interface IHasSecuredAccessCode
    {
        securedAccessCode: string;
    }
    export interface IConfirmMfaPins
    {
        pin1: string;
        pin2: string;
    }
    export interface IHasCurrentPassword
    {
        currentPassword: string;
    }
    export interface IHasNewPassword
    {
        newPassword: string;
    }
    export interface ICsvImport
    {
        csvFileName: string;
        csvContents: string;
    }
    export interface IHasBeneficiaryERN
    {
        beneficiaryERN: string;
    }
    export interface IHasDocumentERN extends IIsERN
    {
        documentERN: string;
    }
    export interface IIsERN
    {
    }
    export interface IHasBeneficiaryAccountERN extends IIsERN
    {
        beneficiaryAccountERN: string;
    }
    export interface IHasERN extends IIsERN
    {
        ern: string;
    }
    export interface IHasAccountERN extends IIsERN
    {
        accountERN: string;
    }
    export class MongoEntity implements IMongoEntity
    {
        public id: string;
        public ern: string;
        public createdDate?: number;
        public modifiedDate?: number;
        public constructor(init?: Partial<MongoEntity>) { (Object as any).assign(this, init); }
    }
    export enum GenderType
    {
        Unspecified = 'Unspecified',
        Male = 'Male',
        Female = 'Female',
    }
    export enum BeneficiaryType
    {
        Person = 'Person',
        Business = 'Business',
        Other = 'Other',
    }
    export class Beneficiary extends MongoEntity implements IBeneficiary
    {
        public emailAddress: string;
        public countryOfOrigin: string;
        public countryOfResidence: string;
        public title: string;
        public firstName: string;
        public middleName: string;
        public lastName: string;
        public birthDate?: number;
        public gender: GenderType;
        public nickName: string;
        public mobilePhone: string;
        public workPhone: string;
        public homePhone: string;
        public riskScore?: number;
        public confidenceScore: number;
        public riskWeight: number;
        public overrideScore?: number;
        public overrideWeight?: number;
        public customerERN: string;
        public statusERN: string;
        public beneficiaryType: BeneficiaryType;
        public createdByERN: string;
        public accountName: string;
        public businessName: string;
        public meta: { [index: string]: string; };
        public constructor(init?: Partial<Beneficiary>) { super(init); (Object as any).assign(this, init); }
    }
    export class BeneficiaryWithDocumentERNs extends Beneficiary implements IHasDocumentERNs
    {
        public documentERNs: string[];
        public constructor(init?: Partial<BeneficiaryWithDocumentERNs>) { super(init); (Object as any).assign(this, init); }
    }
    export class BeneficiaryAccount extends MongoEntity implements IBeneficiaryAccount
    {
        public uban: string;
        public beneficiaryERN: string;
        public accountERN: string;
        public riskScore?: number;
        public confidenceScore: number;
        public riskWeight: number;
        public overrideScore?: number;
        public overrideWeight?: number;
        public swift: string;
        public bban: string;
        public iban: string;
        public bankName: string;
        public sortCode: string;
        public accountNumber: string;
        public accountName: string;
        public nickName: string;
        public accountHolder: string;
        public owners: string[];
        public hasOwners: boolean;
        public constructor(init?: Partial<BeneficiaryAccount>) { super(init); (Object as any).assign(this, init); }
    }
    export interface IHasBatchJobERN
    {
        batchJobERN: string;
    }
    export interface IHasNickName
    {
        nickName: string;
    }
    export interface IHasDocumentERNs
    {
        documentERNs: string[];
    }
    export interface IPaging extends IPage, ISkipTake
    {
    }
    export interface IPage
    {
        page?: number;
        pageSize?: number;
    }
    export interface ISkipTake
    {
        skip?: number;
        take?: number;
    }
    export interface IHasGetDelta
    {
        getDelta: boolean;
    }
    export interface IHasBusinessERN extends IIsERN
    {
        businessERN: string;
    }
    export interface IHasBusinessERNs
    {
        businessERNs: string[];
    }
    export interface IHasJobERN extends IIsERN
    {
        jobERN: string;
    }
    export interface ISmsVerification extends IHasSmsVerificationCode, IHasSendVerificationCode
    {
    }
    export interface IHasSmsVerificationCode
    {
        smsVerificationCode: string;
    }
    export interface IHasSendVerificationCode
    {
        sendVerificationCode: boolean;
    }
    export enum ACLOperations
    {
        Shareholder = 'Shareholder',
        Director = 'Director',
        Signatory = 'Signatory',
        Secretary = 'Secretary',
        Other = 'Other',
        UBO = 'UBO',
        Employee = 'Employee',
        ManagePermissions = 'ManagePermissions',
        ManagePermissionsAuthorize = 'ManagePermissionsAuthorize',
        ManagePermissionsRequest = 'ManagePermissionsRequest',
        ManageNotifications = 'ManageNotifications',
        ManageNotificationsAuthorize = 'ManageNotificationsAuthorize',
        ManageNotificationsRequest = 'ManageNotificationsRequest',
        Create = 'Create',
        Read = 'Read',
        Update = 'Update',
        Delete = 'Delete',
        BeneficiaryRead = 'BeneficiaryRead',
        BeneficiaryAdd = 'BeneficiaryAdd',
        BeneficiaryAddAuthorize = 'BeneficiaryAddAuthorize',
        BeneficiaryAddRequest = 'BeneficiaryAddRequest',
        BeneficiaryUpdate = 'BeneficiaryUpdate',
        BeneficiaryUpdateAuthorize = 'BeneficiaryUpdateAuthorize',
        BeneficiaryUpdateRequest = 'BeneficiaryUpdateRequest',
        BeneficiaryLink = 'BeneficiaryLink',
        BeneficiaryLinkAuthorize = 'BeneficiaryLinkAuthorize',
        BeneficiaryLinkRequest = 'BeneficiaryLinkRequest',
        BeneficiaryUnlink = 'BeneficiaryUnlink',
        BeneficiaryUnlinkAuthorize = 'BeneficiaryUnlinkAuthorize',
        BeneficiaryUnlinkRequest = 'BeneficiaryUnlinkRequest',
        CounterpartyManager = 'CounterpartyManager',
        RejectFunds = 'RejectFunds',
        RejectFundsAuthorize = 'RejectFundsAuthorize',
        RejectFundsRequest = 'RejectFundsRequest',
        SendFunds = 'SendFunds',
        SendFundsAuthorize = 'SendFundsAuthorize',
        SendFundsRequest = 'SendFundsRequest',
        SendFundsTransactionLimit = 'SendFundsTransactionLimit',
        SendFundsDailyLimit = 'SendFundsDailyLimit',
        SendFundsWeeklyLimit = 'SendFundsWeeklyLimit',
        SendFundsMonthlyLimit = 'SendFundsMonthlyLimit',
        SendFundsQuarterlyLimit = 'SendFundsQuarterlyLimit',
        SendFundsYearlyLimit = 'SendFundsYearlyLimit',
        TransferFunds = 'TransferFunds',
        TransferFundsAuthorize = 'TransferFundsAuthorize',
        TransferFundsRequest = 'TransferFundsRequest',
        TransferFundsTransactionLimit = 'TransferFundsTransactionLimit',
        TransferFundsDailyLimit = 'TransferFundsDailyLimit',
        TransferFundsWeeklyLimit = 'TransferFundsWeeklyLimit',
        TransferFundsMonthlyLimit = 'TransferFundsMonthlyLimit',
        TransferFundsQuarterlyLimit = 'TransferFundsQuarterlyLimit',
        TransferFundsYearlyLimit = 'TransferFundsYearlyLimit',
        ViewAccountDocuments = 'ViewAccountDocuments',
        RiskProfileManager = 'RiskProfileManager',
        RiskProfileManagerAuthorize = 'RiskProfileManagerAuthorize',
        RiskProfileManagerRequest = 'RiskProfileManagerRequest',
    }
    export interface IHasPrincipalERN extends IIsERN
    {
        principalERN: string;
    }
    export interface IHasAclOperation
    {
        aclOperation?: ACLOperations;
    }
    export interface IHasResourceERN extends IIsERN
    {
        resourceERN: string;
    }
    export interface IHasLimitValue
    {
        limitValue?: number;
    }
    export interface IHasCRC
    {
        crc: string;
    }
    export interface IHasMobilePhone
    {
        mobilePhone: string;
    }
    export interface IHasSendEmailVerificationCode
    {
        sendEmailVerificationCode: boolean;
    }
    export interface IHasSendSmsVerificationCode
    {
        sendSmsVerificationCode: boolean;
    }
    export enum AccountDocumentType
    {
        MonthlyAccountStatement = 'MonthlyAccountStatement',
        NightlyFeeStatement = 'NightlyFeeStatement',
    }
    export interface IHasAcno
    {
        acno: string;
    }
    export enum NotificationEvent
    {
        AccountEmailChanged = 'AccountEmailChanged',
        AccountPasswordChanged = 'AccountPasswordChanged',
        AccountSmsChanged = 'AccountSmsChanged',
        LoginFailed = 'LoginFailed',
        LoginSuccess = 'LoginSuccess',
        MessagingUnreadMessages = 'MessagingUnreadMessages',
        TransactionEvent = 'TransactionEvent',
    }
    export class NotificationProfileEvent
    {
        public event: NotificationEvent;
        public destination: string[];
        public constructor(init?: Partial<NotificationProfileEvent>) { (Object as any).assign(this, init); }
    }
    export class NotificationProfile extends MongoEntity
    {
        public meta: { [index: string]: string; };
        public events: NotificationProfileEvent[];
        public constructor(init?: Partial<NotificationProfile>) { super(init); (Object as any).assign(this, init); }
    }
    export interface IMongoEntity extends IHasERN, IDateTracking
    {
    }
    export interface IDateTracking extends IHasCreateDate, IHasModifiedDate
    {
    }
    export interface IHasCreateDate
    {
        createdDate?: number;
    }
    export interface IHasModifiedDate
    {
        modifiedDate?: number;
    }
    export interface IHasTransactionId
    {
        transactionId: string;
    }
    export interface IHasPendingTransactionERN extends IIsERN
    {
        pendingTransactionERN: string;
    }
    export class NoteMessage implements INoteMessage
    {
        public response: boolean;
        public principalERN: string;
        public createdDate?: number;
        public message: string;
        public fromEmailAddress: string;
        public constructor(init?: Partial<NoteMessage>) { (Object as any).assign(this, init); }
    }
    export interface INoteMessage extends IIsResponse, IHasPrincipalERN, IHasCreateDate, IHasMessage, IHasFromEmailAddress
    {
    }
    export interface IIsResponse
    {
        response: boolean;
    }
    export interface IHasMessage
    {
        message: string;
    }
    export interface IHasFromEmailAddress
    {
        fromEmailAddress: string;
    }
    export interface IHasCertificateThumbprint
    {
        certificateThumbprint: string;
    }
    export enum RiskModelState
    {
        Draft = 'Draft',
        Submitted = 'Submitted',
        Rejected = 'Rejected',
        Disabled = 'Disabled',
        Archived = 'Archived',
        Approved = 'Approved',
    }
    export enum RiskModelType
    {
        CRA = 'CRA',
        BWRA = 'BWRA',
    }
    export class RiskModelRecord implements IRiskModel
    {
        public ern: string;
        public createdDate?: number;
        public modifiedDate?: number;
        public owners: string[];
        public name: string;
        public riskScore?: number;
        public riskWeight?: number;
        public overrideScore?: number;
        public overrideWeight?: number;
        public version: number;
        public previousERN: string;
        public state: RiskModelState;
        public type: RiskModelType;
        public isTemplate: boolean;
        public meta: { [index: string]: Object; };
        public isModelValid: boolean;
        public constructor(init?: Partial<RiskModelRecord>) { (Object as any).assign(this, init); }
    }
    export interface IRiskModel extends IRedisOwner, IHasName, IHasRiskScore, IHasPreviousVersion, IMetaObj, IIsModelValid
    {
        state: RiskModelState;
        type: RiskModelType;
        isTemplate: boolean;
    }
    export interface IRedisOwner extends IHasERN, IHasOwners, IDateTracking
    {
    }
    export interface IHasOwners
    {
        owners: string[];
    }
    export interface IHasName
    {
        name: string;
    }
    export interface IHasRiskScore
    {
        riskScore?: number;
        riskWeight?: number;
        overrideScore?: number;
        overrideWeight?: number;
    }
    export interface IHasPreviousVersion extends IHasVersion
    {
        previousERN: string;
    }
    export interface IMetaObj
    {
        meta: { [index: string]: Object; };
    }
    export interface IIsModelValid
    {
        isModelValid: boolean;
    }
    export enum RiskAuditType
    {
        Created = 'Created',
        Updated = 'Updated',
        Deleted = 'Deleted',
        Submitted = 'Submitted',
        Disabled = 'Disabled',
        Approved = 'Approved',
    }
    export interface IHasOwner
    {
        owner: string;
    }
    export enum RiskResidualMethodType
    {
        AggregateMinusAggregate = 'AggregateMinusAggregate',
        ImpactMinusImpactLikelyMinusLikely = 'ImpactMinusImpactLikelyMinusLikely',
    }
    export enum RiskListCustomPropertyType
    {
        String = 'String',
        Risk = 'Risk',
        DateTime = 'DateTime',
        DateOnly = 'DateOnly',
        TimeOnly = 'TimeOnly',
        Integer = 'Integer',
        Decimal = 'Decimal',
        Boolean = 'Boolean',
        StringArray = 'StringArray',
        RiskArray = 'RiskArray',
        DateTimeArray = 'DateTimeArray',
        DateOnlyArray = 'DateOnlyArray',
        TimeOnlyArray = 'TimeOnlyArray',
        IntegerArray = 'IntegerArray',
        DecimalArray = 'DecimalArray',
        BooleanArray = 'BooleanArray',
        Country = 'Country',
        Industry = 'Industry',
        Product = 'Product',
    }
    export class RiskConfigRecord implements IRiskConfig
    {
        public ern: string;
        public createdDate?: number;
        public modifiedDate?: number;
        public owners: string[];
        public riskMatrix: number[];
        public maximumWeightAdjustment: number[];
        public riskReductionFloor: number[];
        public controlMethodLabel: string[];
        public riskImpactLabel: string[];
        public riskProbabilityLabel: string[];
        public residualRiskMethod: RiskResidualMethodType;
        public customPropertySchema: { [index: string]: RiskListCustomPropertyType; };
        public name: string;
        public constructor(init?: Partial<RiskConfigRecord>) { (Object as any).assign(this, init); }
    }
    export interface IRiskConfig extends IHasERN, IDateTracking, IHasOwners, IHasName, IHasCustomPropertySchema
    {
        riskMatrix: number[];
        maximumWeightAdjustment: number[];
        riskReductionFloor: number[];
        controlMethodLabel: string[];
        riskImpactLabel: string[];
        riskProbabilityLabel: string[];
        residualRiskMethod: RiskResidualMethodType;
    }
    export interface IHasCustomPropertySchema
    {
        customPropertySchema: { [index: string]: RiskListCustomPropertyType; };
    }
    export class RiskCategoryRecord implements IRiskCategory
    {
        public ern: string;
        public createdDate?: number;
        public modifiedDate?: number;
        public owners: string[];
        public name: string;
        public riskScore?: number;
        public riskWeight?: number;
        public overrideScore?: number;
        public overrideWeight?: number;
        public sortOrder: number;
        public constructor(init?: Partial<RiskCategoryRecord>) { (Object as any).assign(this, init); }
    }
    export interface IRiskCategory extends IHasERN, IDateTracking, IHasOwners, IHasName, IHasRiskScore, IHasSortOrder
    {
    }
    export interface IHasSortOrder
    {
        sortOrder: number;
    }
    export class RiskComponentRecord implements IRiskComponent
    {
        public ern: string;
        public createdDate?: number;
        public modifiedDate?: number;
        public owners: string[];
        public name: string;
        public riskScore?: number;
        public riskWeight?: number;
        public overrideScore?: number;
        public overrideWeight?: number;
        public sortOrder: number;
        public constructor(init?: Partial<RiskComponentRecord>) { (Object as any).assign(this, init); }
    }
    export interface IRiskComponent extends IHasERN, IDateTracking, IHasOwners, IHasName, IHasRiskScore, IHasSortOrder
    {
    }
    export enum RiskAnswerType
    {
        Answer = 'Answer',
        Industry = 'Industry',
        Country = 'Country',
        Product = 'Product',
        Matrix = 'Matrix',
    }
    export class RiskFactorRecord implements IRiskFactor
    {
        public ern: string;
        public createdDate?: number;
        public modifiedDate?: number;
        public owners: string[];
        public riskScore?: number;
        public riskWeight?: number;
        public overrideScore?: number;
        public overrideWeight?: number;
        public state: RiskModelState;
        public question: string;
        public answerType: RiskAnswerType;
        public sortOrder: number;
        public version: number;
        public previousERN: string;
        public constructor(init?: Partial<RiskFactorRecord>) { (Object as any).assign(this, init); }
    }
    export interface IRiskFactor extends IHasERN, IDateTracking, IHasOwners, IHasRiskScore, IHasPreviousVersion, IHasSortOrder
    {
        state: RiskModelState;
        question: string;
        answerType: RiskAnswerType;
    }
    export class RiskAnswerRecord implements IRiskAnswer
    {
        public ern: string;
        public createdDate?: number;
        public modifiedDate?: number;
        public owners: string[];
        public riskScore?: number;
        public riskWeight?: number;
        public overrideScore?: number;
        public overrideWeight?: number;
        public sortOrder: number;
        public description: string;
        public state: RiskModelState;
        public answer: string;
        public version: number;
        public previousERN: string;
        public constructor(init?: Partial<RiskAnswerRecord>) { (Object as any).assign(this, init); }
    }
    export interface IRiskAnswer extends IHasERN, IDateTracking, IHasOwners, IHasDescription, IHasRiskScore, IHasPreviousVersion, IHasSortOrder
    {
        state: RiskModelState;
        answer: string;
    }
    export interface IHasDescription
    {
        description: string;
    }
    export enum RiskOverrideOperatorType
    {
        AND = 'AND',
        OR = 'OR',
    }
    export enum RiskOverrideCompareSymbolType
    {
        LessThan = 'LessThan',
        LessThanEqual = 'LessThanEqual',
        Equal = 'Equal',
        GreaterThanEqual = 'GreaterThanEqual',
        GreaterThan = 'GreaterThan',
    }
    export class RiskOverrideTerm implements IRiskOverrideAdditionalTerms
    {
        public operator: RiskOverrideOperatorType;
        public factorERN: string;
        public compareSymbol: RiskOverrideCompareSymbolType;
        public riskValue: number;
        public additionalTerms: RiskOverrideTerm[];
        public constructor(init?: Partial<RiskOverrideTerm>) { (Object as any).assign(this, init); }
    }
    export class RiskOverrideRecord implements IRiskOverride
    {
        public ern: string;
        public createdDate?: number;
        public modifiedDate?: number;
        public owners: string[];
        public riskScore?: number;
        public riskWeight?: number;
        public overrideScore?: number;
        public overrideWeight?: number;
        public state: RiskModelState;
        public query: RiskOverrideTerm[];
        public description: string;
        public sortOrder: number;
        public version: number;
        public previousERN: string;
        public constructor(init?: Partial<RiskOverrideRecord>) { (Object as any).assign(this, init); }
    }
    export interface IRiskOverride extends IHasERN, IDateTracking, IHasOwners, IHasDescription, IHasRiskScore, IHasPreviousVersion, IHasSortOrder
    {
        state: RiskModelState;
        query: RiskOverrideTerm[];
    }
    export class KeyValuePair<TKey, TValue>
    {
        public key: TKey;
        public value: TValue;
        public constructor(init?: Partial<KeyValuePair<TKey, TValue>>) { (Object as any).assign(this, init); }
    }
    export class RiskModelAnswerKeyRecord implements IRiskModelAnswerKey
    {
        public ern: string;
        public createdDate?: number;
        public modifiedDate?: number;
        public owners: string[];
        public name: string;
        public modelType: RiskModelType;
        public answerKeyState: RiskModelState;
        public cra: ConcurrentDictionary<string, string>;
        public bwra: ConcurrentDictionary<string, number[]>;
        public isAnswerKeyValid: boolean;
        public digitalSignature: string;
        public principalERN: string;
        public meta: { [index: string]: Object; };
        public version: number;
        public previousERN: string;
        public constructor(init?: Partial<RiskModelAnswerKeyRecord>) { (Object as any).assign(this, init); }
    }
    export interface IRiskModelAnswerKey extends IHasERN, IDateTracking, IHasOwners, IHasName, IHasPreviousVersion, IHasPrincipalERN, IMetaObj, IHasDigitalSignature, IIsAnswerKeyValid
    {
        modelType: RiskModelType;
        answerKeyState: RiskModelState;
        cra: ConcurrentDictionary<string, string>;
        bwra: ConcurrentDictionary<string, number[]>;
    }
    export interface IHasDigitalSignature
    {
        digitalSignature: string;
    }
    export interface IIsAnswerKeyValid
    {
        isAnswerKeyValid: boolean;
    }
    export enum RiskListType
    {
        Customer = 'Customer',
        Supplier = 'Supplier',
        Agent = 'Agent',
        Employee = 'Employee',
        Property = 'Property',
        Other = 'Other',
    }
    export class RiskListRecord implements IRiskList
    {
        public ern: string;
        public createdDate?: number;
        public modifiedDate?: number;
        public owners: string[];
        public name: string;
        public externalId: string;
        public riskScore?: number;
        public riskWeight?: number;
        public overrideScore?: number;
        public overrideWeight?: number;
        public type: RiskListType;
        public customProperties: { [index: string]: string; };
        public meta: { [index: string]: Object; };
        public constructor(init?: Partial<RiskListRecord>) { (Object as any).assign(this, init); }
    }
    export interface IRiskList extends IRedisOwner, IHasName, IHasExternalId, IHasRiskScore, IMetaObj
    {
        type: RiskListType;
        customProperties: { [index: string]: string; };
    }
    export interface IHasExternalId
    {
        externalId: string;
    }
    export enum RiskSystemListType
    {
        Industry = 'Industry',
        Country = 'Country',
        Product = 'Product',
    }
    export class RiskAssessmentCalculation implements IRiskAssessmentCalculation
    {
        public originalRiskScore?: number;
        public question: string;
        public answer: string;
        public answerType: RiskAnswerType;
        public categoryWeight?: number;
        public componentWeight?: number;
        public factorWeight?: number;
        public rawQuery: string;
        public overrideTerms: OverrideTermAuditRecord[];
        public calculatedScore?: number;
        public calculatedRiskScore?: number;
        public finalRiskScore?: number;
        public riskScore?: number;
        public riskWeight?: number;
        public overrideScore?: number;
        public overrideWeight?: number;
        public constructor(init?: Partial<RiskAssessmentCalculation>) { (Object as any).assign(this, init); }
    }
    export class RiskAssessmentRecord implements IRiskAssessment
    {
        public ern: string;
        public createdDate?: number;
        public modifiedDate?: number;
        public owners: string[];
        public riskScore?: number;
        public riskWeight?: number;
        public overrideScore?: number;
        public overrideWeight?: number;
        public meta: { [index: string]: Object; };
        public assessmentType: RiskModelType;
        public assessmentState: RiskModelState;
        public assessmentTitle: string;
        public finalRiskScore?: number;
        public overriddenRiskScore?: number;
        public calculations: { [index: string]: RiskAssessmentCalculation; };
        public digitalSignature: string;
        public constructor(init?: Partial<RiskAssessmentRecord>) { (Object as any).assign(this, init); }
    }
    export interface IRiskAssessment extends IHasERN, IDateTracking, IHasOwners, IHasRiskScore, IMetaObj, IHasDigitalSignature
    {
        assessmentType: RiskModelType;
        assessmentState: RiskModelState;
        assessmentTitle: string;
        finalRiskScore?: number;
        overriddenRiskScore?: number;
        calculations: { [index: string]: RiskAssessmentCalculation; };
    }
    export interface IDateRange
    {
        from?: number;
        to?: number;
    }
    export enum ClearBankPaymentScheme
    {
        FPS = 'FPS',
        CHAPS = 'CHAPS',
    }
    export interface IHasAccountNumber
    {
        accountNumber: string;
    }
    export interface IHasBeneficiaryNickname
    {
        beneficiaryNickname: string;
    }
    export interface IHasAmount
    {
        amount: number;
    }
    export interface IPaymentReference extends IHasPaymentReference, IHasInternalReference
    {
        scheme: ClearBankPaymentScheme;
    }
    export interface IHasPaymentReference
    {
        paymentReference: string;
    }
    export interface IHasInternalReference
    {
        internalReference: string;
    }
    export interface IHasPaymentDate
    {
        paymentDate: number;
    }
    export interface IRequiresDigitalSignature extends IHasCertificateThumbprint
    {
    }
    export interface IMfaVerification
    {
        mfaVerificationCode: string;
    }
    export interface IHasToAccountERN extends IIsERN
    {
        toAccountERN: string;
    }
    export interface IHasNullablePaymentDate
    {
        paymentDate?: number;
    }
    export interface IHasToAccountCode
    {
        toAccountCode: string;
    }
    export class SubscriptionConfig
    {
        public url: string;
        public contentType: string;
        public secret: string;
        public constructor(init?: Partial<SubscriptionConfig>) { (Object as any).assign(this, init); }
    }
    export class WebhookSubscription implements IMongoEntity
    {
        public id: string;
        public name: string;
        public event: string;
        public isActive: boolean;
        public createdDateUtc: string;
        public createdById: string;
        public lastModifiedDateUtc: string;
        public config: SubscriptionConfig;
        public ern: string;
        public createdDate?: number;
        public modifiedDate?: number;
        public constructor(init?: Partial<WebhookSubscription>) { (Object as any).assign(this, init); }
    }
    export interface IHasCustomerERN extends IIsERN
    {
        customerERN: string;
    }
    export enum JobType
    {
        Test = 'Test',
        TestSchedule = 'TestSchedule',
        TestBatch = 'TestBatch',
        TestBatch2 = 'TestBatch2',
        ExecuteNightlyReports = 'ExecuteNightlyReports',
        ExecuteDailyCdeReport = 'ExecuteDailyCdeReport',
        ExecuteClearBankAccountsReport = 'ExecuteClearBankAccountsReport',
        ExecuteClearBankNonCustomerReport = 'ExecuteClearBankNonCustomerReport',
        ExecuteClearBankTransactionsReport = 'ExecuteClearBankTransactionsReport',
        ExecutePendingTransactionsReport = 'ExecutePendingTransactionsReport',
        ExecuteBlacklistReport = 'ExecuteBlacklistReport',
        ExecuteBeneficiaryReport = 'ExecuteBeneficiaryReport',
        ExecuteSanctionsReport = 'ExecuteSanctionsReport',
        ExecuteFeesReport = 'ExecuteFeesReport',
        ExecuteBillingReport = 'ExecuteBillingReport',
        ExecuteDocumentsReport = 'ExecuteDocumentsReport',
        UpsertStatus = 'UpsertStatus',
        UpsertInstitution = 'UpsertInstitution',
        UpsertKycCheckProfile = 'UpsertKycCheckProfile',
        UpsertProcessor = 'UpsertProcessor',
        UpsertProductOffer = 'UpsertProductOffer',
        UpsertIndustry = 'UpsertIndustry',
        UpsertCountry = 'UpsertCountry',
        UpsertProgramId = 'UpsertProgramId',
        RebuildVirtualView = 'RebuildVirtualView',
        UpdateBillingProfileProductOffer = 'UpdateBillingProfileProductOffer',
        UpdateBillingProfileAccount = 'UpdateBillingProfileAccount',
        ChangeBusinessStatus = 'ChangeBusinessStatus',
        AddBusiness = 'AddBusiness',
        AddBusinessProduct = 'AddBusinessProduct',
        ChangeBusinessContact = 'ChangeBusinessContact',
        AddBusinessBeneficiary = 'AddBusinessBeneficiary',
        BatchBeneficiaryAdd = 'BatchBeneficiaryAdd',
        UpdateBusinessBeneficiary = 'UpdateBusinessBeneficiary',
        LinkBusinessAccount = 'LinkBusinessAccount',
        UnlinkBusinessAccount = 'UnlinkBusinessAccount',
        LinkBusinessBeneficiary = 'LinkBusinessBeneficiary',
        UnlinkBusinessBeneficiary = 'UnlinkBusinessBeneficiary',
        LinkBusinessEntity = 'LinkBusinessEntity',
        UnlinkBusinessEntity = 'UnlinkBusinessEntity',
        GrantBusinessAcl = 'GrantBusinessAcl',
        DenyBusinessAcl = 'DenyBusinessAcl',
        RevokeBusinessAcl = 'RevokeBusinessAcl',
        DeleteBusiness = 'DeleteBusiness',
        ChangeCustomerStatus = 'ChangeCustomerStatus',
        AddCustomer = 'AddCustomer',
        AddCustomerProduct = 'AddCustomerProduct',
        ChangeCustomerContact = 'ChangeCustomerContact',
        MergeCustomer = 'MergeCustomer',
        DeleteCustomer = 'DeleteCustomer',
        ChangeAccountStatus = 'ChangeAccountStatus',
        ChangeAccountProductOffer = 'ChangeAccountProductOffer',
        BatchImportTransactions = 'BatchImportTransactions',
        ToggleAccountVisibility = 'ToggleAccountVisibility',
        ToggleAccountShowPending = 'ToggleAccountShowPending',
        AccountDirectDebitCreate = 'AccountDirectDebitCreate',
        AccountDirectDebitDelete = 'AccountDirectDebitDelete',
        AccountDirectDebitReturn = 'AccountDirectDebitReturn',
        AccountDirectDebitUpdate = 'AccountDirectDebitUpdate',
        ChangeCardStatus = 'ChangeCardStatus',
        RegenerateCard = 'RegenerateCard',
        RenewCard = 'RenewCard',
        ChangeCardGroup = 'ChangeCardGroup',
        Update3DSecure = 'Update3DSecure',
        ExecuteKycCheck = 'ExecuteKycCheck',
        ExecuteSanctionCheck = 'ExecuteSanctionCheck',
        ExecuteLegacySanctionCheck = 'ExecuteLegacySanctionCheck',
        ExecuteSanctionCheckUpdate = 'ExecuteSanctionCheckUpdate',
        LoadAccount = 'LoadAccount',
        UnloadAccount = 'UnloadAccount',
        BatchSendFunds = 'BatchSendFunds',
        SendFunds = 'SendFunds',
        SendFundsFor = 'SendFundsFor',
        SendFundsBka = 'SendFundsBka',
        TransferFunds = 'TransferFunds',
        TransferFundsFor = 'TransferFundsFor',
        TransferFundsBka = 'TransferFundsBka',
        ProcessAccountFee = 'ProcessAccountFee',
        ReversePendingTransaction = 'ReversePendingTransaction',
        ReleasePendingTransaction = 'ReleasePendingTransaction',
        ExecuteOutgoingTransactionMonitoringPipeline = 'ExecuteOutgoingTransactionMonitoringPipeline',
        UpdateVelocityLimits = 'UpdateVelocityLimits',
        TransactionMonitoringAddRule = 'TransactionMonitoringAddRule',
        TransactionMonitoringUpdateRule = 'TransactionMonitoringUpdateRule',
        TransactionMonitoringDeleteRule = 'TransactionMonitoringDeleteRule',
        TransactionMonitoringAddPreset = 'TransactionMonitoringAddPreset',
        TransactionMonitoringUpdatePreset = 'TransactionMonitoringUpdatePreset',
        TransactionMonitoringDeletePreset = 'TransactionMonitoringDeletePreset',
        CompliancePendingTransactionLock = 'CompliancePendingTransactionLock',
        CompliancePendingTransactionUnlock = 'CompliancePendingTransactionUnlock',
        CompliancePendingTransactionReset = 'CompliancePendingTransactionReset',
        ComplianceReleaseTransaction = 'ComplianceReleaseTransaction',
        ComplianceRejectTransaction = 'ComplianceRejectTransaction',
        ComplianceWhitelistTransaction = 'ComplianceWhitelistTransaction',
        ComplianceBlacklistTransaction = 'ComplianceBlacklistTransaction',
        ComplianceSetConfidenceScore = 'ComplianceSetConfidenceScore',
        ComplianceGrantBusinessAcl = 'ComplianceGrantBusinessAcl',
        ComplianceDenyBusinessAcl = 'ComplianceDenyBusinessAcl',
        ComplianceRevokeBusinessAcl = 'ComplianceRevokeBusinessAcl',
        AddRemitterWhitelist = 'AddRemitterWhitelist',
        UpdateRemitterWhitelist = 'UpdateRemitterWhitelist',
        ToggleRemitterWhitelist = 'ToggleRemitterWhitelist',
        AddRemitterBlacklist = 'AddRemitterBlacklist',
        UpdateRemitterBlacklist = 'UpdateRemitterBlacklist',
        ToggleRemitterBlacklist = 'ToggleRemitterBlacklist',
        AddBeneficiaryBlacklist = 'AddBeneficiaryBlacklist',
        UpdateBeneficiaryBlacklist = 'UpdateBeneficiaryBlacklist',
        ToggleBeneficiaryBlacklist = 'ToggleBeneficiaryBlacklist',
        AddDictionaryBlacklist = 'AddDictionaryBlacklist',
        UpdateDictionaryBlacklist = 'UpdateDictionaryBlacklist',
        ToggleDictionaryBlacklist = 'ToggleDictionaryBlacklist',
        NotificationProfiles = 'NotificationProfiles',
        NotificationTemplates = 'NotificationTemplates',
        ChangeCustomerIndustry = 'ChangeCustomerIndustry',
        ChangeBusinessIndustry = 'ChangeBusinessIndustry',
        RiskProfileManage = 'RiskProfileManage',
    }
    export interface IHasNullableJobType
    {
        type?: JobType;
    }
    export interface IHasJobInput
    {
        input: { [index: string]: string; };
    }
    export enum JobState
    {
        New = 'New',
        Scheduled = 'Scheduled',
        Running = 'Running',
        Cancelled = 'Cancelled',
        Failed = 'Failed',
        HasExceptions = 'HasExceptions',
        Succeeded = 'Succeeded',
    }
    export enum PendingApproval
    {
        Pending = 'Pending',
        Denied = 'Denied',
        Approved = 'Approved',
    }
    export interface IHasNullableJobState
    {
        state?: JobState;
    }
    export interface IHasNullablePendingApprovalState
    {
        approvalState?: PendingApproval;
    }
    export enum CounterpartAccountGenericIdentificationSchemeCode
    {
        BBAN = 'BBAN',
        CUID = 'CUID',
        UPIC = 'UPIC',
    }
    export class CounterpartAccountGenericIdentificationScheme
    {
        public code?: CounterpartAccountGenericIdentificationSchemeCode;
        public proprietary: string;
        public constructor(init?: Partial<CounterpartAccountGenericIdentificationScheme>) { (Object as any).assign(this, init); }
    }
    export class CounterpartAccountGenericIdentification
    {
        public issuer: string;
        public identification: string;
        public schemeName: CounterpartAccountGenericIdentificationScheme;
        public constructor(init?: Partial<CounterpartAccountGenericIdentification>) { (Object as any).assign(this, init); }
    }
    export class CounterpartAccountIdentification
    {
        public iban: string;
        public accountName: string;
        public sortCode: string;
        public accountNumber: string;
        public reference: string;
        public other: CounterpartAccountGenericIdentification;
        public constructor(init?: Partial<CounterpartAccountIdentification>) { (Object as any).assign(this, init); }
    }
    export class CounterpartAccount
    {
        public identification: CounterpartAccountIdentification;
        public constructor(init?: Partial<CounterpartAccount>) { (Object as any).assign(this, init); }
    }
    export enum MandateCreationRequestMandateType
    {
        PaperMandate = 'PaperMandate',
        Origination = 'Origination',
    }
    export class MandateCreationRequest
    {
        public accountId: string;
        public serviceUserNumber: string;
        public reference: string;
        public payerName: string;
        public counterpartAccount: CounterpartAccount;
        public mandateType?: MandateCreationRequestMandateType;
        public constructor(init?: Partial<MandateCreationRequest>) { (Object as any).assign(this, init); }
    }
    export class CreateAccountMandateRequest extends MandateCreationRequest
    {
        public constructor(init?: Partial<CreateAccountMandateRequest>) { super(init); (Object as any).assign(this, init); }
    }
    export interface IClearBankApiRequest
    {
    }
    export class DeleteAccountMandatesRequest
    {
        public accountId: string;
        public mandateId: string;
        public reasonCode: string;
        public constructor(init?: Partial<DeleteAccountMandatesRequest>) { (Object as any).assign(this, init); }
    }
    export class CreateAccountMandateReturnRequest
    {
        public accountId: string;
        public mandateId: string;
        public rejectionReason: string;
        public constructor(init?: Partial<CreateAccountMandateReturnRequest>) { (Object as any).assign(this, init); }
    }
    export class MandateAmendmentRequest implements IClearBankApiRequest
    {
        public accountId: string;
        public mandateId: string;
        public reasonCode: string;
        public newDebtorAccount: CounterpartAccount;
        public constructor(init?: Partial<MandateAmendmentRequest>) { (Object as any).assign(this, init); }
    }
    export class PatchAccountMandatesRequest extends MandateAmendmentRequest
    {
        public constructor(init?: Partial<PatchAccountMandatesRequest>) { super(init); (Object as any).assign(this, init); }
    }
    export interface IHasIBan
    {
        iBan: string;
    }
    export enum BusinessEntityType
    {
        SoleTrader = 'SoleTrader',
        PrivateLimitedCompany_ByShares = 'PrivateLimitedCompany_ByShares',
        PrivateLimitedCompany_ByGuarantee = 'PrivateLimitedCompany_ByGuarantee',
        PublicLimitedCompany = 'PublicLimitedCompany',
        UnlimitedCompany = 'UnlimitedCompany',
        GeneralPartnership = 'GeneralPartnership',
        LimitedLiabilityPartnership = 'LimitedLiabilityPartnership',
        LimitedPartnership = 'LimitedPartnership',
        ScottishLimitedPartnership = 'ScottishLimitedPartnership',
        CharitableIncorporateOrganisation = 'CharitableIncorporateOrganisation',
        CommunityInterestCompany = 'CommunityInterestCompany',
        IndustrialAndProvidentSociety = 'IndustrialAndProvidentSociety',
    }
    export enum IncorporationJurisdictionType
    {
        EnglandAndWales = 'EnglandAndWales',
        Scotland = 'Scotland',
        NorthernIreland = 'NorthernIreland',
        Ireland = 'Ireland',
        Spain = 'Spain',
        Germany = 'Germany',
        Estonia = 'Estonia',
        Denmark = 'Denmark',
        Gibraltar = 'Gibraltar',
        HongKong = 'HongKong',
        China = 'China',
        France = 'France',
        Netherlands = 'Netherlands',
        Belgium = 'Belgium',
        Sweden = 'Sweden',
        Finland = 'Finland',
        Latvia = 'Latvia',
        Malta = 'Malta',
        Portugal = 'Portugal',
        Italy = 'Italy',
        Switzerland_CantonZurich = 'Switzerland_CantonZurich',
        Switzerland_CantonBern = 'Switzerland_CantonBern',
        Switzerland_CantonZug = 'Switzerland_CantonZug',
    }
    export enum FATCAStatusType
    {
        PassiveNNFE = 'PassiveNNFE',
        ReportingNFFE = 'ReportingNFFE',
        DeemedComplianceFFI = 'DeemedComplianceFFI',
        ExceptedFFI = 'ExceptedFFI',
        Non_ParticipatingFFI = 'Non_ParticipatingFFI',
        ExemptBeneficialOwner = 'ExemptBeneficialOwner',
    }
    export interface IHasAccountTypeTag
    {
        accountTypeTag: string;
    }
    export interface IBusiness extends IHasERN, IHasBusinessName, IHasConfidenceScore, IHasAccountManagerERN, IHasBusinessEntityType, IHasIncorporationJurisdictionType, IHasIncorporationNumber, IHasTaxNumber, IHasVatNumber, IHasFATCAStatusType, IBusinessContactInfo, IHasPreviousName, IHasAccountPeriodEnd, IHasCode, IDateTracking, IHasStatusERN, IHasProgramIds, IHasIndustryERNs
    {
    }
    export interface IHasBusinessName
    {
        businessName: string;
    }
    export interface IHasConfidenceScore
    {
        riskScore?: number;
        confidenceScore: number;
        riskWeight: number;
        overrideScore?: number;
        overrideWeight?: number;
    }
    export interface IHasAccountManagerERN extends IIsERN
    {
        accountManagerERN: string;
    }
    export interface IHasBusinessEntityType
    {
        businessType?: BusinessEntityType;
    }
    export interface IHasIncorporationJurisdictionType
    {
        incorporationJurisdiction?: IncorporationJurisdictionType;
    }
    export interface IHasIncorporationNumber
    {
        incorporationNumber: string;
    }
    export interface IHasTaxNumber
    {
        taxNumber: string;
    }
    export interface IHasVatNumber
    {
        vatNumber: string;
    }
    export interface IHasFATCAStatusType
    {
        fatcaStatus?: FATCAStatusType;
    }
    export interface IBusinessContactInfo
    {
        telephoneNumber: string;
        faxNumber: string;
        emailAddress: string;
    }
    export interface IHasPreviousName
    {
        previousName: string;
    }
    export interface IHasAccountPeriodEnd
    {
        accountsPeriodEnd?: number;
    }
    export interface IHasCode
    {
        code: string;
    }
    export interface IHasStatusERN extends IIsERN
    {
        statusERN: string;
    }
    export interface IHasProgramIds
    {
        programIds: string[];
    }
    export interface IHasIndustryERNs
    {
        industryERNs: string[];
    }
    export interface IHasLinkToAccountERN extends IIsERN
    {
        linkToAccountERN: string;
    }
    export interface IHasAddressERN extends IIsERN
    {
        addressERN: string;
    }
    export interface IHasProductOfferERN extends IIsERN
    {
        productOfferERN: string;
    }
    export interface IHasProgramIdERN extends IIsERN
    {
        programIdERN: string;
    }
    export interface IHasOverrides
    {
        overrides: { [index: string]: string; };
    }
    export interface IHasConsumerIndustryERNs extends IHasIndustryERNs
    {
        workIndustryERNs: string[];
    }
    export interface IHasCountryOfOrigin
    {
        countryOfOrigin: string;
    }
    export interface IHasSource
    {
        source: string;
    }
    export interface IHasAccountERNs
    {
        accountERNs: string[];
    }
    export interface IHasAccountStatusERN extends IIsERN
    {
        accountStatusERN: string;
    }
    export enum AddressType
    {
        Home = 'Home',
        Work = 'Work',
        Trading = 'Trading',
        Registered = 'Registered',
        Delivery = 'Delivery',
    }
    export enum AddressState
    {
        Previous = 'Previous',
        Current = 'Current',
        Default = 'Default',
    }
    export class PrincipalAddressRecord implements IPrincipalAddress
    {
        public id: string;
        public type: AddressType;
        public state: AddressState;
        public addressLabel: string;
        public building: string;
        public street: string;
        public city: string;
        public stateDistrict: string;
        public country: string;
        public zipPostcode: string;
        public longitude?: number;
        public latitude?: number;
        public constructor(init?: Partial<PrincipalAddressRecord>) { (Object as any).assign(this, init); }
    }
    export interface IHasIndustry
    {
        industry: string;
    }
    export interface IHasBusinessStatusERN extends IIsERN
    {
        businessStatusERN: string;
    }
    export interface IHasCardERN extends IIsERN
    {
        cardERN: string;
    }
    export interface IHasCardStatusERN extends IIsERN
    {
        cardStatusERN: string;
    }
    export interface IHasWorkIndustry
    {
        workIndustry: string;
    }
    export interface IHasCustomerStatusERN extends IIsERN
    {
        customerStatusERN: string;
    }
    export interface IHasUseRecoveredFundsAccount
    {
        useRecoveredFundsAccount: boolean;
    }
    export interface IHasAmount
    {
        amount: number;
    }
    export interface IHasSourceCustomerERN
    {
        sourceCustomerERN: string;
    }
    export interface IHasDestinationCustomerERN
    {
        destinationCustomerERN: string;
    }
    export enum NotificationDelivery
    {
        Suppress = 'Suppress',
        Email = 'Email',
        Sms = 'Sms',
    }
    export class NotificationTemplate extends MongoEntity
    {
        public notification: NotificationEvent;
        public delivery: NotificationDelivery;
        public template: string;
        public meta: { [index: string]: string; };
        public constructor(init?: Partial<NotificationTemplate>) { super(init); (Object as any).assign(this, init); }
    }
    export interface IHasFeePaymentOrderERN extends IIsERN
    {
        feePaymentOrderERN: string;
    }
    export interface IHasSourceERN extends IIsERN
    {
        sourceERN: string;
    }
    export interface IHasLastName
    {
        lastName: string;
    }
    export interface IShowPendingNullable
    {
        showPending?: boolean;
    }
    export interface IIsHiddenNullable
    {
        isHidden?: boolean;
    }
    export interface IHasBeneficiaryBlacklistERN extends IIsERN
    {
        beneficiaryBlacklistERN: string;
    }
    export interface IHasEnabled
    {
        enabled?: boolean;
    }
    export interface IHasDictionaryBlacklistERN extends IIsERN
    {
        dictionaryBlacklistERN: string;
    }
    export interface IHasRemitterBlacklistERN extends IIsERN
    {
        remitterBlacklistERN: string;
    }
    export interface IHasRemitterWhitelistERN extends IIsERN
    {
        remitterWhitelistERN: string;
    }
    export interface IHasPublicToken
    {
        publicToken: number;
    }
    export interface IHasMemorableDate
    {
        memorableDate: string;
    }
    export class CreditTier implements ICreditTier
    {
        public lt?: number;
        public lte?: number;
        public gt?: number;
        public gte?: number;
        public count: number;
        public constructor(init?: Partial<CreditTier>) { (Object as any).assign(this, init); }
    }
    export class CreditScheme implements ICreditScheme
    {
        public in: CreditTier[];
        public out: CreditTier[];
        public constructor(init?: Partial<CreditScheme>) { (Object as any).assign(this, init); }
    }
    export class CreditSchedule implements ICreditSchedule
    {
        public fps: CreditScheme;
        public chaps: CreditScheme;
        public swift: CreditScheme;
        public bacs: CreditScheme;
        public fx: CreditScheme;
        public totalCredits: number;
        public constructor(init?: Partial<CreditSchedule>) { (Object as any).assign(this, init); }
    }
    export class FeeCount implements IFeeCount
    {
        public count: number;
        public value: number;
        public constructor(init?: Partial<FeeCount>) { (Object as any).assign(this, init); }
    }
    export class TotalSummary
    {
        public global: FeeCount;
        public in: FeeCount;
        public out: FeeCount;
        public constructor(init?: Partial<TotalSummary>) { (Object as any).assign(this, init); }
    }
    export class BalanceSheetTransaction implements IBalanceSheetTransaction
    {
        public date: string;
        public id: string;
        public amount: number;
        public fee: number;
        public constructor(init?: Partial<BalanceSheetTransaction>) { (Object as any).assign(this, init); }
    }
    export class CountTransaction extends ConcurrentHashSet<BalanceSheetTransaction>
    {
        public constructor(init?: Partial<CountTransaction>) { super(init); (Object as any).assign(this, init); }
    }
    export class CountScheme
    {
        public in: CountTransaction;
        public out: CountTransaction;
        public constructor(init?: Partial<CountScheme>) { (Object as any).assign(this, init); }
    }
    export class TransactionSummary
    {
        public totals: TotalSummary;
        public fps: CountScheme;
        public chaps: CountScheme;
        public swift: CountScheme;
        public bacs: CountScheme;
        public fx: CountScheme;
        public constructor(init?: Partial<TransactionSummary>) { (Object as any).assign(this, init); }
    }
    export class TransactionState
    {
        public pending: ConcurrentHashSet<BalanceSheetTransaction>;
        public success: ConcurrentHashSet<BalanceSheetTransaction>;
        public credits: ConcurrentHashSet<BalanceSheetTransaction>;
        public prePaid: ConcurrentHashSet<BalanceSheetTransaction>;
        public commitment: ConcurrentHashSet<string>;
        public commitmentRollover: number;
        public pendingTotal: number;
        public successTotal: number;
        public creditsTotal: number;
        public prePaidTotal: number;
        public constructor(init?: Partial<TransactionState>) { (Object as any).assign(this, init); }
    }
    export enum FeePaymentOrderType
    {
        Transaction = 'Transaction',
        Nightly = 'Nightly',
        Monthly = 'Monthly',
        Other = 'Other',
    }
    export enum FeePaymentOrderState
    {
        Pending = 'Pending',
        Cancelled = 'Cancelled',
        Success = 'Success',
    }
    export class FeePaymentRecord implements IFeePaymentRecord
    {
        public ern: string;
        public type: FeePaymentOrderType;
        public state: FeePaymentOrderState;
        public acno: string;
        public paymentReference: string;
        public transactionIds: string[];
        public amount: number;
        public billingDate: number;
        public createdDate?: number;
        public modifiedDate?: number;
        public constructor(init?: Partial<FeePaymentRecord>) { (Object as any).assign(this, init); }
    }
    export class PaymentOrderState
    {
        public pending: ConcurrentHashSet<FeePaymentRecord>;
        public cancelled: ConcurrentHashSet<FeePaymentRecord>;
        public success: ConcurrentHashSet<FeePaymentRecord>;
        public pendingTotal: number;
        public cancelledTotal: number;
        public successTotal: number;
        public constructor(init?: Partial<PaymentOrderState>) { (Object as any).assign(this, init); }
    }
    export class FeeBalanceSheet
    {
        public monthlyOther: number;
        public hold: number;
        public paid: number;
        public credit: number;
        public prePaid: number;
        public tally: TransactionSummary;
        public transactions: TransactionState;
        public paymentOrders: PaymentOrderState;
        public constructor(init?: Partial<FeeBalanceSheet>) { (Object as any).assign(this, init); }
    }
    export class MonthlyFee implements IHasFeeFixed
    {
        public feeFixed?: number;
        public minimumCommitment?: number;
        public inArrears: boolean;
        public constructor(init?: Partial<MonthlyFee>) { (Object as any).assign(this, init); }
    }
    export class VolumeFeeRate implements IVolumeFeeRate
    {
        public limitValue?: number;
        public feeRate?: number;
        public feeRateMin?: number;
        public feeRateMax?: number;
        public constructor(init?: Partial<VolumeFeeRate>) { (Object as any).assign(this, init); }
    }
    export class VolumeFee
    {
        public global: VolumeFeeRate;
        public combined: VolumeFeeRate;
        public in: VolumeFeeRate;
        public out: VolumeFeeRate;
        public constructor(init?: Partial<VolumeFee>) { (Object as any).assign(this, init); }
    }
    export class FeeTier implements IFeeTier
    {
        public lt?: number;
        public lte?: number;
        public gt?: number;
        public gte?: number;
        public feeFixed?: number;
        public feeRate?: number;
        public feeRateMin?: number;
        public feeRateMax?: number;
        public constructor(init?: Partial<FeeTier>) { (Object as any).assign(this, init); }
    }
    export class FeeScheme implements IFeeScheme
    {
        public in: FeeTier[];
        public out: FeeTier[];
        public constructor(init?: Partial<FeeScheme>) { (Object as any).assign(this, init); }
    }
    export class FeeSchedule implements IFeeSchedule
    {
        public monthly: MonthlyFee;
        public volume: VolumeFee;
        public fps: FeeScheme;
        public chaps: FeeScheme;
        public swift: FeeScheme;
        public bacs: FeeScheme;
        public fx: FeeScheme;
        public hideTransactionFee?: boolean;
        public constructor(init?: Partial<FeeSchedule>) { (Object as any).assign(this, init); }
    }
    export class TimePeriodMatrix<T>
    {
        public transaction: T;
        public daily: T;
        public weekly: T;
        public monthly: T;
        public quarterly: T;
        public halfYearly: T;
        public yearly: T;
        public constructor(init?: Partial<TimePeriodMatrix<T>>) { (Object as any).assign(this, init); }
    }
    export class VelocityLimit
    {
        public limit?: number;
        public constructor(init?: Partial<VelocityLimit>) { (Object as any).assign(this, init); }
    }
    export class Country extends MongoEntity implements ICountry
    {
        public isoCode: string;
        public name: string;
        public alpha2Code: string;
        public alpha3Code: string;
        public nationality: string;
        public display: string;
        public zipPostcodeRequired: boolean;
        public riskScore?: number;
        public confidenceScore: number;
        public riskWeight: number;
        public overrideScore?: number;
        public overrideWeight?: number;
        public constructor(init?: Partial<Country>) { super(init); (Object as any).assign(this, init); }
    }
    export interface ICountry extends IHasConfidenceScore
    {
        isoCode: string;
        name: string;
        alpha2Code: string;
        alpha3Code: string;
        nationality: string;
        display: string;
        zipPostcodeRequired: boolean;
        ern: string;
        createdDate?: number;
        modifiedDate?: number;
    }
    export class Industry extends MongoEntity
    {
        public name: string;
        public description: string;
        public classification: string;
        public cptIn: TimePeriodMatrix<VelocityLimit>;
        public cptOut: TimePeriodMatrix<VelocityLimit>;
        public riskScore?: number;
        public confidenceScore: number;
        public riskWeight: number;
        public overrideScore?: number;
        public overrideWeight?: number;
        public isActive: boolean;
        public constructor(init?: Partial<Industry>) { super(init); (Object as any).assign(this, init); }
    }
    export interface IIsActive
    {
        isActive: boolean;
    }
    export enum ProductType
    {
        None = 0,
        PrepaidCardPhysical = 1,
        DebitCardPhysical = 2,
        CreditCardPhysical = 3,
        eWallet = 4,
        CurrentAccount = 5,
        VirtualIBAN = 6,
        LoanAccount = 7,
        LoyaltyRewardPointsAccount = 8,
        InsurancePayoutPrepaidCard = 9,
        PrepaidVoucher = 10,
        GiftCard = 18,
        PrepaidCardVirtual = 19,
        DebitCardVirtual = 20,
    }
    export enum CustomerBusinessOnly
    {
        CustomerOnly = 'CustomerOnly',
        BusinessOnly = 'BusinessOnly',
    }
    export enum CardType
    {
        Customer = 'Customer',
        NonNominative = 'NonNominative',
        Nominative = 'Nominative',
        Payroll = 'Payroll',
    }
    export class ProductOffer extends MongoEntity
    {
        public group: string;
        public construct: string;
        public groupDescription: string;
        public constructDescription: string;
        public restrictions?: CustomerBusinessOnly;
        public productType: ProductType;
        public cardType?: CardType;
        public cptIn: TimePeriodMatrix<VelocityLimit>;
        public cptOut: TimePeriodMatrix<VelocityLimit>;
        public cardCarrier: string;
        public cardDesign: string;
        public cardManufacturer: string;
        public createType: string;
        public curCode: string;
        public feeGroup: string;
        public isActive: boolean;
        public limitsGroup: string;
        public mccGroup: string;
        public offeringCode: string;
        public permsGroup: string;
        public productRef: string;
        public programId: string;
        public schedFeeGroup: string;
        public txnCode: string;
        public wsFeeGroup: string;
        public institutionERN: string;
        public processorERN: string;
        public permittedRiskScores: number[];
        public billingProfileERN: string;
        public brandERN: string;
        public noticePeriod?: number;
        public accountNameSuffix: string;
        public industries: string[];
        public countryOfOrigin: string;
        public constructor(init?: Partial<ProductOffer>) { super(init); (Object as any).assign(this, init); }
    }
    export class ProductOfferGroupConstruct
    {
        public group: string;
        public description: string;
        public constructs: ProductOffer[];
        public constructor(init?: Partial<ProductOfferGroupConstruct>) { (Object as any).assign(this, init); }
    }
    export class ProgramId extends MongoEntity implements IProgramId
    {
        public code: string;
        public description: string;
        public inActive: boolean;
        public constructor(init?: Partial<ProgramId>) { super(init); (Object as any).assign(this, init); }
    }
    export interface IProgramId extends IHasERN, IHasCode, IHasDescription, IHasInactive
    {
    }
    export interface IHasInactive
    {
        inActive: boolean;
    }
    export enum PublicPrivate
    {
        All = 'All',
        Public = 'Public',
        Private = 'Private',
    }
    export class BannerNotification extends MongoEntity
    {
        public userAuthId: string;
        public roles: string[];
        public from?: number;
        public to?: number;
        public persistent: boolean;
        public visible: boolean;
        public suspendActivity: boolean;
        public priority: number;
        public css: string;
        public header: string;
        public style: string;
        public target: string;
        public text: string;
        public audience: PublicPrivate;
        public constructor(init?: Partial<BannerNotification>) { super(init); (Object as any).assign(this, init); }
    }
    export interface IHasAuthRoles
    {
        roles: string[];
    }
    export interface IHasAuthorizationCode
    {
        authorizationCode: string;
    }
    export interface IHasDeviceId
    {
        deviceId: string;
    }
    export class Notification implements INotification
    {
        public appBearerToken: string;
        public authenticatedAuthorization: string;
        public authRequestERN: string;
        public message: string;
        public isAuthorized?: boolean;
        public header: string;
        public verb: string;
        public constructor(init?: Partial<Notification>) { (Object as any).assign(this, init); }
    }
    export interface IHasOriginalRequest
    {
        originalRequest: string;
    }
    export interface IHasNotification
    {
        notification: Notification;
    }
    export interface IHasAuthenticatedAuthorization
    {
        authenticatedAuthorization: string;
    }
    export interface IHasFactoryType
    {
        factoryType: string;
    }
    export interface IHasAuthRequestERN extends IIsERN
    {
        authRequestERN: string;
    }
    export interface IIsAuthorized
    {
        isAuthorized?: boolean;
    }
    export enum CounterpartyType
    {
        Person = 'Person',
        Business = 'Business',
    }
    export class Counterparty extends MongoEntity implements ICounterparty
    {
        public emailAddress: string;
        public countryOfOrigin: string;
        public countryOfResidence: string;
        public title: string;
        public firstName: string;
        public middleName: string;
        public lastName: string;
        public birthDate?: number;
        public gender: GenderType;
        public nickName: string;
        public mobilePhone: string;
        public workPhone: string;
        public homePhone: string;
        public riskScore?: number;
        public confidenceScore: number;
        public riskWeight: number;
        public overrideScore?: number;
        public overrideWeight?: number;
        public customerERN: string;
        public statusERN: string;
        public counterpartyType: CounterpartyType;
        public createdByERN: string;
        public accountName: string;
        public businessName: string;
        public meta: { [index: string]: string; };
        public constructor(init?: Partial<Counterparty>) { super(init); (Object as any).assign(this, init); }
    }
    export interface ICounterparty extends IPerson, IHasCustomerERN, IHasCreatedByERN, IHasCounterpartyType
    {
    }
    export interface IPerson extends IHasERN, IHasEmailAddress, IHasCountryOfOrigin, IHasCountryOfResidence, IPersonalIdentity, IBusinessIdentity, IContactInfo, IHasConfidenceScore, IDateTracking, IHasStatusERN
    {
    }
    export interface IHasCountryOfResidence
    {
        countryOfResidence: string;
    }
    export interface IPersonalIdentity extends IHasFirstName, IHasMiddleName, IHasLastName, IHasBirthDate, IHasTitle, IHasAccountName, IHasNickName, IHasGender
    {
    }
    export interface IHasFirstName
    {
        firstName: string;
    }
    export interface IHasMiddleName
    {
        middleName: string;
    }
    export interface IHasBirthDate
    {
        birthDate?: number;
    }
    export interface IHasTitle
    {
        title: string;
    }
    export interface IHasAccountName
    {
        accountName: string;
    }
    export interface IHasGender
    {
        gender: GenderType;
    }
    export interface IBusinessIdentity extends IHasBusinessName
    {
    }
    export interface IContactInfo extends IHasMobilePhone, IHasWorkPhone, IHasHomePhone
    {
    }
    export interface IHasWorkPhone
    {
        workPhone: string;
    }
    export interface IHasHomePhone
    {
        homePhone: string;
    }
    export interface IHasCreatedByERN extends IIsERN
    {
        createdByERN: string;
    }
    export interface IHasCounterpartyType
    {
        counterpartyType: CounterpartyType;
    }
    export interface IHasUBAN
    {
        uban: string;
    }
    export enum MailboxWorkflowStatus
    {
        Active = 'Active',
        Resolved = 'Resolved',
    }
    // @Flags()
    export enum MailboxMessageFlags
    {
        None = 0,
        Internal = 1,
        Client = 2,
        Enumis = 4,
        Edited = 8,
        Deleted = 16,
        Rationale = 32,
    }
    export class PlatformHost
    {
        public baseUrl: string;
        public basePath: string;
        public url: string;
        public constructor(init?: Partial<PlatformHost>) { (Object as any).assign(this, init); }
    }
    export class IM implements IPlatformLayer
    {
        public version: string;
        public constructor(init?: Partial<IM>) { (Object as any).assign(this, init); }
    }
    export class Enumis implements IPlatformLayer
    {
        public version: string;
        public constructor(init?: Partial<Enumis>) { (Object as any).assign(this, init); }
    }
    export class PlatformSummary
    {
        public serviceName: string;
        public host: PlatformHost;
        public im: IM;
        public enumis: Enumis;
        public apiVersion: string;
        public constructor(init?: Partial<PlatformSummary>) { (Object as any).assign(this, init); }
    }
    // @DataContract
    export class ResponseError
    {
        // @DataMember(Order=1)
        public errorCode: string;
        // @DataMember(Order=2)
        public fieldName: string;
        // @DataMember(Order=3)
        public message: string;
        // @DataMember(Order=4)
        public meta: { [index: string]: string; };
        public constructor(init?: Partial<ResponseError>) { (Object as any).assign(this, init); }
    }
    // @DataContract
    export class ResponseStatus
    {
        // @DataMember(Order=1)
        public errorCode: string;
        // @DataMember(Order=2)
        public message: string;
        // @DataMember(Order=3)
        public stackTrace: string;
        // @DataMember(Order=4)
        public errors: ResponseError[];
        // @DataMember(Order=5)
        public meta: { [index: string]: string; };
        public constructor(init?: Partial<ResponseStatus>) { (Object as any).assign(this, init); }
    }
    // @DataContract
    export class UserApiKey
    {
        // @DataMember(Order=1)
        public key: string;
        // @DataMember(Order=2)
        public keyType: string;
        // @DataMember(Order=3)
        public expiryDate?: string;
        // @DataMember(Order=4)
        public meta: { [index: string]: string; };
        public constructor(init?: Partial<UserApiKey>) { (Object as any).assign(this, init); }
    }
    export class SetupCode
    {
        public account: string;
        public manualEntryKey: string;
        public base64PngImage: string;
        public constructor(init?: Partial<SetupCode>) { (Object as any).assign(this, init); }
    }
    export class Dictionary<T> { [Key: string]: T; }
    export class CsvValidationErrors extends Map<number, Array<string>> {
        public constructor(init?: Partial<CsvValidationErrors>) {
            super();
            (Object as any).assign(this, init);
        }
    }
    export class MongoJobEntity implements IMongoJobEntity
    {
        public lookupERN: string;
        public id: string;
        public jobERN: string;
        public createdDate?: number;
        public modifiedDate?: number;
        public constructor(init?: Partial<MongoJobEntity>) { (Object as any).assign(this, init); }
    }
    export class JobTasks extends Array<JobTask>
    {
        public constructor(init?: Partial<JobTasks>) { super(); (Object as any).assign(this, init); }
    }
    export class JobTask implements IJobTask
    {
        public elapsedTime?: string;
        public type: JobType;
        public state: JobState;
        public meta: { [index: string]: string; };
        public crc: string;
        public exception: string;
        public createdDate?: number;
        public modifiedDate?: number;
        public tasks: JobTasks;
        public isLongRunning?: boolean;
        public cleanup: boolean;
        public constructor(init?: Partial<JobTask>) { (Object as any).assign(this, init); }
    }
    export enum JobOrigination
    {
        Admin = 'Admin',
        OnlineAccount = 'OnlineAccount',
    }
    export class RequestedBy implements IRequestedBy
    {
        public approvalState: PendingApproval;
        public userAuthId: string;
        public userAuthEmail: string;
        public date: number;
        public constructor(init?: Partial<RequestedBy>) { (Object as any).assign(this, init); }
    }
    export class ApprovedBy implements IApprovedBy
    {
        public userAuthId: string;
        public userAuthEmail: string;
        public date: number;
        public constructor(init?: Partial<ApprovedBy>) { (Object as any).assign(this, init); }
    }
    export class Job extends MongoJobEntity implements IJob
    {
        public elapsedTime?: string;
        public scheduleTime?: string;
        public isValid: boolean;
        public task: JobTask;
        public subTask: JobTask;
        public currentTask: JobTask;
        public tasksTotal: number;
        public currentTaskIndex: number;
        public tasksRemaining: number;
        public lookupERN2: string;
        public scheduleDate?: number;
        public type: JobType;
        public state: JobState;
        public origination: JobOrigination;
        public principalERN: string;
        public programIds: string[];
        public requestedBy: RequestedBy;
        public approvedBy: ApprovedBy;
        public authorizedBy: RequestedBy;
        public continueOnError: boolean;
        public tasks: JobTasks;
        public crc: string;
        public input: { [index: string]: string; };
        public output: { [index: string]: string; };
        public exception: string;
        public retryJobERN: string;
        public failedJobERN: string;
        public batchMode: boolean;
        public batchJobERN: string;
        public supplementaryData: { [index: string]: string; };
        public meta: { [index: string]: string; };
        public constructor(init?: Partial<Job>) { super(init); (Object as any).assign(this, init); }
    }
    export class DocumentSummary implements IDocumentSummary
    {
        public ern: string;
        public fileName: string;
        public contentLength: number;
        public contentType: string;
        public documentType: string;
        public constructor(init?: Partial<DocumentSummary>) { (Object as any).assign(this, init); }
    }
    export interface IHasCount
    {
        count: number;
    }
    export class BeneficiarySummary extends BeneficiaryAccount
    {
        public documents: DocumentSummary[];
        public beneficiaryType: BeneficiaryType;
        public businessName: string;
        public birthDate?: number;
        public firstName: string;
        public lastName: string;
        public constructor(init?: Partial<BeneficiarySummary>) { super(init); (Object as any).assign(this, init); }
    }
    export class BeneficiaryAccountRecord implements IBeneficiaryAccount, IDateTracking
    {
        public ern: string;
        public uban: string;
        public nickName: string;
        public beneficiaryERN: string;
        public accountERN: string;
        public riskScore?: number;
        public confidenceScore: number;
        public riskWeight: number;
        public overrideScore?: number;
        public overrideWeight?: number;
        public swift: string;
        public bban: string;
        public iban: string;
        public bankName: string;
        public sortCode: string;
        public accountNumber: string;
        public accountName: string;
        public accountHolder: string;
        public createdDate?: number;
        public modifiedDate?: number;
        public owners: string[];
        public hasOwners: boolean;
        public constructor(init?: Partial<BeneficiaryAccountRecord>) { (Object as any).assign(this, init); }
    }
    export class MemberSummary implements IMemberSummary
    {
        public ern: string;
        public name: string;
        public position: string;
        public constructor(init?: Partial<MemberSummary>) { (Object as any).assign(this, init); }
    }
    export class BusinessAccountSummary implements IBusinessAccountSummary
    {
        public name: string;
        public ern: string;
        public constructor(init?: Partial<BusinessAccountSummary>) { (Object as any).assign(this, init); }
    }
    export class AclClaim implements IAclClaim
    {
        public principal: string;
        public operation: string;
        public resource: string;
        public constructor(init?: Partial<AclClaim>) { (Object as any).assign(this, init); }
    }
    export class CustomerBusinessSummary
    {
        public ern: string;
        public businessName: string;
        public members: MemberSummary[];
        public accounts: BusinessAccountSummary[];
        public grantedClaims: AclClaim[];
        public deniedClaims: AclClaim[];
        public code: string;
        public constructor(init?: Partial<CustomerBusinessSummary>) { (Object as any).assign(this, init); }
    }
    export class BusinessPendingJobsSummary implements IHasBusinessERN
    {
        public businessERN: string;
        public results: Job[];
        public constructor(init?: Partial<BusinessPendingJobsSummary>) { (Object as any).assign(this, init); }
    }
    export class CardSummary implements ICardSummary
    {
        public accountERN: string;
        public customerERN: string;
        public ern: string;
        public expDate: string;
        public isLocked: boolean;
        public locDate: string;
        public maskedPAN: string;
        public name: string;
        public programId: string;
        public publicToken: number;
        public startDate: string;
        public factoryType: string;
        public status: string;
        public tags: string[];
        public cardType: CardType;
        public constructor(init?: Partial<CardSummary>) { (Object as any).assign(this, init); }
    }
    export class AccountSummary
    {
        public ern: string;
        public businessERN: string;
        public customerERN: string;
        public code: string;
        public cards: CardSummary[];
        public status: string;
        public cardContextERN: string;
        public currencyCode: string;
        public currencySymbol: string;
        public createdDate?: number;
        public modifiedDate?: number;
        public availableBalance: number;
        public availableBalanceTimestamp?: number;
        public ledgerBalance: number;
        public ledgerBalanceTimestamp?: number;
        public transactionBalance: number;
        public transactionBalanceTimestamp?: number;
        public holdBalance: number;
        public presentBalance: number;
        public billingProfileERN: string;
        public programId: string;
        public offeringCode: string;
        public accountName: string;
        public nickName: string;
        public tags: string[];
        public accountHolder: string;
        public aclClaims: AclClaim[];
        public displayPoints: boolean;
        public beneficiaryCount: number;
        public sendLimits: { [index: string]: number; };
        public transferLimits: { [index: string]: number; };
        public riskScore?: number;
        public confidenceScore: number;
        public riskWeight: number;
        public overrideScore?: number;
        public overrideWeight?: number;
        public isHidden: boolean;
        public countryOfOrigin: string;
        public showPending: boolean;
        public productType: ProductType;
        public constructor(init?: Partial<AccountSummary>) { (Object as any).assign(this, init); }
    }
    export class Address extends MongoEntity implements IAddress
    {
        public addressLabel: string;
        public addressLine1: string;
        public addressLine2: string;
        public addressLine3: string;
        public addressLine4: string;
        public addressLine5: string;
        public addressLine6: string;
        public addressLine7: string;
        public addressLine8: string;
        public building: string;
        public cedexMailsort: string;
        public city: string;
        public company: string;
        public country: string;
        public department: string;
        public dpsZipPlus: string;
        public firstMonthOfResidence: string;
        public firstYearOfResidence: string;
        public lastMonthOfResidence: string;
        public lastYearOfResidence: string;
        public poBox: string;
        public premise: string;
        public principality: string;
        public region: string;
        public stateDistrict: string;
        public street: string;
        public subBuilding: string;
        public subCity: string;
        public subStreet: string;
        public zipPostcode: string;
        public latitude: string;
        public longitude: string;
        public constructor(init?: Partial<Address>) { super(init); (Object as any).assign(this, init); }
    }
    export class CustomerBusinessLookup implements ICustomerBusinessLookup
    {
        public ern: string;
        public businessName: string;
        public code: string;
        public constructor(init?: Partial<CustomerBusinessLookup>) { (Object as any).assign(this, init); }
    }
    export enum SmsProviderType
    {
        ClickSend = 'ClickSend',
        Aws = 'Aws',
    }
    export class CustomerSummary extends MongoEntity
    {
        public userAuthId: string;
        public emailAddress: string;
        public countryOfOrigin: string;
        public countryOfResidence: string;
        public title: string;
        public firstName: string;
        public middleName: string;
        public lastName: string;
        public birthDate?: number;
        public gender: GenderType;
        public nickName: string;
        public mobilePhone: string;
        public workPhone: string;
        public homePhone: string;
        public code: string;
        public accounts: AccountSummary[];
        public homeAddresses: Address[];
        public deliveryAddresses: Address[];
        public status: string;
        public accountContextERN: string;
        public isValidKycCheck: boolean;
        public isValidSanctionCheck: boolean;
        public programIds: string[];
        public accountName: string;
        public tags: string[];
        public webHookEnabled: boolean;
        public pkiEnabled: boolean;
        public cpmEnabled: boolean;
        public authLocked: boolean;
        public beneficiaryCount: number;
        public businesses: CustomerBusinessLookup[];
        public aclClaims: AclClaim[];
        public sendLimits: { [index: string]: number; };
        public transferLimits: { [index: string]: number; };
        public riskScore?: number;
        public confidenceScore: number;
        public riskWeight: number;
        public overrideScore?: number;
        public overrideWeight?: number;
        public industries: string[];
        public workIndustries: string[];
        public addresses: PrincipalAddressRecord[];
        public smsProviderOverride?: SmsProviderType;
        public constructor(init?: Partial<CustomerSummary>) { super(init); (Object as any).assign(this, init); }
    }
    export class Customer extends MongoEntity implements ICustomer
    {
        public userAuthId: string;
        public emailAddress: string;
        public countryOfOrigin: string;
        public countryOfResidence: string;
        public title: string;
        public firstName: string;
        public middleName: string;
        public lastName: string;
        public birthDate?: number;
        public gender: GenderType;
        public nickName: string;
        public mobilePhone: string;
        public workPhone: string;
        public homePhone: string;
        public accessCode: string;
        public code: string;
        public registeredDate?: number;
        public programIds: string[];
        public riskScore?: number;
        public confidenceScore: number;
        public riskWeight: number;
        public overrideScore?: number;
        public overrideWeight?: number;
        public statusERN: string;
        public accountName: string;
        public businessName: string;
        public webHookEnabled: boolean;
        public pkiEnabled: boolean;
        public cpmEnabled: boolean;
        public authLocked: boolean;
        public meta: { [index: string]: string; };
        public industryERNs: string[];
        public workIndustryERNs: string[];
        public smsProviderOverride?: SmsProviderType;
        public constructor(init?: Partial<Customer>) { super(init); (Object as any).assign(this, init); }
    }
    export class AccountPdfDocument
    {
        public ern: string;
        public acno: string;
        public description: string;
        public date: number;
        public constructor(init?: Partial<AccountPdfDocument>) { (Object as any).assign(this, init); }
    }
    export class TransactionNotificationEvent
    {
        public destination: NotificationDelivery[];
        public acno: string[];
        public onAuthorized?: boolean;
        public onCleared?: boolean;
        public isInternational?: boolean;
        public balanceAmountFloor?: number;
        public paymentAmountCeiling?: number;
        public typePos?: boolean;
        public typeAtm?: boolean;
        public typeLoad?: boolean;
        public typeUnload?: boolean;
        public constructor(init?: Partial<TransactionNotificationEvent>) { (Object as any).assign(this, init); }
    }
    export class TransactionNotifications
    {
        public events: TransactionNotificationEvent[];
        public constructor(init?: Partial<TransactionNotifications>) { (Object as any).assign(this, init); }
    }
    export class MessageAuthor implements IMessageAuthor
    {
        public name: string;
        public email: string;
        public code: string;
        public constructor(init?: Partial<MessageAuthor>) { (Object as any).assign(this, init); }
    }
    export interface IMailboxMessage extends IHasERN, IDateTracking, IHasOwners
    {
        date: number;
        author: MessageAuthor;
        message: string;
        flags: MailboxMessageFlags;
    }
    export class PendingTransactionMessages implements IHasPendingTransactionERN
    {
        public messages: IMailboxMessage[];
        public canReject: boolean;
        public pendingTransactionERN: string;
        public constructor(init?: Partial<PendingTransactionMessages>) { (Object as any).assign(this, init); }
    }
    export class CertificateSummary
    {
        public thumbprint: string;
        public friendlyName: string;
        public notBefore: string;
        public notAfter: string;
        public constructor(init?: Partial<CertificateSummary>) { (Object as any).assign(this, init); }
    }
    export class RiskModelCollection implements IRiskModelCollection
    {
        public riskScoreCalc?: number;
        public allowRiskFactorWeightAdjustment: boolean;
        public ern: string;
        public owners: string[];
        public createdDate?: number;
        public modifiedDate?: number;
        public name: string;
        public riskScore?: number;
        public riskWeight?: number;
        public overrideScore?: number;
        public overrideWeight?: number;
        public version: number;
        public previousERN: string;
        public meta: { [index: string]: Object; };
        public state: RiskModelState;
        public type: RiskModelType;
        public isTemplate: boolean;
        public categories: ConcurrentDictionary<string, IRiskCategory>;
        public components: ConcurrentDictionary<string, IRiskComponent>;
        public factors: ConcurrentDictionary<string, IRiskFactor>;
        public answers: ConcurrentDictionary<string, IRiskAnswer>;
        public industries: ConcurrentDictionary<string, IRiskAnswer>;
        public countries: ConcurrentDictionary<string, IRiskAnswer>;
        public products: ConcurrentDictionary<string, IRiskAnswer>;
        public overrides: ConcurrentDictionary<string, IRiskOverride>;
        public riskMatrix: number[];
        public maximumWeightAdjustment: number[];
        public riskReductionFloor: number[];
        public controlMethodLabel: string[];
        public riskImpactLabel: string[];
        public riskProbabilityLabel: string[];
        public residualRiskMethod: RiskResidualMethodType;
        public customPropertySchema: { [index: string]: RiskListCustomPropertyType; };
        public isModelValid: boolean;
        public constructor(init?: Partial<RiskModelCollection>) { (Object as any).assign(this, init); }
    }
    export class RiskAuditTrailRecord implements IRiskAuditTrail
    {
        public ern: string;
        public createdDate?: number;
        public modifiedDate?: number;
        public owners: string[];
        public eventDate: number;
        public oldValue: Object;
        public newValue: Object;
        public userAuthId: string;
        public principalERN: string;
        public type: RiskAuditType;
        public constructor(init?: Partial<RiskAuditTrailRecord>) { (Object as any).assign(this, init); }
    }
    export class DateTimeZone
    {
        public dateTime: string;
        public timeZoneInfo: any;
        public timeZone: string;
        public constructor(init?: Partial<DateTimeZone>) { (Object as any).assign(this, init); }
    }
    export class ChapsTimeZoneAvailable
    {
        public currentTime: DateTimeZone;
        public available: boolean;
        public constructor(init?: Partial<ChapsTimeZoneAvailable>) { (Object as any).assign(this, init); }
    }
    export type ResourceLimit = Record<string,Record<string,LimitLedger>>;
    export class CustomerLimit extends MongoEntity
    {
        public send: ResourceLimit;
        public transfer: ResourceLimit;
        public constructor(init?: Partial<CustomerLimit>) { super(init); (Object as any).assign(this, init); }
    }
    export class PagedTransactionResults
    {
        public count: number;
        public results: Object[];
        public constructor(init?: Partial<PagedTransactionResults>) { (Object as any).assign(this, init); }
    }
    export class TransactionHistory extends MongoEntity implements ITransactionHistory
    {
        public hold: boolean;
        public type: string;
        public account: string;
        public payload: SortedDictionary<string, string>;
        public meta: { [index: string]: string; };
        public constructor(init?: Partial<TransactionHistory>) { super(init); (Object as any).assign(this, init); }
    }
    export interface IHasFeeFixed
    {
        feeFixed?: number;
    }
    export interface IHasFeeCredit
    {
        feeCredit?: boolean;
    }
    export class WebhookSummary implements IHasVersion
    {
        public ern: string;
        public name: string;
        public event: string;
        public isActive: boolean;
        public createdDateUtc: string;
        public createdById: string;
        public lastModifiedDateUtc: string;
        public url: string;
        public contentType: string;
        public secret: string;
        public attemptedDateUtc: string;
        public statusDescription: string;
        public statusCode: number;
        public subscriptionId: string;
        public eventId: string;
        public version: number;
        public constructor(init?: Partial<WebhookSummary>) { (Object as any).assign(this, init); }
    }
    export class HalLink
    {
        // @Required()
        public name: string;
        // @Required()
        public href: string;
        public templated?: boolean;
        public constructor(init?: Partial<HalLink>) { (Object as any).assign(this, init); }
    }
    export interface IClearBankApiResponse
    {
        errors: { [index: string]: string[]; };
    }
    export class BeneficiaryBlacklist extends MongoEntity
    {
        public iBan: string;
        public name: string;
        public disabled: boolean;
        public notes: { [index: string]: NoteMessage; };
        public constructor(init?: Partial<BeneficiaryBlacklist>) { super(init); (Object as any).assign(this, init); }
    }
    export class BusinessSummary extends MongoEntity
    {
        public businessName: string;
        public riskScore?: number;
        public confidenceScore: number;
        public riskWeight: number;
        public overrideScore?: number;
        public overrideWeight?: number;
        public accountManagerERN: string;
        public businessType?: BusinessEntityType;
        public incorporationJurisdiction?: IncorporationJurisdictionType;
        public incorporationNumber: string;
        public taxNumber: string;
        public vatNumber: string;
        public fatcaStatus?: FATCAStatusType;
        public telephoneNumber: string;
        public faxNumber: string;
        public emailAddress: string;
        public previousName: string;
        public accountsPeriodEnd?: number;
        public programIds: string[];
        public status: string;
        public isValidKycCheck: boolean;
        public isValidSanctionCheck: boolean;
        public members: MemberSummary[];
        public homeAddresses: Address[];
        public deliveryAddresses: Address[];
        public accounts: AccountSummary[];
        public tags: string[];
        public aclClaims: AclClaim[];
        public beneficiaryCount: number;
        public sendLimits: { [index: string]: number; };
        public transferLimits: { [index: string]: number; };
        public code: string;
        public industries: string[];
        public addresses: PrincipalAddressRecord[];
        public constructor(init?: Partial<BusinessSummary>) { super(init); (Object as any).assign(this, init); }
    }
    export class CustomerSummaryRecord
    {
        public ern: string;
        public createdDate?: number;
        public modifiedDate?: number;
        public userAuthId: string;
        public emailAddress: string;
        public countryOfOrigin: string;
        public countryOfResidence: string;
        public title: string;
        public firstName: string;
        public middleName: string;
        public lastName: string;
        public birthDate?: number;
        public gender: GenderType;
        public nickName: string;
        public mobilePhone: string;
        public workPhone: string;
        public homePhone: string;
        public code: string;
        public accounts: AccountSummary[];
        public homeAddresses: Address[];
        public deliveryAddresses: Address[];
        public status: string;
        public accountContextERN: string;
        public isValidKycCheck: boolean;
        public isValidSanctionCheck: boolean;
        public programIds: string[];
        public accountName: string;
        public tags: string[];
        public webHookEnabled: boolean;
        public pkiEnabled: boolean;
        public cpmEnabled: boolean;
        public authLocked: boolean;
        public beneficiaryCount: number;
        public businesses: CustomerBusinessLookup[];
        public aclClaims: AclClaim[];
        public sendLimits: { [index: string]: number; };
        public transferLimits: { [index: string]: number; };
        public riskScore?: number;
        public confidenceScore: number;
        public riskWeight: number;
        public overrideScore?: number;
        public overrideWeight?: number;
        public industries: string[];
        public workIndustries: string[];
        public addresses: PrincipalAddressRecord[];
        public smsProviderOverride?: SmsProviderType;
        public constructor(init?: Partial<CustomerSummaryRecord>) { (Object as any).assign(this, init); }
    }
    export class DictionaryBlacklist extends MongoEntity implements IHasConfidenceScore
    {
        public iBan: string;
        public name: string;
        public disabled: boolean;
        public notes: { [index: string]: NoteMessage; };
        public riskScore?: number;
        public confidenceScore: number;
        public riskWeight: number;
        public overrideScore?: number;
        public overrideWeight?: number;
        public source: string;
        public constructor(init?: Partial<DictionaryBlacklist>) { super(init); (Object as any).assign(this, init); }
    }
    export class RemitterBlacklist extends MongoEntity
    {
        public iBan: string;
        public name: string;
        public disabled: boolean;
        public notes: { [index: string]: NoteMessage; };
        public constructor(init?: Partial<RemitterBlacklist>) { super(init); (Object as any).assign(this, init); }
    }
    export class RemitterWhitelist extends MongoEntity
    {
        public iBan: string;
        public name: string;
        public disabled: boolean;
        public notes: { [index: string]: NoteMessage; };
        public loading: boolean;
        public constructor(init?: Partial<RemitterWhitelist>) { super(init); (Object as any).assign(this, init); }
    }
    export class GroupChange
    {
        public wsid: number;
        public issCode: string;
        public cardSelector: number;
        public cardSelectorValue: string;
        public actionCode: string;
        public locDate: string;
        public locTime: string;
        public sysDate: string;
        public cards: CardDesc[];
        public constructor(init?: Partial<GroupChange>) { (Object as any).assign(this, init); }
    }
    export class Ws_Change_GroupsResponse
    {
        public ws_Change_GroupsResult: GroupChange;
        public constructor(init?: Partial<Ws_Change_GroupsResponse>) { (Object as any).assign(this, init); }
    }
    export class ChangeGroupsResponse extends Ws_Change_GroupsResponse
    {
        public responseStatus: ResponseStatus;
        public constructor(init?: Partial<ChangeGroupsResponse>) { super(init); (Object as any).assign(this, init); }
    }
    export class GlobalItemCheckResultCode2
    {
        public description: string;
        public code: number;
        public constructor(init?: Partial<GlobalItemCheckResultCode2>) { (Object as any).assign(this, init); }
    }
    export class Comment
    {
        public globalItemCheckResultCode: GlobalItemCheckResultCode2[];
        public constructor(init?: Partial<Comment>) { (Object as any).assign(this, init); }
    }
    export class GlobalItemCheckResultCode
    {
        public name: string;
        public description: string;
        public comment: Comment;
        public id: number;
        public pass: string;
        public address: string;
        public forename: string;
        public surname: string;
        public dob: string;
        public alert: string;
        public constructor(init?: Partial<GlobalItemCheckResultCode>) { (Object as any).assign(this, init); }
    }
    export class ResultCodes
    {
        public globalItemCheckResultCodes: GlobalItemCheckResultCode[];
        public constructor(init?: Partial<ResultCodes>) { (Object as any).assign(this, init); }
    }
    export class AuthenticateSPResult
    {
        public authenticationID: string;
        public timestamp: string;
        public customerRef: string;
        public profileID: string;
        public profileName: string;
        public profileVersion: number;
        public profileRevision: number;
        public profileState: string;
        public resultCodes: ResultCodes;
        public score: number;
        public bandText: string;
        public country: string;
        public constructor(init?: Partial<AuthenticateSPResult>) { (Object as any).assign(this, init); }
    }
    export class AuthenticateSPResponse
    {
        public authenticateSPResult: AuthenticateSPResult;
        public constructor(init?: Partial<AuthenticateSPResponse>) { (Object as any).assign(this, init); }
    }
    export class KycCheckResponse extends AuthenticateSPResponse
    {
        public responseStatus: ResponseStatus;
        public constructor(init?: Partial<KycCheckResponse>) { super(init); (Object as any).assign(this, init); }
    }
    export interface IRiskCalculation extends IHasRisk, IHasCalculationScore, IHasCalculationResult
    {
    }
    export class BaseResponse implements IBaseDataResponse
    {
        public responseStatus: ResponseStatus;
        public constructor(init?: Partial<BaseResponse>) { (Object as any).assign(this, init); }
    }
    export class SearchCriteria
    {
        public name: string;
        public address: string;
        public country: string;
        public dateOfBirth: string;
        public nationality: string;
        public reference: string;
        public constructor(init?: Partial<SearchCriteria>) { (Object as any).assign(this, init); }
    }
    export class SearchResultEuAddress
    {
        public street: string;
        public city: string;
        public country: string;
        public postCode: string;
        public other: string;
        public constructor(init?: Partial<SearchResultEuAddress>) { (Object as any).assign(this, init); }
    }
    export class SearchResultEuBirth
    {
        public date: string;
        public place: string;
        public country: string;
        public constructor(init?: Partial<SearchResultEuBirth>) { (Object as any).assign(this, init); }
    }
    export class SearchResultOfacEuCitizenship
    {
        public country: string;
        public constructor(init?: Partial<SearchResultOfacEuCitizenship>) { (Object as any).assign(this, init); }
    }
    export class SearchResultEuName
    {
        public fullName: string;
        public gender: string;
        public constructor(init?: Partial<SearchResultEuName>) { (Object as any).assign(this, init); }
    }
    export class SearchResultEuPassport
    {
        public number: string;
        public country: string;
        public constructor(init?: Partial<SearchResultEuPassport>) { (Object as any).assign(this, init); }
    }
    export class SearchResultEu
    {
        public resultStrength: number;
        public resultSimilarity: number;
        public resultResolved: boolean;
        public resultType: string;
        public dateUpdated: string;
        public addresses: SearchResultEuAddress[];
        public births: SearchResultEuBirth[];
        public citizenships: SearchResultOfacEuCitizenship[];
        public names: SearchResultEuName[];
        public passports: SearchResultEuPassport[];
        public constructor(init?: Partial<SearchResultEu>) { (Object as any).assign(this, init); }
    }
    export class SearchResultHmTreasury
    {
        public resultStrength: number;
        public resultSimilarity: number;
        public resultResolved: boolean;
        public resultType: string;
        public dateListed: string;
        public dateUpdated: string;
        public name1: string;
        public name2: string;
        public name3: string;
        public name4: string;
        public name5: string;
        public name6: string;
        public dateOfBirth: string;
        public countryOfBirth: string;
        public nationality: string;
        public address1: string;
        public address2: string;
        public address3: string;
        public address4: string;
        public address5: string;
        public address6: string;
        public postCode: string;
        public country: string;
        public constructor(init?: Partial<SearchResultHmTreasury>) { (Object as any).assign(this, init); }
    }
    export class SearchResultOfacAddress
    {
        public address1: string;
        public address2: string;
        public address3: string;
        public city: string;
        public state: string;
        public postCode: string;
        public country: string;
        public constructor(init?: Partial<SearchResultOfacAddress>) { (Object as any).assign(this, init); }
    }
    export class SearchResultOfacAka
    {
        public firstName: string;
        public lastName: string;
        public type: string;
        public strength: string;
        public constructor(init?: Partial<SearchResultOfacAka>) { (Object as any).assign(this, init); }
    }
    export class SearchResultOfacDateOfBirth
    {
        public dateOfBirth: string;
        public constructor(init?: Partial<SearchResultOfacDateOfBirth>) { (Object as any).assign(this, init); }
    }
    export class SearchResultOfacNationality
    {
        public country: string;
        public constructor(init?: Partial<SearchResultOfacNationality>) { (Object as any).assign(this, init); }
    }
    export class SearchResultOfacPlaceOfBirth
    {
        public placeOfBirth: string;
        public constructor(init?: Partial<SearchResultOfacPlaceOfBirth>) { (Object as any).assign(this, init); }
    }
    export class SearchResultOfac
    {
        public resultStrength: number;
        public resultSimilarity: number;
        public resultResolved: boolean;
        public resultType: string;
        public dateUpdated: string;
        public firstName: string;
        public lastName: string;
        public addresses: SearchResultOfacAddress[];
        public akas: SearchResultOfacAka[];
        public dateOfBirths: SearchResultOfacDateOfBirth[];
        public nationalities: SearchResultOfacNationality[];
        public placeOfBirths: SearchResultOfacPlaceOfBirth[];
        public constructor(init?: Partial<SearchResultOfac>) { (Object as any).assign(this, init); }
    }
    export class SearchResultDfat
    {
        public resultStrength: number;
        public resultSimilarity: number;
        public resultResolved: boolean;
        public resultType: string;
        public dateUpdated: string;
        public fullName: string;
        public address: string;
        public dateOfBirth: string;
        public placeOfBirth: string;
        public nationality: string;
        public constructor(init?: Partial<SearchResultDfat>) { (Object as any).assign(this, init); }
    }
    export class SearchResultOsfi
    {
        public resultStrength: number;
        public resultSimilarity: number;
        public resultResolved: boolean;
        public resultType: string;
        public dateUpdated: string;
        public fullName: string;
        public address: string;
        public dateOfBirth: string;
        public placeOfBirth: string;
        public nationality: string;
        public constructor(init?: Partial<SearchResultOsfi>) { (Object as any).assign(this, init); }
    }
    export class SearchResultCanadianJustice
    {
        public resultStrength: number;
        public resultSimilarity: number;
        public resultResolved: boolean;
        public resultType: string;
        public dateUpdated: string;
        public name: string;
        public dateOfBirth: string;
        public country: string;
        public refId: number;
        public constructor(init?: Partial<SearchResultCanadianJustice>) { (Object as any).assign(this, init); }
    }
    export class SearchResultCanadianSema
    {
        public resultStrength: number;
        public resultSimilarity: number;
        public resultResolved: boolean;
        public resultType: string;
        public dateUpdated: string;
        public name: string;
        public dateOfBirth: string;
        public country: string;
        public schedule: string;
        public item: string;
        public constructor(init?: Partial<SearchResultCanadianSema>) { (Object as any).assign(this, init); }
    }
    export class SearchResultAddress
    {
        public searchResultAddressId: number;
        public type: string;
        public address1: string;
        public address2: string;
        public address3: string;
        public city: string;
        public county: string;
        public postCode: string;
        public country: string;
        public constructor(init?: Partial<SearchResultAddress>) { (Object as any).assign(this, init); }
    }
    export class SearchResultDateOfBirth
    {
        public searchResultDateOfBirthId: number;
        public dateOfBirth: string;
        public year?: number;
        public month?: number;
        public day?: number;
        public type: string;
        public constructor(init?: Partial<SearchResultDateOfBirth>) { (Object as any).assign(this, init); }
    }
    export class SearchResultName
    {
        public searchResultNameId: number;
        public type: string;
        public title: string;
        public fullName: string;
        public resultSimilarity: number;
        public constructor(init?: Partial<SearchResultName>) { (Object as any).assign(this, init); }
    }
    export class SearchResultNationality
    {
        public searchResultNationalityId: number;
        public nationality: string;
        public constructor(init?: Partial<SearchResultNationality>) { (Object as any).assign(this, init); }
    }
    export class SearchResultPlaceOfBirth
    {
        public searchResultPlaceOfBirthId: number;
        public placeOfBirth: string;
        public countryOfBirth: string;
        public constructor(init?: Partial<SearchResultPlaceOfBirth>) { (Object as any).assign(this, init); }
    }
    export class SearchResultRemark
    {
        public searchResultRemarkId: number;
        public name: string;
        public description: string;
        public constructor(init?: Partial<SearchResultRemark>) { (Object as any).assign(this, init); }
    }
    export class SearchResultEntry
    {
        public searchResultId: number;
        public resultStrength: number;
        public resultSimilarity: number;
        public resultResolved: boolean;
        public resultType: string;
        public dateUpdated?: string;
        public addresses: SearchResultAddress[];
        public datesOfBirth: SearchResultDateOfBirth[];
        public names: SearchResultName[];
        public nationalities: SearchResultNationality[];
        public placesOfBirth: SearchResultPlaceOfBirth[];
        public remarks: SearchResultRemark[];
        public constructor(init?: Partial<SearchResultEntry>) { (Object as any).assign(this, init); }
    }
    export class SearchResults
    {
        public euResults: SearchResultEu[];
        public hmtResults: SearchResultHmTreasury[];
        public hmtUkraineResults: SearchResultHmTreasury[];
        public ofacResults: SearchResultOfac[];
        public ofacConsolidatedResults: SearchResultOfac[];
        public dfatResults: SearchResultDfat[];
        public osfiResults: SearchResultOsfi[];
        public canadianJusticeResults: SearchResultCanadianJustice[];
        public canadianSemaResults: SearchResultCanadianSema[];
        public swissSecoResults: SearchResultEntry[];
        public constructor(init?: Partial<SearchResults>) { (Object as any).assign(this, init); }
    }
    export class SearchRecord
    {
        public id: number;
        public searchType: string;
        public dateSearched: string;
        public dateUpdated: string;
        public dateArchived?: string;
        public isArchived: boolean;
        public numOfResults: number;
        public clientInResults: boolean;
        public clientNotInResults: boolean;
        public affectedByUpdate: boolean;
        public searchCriteria: SearchCriteria;
        public searchResults: SearchResults;
        public constructor(init?: Partial<SearchRecord>) { (Object as any).assign(this, init); }
    }
    export class GetSearchData extends BaseResponse
    {
        public searchRecord: SearchRecord;
        public constructor(init?: Partial<GetSearchData>) { super(init); (Object as any).assign(this, init); }
    }
    // @DataContract
    export class GetSearchResponse
    {
        // @DataMember
        public data: GetSearchData;
        public constructor(init?: Partial<GetSearchResponse>) { (Object as any).assign(this, init); }
    }
    export class LoadCard
    {
        public wsid: number;
        public issCode: string;
        public txnCode: string;
        public publicToken: string;
        public locDate: string;
        public locTime: string;
        public itemID: number;
        public clientCode: string;
        public sysDate: string;
        public actionCode: string;
        public constructor(init?: Partial<LoadCard>) { (Object as any).assign(this, init); }
    }
    export class Ws_LoadResponse
    {
        public ws_LoadResult: LoadCard;
        public constructor(init?: Partial<Ws_LoadResponse>) { (Object as any).assign(this, init); }
    }
    export class AccountLoadResponse extends Ws_LoadResponse
    {
        public responseStatus: ResponseStatus;
        public constructor(init?: Partial<AccountLoadResponse>) { super(init); (Object as any).assign(this, init); }
    }
    export class VirtualViewSummary
    {
        public name: string;
        public entity: string;
        public queryBy: string;
        public count: number;
        public constructor(init?: Partial<VirtualViewSummary>) { (Object as any).assign(this, init); }
    }
    export class Regenerate
    {
        public wsid: string;
        public issCode: string;
        public pan: string;
        public publicToken: string;
        public actionCode: string;
        public cvv: string;
        public image: string;
        public expDate: string;
        public constructor(init?: Partial<Regenerate>) { (Object as any).assign(this, init); }
    }
    export class Ws_RegenerateResponse
    {
        public ws_RegenerateResult: Regenerate;
        public constructor(init?: Partial<Ws_RegenerateResponse>) { (Object as any).assign(this, init); }
    }
    export class RegenerateCardResponse extends Ws_RegenerateResponse
    {
        public responseStatus: ResponseStatus;
        public constructor(init?: Partial<RegenerateCardResponse>) { super(init); (Object as any).assign(this, init); }
    }
    export class Ws_Renew_CardResponse
    {
        public ws_Renew_CardResult: Regenerate;
        public constructor(init?: Partial<Ws_Renew_CardResponse>) { (Object as any).assign(this, init); }
    }
    export class RenewCardResponse extends Ws_Renew_CardResponse
    {
        public responseStatus: ResponseStatus;
        public constructor(init?: Partial<RenewCardResponse>) { super(init); (Object as any).assign(this, init); }
    }
    export enum PaymentInstructionResponseResponse
    {
        Accepted = 'Accepted',
        AccountDisabled = 'AccountDisabled',
        InsufficientFunds = 'InsufficientFunds',
        InvalidAccount = 'InvalidAccount',
        InvalidCurrency = 'InvalidCurrency',
        Rejected = 'Rejected',
    }
    export class PaymentInstructionResponse
    {
        // @Required()
        public endToEndIdentification: string;
        public response?: PaymentInstructionResponseResponse;
        public constructor(init?: Partial<PaymentInstructionResponse>) { (Object as any).assign(this, init); }
    }
    export class CreatePaymentSchemesResponse implements IClearBankApiResponse
    {
        public transactions: ObservableCollection<PaymentInstructionResponse>;
        public halLinks: ObservableCollection<HalLink>;
        public responseStatus: ResponseStatus;
        public errors: { [index: string]: string[]; };
        public constructor(init?: Partial<CreatePaymentSchemesResponse>) { (Object as any).assign(this, init); }
    }
    export class SendPaymentResponse extends CreatePaymentSchemesResponse
    {
        public constructor(init?: Partial<SendPaymentResponse>) { super(init); (Object as any).assign(this, init); }
    }
    export class BalanceTransfer
    {
        public wsid: number;
        public issCode: string;
        public txnCode: string;
        public publicToken: string;
        public locDate: string;
        public locTime: string;
        public newPAN: string;
        public clientCode: string;
        public sysDate: string;
        public actionCode: string;
        public avlBal: number;
        public blkAmt: number;
        public amtTxn: number;
        public curCode: string;
        public itemID: number;
        public constructor(init?: Partial<BalanceTransfer>) { (Object as any).assign(this, init); }
    }
    export class Ws_BalanceTransferResponse
    {
        public ws_BalanceTransferResult: BalanceTransfer;
        public constructor(init?: Partial<Ws_BalanceTransferResponse>) { (Object as any).assign(this, init); }
    }
    export class BalanceTransferResponse extends Ws_BalanceTransferResponse
    {
        public responseStatus: ResponseStatus;
        public constructor(init?: Partial<BalanceTransferResponse>) { super(init); (Object as any).assign(this, init); }
    }
    export class UnLoad
    {
        public wsid: number;
        public issCode: string;
        public txnCode: string;
        public publicToken: string;
        public locDate: string;
        public locTime: string;
        public amtUnLoad: number;
        public clientCode: string;
        public sysDate: string;
        public actionCode: string;
        public avlBal: number;
        public blkAmt: number;
        public itemID: number;
        public curCode: string;
        public constructor(init?: Partial<UnLoad>) { (Object as any).assign(this, init); }
    }
    export class Ws_UnLoadResponse
    {
        public ws_UnLoadResult: UnLoad;
        public constructor(init?: Partial<Ws_UnLoadResponse>) { (Object as any).assign(this, init); }
    }
    export class AccountUnLoadResponse extends Ws_UnLoadResponse
    {
        public responseStatus: ResponseStatus;
        public constructor(init?: Partial<AccountUnLoadResponse>) { super(init); (Object as any).assign(this, init); }
    }
    export class Institution extends MongoEntity implements IInstitution
    {
        public name: string;
        public code: string;
        public constructor(init?: Partial<Institution>) { super(init); (Object as any).assign(this, init); }
    }
    export class KycCheckProfile extends MongoEntity implements IKycCheckProfile
    {
        public name: string;
        public code: string;
        public constructor(init?: Partial<KycCheckProfile>) { super(init); (Object as any).assign(this, init); }
    }
    export class Processor extends MongoEntity
    {
        public name: string;
        public productTypes: ProductType[];
        public currencies: string[];
        public code: string;
        public constructor(init?: Partial<Processor>) { super(init); (Object as any).assign(this, init); }
    }
    export class AuthDeviceSummary implements IHasDeviceId, IDateTracking
    {
        public createdDate?: number;
        public modifiedDate?: number;
        public deviceId: string;
        public constructor(init?: Partial<AuthDeviceSummary>) { (Object as any).assign(this, init); }
    }
    export class RegisteredAccount implements IHasName, IHasBearerToken
    {
        public bearerToken: string;
        public name: string;
        public constructor(init?: Partial<RegisteredAccount>) { (Object as any).assign(this, init); }
    }
    export class RegisteredAccounts extends Array<RegisteredAccount>
    {
        public constructor(init?: Partial<RegisteredAccounts>) { super(); (Object as any).assign(this, init); }
    }
    export class CounterpartyTodo<T> implements IHasUBAN, IHasPrincipalERN
    {
        public transaction: T;
        public principalERN: string;
        public uban: string;
        public constructor(init?: Partial<CounterpartyTodo<T>>) { (Object as any).assign(this, init); }
    }
    export class CounterpartyComplete implements IHasUBAN
    {
        public countryOfOrigin: string[];
        public countryOfResidence: string[];
        public title: string[];
        public firstName: string[];
        public middleName: string[];
        public lastName: string[];
        public birthDate: number[];
        public gender: GenderType[];
        public nickName: string[];
        public mobilePhone: string[];
        public workPhone: string[];
        public homePhone: string[];
        public counterpartyType: CounterpartyType[];
        public accountName: string[];
        public businessName: string[];
        public uban: string;
        public constructor(init?: Partial<CounterpartyComplete>) { (Object as any).assign(this, init); }
    }
    export interface IMailboxPdf
    {
        filename: string;
        base64Pdf: string;
    }
    export class MessageActivity
    {
        public readTime: number;
        public readCount: number;
        public writeTime: number;
        public writeCount: number;
        public unread: number;
        public constructor(init?: Partial<MessageActivity>) { (Object as any).assign(this, init); }
    }
    export interface IMailboxSubject extends IHasERN, IDateTracking, IHasOwners, IHasExternalId
    {
        subject: string;
        workflowStatus: MailboxWorkflowStatus;
        messageCount: MessageActivity;
        messageCounts: ConcurrentDictionary<string, MessageActivity>;
        owner: MessageAuthor;
    }
    export enum MailboxType
    {
        User = 'User',
        InformationRequest = 'InformationRequest',
        CustomerService = 'CustomerService',
        Billing = 'Billing',
    }
    export interface IMailbox extends IHasERN, IDateTracking, IHasOwners
    {
        owner: MessageAuthor;
        type: MailboxType;
        unread?: number;
        unresolved?: number;
    }
    export interface IBeneficiary extends IPerson, IHasCustomerERN, IHasCreatedByERN, IHasBeneficiaryType
    {
    }
    export interface IHasBeneficiaryType
    {
        beneficiaryType: BeneficiaryType;
    }
    export interface IBeneficiaryAccount extends IHasOwners, IHasUBAN, IHasNickName, IHasERN, IHasBeneficiaryERN, IHasAccountERN, IHasConfidenceScore, ITransferDetails, IHasAccountHolder
    {
    }
    export interface ITransferDetails
    {
        swift: string;
        bban: string;
        iban: string;
        bankName: string;
        sortCode: string;
        accountNumber: string;
        accountName: string;
    }
    export interface IHasAccountHolder
    {
        accountHolder: string;
    }
    export interface IRiskOverrideAdditionalTerms extends IRiskOverrideTerm
    {
        additionalTerms: RiskOverrideTerm[];
    }
    export interface IRiskOverrideTerm
    {
        operator: RiskOverrideOperatorType;
        factorERN: string;
        compareSymbol: RiskOverrideCompareSymbolType;
        riskValue: number;
    }
    export class OverrideTermAuditRecord
    {
        public compareSymbol: RiskOverrideCompareSymbolType;
        public rightRisk: number;
        public operator: RiskOverrideOperatorType;
        public rightFactorERN: string;
        public leftScore?: number;
        public leftERN: string;
        public overrideERN: string;
        public answerERN: string;
        public isTrue: boolean;
        public query: string;
        public constructor(init?: Partial<OverrideTermAuditRecord>) { (Object as any).assign(this, init); }
    }
    export interface IRiskAssessmentCalculation extends IHasRiskScore
    {
        question: string;
        answer: string;
        answerType: RiskAnswerType;
        categoryWeight?: number;
        componentWeight?: number;
        factorWeight?: number;
        rawQuery: string;
        overrideTerms: OverrideTermAuditRecord[];
        calculatedScore?: number;
    }
    export interface IPrincipalAddress
    {
        id: string;
        type: AddressType;
        state: AddressState;
        addressLabel: string;
        building: string;
        street: string;
        city: string;
        stateDistrict: string;
        country: string;
        zipPostcode: string;
        longitude?: number;
        latitude?: number;
    }
    export interface ICreditSchedule
    {
        fps: CreditScheme;
        chaps: CreditScheme;
        swift: CreditScheme;
        bacs: CreditScheme;
        fx: CreditScheme;
    }
    export interface IFeeSchedule
    {
        monthly: MonthlyFee;
        volume: VolumeFee;
        fps: FeeScheme;
        bacs: FeeScheme;
        chaps: FeeScheme;
        swift: FeeScheme;
        fx: FeeScheme;
        hideTransactionFee?: boolean;
    }
    export interface IGroupProductOffer extends IHasOfferingCode
    {
        group: string;
        construct: string;
    }
    export interface IHasOfferingCode
    {
        offeringCode: string;
    }
    export interface IHasInstitutionERN extends IIsERN
    {
        institutionERN: string;
    }
    export interface IHasProcessorERN extends IIsERN
    {
        processorERN: string;
    }
    export interface IHasBillingProfileERN extends IIsERN
    {
        billingProfileERN: string;
    }
    export interface IHasBrandERN extends IIsERN
    {
        brandERN: string;
    }
    export interface IHasIndustries
    {
        industries: string[];
    }
    export interface IHasPermittedRiskScores
    {
        permittedRiskScores: number[];
    }
    export interface IHasNoticePeriod
    {
        noticePeriod?: number;
    }
    export interface IHasAccountNameSuffix
    {
        accountNameSuffix: string;
    }
    export interface INotification extends IIsAuthorized, IHasAuthenticatedAuthorization, IHasMessage, INotificationDetails, IAppBearerToken, IHasAuthRequestERN
    {
    }
    export interface INotificationDetails
    {
        header: string;
        verb: string;
        message: string;
    }
    export interface IAppBearerToken extends IHasAppBearerToken
    {
    }
    export interface IHasAppBearerToken
    {
        appBearerToken: string;
    }
    export interface IMongoJobEntity extends IHasJobERN, IDateTracking
    {
    }
    export interface IHasRetryJobERN extends IIsERN
    {
        retryJobERN: string;
    }
    export interface IHasFailedJobERN extends IIsERN
    {
        failedJobERN: string;
    }
    export interface IHasNullableScheduleDate
    {
        scheduleDate?: number;
    }
    export interface IHasJobType
    {
        type: JobType;
    }
    export interface IHasJobState
    {
        state: JobState;
    }
    export interface IHasJobOrigination
    {
        origination: JobOrigination;
    }
    export interface IHasContinueOnError
    {
        continueOnError: boolean;
    }
    export interface IHasTasks
    {
        tasks: JobTasks;
    }
    export interface IHasJobOutput
    {
        output: { [index: string]: string; };
    }
    export interface IHasJobException
    {
        exception: any;
    }
    export interface IHasBatchMode extends IHasBatchJobERN
    {
        batchMode: boolean;
    }
    export interface IHasSupplementaryData extends IHasBatchJobERN
    {
        supplementaryData: { [index: string]: string; };
    }
    export interface IJob
    {
        elapsedTime?: string;
        scheduleTime?: string;
        isValid: boolean;
        task: JobTask;
        subTask: JobTask;
        currentTask: JobTask;
        tasksTotal: number;
        currentTaskIndex: number;
        tasksRemaining: number;
        scheduleDate?: number;
        type: JobType;
        state: JobState;
        origination: JobOrigination;
        principalERN: string;
        programIds: string[];
        requestedBy: RequestedBy;
        approvedBy: ApprovedBy;
        continueOnError: boolean;
        tasks: JobTasks;
        crc: string;
        input: { [index: string]: string; };
        output: { [index: string]: string; };
        exception: string;
        retryJobERN: string;
        failedJobERN: string;
        batchMode: boolean;
        batchJobERN: string;
        meta: { [index: string]: string; };
        lookupERN: string;
        lookupERN2: string;
        id: string;
        jobERN: string;
        createdDate?: number;
        modifiedDate?: number;
    }
    export interface IDocumentSummary extends IHasERN, IHasDocumentType, IHasFileName, IHasContentLength, IHasContentType
    {
    }
    export interface IHasDocumentType
    {
        documentType: string;
    }
    export interface IHasFileName
    {
        fileName: string;
    }
    export interface IHasContentLength
    {
        contentLength: number;
    }
    export interface IHasContentType
    {
        contentType: string;
    }
    export interface ICustomerBusinessLookup extends IHasERN, IHasBusinessName, IHasCode
    {
    }
    export interface IHasStatusString
    {
        status: string;
    }
    export interface IHasAccountContextERN extends IIsERN
    {
        accountContextERN: string;
    }
    export interface IIsValidKycCheck
    {
        isValidKycCheck: boolean;
    }
    export interface IIsValidSanctionCheck
    {
        isValidSanctionCheck: boolean;
    }
    export interface IHasBeneficiaryCount
    {
        beneficiaryCount: number;
    }
    export interface IHasTags
    {
        tags: string[];
    }
    export interface IHasWorkIndustries extends IHasIndustries
    {
        workIndustries: string[];
    }
    export interface IHasSmsProviderOverride
    {
        smsProviderOverride?: SmsProviderType;
    }
    export interface IHasWebHookEnabled
    {
        webHookEnabled: boolean;
    }
    export interface IHasPkiEnabled
    {
        pkiEnabled: boolean;
    }
    export interface IHasCpmEnabled
    {
        cpmEnabled: boolean;
    }
    export interface IHasAuthLocked
    {
        authLocked: boolean;
    }
    export interface IHasStringLimits
    {
        sendLimits: { [index: string]: number; };
        transferLimits: { [index: string]: number; };
    }
    export interface ICustomer extends IPerson, IHasUserAuthId, IHasAccessCode, IHasRegistrationDate, IHasCode, IHasProgramIds, IHasSmsProviderOverride, IHasWebHookEnabled, IHasPkiEnabled, IHasCpmEnabled, IHasAuthLocked, IHasConsumerIndustryERNs
    {
    }
    export interface IHasAccessCode
    {
        accessCode: string;
    }
    export interface IHasRegistrationDate
    {
        registeredDate?: number;
    }
    export class EnumPropertyValue
    {
        public description: string;
        public name: string;
        public value: string;
        public constructor(init?: Partial<EnumPropertyValue>) { (Object as any).assign(this, init); }
    }
    export interface IRiskModelCollection extends IRiskModel, IRiskConfig
    {
        categories: ConcurrentDictionary<string, IRiskCategory>;
        components: ConcurrentDictionary<string, IRiskComponent>;
        factors: ConcurrentDictionary<string, IRiskFactor>;
        answers: ConcurrentDictionary<string, IRiskAnswer>;
        industries: ConcurrentDictionary<string, IRiskAnswer>;
        countries: ConcurrentDictionary<string, IRiskAnswer>;
        products: ConcurrentDictionary<string, IRiskAnswer>;
        overrides: ConcurrentDictionary<string, IRiskOverride>;
    }
    export interface IRiskAuditTrail extends IRedisOwner, IHasUserAuthId, IHasPrincipalERN
    {
        type: RiskAuditType;
        eventDate: number;
        oldValue: Object;
        newValue: Object;
    }
    export interface ITransactionHistory extends IHasPayloadDictionary, IHasHold
    {
        type: string;
        account: string;
    }
    export interface IHasPayloadDictionary
    {
        payload: SortedDictionary<string, string>;
    }
    export interface IHasHold
    {
        hold: boolean;
    }
    export interface IIsDisabled
    {
        disabled: boolean;
    }
    export interface IAccountBalance extends IAvailableBalance, ILedgerBalance, ITransactionBalance, IHoldBalance, IPresentBalance
    {
    }
    export interface IAvailableBalance
    {
        availableBalance: number;
        availableBalanceTimestamp?: number;
    }
    export interface ILedgerBalance
    {
        ledgerBalance: number;
        ledgerBalanceTimestamp?: number;
    }
    export interface ITransactionBalance
    {
        transactionBalance: number;
        transactionBalanceTimestamp?: number;
    }
    export interface IHoldBalance
    {
        holdBalance: number;
    }
    export interface IPresentBalance
    {
        presentBalance: number;
    }
    export interface ICurrency extends IHasCurrencyCode, IHasCurrencySymbol
    {
    }
    export interface IHasCurrencyCode
    {
        currencyCode: string;
    }
    export interface IHasCurrencySymbol
    {
        currencySymbol: string;
    }
    export interface IHasProgramId
    {
        programId: string;
    }
    export interface IHasCardContextERN extends IIsERN
    {
        cardContextERN: string;
    }
    export interface IHasProductType
    {
        productType: ProductType;
    }
    export interface IDisplayPoints
    {
        displayPoints: boolean;
    }
    export interface IShowPending
    {
        showPending: boolean;
    }
    export interface IIsHidden
    {
        isHidden: boolean;
    }
    // @DataContract
    export class HasConfidenceScore implements IHasConfidenceScore
    {
        // @DataMember
        public confidenceScore: number;
        // @DataMember
        public riskWeight: number;
        // @DataMember
        public overrideScore?: number;
        public constructor(init?: Partial<HasConfidenceScore>) { (Object as any).assign(this, init); }
    }
    export class RiskScoreModel implements IRiskScore
    {
        public riskScore?: number;
        public confidenceScore: number;
        public riskWeight: number;
        public overrideScore?: number;
        public overrideWeight?: number;
        public rawScore: number;
        public testMode: boolean;
        public tag: string;
        public rule: string;
        public message: string;
        public constructor(init?: Partial<RiskScoreModel>) { (Object as any).assign(this, init); }
    }
    export interface IHasRisk
    {
        risk: number;
    }
    export interface IHasCalculationScore
    {
        success: number;
        failure: number;
    }
    export interface IHasCalculationResult
    {
        confidenceScore: number;
    }
    export interface IInstitution extends IHasERN, IHasCode
    {
        name: string;
    }
    export interface IKycCheckProfile extends IHasERN, IHasCode
    {
        name: string;
    }
    export class AccountIdentifier implements IAccountIdentifier
    {
        public ownerName: string;
        public transactionOwnerName: string;
        public accountName: string;
        public institutionName: string;
        public iban: string;
        public bban: string;
        public oban: string;
        public upic: string;
        public cuid: string;
        public constructor(init?: Partial<AccountIdentifier>) { (Object as any).assign(this, init); }
    }
    export enum Currency
    {
        ALL = 'ALL',
        DZD = 'DZD',
        ARS = 'ARS',
        AUD = 'AUD',
        BSD = 'BSD',
        BHD = 'BHD',
        BDT = 'BDT',
        AMD = 'AMD',
        BBD = 'BBD',
        BMD = 'BMD',
        BTN = 'BTN',
        BOB = 'BOB',
        BWP = 'BWP',
        BZD = 'BZD',
        SBD = 'SBD',
        BND = 'BND',
        MMK = 'MMK',
        BIF = 'BIF',
        KHR = 'KHR',
        CAD = 'CAD',
        CVE = 'CVE',
        KYD = 'KYD',
        LKR = 'LKR',
        CLP = 'CLP',
        CNY = 'CNY',
        COP = 'COP',
        KMF = 'KMF',
        CRC = 'CRC',
        HRK = 'HRK',
        CUP = 'CUP',
        CZK = 'CZK',
        DKK = 'DKK',
        DOP = 'DOP',
        SVC = 'SVC',
        ETB = 'ETB',
        ERN = 'ERN',
        FKP = 'FKP',
        FJD = 'FJD',
        DJF = 'DJF',
        GMD = 'GMD',
        GIP = 'GIP',
        GTQ = 'GTQ',
        GNF = 'GNF',
        GYD = 'GYD',
        HTG = 'HTG',
        HNL = 'HNL',
        HKD = 'HKD',
        HUF = 'HUF',
        ISK = 'ISK',
        INR = 'INR',
        IDR = 'IDR',
        IRR = 'IRR',
        IQD = 'IQD',
        ILS = 'ILS',
        JMD = 'JMD',
        JPY = 'JPY',
        KZT = 'KZT',
        JOD = 'JOD',
        KES = 'KES',
        KPW = 'KPW',
        KRW = 'KRW',
        KWD = 'KWD',
        KGS = 'KGS',
        LAK = 'LAK',
        LBP = 'LBP',
        LSL = 'LSL',
        LRD = 'LRD',
        LYD = 'LYD',
        MOP = 'MOP',
        MWK = 'MWK',
        MYR = 'MYR',
        MVR = 'MVR',
        MUR = 'MUR',
        MXN = 'MXN',
        MNT = 'MNT',
        MDL = 'MDL',
        MAD = 'MAD',
        OMR = 'OMR',
        NAD = 'NAD',
        NPR = 'NPR',
        ANG = 'ANG',
        AWG = 'AWG',
        VUV = 'VUV',
        NZD = 'NZD',
        NIO = 'NIO',
        NGN = 'NGN',
        NOK = 'NOK',
        PKR = 'PKR',
        PAB = 'PAB',
        PGK = 'PGK',
        PYG = 'PYG',
        PEN = 'PEN',
        PHP = 'PHP',
        QAR = 'QAR',
        RUB = 'RUB',
        RWF = 'RWF',
        SHP = 'SHP',
        SAR = 'SAR',
        SCR = 'SCR',
        SLL = 'SLL',
        SGD = 'SGD',
        VND = 'VND',
        SOS = 'SOS',
        ZAR = 'ZAR',
        SSP = 'SSP',
        SZL = 'SZL',
        SEK = 'SEK',
        CHF = 'CHF',
        SYP = 'SYP',
        THB = 'THB',
        TOP = 'TOP',
        TTD = 'TTD',
        AED = 'AED',
        TND = 'TND',
        UGX = 'UGX',
        MKD = 'MKD',
        EGP = 'EGP',
        GBP = 'GBP',
        TZS = 'TZS',
        USD = 'USD',
        UYU = 'UYU',
        UZS = 'UZS',
        WST = 'WST',
        YER = 'YER',
        TWD = 'TWD',
        MRU = 'MRU',
        STN = 'STN',
        CUC = 'CUC',
        ZWL = 'ZWL',
        BYN = 'BYN',
        TMT = 'TMT',
        GHS = 'GHS',
        VEF = 'VEF',
        SDG = 'SDG',
        UYI = 'UYI',
        RSD = 'RSD',
        MZN = 'MZN',
        AZN = 'AZN',
        RON = 'RON',
        CHE = 'CHE',
        CHW = 'CHW',
        TRY = 'TRY',
        XAF = 'XAF',
        XCD = 'XCD',
        XOF = 'XOF',
        XPF = 'XPF',
        XBA = 'XBA',
        XBB = 'XBB',
        XBC = 'XBC',
        XBD = 'XBD',
        XAU = 'XAU',
        XDR = 'XDR',
        XAG = 'XAG',
        XPT = 'XPT',
        XTS = 'XTS',
        XPD = 'XPD',
        XUA = 'XUA',
        ZMW = 'ZMW',
        SRD = 'SRD',
        MGA = 'MGA',
        COU = 'COU',
        AFN = 'AFN',
        TJS = 'TJS',
        AOA = 'AOA',
        BGN = 'BGN',
        CDF = 'CDF',
        BAM = 'BAM',
        EUR = 'EUR',
        MXV = 'MXV',
        UAH = 'UAH',
        GEL = 'GEL',
        BOV = 'BOV',
        PLN = 'PLN',
        BRL = 'BRL',
        CLF = 'CLF',
        XSU = 'XSU',
        USN = 'USN',
        XXX = 'XXX',
    }
    export class NameValueRecord
    {
        public name: string;
        public value: string;
        public constructor(init?: Partial<NameValueRecord>) { (Object as any).assign(this, init); }
    }
    export class ClearBankTransaction extends MongoEntity
    {
        public account: AccountIdentifier;
        public transactionId: string;
        public type: string;
        public status: string;
        public scheme: string;
        public endToEndTransactionId: string;
        public actualEndToEndTransactionId: string;
        public internalReference: string;
        public amount: number;
        public timestampModified?: string;
        public timestampSettled?: string;
        public timestampCreated?: string;
        public schemeId: string;
        public transactionTime: string;
        public settledTime: string;
        public currencyCode: Currency;
        public debitCreditCode: string;
        public reference: string;
        public isReturn?: boolean;
        public counterpartAccount: AccountIdentifier;
        public supplementaryData: NameValueRecord[];
        public meta: { [index: string]: string; };
        public constructor(init?: Partial<ClearBankTransaction>) { super(init); (Object as any).assign(this, init); }
    }
    export interface ICreditScheme
    {
        in: CreditTier[];
        out: CreditTier[];
    }
    export interface IFeeScheme
    {
        in: FeeTier[];
        out: FeeTier[];
    }
    export interface IPlatformLayer
    {
        version: string;
    }
    export interface IJobTask extends IHasJobType, IHasJobState, IHasCRC, IHasJobException, IDateTracking, IHasTasks, IIsLongRunning, IIsCleanup
    {
    }
    export interface IIsLongRunning
    {
        isLongRunning?: boolean;
    }
    export interface IIsCleanup
    {
        cleanup: boolean;
    }
    export interface IRequestedBy extends IApprovedBy, IHasPendingApprovalState
    {
    }
    export interface IApprovedBy
    {
        userAuthId: string;
        userAuthEmail: string;
        date: number;
    }
    export interface IHasPendingApprovalState
    {
        approvalState: PendingApproval;
    }
    export interface IMemberSummary extends IHasERN, IHasName, IHasPosition
    {
    }
    export interface IHasPosition
    {
        position: string;
    }
    export interface IBusinessAccountSummary extends IHasName, IHasERN
    {
    }
    export interface IAclClaim
    {
        principal: string;
        operation: string;
        resource: string;
    }
    export interface IAddress extends IHasERN, IIsERN, IHasGeoLocation, IHasAddressLabel
    {
        addressLine1: string;
        addressLine2: string;
        addressLine3: string;
        addressLine4: string;
        addressLine5: string;
        addressLine6: string;
        addressLine7: string;
        addressLine8: string;
        building: string;
        cedexMailsort: string;
        city: string;
        company: string;
        country: string;
        department: string;
        dpsZipPlus: string;
        firstMonthOfResidence: string;
        firstYearOfResidence: string;
        lastMonthOfResidence: string;
        lastYearOfResidence: string;
        poBox: string;
        premise: string;
        principality: string;
        region: string;
        stateDistrict: string;
        street: string;
        subBuilding: string;
        subCity: string;
        subStreet: string;
        zipPostcode: string;
    }
    export interface IHasGeoLocation
    {
        latitude: string;
        longitude: string;
    }
    export interface IHasAddressLabel
    {
        addressLabel: string;
    }
    export class SystemTimeZone
    {
        public constructor(init?: Partial<SystemTimeZone>) { (Object as any).assign(this, init); }
    }
    export interface ICardSummary extends IHasERN, IHasCustomerERN, IHasAccountERN, IHasFactoryType, IHasStatusString, IIsLocked, ICardDetails, IHasProgramId, IHasTags, IHasCardType
    {
        locDate: string;
        startDate: string;
    }
    export interface IIsLocked
    {
        isLocked: boolean;
    }
    export interface ICardDetails
    {
        name: string;
        maskedPAN: string;
        expDate: string;
        publicToken: number;
    }
    export interface IHasCardType
    {
        cardType: CardType;
    }
    export class CardDesc
    {
        public publicToken: string;
        public currentLimitsGroup: string;
        public currentMCCGroup: string;
        public currentPERMSGroup: string;
        public currentFeeGroup: string;
        public currentSchedFeeGroup: string;
        public currentWSFeeGroup: string;
        public currentLinkageGroup: string;
        public currentFXGroup: string;
        public constructor(init?: Partial<CardDesc>) { (Object as any).assign(this, init); }
    }
    export interface IRiskScore extends IHasConfidenceScore, IHasRawScore
    {
        testMode: boolean;
        tag: string;
        rule: string;
        message: string;
    }
    export interface IHasRawScore
    {
        rawScore: number;
    }
    export interface IBaseDataResponse
    {
        responseStatus: ResponseStatus;
    }
    export interface IMessageAuthor
    {
        name: string;
        email: string;
        code: string;
    }
    export interface ICreditTier
    {
        lt?: number;
        lte?: number;
        gt?: number;
        gte?: number;
        count: number;
    }
    export interface IBalanceSheetTransaction
    {
        id: string;
        amount: number;
        fee: number;
        date: string;
    }
    export interface IFeePaymentRecord extends IHasFeePaymentOrderType, IHasFeePaymentOrderState, IHasBillingDate, IDateTracking
    {
        ern: string;
        acno: string;
        paymentReference: string;
        transactionIds: string[];
        amount: number;
    }
    export interface IHasFeePaymentOrderType
    {
        type: FeePaymentOrderType;
    }
    export interface IHasFeePaymentOrderState
    {
        state: FeePaymentOrderState;
    }
    export interface IHasBillingDate
    {
        billingDate: number;
    }
    export interface IVolumeFeeRate extends IHasLimitValue, IHasFeeRate
    {
    }
    export interface IHasFeeRate
    {
        feeRate?: number;
        feeRateMin?: number;
        feeRateMax?: number;
    }
    export interface IFeeTier extends IFeeValue
    {
        lt?: number;
        lte?: number;
        gt?: number;
        gte?: number;
    }
    export interface IFeeValue extends IHasFeeFixed, IHasFeeRate
    {
    }
    export class LimitLedger
    {
        public ledger: number;
        public actual: number;
        public constructor(init?: Partial<LimitLedger>) { (Object as any).assign(this, init); }
    }
    export interface IAccountIdentifier
    {
        iban: string;
        bban: string;
        oban: string;
        upic: string;
        cuid: string;
        accountName: string;
        institutionName: string;
    }
    export interface IFeeCount
    {
        count: number;
        value: number;
    }
    export class PlatformResponse
    {
        public platform: PlatformSummary;
        public responseStatus: ResponseStatus;
        public constructor(init?: Partial<PlatformResponse>) { (Object as any).assign(this, init); }
    }
    export class MockErrorResponse
    {
        public responseStatus: ResponseStatus;
        public constructor(init?: Partial<MockErrorResponse>) { (Object as any).assign(this, init); }
    }
    export class UpTimeResponse
    {
        public startedAt: string;
        public currentTime: string;
        public duration: string;
        public timeSpan: string;
        public responseStatus: ResponseStatus;
        public constructor(init?: Partial<UpTimeResponse>) { (Object as any).assign(this, init); }
    }
    export class PingResponse
    {
        public response: string;
        public upTime: UpTimeResponse;
        public responseStatus: ResponseStatus;
        public constructor(init?: Partial<PingResponse>) { (Object as any).assign(this, init); }
    }
    // @DataContract
    export class AuthenticateResponse implements IHasSessionId, IHasBearerToken
    {
        // @DataMember(Order=1)
        public userId: string;
        // @DataMember(Order=2)
        public sessionId: string;
        // @DataMember(Order=3)
        public userName: string;
        // @DataMember(Order=4)
        public displayName: string;
        // @DataMember(Order=5)
        public referrerUrl: string;
        // @DataMember(Order=6)
        public bearerToken: string;
        // @DataMember(Order=7)
        public refreshToken: string;
        // @DataMember(Order=8)
        public profileUrl: string;
        // @DataMember(Order=9)
        public roles: string[];
        // @DataMember(Order=10)
        public permissions: string[];
        // @DataMember(Order=11)
        public responseStatus: ResponseStatus;
        // @DataMember(Order=12)
        public meta: { [index: string]: string; };
        public constructor(init?: Partial<AuthenticateResponse>) { (Object as any).assign(this, init); }
    }
    export class NormalizeUserRolesResponse
    {
        public responseStatus: ResponseStatus;
        public results: string[];
        public constructor(init?: Partial<NormalizeUserRolesResponse>) { (Object as any).assign(this, init); }
    }
    // @DataContract
    export class AssignRolesResponse
    {
        // @DataMember(Order=1)
        public allRoles: string[];
        // @DataMember(Order=2)
        public allPermissions: string[];
        // @DataMember(Order=3)
        public meta: { [index: string]: string; };
        // @DataMember(Order=4)
        public responseStatus: ResponseStatus;
        public constructor(init?: Partial<AssignRolesResponse>) { (Object as any).assign(this, init); }
    }
    // @DataContract
    export class UnAssignRolesResponse
    {
        // @DataMember(Order=1)
        public allRoles: string[];
        // @DataMember(Order=2)
        public allPermissions: string[];
        // @DataMember(Order=3)
        public meta: { [index: string]: string; };
        // @DataMember(Order=4)
        public responseStatus: ResponseStatus;
        public constructor(init?: Partial<UnAssignRolesResponse>) { (Object as any).assign(this, init); }
    }
    // @DataContract
    export class RegisterResponse implements IHasSessionId, IHasBearerToken
    {
        // @DataMember(Order=1)
        public userId: string;
        // @DataMember(Order=2)
        public sessionId: string;
        // @DataMember(Order=3)
        public userName: string;
        // @DataMember(Order=4)
        public referrerUrl: string;
        // @DataMember(Order=5)
        public bearerToken: string;
        // @DataMember(Order=6)
        public refreshToken: string;
        // @DataMember(Order=7)
        public roles: string[];
        // @DataMember(Order=8)
        public permissions: string[];
        // @DataMember(Order=9)
        public responseStatus: ResponseStatus;
        // @DataMember(Order=10)
        public meta: { [index: string]: string; };
        public constructor(init?: Partial<RegisterResponse>) { (Object as any).assign(this, init); }
    }
    // @DataContract
    export class GetApiKeysResponse
    {
        // @DataMember(Order=1)
        public results: UserApiKey[];
        // @DataMember(Order=2)
        public meta: { [index: string]: string; };
        // @DataMember(Order=3)
        public responseStatus: ResponseStatus;
        public constructor(init?: Partial<GetApiKeysResponse>) { (Object as any).assign(this, init); }
    }
    // @DataContract
    export class RegenerateApiKeysResponse
    {
        // @DataMember(Order=1)
        public results: UserApiKey[];
        // @DataMember(Order=2)
        public meta: { [index: string]: string; };
        // @DataMember(Order=3)
        public responseStatus: ResponseStatus;
        public constructor(init?: Partial<RegenerateApiKeysResponse>) { (Object as any).assign(this, init); }
    }
    // @DataContract
    export class GetAccessTokenResponse
    {
        // @DataMember(Order=1)
        public accessToken: string;
        // @DataMember(Order=2)
        public meta: { [index: string]: string; };
        // @DataMember(Order=3)
        public responseStatus: ResponseStatus;
        public constructor(init?: Partial<GetAccessTokenResponse>) { (Object as any).assign(this, init); }
    }
    export class MfaAuthenticateResponse
    {
        public responseStatus: ResponseStatus;
        public result: string;
        public constructor(init?: Partial<MfaAuthenticateResponse>) { (Object as any).assign(this, init); }
    }
    export class MfaPreEnrollResponse
    {
        public responseStatus: ResponseStatus;
        public constructor(init?: Partial<MfaPreEnrollResponse>) { (Object as any).assign(this, init); }
    }
    export class MfaEnrollResponse
    {
        public responseStatus: ResponseStatus;
        public result: SetupCode;
        public constructor(init?: Partial<MfaEnrollResponse>) { (Object as any).assign(this, init); }
    }
    export class MfaConfirmResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<MfaConfirmResponse>) { (Object as any).assign(this, init); }
    }
    export class ChangePasswordResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<ChangePasswordResponse>) { (Object as any).assign(this, init); }
    }
    export class PasswordResetResponse
    {
        public mfa: boolean;
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<PasswordResetResponse>) { (Object as any).assign(this, init); }
    }
    export class PasswordResetConfirmResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<PasswordResetConfirmResponse>) { (Object as any).assign(this, init); }
    }
    export class BatchBeneficiaryAddResponse
    {
        public validationErrors: CsvValidationErrors;
        public validated: boolean;
        public responseStatus: ResponseStatus;
        public result: Job;
        public constructor(init?: Partial<BatchBeneficiaryAddResponse>) { (Object as any).assign(this, init); }
    }
    export class ListBeneficiaryDocumentsResponse implements IHasCount
    {
        public count: number;
        public responseStatus: ResponseStatus;
        public results: DocumentSummary[];
        public constructor(init?: Partial<ListBeneficiaryDocumentsResponse>) { (Object as any).assign(this, init); }
    }
    export class RemoveBeneficiaryDocumentResponse
    {
        public responseStatus: ResponseStatus;
        public result: BeneficiarySummary;
        public constructor(init?: Partial<RemoveBeneficiaryDocumentResponse>) { (Object as any).assign(this, init); }
    }
    export class GetBeneficiaryResponse
    {
        public responseStatus: ResponseStatus;
        public result: BeneficiarySummary;
        public constructor(init?: Partial<GetBeneficiaryResponse>) { (Object as any).assign(this, init); }
    }
    export class LinkBeneficiaryResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<LinkBeneficiaryResponse>) { (Object as any).assign(this, init); }
    }
    export class AddBeneficiaryResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<AddBeneficiaryResponse>) { (Object as any).assign(this, init); }
    }
    export class EditBeneficiaryResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<EditBeneficiaryResponse>) { (Object as any).assign(this, init); }
    }
    export class ListBeneficiaryAccountsResponse implements IHasCount
    {
        public count: number;
        public responseStatus: ResponseStatus;
        public results: BeneficiaryAccountRecord[];
        public constructor(init?: Partial<ListBeneficiaryAccountsResponse>) { (Object as any).assign(this, init); }
    }
    export class ListAccountOwnerBeneficiaryAccountsResponse implements IHasCount
    {
        public count: number;
        public responseStatus: ResponseStatus;
        public results: BeneficiaryAccountRecord[];
        public constructor(init?: Partial<ListAccountOwnerBeneficiaryAccountsResponse>) { (Object as any).assign(this, init); }
    }
    export class GetNotificationsBusinessSummaryResponse
    {
        public responseStatus: ResponseStatus;
        public result: CustomerBusinessSummary;
        public constructor(init?: Partial<GetNotificationsBusinessSummaryResponse>) { (Object as any).assign(this, init); }
    }
    export class GetBusinessSummaryResponse
    {
        public responseStatus: ResponseStatus;
        public result: CustomerBusinessSummary;
        public constructor(init?: Partial<GetBusinessSummaryResponse>) { (Object as any).assign(this, init); }
    }
    export class ListBusinessPendingPaymentsResponse
    {
        public responseStatus: ResponseStatus;
        public results: BusinessPendingJobsSummary[];
        public constructor(init?: Partial<ListBusinessPendingPaymentsResponse>) { (Object as any).assign(this, init); }
    }
    export class ListBusinessPendingRequestsResponse
    {
        public responseStatus: ResponseStatus;
        public count: number;
        public results: Job[];
        public constructor(init?: Partial<ListBusinessPendingRequestsResponse>) { (Object as any).assign(this, init); }
    }
    export class ListBusinessPaymentsResponse
    {
        public responseStatus: ResponseStatus;
        public count: number;
        public results: Job[];
        public constructor(init?: Partial<ListBusinessPaymentsResponse>) { (Object as any).assign(this, init); }
    }
    export class BusinessJobApproveResponse implements IHasSendSmsVerificationCode
    {
        public responseStatus: ResponseStatus;
        public result: Job;
        public sendSmsVerificationCode: boolean;
        public constructor(init?: Partial<BusinessJobApproveResponse>) { (Object as any).assign(this, init); }
    }
    export class BusinessJobRejectResponse
    {
        public responseStatus: ResponseStatus;
        public result: Job;
        public constructor(init?: Partial<BusinessJobRejectResponse>) { (Object as any).assign(this, init); }
    }
    export class BusinessJobRetryResponse
    {
        public responseStatus: ResponseStatus;
        public result: Job;
        public constructor(init?: Partial<BusinessJobRetryResponse>) { (Object as any).assign(this, init); }
    }
    export class BusinessGrantAclResponse
    {
        public responseStatus: ResponseStatus;
        public result: Job;
        public constructor(init?: Partial<BusinessGrantAclResponse>) { (Object as any).assign(this, init); }
    }
    export class BusinessDenyAclResponse
    {
        public responseStatus: ResponseStatus;
        public result: Job;
        public constructor(init?: Partial<BusinessDenyAclResponse>) { (Object as any).assign(this, init); }
    }
    export class BusinessRevokeAclResponse
    {
        public responseStatus: ResponseStatus;
        public result: Job;
        public constructor(init?: Partial<BusinessRevokeAclResponse>) { (Object as any).assign(this, init); }
    }
    export class ListBusinessBeneficiaryAccountsResponse
    {
        public responseStatus: ResponseStatus;
        public results: BeneficiaryAccountRecord[];
        public constructor(init?: Partial<ListBusinessBeneficiaryAccountsResponse>) { (Object as any).assign(this, init); }
    }
    export class UpdateMobilePhoneAuthResponse
    {
        public responseStatus: ResponseStatus;
        public result: UpdateMobilePhoneAuthRequest;
        public constructor(init?: Partial<UpdateMobilePhoneAuthResponse>) { (Object as any).assign(this, init); }
    }
    // @Route("/update/mobile/phone/auth", "POST")
    export class UpdateMobilePhoneAuthRequest implements IReturn<UpdateMobilePhoneAuthResponse>, IHasCRC, IHasMobilePhone, IHasSendEmailVerificationCode, IHasEmailVerificationCode, IHasSendSmsVerificationCode, IHasSmsVerificationCode
    {
        public isValid: boolean;
        public crc: string;
        public emailVerificationCode: string;
        public mobilePhone: string;
        public sendEmailVerificationCode: boolean;
        public sendSmsVerificationCode: boolean;
        public smsVerificationCode: string;
        public constructor(init?: Partial<UpdateMobilePhoneAuthRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'UpdateMobilePhoneAuthRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new UpdateMobilePhoneAuthResponse(); }
    }
    export class UpdateMobilePhoneResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<UpdateMobilePhoneResponse>) { (Object as any).assign(this, init); }
    }
    export class ResetCustomerRegistrationResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<ResetCustomerRegistrationResponse>) { (Object as any).assign(this, init); }
    }
    export class ResendSmsVerificationCodeResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<ResendSmsVerificationCodeResponse>) { (Object as any).assign(this, init); }
    }
    export class ResendEmailVerificationCodeResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<ResendEmailVerificationCodeResponse>) { (Object as any).assign(this, init); }
    }
    export class CustomerResponse
    {
        public responseStatus: ResponseStatus;
        public result: CustomerSummary;
        public constructor(init?: Partial<CustomerResponse>) { (Object as any).assign(this, init); }
    }
    export class StartRegistrationResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<StartRegistrationResponse>) { (Object as any).assign(this, init); }
    }
    export class FinishRegistrationResponse
    {
        public responseStatus: ResponseStatus;
        public result: Customer;
        public constructor(init?: Partial<FinishRegistrationResponse>) { (Object as any).assign(this, init); }
    }
    export class ListAccountDocumentsResponse
    {
        public responseStatus: ResponseStatus;
        public count: number;
        public results: AccountPdfDocument[];
        public constructor(init?: Partial<ListAccountDocumentsResponse>) { (Object as any).assign(this, init); }
    }
    export class GetAccountDocumentResponse
    {
        public responseStatus: ResponseStatus;
        public result: string;
        public constructor(init?: Partial<GetAccountDocumentResponse>) { (Object as any).assign(this, init); }
    }
    export class ListEnumsResponse
    {
        public responseStatus: ResponseStatus;
        public result: { [index: string]: EnumPropertyValue[]; };
        public constructor(init?: Partial<ListEnumsResponse>) { (Object as any).assign(this, init); }
    }
    export class NotificationProfileResponse
    {
        public responseStatus: ResponseStatus;
        public result: NotificationProfile;
        public constructor(init?: Partial<NotificationProfileResponse>) { (Object as any).assign(this, init); }
    }
    export class NotificationProfileTransactionsResponse
    {
        public responseStatus: ResponseStatus;
        public result: TransactionNotifications;
        public constructor(init?: Partial<NotificationProfileTransactionsResponse>) { (Object as any).assign(this, init); }
    }
    export class GetPendingTransactionIdResponse
    {
        public responseStatus: ResponseStatus;
        public result: string;
        public constructor(init?: Partial<GetPendingTransactionIdResponse>) { (Object as any).assign(this, init); }
    }
    export class ListPendingTransactionMessagesResponse
    {
        public responseStatus: ResponseStatus;
        public result: PendingTransactionMessages;
        public constructor(init?: Partial<ListPendingTransactionMessagesResponse>) { (Object as any).assign(this, init); }
    }
    export class PendingTransactionClientMessageResponse
    {
        public responseStatus: ResponseStatus;
        public result: PendingTransactionMessages;
        public constructor(init?: Partial<PendingTransactionClientMessageResponse>) { (Object as any).assign(this, init); }
    }
    export class RejectPendingTransactionResponse
    {
        public responseStatus: ResponseStatus;
        public result: string;
        public constructor(init?: Partial<RejectPendingTransactionResponse>) { (Object as any).assign(this, init); }
    }
    export class EnrollDigitalSignatureResponse
    {
        public responseStatus: ResponseStatus;
        public result: string;
        public constructor(init?: Partial<EnrollDigitalSignatureResponse>) { (Object as any).assign(this, init); }
    }
    export class ListPkiCertificatesResponse
    {
        public responseStatus: ResponseStatus;
        public results: CertificateSummary[];
        public constructor(init?: Partial<ListPkiCertificatesResponse>) { (Object as any).assign(this, init); }
    }
    export class PkiCertificateResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<PkiCertificateResponse>) { (Object as any).assign(this, init); }
    }
    export class RiskModelCollectionResponse
    {
        public responseStatus: ResponseStatus;
        public result: RiskModelCollection;
        public constructor(init?: Partial<RiskModelCollectionResponse>) { (Object as any).assign(this, init); }
    }
    export class ListRiskAuditTrailResponse
    {
        public responseStatus: ResponseStatus;
        public results: RiskAuditTrailRecord[];
        public count: number;
        public constructor(init?: Partial<ListRiskAuditTrailResponse>) { (Object as any).assign(this, init); }
    }
    export class ListRiskTemplateResponse
    {
        public responseStatus: ResponseStatus;
        public results: RiskModelRecord[];
        public count: number;
        public constructor(init?: Partial<ListRiskTemplateResponse>) { (Object as any).assign(this, init); }
    }
    export class RiskTemplateResponse
    {
        public responseStatus: ResponseStatus;
        public result: RiskModelRecord;
        public constructor(init?: Partial<RiskTemplateResponse>) { (Object as any).assign(this, init); }
    }
    export class RiskConfigResponse
    {
        public responseStatus: ResponseStatus;
        public result: RiskConfigRecord;
        public constructor(init?: Partial<RiskConfigResponse>) { (Object as any).assign(this, init); }
    }
    export class RiskModelResponse
    {
        public responseStatus: ResponseStatus;
        public result: RiskModelRecord;
        public constructor(init?: Partial<RiskModelResponse>) { (Object as any).assign(this, init); }
    }
    export class ListRiskModelResponse implements IIsModelValid
    {
        public responseStatus: ResponseStatus;
        public isModelValid: boolean;
        public results: RiskModelRecord[];
        public count: number;
        public constructor(init?: Partial<ListRiskModelResponse>) { (Object as any).assign(this, init); }
    }
    export class RiskCategoryResponse
    {
        public responseStatus: ResponseStatus;
        public result: RiskCategoryRecord;
        public constructor(init?: Partial<RiskCategoryResponse>) { (Object as any).assign(this, init); }
    }
    export class ListRiskCategoryResponse implements IIsModelValid
    {
        public responseStatus: ResponseStatus;
        public isModelValid: boolean;
        public results: RiskCategoryRecord[];
        public count: number;
        public constructor(init?: Partial<ListRiskCategoryResponse>) { (Object as any).assign(this, init); }
    }
    export class RiskComponentResponse
    {
        public responseStatus: ResponseStatus;
        public result: RiskComponentRecord;
        public constructor(init?: Partial<RiskComponentResponse>) { (Object as any).assign(this, init); }
    }
    export class ListRiskComponentResponse implements IIsModelValid
    {
        public responseStatus: ResponseStatus;
        public isModelValid: boolean;
        public results: RiskComponentRecord[];
        public count: number;
        public constructor(init?: Partial<ListRiskComponentResponse>) { (Object as any).assign(this, init); }
    }
    export class RiskFactorResponse
    {
        public responseStatus: ResponseStatus;
        public result: RiskFactorRecord;
        public constructor(init?: Partial<RiskFactorResponse>) { (Object as any).assign(this, init); }
    }
    export class ListRiskFactorResponse implements IIsModelValid
    {
        public responseStatus: ResponseStatus;
        public isModelValid: boolean;
        public results: RiskFactorRecord[];
        public count: number;
        public constructor(init?: Partial<ListRiskFactorResponse>) { (Object as any).assign(this, init); }
    }
    export class RiskAnswerResponse
    {
        public responseStatus: ResponseStatus;
        public result: RiskAnswerRecord;
        public constructor(init?: Partial<RiskAnswerResponse>) { (Object as any).assign(this, init); }
    }
    export class ListRiskAnswerResponse
    {
        public responseStatus: ResponseStatus;
        public results: RiskAnswerRecord[];
        public count: number;
        public constructor(init?: Partial<ListRiskAnswerResponse>) { (Object as any).assign(this, init); }
    }
    export class RiskOverrideResponse
    {
        public responseStatus: ResponseStatus;
        public result: RiskOverrideRecord;
        public constructor(init?: Partial<RiskOverrideResponse>) { (Object as any).assign(this, init); }
    }
    export class ListRiskOverrideResponse
    {
        public responseStatus: ResponseStatus;
        public results: RiskOverrideRecord[];
        public count: number;
        public constructor(init?: Partial<ListRiskOverrideResponse>) { (Object as any).assign(this, init); }
    }
    export class RiskModelAnswerKeyResponse
    {
        public responseStatus: ResponseStatus;
        public result: RiskModelAnswerKeyRecord;
        public constructor(init?: Partial<RiskModelAnswerKeyResponse>) { (Object as any).assign(this, init); }
    }
    export class ListRiskAnswerKeyResponse
    {
        public responseStatus: ResponseStatus;
        public results: RiskModelAnswerKeyRecord[];
        public count: number;
        public constructor(init?: Partial<ListRiskAnswerKeyResponse>) { (Object as any).assign(this, init); }
    }
    export class RiskListResponse
    {
        public responseStatus: ResponseStatus;
        public result: RiskListRecord;
        public constructor(init?: Partial<RiskListResponse>) { (Object as any).assign(this, init); }
    }
    export class ListRiskListResponse
    {
        public responseStatus: ResponseStatus;
        public results: RiskListRecord[];
        public count: number;
        public constructor(init?: Partial<ListRiskListResponse>) { (Object as any).assign(this, init); }
    }
    export class RiskSystemListResponse
    {
        public responseStatus: ResponseStatus;
        public result: RiskAnswerRecord;
        public constructor(init?: Partial<RiskSystemListResponse>) { (Object as any).assign(this, init); }
    }
    export class ListRiskSystemListResponse
    {
        public responseStatus: ResponseStatus;
        public results: RiskAnswerRecord[];
        public count: number;
        public constructor(init?: Partial<ListRiskSystemListResponse>) { (Object as any).assign(this, init); }
    }
    export class RiskAssessmentResponse
    {
        public responseStatus: ResponseStatus;
        public result: RiskAssessmentRecord;
        public constructor(init?: Partial<RiskAssessmentResponse>) { (Object as any).assign(this, init); }
    }
    export class ListRiskAssessmentResponse
    {
        public responseStatus: ResponseStatus;
        public results: RiskAssessmentRecord[];
        public count: number;
        public constructor(init?: Partial<ListRiskAssessmentResponse>) { (Object as any).assign(this, init); }
    }
    export class SiteConfigurationResponse
    {
        public instrumentationKey: string;
        public autoLogoffMinutes: number;
        public buildNumber: string;
        public features: string[];
        public responseStatus: ResponseStatus;
        public constructor(init?: Partial<SiteConfigurationResponse>) { (Object as any).assign(this, init); }
    }
    export class ChapsStatusResponse
    {
        public responseStatus: ResponseStatus;
        public result: ChapsTimeZoneAvailable;
        public constructor(init?: Partial<ChapsStatusResponse>) { (Object as any).assign(this, init); }
    }
    export class GetCustomerLimitResponse
    {
        public responseStatus: ResponseStatus;
        public result: CustomerLimit;
        public constructor(init?: Partial<GetCustomerLimitResponse>) { (Object as any).assign(this, init); }
    }
    export class ListBatchPaymentsResponse
    {
        public responseStatus: ResponseStatus;
        public results: Job[];
        public constructor(init?: Partial<ListBatchPaymentsResponse>) { (Object as any).assign(this, init); }
    }
    export class CancelBatchPaymentResponse
    {
        public responseStatus: ResponseStatus;
        public result: string;
        public constructor(init?: Partial<CancelBatchPaymentResponse>) { (Object as any).assign(this, init); }
    }
    export class ListTransactionsBatchResponse
    {
        public results: { [index: string]: PagedTransactionResults; };
        public responseStatus: ResponseStatus;
        public constructor(init?: Partial<ListTransactionsBatchResponse>) { (Object as any).assign(this, init); }
    }
    export class ListTransactionsResponse
    {
        public responseStatus: ResponseStatus;
        public count: number;
        public results: TransactionHistory[];
        public constructor(init?: Partial<ListTransactionsResponse>) { (Object as any).assign(this, init); }
    }
    export class ListPendingPaymentOrdersResponse
    {
        public responseStatus: ResponseStatus;
        public results: Job[];
        public constructor(init?: Partial<ListPendingPaymentOrdersResponse>) { (Object as any).assign(this, init); }
    }
    export class ApiSendFundsResponse
    {
        public responseStatus: ResponseStatus;
        public result: Job;
        public constructor(init?: Partial<ApiSendFundsResponse>) { (Object as any).assign(this, init); }
    }
    export class BatchSendFundsResponse implements IHasCRC
    {
        public validationErrors: CsvValidationErrors;
        public validated: boolean;
        public sendVerificationCode: boolean;
        public crc: string;
        public responseStatus: ResponseStatus;
        public result: Job;
        public constructor(init?: Partial<BatchSendFundsResponse>) { (Object as any).assign(this, init); }
    }
    export class BkaSendFundsResponse implements IHasFeeFixed, IHasFeeCredit
    {
        public responseStatus: ResponseStatus;
        public result: Job;
        public feeFixed?: number;
        public feeCredit?: boolean;
        public constructor(init?: Partial<BkaSendFundsResponse>) { (Object as any).assign(this, init); }
    }
    export class BkaTransferFundsResponse
    {
        public responseStatus: ResponseStatus;
        public result: Job;
        public constructor(init?: Partial<BkaTransferFundsResponse>) { (Object as any).assign(this, init); }
    }
    export class ForSendFundsResponse
    {
        public responseStatus: ResponseStatus;
        public result: Job;
        public constructor(init?: Partial<ForSendFundsResponse>) { (Object as any).assign(this, init); }
    }
    export class ForTransferFundsResponse
    {
        public responseStatus: ResponseStatus;
        public result: Job;
        public constructor(init?: Partial<ForTransferFundsResponse>) { (Object as any).assign(this, init); }
    }
    export class ResendWebhookResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<ResendWebhookResponse>) { (Object as any).assign(this, init); }
    }
    export class SendTestWebhookResponse
    {
        public responseStatus: ResponseStatus;
        public result: HttpStatusCode;
        public constructor(init?: Partial<SendTestWebhookResponse>) { (Object as any).assign(this, init); }
    }
    export class ListCustomerWebhooksResponse
    {
        public responseStatus: ResponseStatus;
        public results: WebhookSummary[];
        public constructor(init?: Partial<ListCustomerWebhooksResponse>) { (Object as any).assign(this, init); }
    }
    export class CustomerWebhookResponse
    {
        public responseStatus: ResponseStatus;
        public result: WebhookSubscription;
        public constructor(init?: Partial<CustomerWebhookResponse>) { (Object as any).assign(this, init); }
    }
    export class JobResponse
    {
        public responseStatus: ResponseStatus;
        public result: Job;
        public constructor(init?: Partial<JobResponse>) { (Object as any).assign(this, init); }
    }
    export class ListJobResponse
    {
        public responseStatus: ResponseStatus;
        public count: number;
        public results: Job[];
        public constructor(init?: Partial<ListJobResponse>) { (Object as any).assign(this, init); }
    }
    export class CreateAccountMandateResponse implements IClearBankApiResponse
    {
        public halLinks: ObservableCollection<HalLink>;
        public responseStatus: ResponseStatus;
        public errors: { [index: string]: string[]; };
        public constructor(init?: Partial<CreateAccountMandateResponse>) { (Object as any).assign(this, init); }
    }
    export class DeleteAccountMandatesResponse implements IClearBankApiResponse
    {
        public halLinks: ObservableCollection<HalLink>;
        public responseStatus: ResponseStatus;
        public errors: { [index: string]: string[]; };
        public constructor(init?: Partial<DeleteAccountMandatesResponse>) { (Object as any).assign(this, init); }
    }
    export class CreateAccountMandateReturnResponse implements IClearBankApiResponse
    {
        public halLinks: ObservableCollection<HalLink>;
        public responseStatus: ResponseStatus;
        public errors: { [index: string]: string[]; };
        public constructor(init?: Partial<CreateAccountMandateReturnResponse>) { (Object as any).assign(this, init); }
    }
    export class PatchAccountMandatesResponse implements IClearBankApiResponse
    {
        public halLinks: ObservableCollection<HalLink>;
        public responseStatus: ResponseStatus;
        public errors: { [index: string]: string[]; };
        public constructor(init?: Partial<PatchAccountMandatesResponse>) { (Object as any).assign(this, init); }
    }
    export class AddBeneficiaryBlacklistJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: BeneficiaryBlacklist;
        public constructor(init?: Partial<AddBeneficiaryBlacklistJobResponse>) { (Object as any).assign(this, init); }
    }
    export class AddBusinessJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: BusinessSummary;
        public constructor(init?: Partial<AddBusinessJobResponse>) { (Object as any).assign(this, init); }
    }
    export class AddBusinessBeneficiaryJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<AddBusinessBeneficiaryJobResponse>) { (Object as any).assign(this, init); }
    }
    export class AddBusinessProductJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: AccountSummary;
        public constructor(init?: Partial<AddBusinessProductJobResponse>) { (Object as any).assign(this, init); }
    }
    export class AddCustomerJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: CustomerSummaryRecord;
        public constructor(init?: Partial<AddCustomerJobResponse>) { (Object as any).assign(this, init); }
    }
    export class AddCustomerProductJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: AccountSummary;
        public constructor(init?: Partial<AddCustomerProductJobResponse>) { (Object as any).assign(this, init); }
    }
    export class AddDictionaryBlacklistJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: DictionaryBlacklist;
        public constructor(init?: Partial<AddDictionaryBlacklistJobResponse>) { (Object as any).assign(this, init); }
    }
    export class AddRemitterBlacklistJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: RemitterBlacklist;
        public constructor(init?: Partial<AddRemitterBlacklistJobResponse>) { (Object as any).assign(this, init); }
    }
    export class AddRemitterWhitelistJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: RemitterWhitelist;
        public constructor(init?: Partial<AddRemitterWhitelistJobResponse>) { (Object as any).assign(this, init); }
    }
    export class BatchBeneficiaryAddJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<BatchBeneficiaryAddJobResponse>) { (Object as any).assign(this, init); }
    }
    export class BatchImportTransactionsJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: string;
        public constructor(init?: Partial<BatchImportTransactionsJobResponse>) { (Object as any).assign(this, init); }
    }
    export class BatchSendFundsJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<BatchSendFundsJobResponse>) { (Object as any).assign(this, init); }
    }
    export class ChangeAccountProductOfferJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<ChangeAccountProductOfferJobResponse>) { (Object as any).assign(this, init); }
    }
    export class ChangeAccountStatusJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<ChangeAccountStatusJobResponse>) { (Object as any).assign(this, init); }
    }
    export class ChangeBusinessContactJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<ChangeBusinessContactJobResponse>) { (Object as any).assign(this, init); }
    }
    export class ChangeBusinessIndustryJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<ChangeBusinessIndustryJobResponse>) { (Object as any).assign(this, init); }
    }
    export class ChangeBusinessStatusJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<ChangeBusinessStatusJobResponse>) { (Object as any).assign(this, init); }
    }
    export class ChangeCardGroupJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: ChangeGroupsResponse;
        public constructor(init?: Partial<ChangeCardGroupJobResponse>) { (Object as any).assign(this, init); }
    }
    export class ChangeCardStatusJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<ChangeCardStatusJobResponse>) { (Object as any).assign(this, init); }
    }
    export class ChangeCustomerContactJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: Customer;
        public constructor(init?: Partial<ChangeCustomerContactJobResponse>) { (Object as any).assign(this, init); }
    }
    export class ChangeCustomerIndustryJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<ChangeCustomerIndustryJobResponse>) { (Object as any).assign(this, init); }
    }
    export class ChangeCustomerStatusJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<ChangeCustomerStatusJobResponse>) { (Object as any).assign(this, init); }
    }
    export class ComplianceBlacklistTransactionJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<ComplianceBlacklistTransactionJobResponse>) { (Object as any).assign(this, init); }
    }
    export class ComplianceDenyBusinessAclJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<ComplianceDenyBusinessAclJobResponse>) { (Object as any).assign(this, init); }
    }
    export class ComplianceGrantBusinessAclJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<ComplianceGrantBusinessAclJobResponse>) { (Object as any).assign(this, init); }
    }
    export class CompliancePendingTransactionLockJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<CompliancePendingTransactionLockJobResponse>) { (Object as any).assign(this, init); }
    }
    export class CompliancePendingTransactionResetJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<CompliancePendingTransactionResetJobResponse>) { (Object as any).assign(this, init); }
    }
    export class CompliancePendingTransactionUnlockJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<CompliancePendingTransactionUnlockJobResponse>) { (Object as any).assign(this, init); }
    }
    export class ComplianceRejectTransactionJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<ComplianceRejectTransactionJobResponse>) { (Object as any).assign(this, init); }
    }
    export class ComplianceReleaseTransactionJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<ComplianceReleaseTransactionJobResponse>) { (Object as any).assign(this, init); }
    }
    export class ComplianceRevokeBusinessAclJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<ComplianceRevokeBusinessAclJobResponse>) { (Object as any).assign(this, init); }
    }
    export class ComplianceSetConfidenceScoreJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<ComplianceSetConfidenceScoreJobResponse>) { (Object as any).assign(this, init); }
    }
    export class ComplianceWhitelistTransactionJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<ComplianceWhitelistTransactionJobResponse>) { (Object as any).assign(this, init); }
    }
    export class DeleteBusinessJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: BusinessSummary;
        public constructor(init?: Partial<DeleteBusinessJobResponse>) { (Object as any).assign(this, init); }
    }
    export class DeleteCustomerJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: CustomerSummary;
        public constructor(init?: Partial<DeleteCustomerJobResponse>) { (Object as any).assign(this, init); }
    }
    export class DenyBusinessAclJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<DenyBusinessAclJobResponse>) { (Object as any).assign(this, init); }
    }
    export class ExecuteBeneficiaryReportJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<ExecuteBeneficiaryReportJobResponse>) { (Object as any).assign(this, init); }
    }
    export class ExecuteBillingReportJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: string;
        public constructor(init?: Partial<ExecuteBillingReportJobResponse>) { (Object as any).assign(this, init); }
    }
    export class ExecuteBlacklistReportJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<ExecuteBlacklistReportJobResponse>) { (Object as any).assign(this, init); }
    }
    export class ExecuteClearBankAccountsReportJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: string;
        public constructor(init?: Partial<ExecuteClearBankAccountsReportJobResponse>) { (Object as any).assign(this, init); }
    }
    export class ExecuteClearBankNonCustomerReportJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: string;
        public constructor(init?: Partial<ExecuteClearBankNonCustomerReportJobResponse>) { (Object as any).assign(this, init); }
    }
    export class ExecuteClearBankTransactionsReportJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: string;
        public constructor(init?: Partial<ExecuteClearBankTransactionsReportJobResponse>) { (Object as any).assign(this, init); }
    }
    export class ExecuteDailyCdeReportJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: string;
        public constructor(init?: Partial<ExecuteDailyCdeReportJobResponse>) { (Object as any).assign(this, init); }
    }
    export class ExecuteDocumentsReportJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: string;
        public constructor(init?: Partial<ExecuteDocumentsReportJobResponse>) { (Object as any).assign(this, init); }
    }
    export class ExecuteFeesReportJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: string;
        public constructor(init?: Partial<ExecuteFeesReportJobResponse>) { (Object as any).assign(this, init); }
    }
    export class ExecuteKycCheckJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: KycCheckResponse;
        public constructor(init?: Partial<ExecuteKycCheckJobResponse>) { (Object as any).assign(this, init); }
    }
    export class ExecuteNightlyReportsJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<ExecuteNightlyReportsJobResponse>) { (Object as any).assign(this, init); }
    }
    export class ExecuteOutgoingTransactionMonitoringPipelineJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: IRiskCalculation;
        public constructor(init?: Partial<ExecuteOutgoingTransactionMonitoringPipelineJobResponse>) { (Object as any).assign(this, init); }
    }
    export class ExecutePendingTransactionsReportJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: string;
        public constructor(init?: Partial<ExecutePendingTransactionsReportJobResponse>) { (Object as any).assign(this, init); }
    }
    export class ExecuteSanctionCheckJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: GetSearchResponse;
        public constructor(init?: Partial<ExecuteSanctionCheckJobResponse>) { (Object as any).assign(this, init); }
    }
    export class ExecuteSanctionCheckUpdateJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<ExecuteSanctionCheckUpdateJobResponse>) { (Object as any).assign(this, init); }
    }
    export class ExecuteSanctionsReportJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<ExecuteSanctionsReportJobResponse>) { (Object as any).assign(this, init); }
    }
    export class GrantBusinessAclJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<GrantBusinessAclJobResponse>) { (Object as any).assign(this, init); }
    }
    export class LinkBusinessAccountJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<LinkBusinessAccountJobResponse>) { (Object as any).assign(this, init); }
    }
    export class LinkBusinessBeneficiaryJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<LinkBusinessBeneficiaryJobResponse>) { (Object as any).assign(this, init); }
    }
    export class LinkBusinessEntityJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<LinkBusinessEntityJobResponse>) { (Object as any).assign(this, init); }
    }
    export class LoadAccountJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: AccountLoadResponse;
        public constructor(init?: Partial<LoadAccountJobResponse>) { (Object as any).assign(this, init); }
    }
    export class MergeCustomerJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: CustomerSummaryRecord;
        public constructor(init?: Partial<MergeCustomerJobResponse>) { (Object as any).assign(this, init); }
    }
    export class NotificationProfilesJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<NotificationProfilesJobResponse>) { (Object as any).assign(this, init); }
    }
    export class NotificationTemplatesJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<NotificationTemplatesJobResponse>) { (Object as any).assign(this, init); }
    }
    export class ProcessAccountFeeJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<ProcessAccountFeeJobResponse>) { (Object as any).assign(this, init); }
    }
    export class RebuildVirtualViewJobResponse
    {
        public responseStatus: ResponseStatus;
        public results: VirtualViewSummary[];
        public constructor(init?: Partial<RebuildVirtualViewJobResponse>) { (Object as any).assign(this, init); }
    }
    export class RegenerateCardJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: RegenerateCardResponse;
        public constructor(init?: Partial<RegenerateCardJobResponse>) { (Object as any).assign(this, init); }
    }
    export class ReleasePendingTransactionJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<ReleasePendingTransactionJobResponse>) { (Object as any).assign(this, init); }
    }
    export class RenewCardJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: RenewCardResponse;
        public constructor(init?: Partial<RenewCardJobResponse>) { (Object as any).assign(this, init); }
    }
    export class ReversePendingTransactionJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<ReversePendingTransactionJobResponse>) { (Object as any).assign(this, init); }
    }
    export class RevokeBusinessAclJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<RevokeBusinessAclJobResponse>) { (Object as any).assign(this, init); }
    }
    export class SendFundsJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<SendFundsJobResponse>) { (Object as any).assign(this, init); }
    }
    export class SendFundsBkaJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: SendPaymentResponse;
        public constructor(init?: Partial<SendFundsBkaJobResponse>) { (Object as any).assign(this, init); }
    }
    export class SendFundsForJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: BalanceTransferResponse;
        public constructor(init?: Partial<SendFundsForJobResponse>) { (Object as any).assign(this, init); }
    }
    export class TestJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: string;
        public constructor(init?: Partial<TestJobResponse>) { (Object as any).assign(this, init); }
    }
    export class TestBatchJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<TestBatchJobResponse>) { (Object as any).assign(this, init); }
    }
    export class TestBatch2JobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<TestBatch2JobResponse>) { (Object as any).assign(this, init); }
    }
    export class TestScheduleJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: string;
        public constructor(init?: Partial<TestScheduleJobResponse>) { (Object as any).assign(this, init); }
    }
    export class ToggleAccountShowPendingJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<ToggleAccountShowPendingJobResponse>) { (Object as any).assign(this, init); }
    }
    export class ToggleAccountVisibilityJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<ToggleAccountVisibilityJobResponse>) { (Object as any).assign(this, init); }
    }
    export class ToggleBeneficiaryBlacklistJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: BeneficiaryBlacklist;
        public constructor(init?: Partial<ToggleBeneficiaryBlacklistJobResponse>) { (Object as any).assign(this, init); }
    }
    export class ToggleDictionaryBlacklistJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: DictionaryBlacklist;
        public constructor(init?: Partial<ToggleDictionaryBlacklistJobResponse>) { (Object as any).assign(this, init); }
    }
    export class ToggleRemitterBlacklistJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: RemitterBlacklist;
        public constructor(init?: Partial<ToggleRemitterBlacklistJobResponse>) { (Object as any).assign(this, init); }
    }
    export class ToggleRemitterWhitelistJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: RemitterWhitelist;
        public constructor(init?: Partial<ToggleRemitterWhitelistJobResponse>) { (Object as any).assign(this, init); }
    }
    export class TransactionMonitoringAddPresetJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: string;
        public constructor(init?: Partial<TransactionMonitoringAddPresetJobResponse>) { (Object as any).assign(this, init); }
    }
    export class TransactionMonitoringAddRuleJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: string;
        public constructor(init?: Partial<TransactionMonitoringAddRuleJobResponse>) { (Object as any).assign(this, init); }
    }
    export class TransactionMonitoringDeletePresetJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: string;
        public constructor(init?: Partial<TransactionMonitoringDeletePresetJobResponse>) { (Object as any).assign(this, init); }
    }
    export class TransactionMonitoringDeleteRuleJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: string;
        public constructor(init?: Partial<TransactionMonitoringDeleteRuleJobResponse>) { (Object as any).assign(this, init); }
    }
    export class TransactionMonitoringUpdatePresetJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: string;
        public constructor(init?: Partial<TransactionMonitoringUpdatePresetJobResponse>) { (Object as any).assign(this, init); }
    }
    export class TransactionMonitoringUpdateRuleJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: string;
        public constructor(init?: Partial<TransactionMonitoringUpdateRuleJobResponse>) { (Object as any).assign(this, init); }
    }
    export class TransferFundsJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<TransferFundsJobResponse>) { (Object as any).assign(this, init); }
    }
    export class TransferFundsBkaJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: SendPaymentResponse;
        public constructor(init?: Partial<TransferFundsBkaJobResponse>) { (Object as any).assign(this, init); }
    }
    export class TransferFundsForJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: BalanceTransferResponse;
        public constructor(init?: Partial<TransferFundsForJobResponse>) { (Object as any).assign(this, init); }
    }
    export class UnlinkBusinessAccountJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<UnlinkBusinessAccountJobResponse>) { (Object as any).assign(this, init); }
    }
    export class UnlinkBusinessBeneficiaryJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<UnlinkBusinessBeneficiaryJobResponse>) { (Object as any).assign(this, init); }
    }
    export class UnlinkBusinessEntityJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<UnlinkBusinessEntityJobResponse>) { (Object as any).assign(this, init); }
    }
    export class UnloadAccountJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: AccountUnLoadResponse;
        public constructor(init?: Partial<UnloadAccountJobResponse>) { (Object as any).assign(this, init); }
    }
    export class Update3DSecureJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<Update3DSecureJobResponse>) { (Object as any).assign(this, init); }
    }
    export class UpdateBeneficiaryBlacklistJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: BeneficiaryBlacklist;
        public constructor(init?: Partial<UpdateBeneficiaryBlacklistJobResponse>) { (Object as any).assign(this, init); }
    }
    export class UpdateBillingProfileAccountJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<UpdateBillingProfileAccountJobResponse>) { (Object as any).assign(this, init); }
    }
    export class UpdateBillingProfileProductOfferJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<UpdateBillingProfileProductOfferJobResponse>) { (Object as any).assign(this, init); }
    }
    export class UpdateBusinessBeneficiaryJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<UpdateBusinessBeneficiaryJobResponse>) { (Object as any).assign(this, init); }
    }
    export class UpdateDictionaryBlacklistJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: DictionaryBlacklist;
        public constructor(init?: Partial<UpdateDictionaryBlacklistJobResponse>) { (Object as any).assign(this, init); }
    }
    export class UpdateRemitterBlacklistJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: RemitterBlacklist;
        public constructor(init?: Partial<UpdateRemitterBlacklistJobResponse>) { (Object as any).assign(this, init); }
    }
    export class UpdateRemitterWhitelistJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: RemitterWhitelist;
        public constructor(init?: Partial<UpdateRemitterWhitelistJobResponse>) { (Object as any).assign(this, init); }
    }
    export class UpdateVelocityLimitsJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<UpdateVelocityLimitsJobResponse>) { (Object as any).assign(this, init); }
    }
    export class UpsertCountryJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: Country;
        public constructor(init?: Partial<UpsertCountryJobResponse>) { (Object as any).assign(this, init); }
    }
    export class UpsertIndustryJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: Industry;
        public constructor(init?: Partial<UpsertIndustryJobResponse>) { (Object as any).assign(this, init); }
    }
    export class UpsertInstitutionJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: Institution;
        public constructor(init?: Partial<UpsertInstitutionJobResponse>) { (Object as any).assign(this, init); }
    }
    export class UpsertKycCheckProfileJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: KycCheckProfile;
        public constructor(init?: Partial<UpsertKycCheckProfileJobResponse>) { (Object as any).assign(this, init); }
    }
    export class UpsertProcessorJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: Processor;
        public constructor(init?: Partial<UpsertProcessorJobResponse>) { (Object as any).assign(this, init); }
    }
    export class UpsertProductOfferJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: ProductOfferGroupConstruct;
        public constructor(init?: Partial<UpsertProductOfferJobResponse>) { (Object as any).assign(this, init); }
    }
    export class UpsertProgramIdJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: ProgramId;
        public constructor(init?: Partial<UpsertProgramIdJobResponse>) { (Object as any).assign(this, init); }
    }
    export class UpsertStatusJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<UpsertStatusJobResponse>) { (Object as any).assign(this, init); }
    }
    export class ExecuteJobResponse
    {
        public responseStatus: ResponseStatus;
        public result: string;
        public constructor(init?: Partial<ExecuteJobResponse>) { (Object as any).assign(this, init); }
    }
    export class ExecuteJobTaskResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<ExecuteJobTaskResponse>) { (Object as any).assign(this, init); }
    }
    export class GetBannerNotificationsResponse
    {
        public responseStatus: ResponseStatus;
        public results: BannerNotification[];
        public constructor(init?: Partial<GetBannerNotificationsResponse>) { (Object as any).assign(this, init); }
    }
    export class BannerNotificationResponse
    {
        public responseStatus: ResponseStatus;
        public result: BannerNotification;
        public constructor(init?: Partial<BannerNotificationResponse>) { (Object as any).assign(this, init); }
    }
    export class GetAuthDevicesResponse
    {
        public responseStatus: ResponseStatus;
        public results: AuthDeviceSummary[];
        public constructor(init?: Partial<GetAuthDevicesResponse>) { (Object as any).assign(this, init); }
    }
    export class RecoverDeviceResponse
    {
        public responseStatus: ResponseStatus;
        public result: RegisteredAccounts;
        public constructor(init?: Partial<RecoverDeviceResponse>) { (Object as any).assign(this, init); }
    }
    export class GetNotificationResponse
    {
        public responseStatus: ResponseStatus;
        public result: Notification;
        public constructor(init?: Partial<GetNotificationResponse>) { (Object as any).assign(this, init); }
    }
    export class EnrollUserResponse
    {
        public responseStatus: ResponseStatus;
        public result: string;
        public constructor(init?: Partial<EnrollUserResponse>) { (Object as any).assign(this, init); }
    }
    export class EnrollDeviceResponse
    {
        public responseStatus: ResponseStatus;
        public result: RegisteredAccount;
        public constructor(init?: Partial<EnrollDeviceResponse>) { (Object as any).assign(this, init); }
    }
    export class EnrollCompleteResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<EnrollCompleteResponse>) { (Object as any).assign(this, init); }
    }
    export class CreateAuthResponse
    {
        public responseStatus: ResponseStatus;
        public result: string;
        public constructor(init?: Partial<CreateAuthResponse>) { (Object as any).assign(this, init); }
    }
    export class AuthorizeResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<AuthorizeResponse>) { (Object as any).assign(this, init); }
    }
    export class CounterpartyResponse
    {
        public responseStatus: ResponseStatus;
        public result: Counterparty;
        public constructor(init?: Partial<CounterpartyResponse>) { (Object as any).assign(this, init); }
    }
    export class CounterpartyTodoResponse
    {
        public responseStatus: ResponseStatus;
        public results: CounterpartyTodo<ClearBankTransaction>[];
        public constructor(init?: Partial<CounterpartyTodoResponse>) { (Object as any).assign(this, init); }
    }
    export class UbanFromCounterpartiesResponse
    {
        public responseStatus: ResponseStatus;
        public result: CounterpartyComplete;
        public constructor(init?: Partial<UbanFromCounterpartiesResponse>) { (Object as any).assign(this, init); }
    }
    export class MailboxMessagePdfResponse
    {
        public responseStatus: ResponseStatus;
        public result: IMailboxPdf;
        public constructor(init?: Partial<MailboxMessagePdfResponse>) { (Object as any).assign(this, init); }
    }
    export class MailboxOwnerResponse
    {
        public responseStatus: ResponseStatus;
        public result: string;
        public constructor(init?: Partial<MailboxOwnerResponse>) { (Object as any).assign(this, init); }
    }
    export class SubjectWorkflowResponse
    {
        public responseStatus: ResponseStatus;
        public result: IMailboxSubject;
        public constructor(init?: Partial<SubjectWorkflowResponse>) { (Object as any).assign(this, init); }
    }
    export class ListMailboxResponse
    {
        public responseStatus: ResponseStatus;
        public results: IMailbox[];
        public constructor(init?: Partial<ListMailboxResponse>) { (Object as any).assign(this, init); }
    }
    export class AdminListMailboxSubjectResponse
    {
        public mailboxOwners: { [index: string]: string; };
        public count: number;
        public responseStatus: ResponseStatus;
        public results: IMailboxSubject[];
        public constructor(init?: Partial<AdminListMailboxSubjectResponse>) { (Object as any).assign(this, init); }
    }
    export class ListMailboxMessageResponse
    {
        public responseStatus: ResponseStatus;
        public results: IMailboxMessage[];
        public constructor(init?: Partial<ListMailboxMessageResponse>) { (Object as any).assign(this, init); }
    }
    export class MailboxMessageResponse
    {
        public responseStatus: ResponseStatus;
        public result: IMailboxMessage;
        public mailboxSubject: IMailboxSubject;
        public constructor(init?: Partial<MailboxMessageResponse>) { (Object as any).assign(this, init); }
    }
    export class AdminListSubjectMessagesResponse
    {
        public responseStatus: ResponseStatus;
        public results: IMailboxMessage[];
        public constructor(init?: Partial<AdminListSubjectMessagesResponse>) { (Object as any).assign(this, init); }
    }
    export class SubjectMessageResponse
    {
        public responseStatus: ResponseStatus;
        public result: boolean;
        public constructor(init?: Partial<SubjectMessageResponse>) { (Object as any).assign(this, init); }
    }
    export class MailboxSubjectOwnerResponse
    {
        public responseStatus: ResponseStatus;
        public result: IMailboxSubject;
        public constructor(init?: Partial<MailboxSubjectOwnerResponse>) { (Object as any).assign(this, init); }
    }
    export class ListMailboxSubjectResponse
    {
        public count: number;
        public responseStatus: ResponseStatus;
        public results: IMailboxSubject[];
        public constructor(init?: Partial<ListMailboxSubjectResponse>) { (Object as any).assign(this, init); }
    }
    // @Route("/platform")
    export class Platform implements IReturn<PlatformResponse>
    {
        public constructor(init?: Partial<Platform>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'Platform'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new PlatformResponse(); }
    }
    // @Route("/system/exception/", "GET")
    // @Route("/system/exception/{Type}", "GET")
    export class MockErrorRequest implements IReturn<MockErrorResponse>
    {
        public type: string;
        public constructor(init?: Partial<MockErrorRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'MockErrorRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new MockErrorResponse(); }
    }
    // @Route("/system/uptime", "GET")
    export class UpTimeRequest implements IReturn<UpTimeResponse>
    {
        public constructor(init?: Partial<UpTimeRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'UpTimeRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new UpTimeResponse(); }
    }
    // @Route("/system/ping", "GET")
    export class PingRequest implements IReturn<PingResponse>
    {
        public constructor(init?: Partial<PingRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'PingRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new PingResponse(); }
    }
    // @Route("/system/debug")
    export class DebugRequest implements IReturn<Object>
    {
        public constructor(init?: Partial<DebugRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'DebugRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new Object(); }
    }
    // @Route("/impersonate", "POST")
    export class ImpersonateUser implements IReturn<AuthenticateResponse>
    {
        public userName: string;
        public constructor(init?: Partial<ImpersonateUser>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ImpersonateUser'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new AuthenticateResponse(); }
    }
    // @Route("/bearer-token", "POST")
    export class GetBearerToken implements IReturn<AuthenticateResponse>
    {
        public apiKey: string;
        public constructor(init?: Partial<GetBearerToken>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'GetBearerToken'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new AuthenticateResponse(); }
    }
    // @Route("/auth/{UserAuthId}/roles", "GET")
    export class NormalizeUserRolesRequest implements IReturn<NormalizeUserRolesResponse>, IHasUserAuthId
    {
        public key: string;
        public userAuthId: string;
        public constructor(init?: Partial<NormalizeUserRolesRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'NormalizeUserRolesRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new NormalizeUserRolesResponse(); }
    }
    /**
    * Sign In
    */
    // @Route("/auth", "OPTIONS,GET,POST,DELETE")
    // @Route("/auth/{provider}", "OPTIONS,GET,POST,DELETE")
    // @Api(Description="Sign In")
    // @DataContract
    export class Authenticate implements IReturn<AuthenticateResponse>, IPost
    {
        /**
        * AuthProvider, e.g. credentials
        */
        // @DataMember(Order=1)
        public provider: string;
        // @DataMember(Order=2)
        public state: string;
        // @DataMember(Order=3)
        public oauth_token: string;
        // @DataMember(Order=4)
        public oauth_verifier: string;
        // @DataMember(Order=5)
        public userName: string;
        // @DataMember(Order=6)
        public password: string;
        // @DataMember(Order=7)
        public rememberMe?: boolean;
        // @DataMember(Order=9)
        public errorView: string;
        // @DataMember(Order=10)
        public nonce: string;
        // @DataMember(Order=11)
        public uri: string;
        // @DataMember(Order=12)
        public response: string;
        // @DataMember(Order=13)
        public qop: string;
        // @DataMember(Order=14)
        public nc: string;
        // @DataMember(Order=15)
        public cnonce: string;
        // @DataMember(Order=17)
        public accessToken: string;
        // @DataMember(Order=18)
        public accessTokenSecret: string;
        // @DataMember(Order=19)
        public scope: string;
        // @DataMember(Order=20)
        public meta: { [index: string]: string; };
        public constructor(init?: Partial<Authenticate>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'Authenticate'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new AuthenticateResponse(); }
    }
    // @Route("/assignroles", "POST")
    // @DataContract
    export class AssignRoles implements IReturn<AssignRolesResponse>, IPost
    {
        // @DataMember(Order=1)
        public userName: string;
        // @DataMember(Order=2)
        public permissions: string[];
        // @DataMember(Order=3)
        public roles: string[];
        // @DataMember(Order=4)
        public meta: { [index: string]: string; };
        public constructor(init?: Partial<AssignRoles>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'AssignRoles'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new AssignRolesResponse(); }
    }
    // @Route("/unassignroles", "POST")
    // @DataContract
    export class UnAssignRoles implements IReturn<UnAssignRolesResponse>, IPost
    {
        // @DataMember(Order=1)
        public userName: string;
        // @DataMember(Order=2)
        public permissions: string[];
        // @DataMember(Order=3)
        public roles: string[];
        // @DataMember(Order=4)
        public meta: { [index: string]: string; };
        public constructor(init?: Partial<UnAssignRoles>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'UnAssignRoles'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new UnAssignRolesResponse(); }
    }
    /**
    * Sign Up
    */
    // @Route("/register", "PUT,POST")
    // @Api(Description="Sign Up")
    // @DataContract
    export class Register implements IReturn<RegisterResponse>, IPost
    {
        // @DataMember(Order=1)
        public userName: string;
        // @DataMember(Order=2)
        public firstName: string;
        // @DataMember(Order=3)
        public lastName: string;
        // @DataMember(Order=4)
        public displayName: string;
        // @DataMember(Order=5)
        public email: string;
        // @DataMember(Order=6)
        public password: string;
        // @DataMember(Order=7)
        public confirmPassword: string;
        // @DataMember(Order=8)
        public autoLogin?: boolean;
        // @DataMember(Order=10)
        public errorView: string;
        // @DataMember(Order=11)
        public meta: { [index: string]: string; };
        public constructor(init?: Partial<Register>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'Register'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new RegisterResponse(); }
    }
    // @Route("/apikeys")
    // @Route("/apikeys/{Environment}")
    // @DataContract
    export class GetApiKeys implements IReturn<GetApiKeysResponse>, IGet
    {
        // @DataMember(Order=1)
        public environment: string;
        // @DataMember(Order=2)
        public meta: { [index: string]: string; };
        public constructor(init?: Partial<GetApiKeys>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'GetApiKeys'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new GetApiKeysResponse(); }
    }
    // @Route("/apikeys/regenerate")
    // @Route("/apikeys/regenerate/{Environment}")
    // @DataContract
    export class RegenerateApiKeys implements IReturn<RegenerateApiKeysResponse>, IPost
    {
        // @DataMember(Order=1)
        public environment: string;
        // @DataMember(Order=2)
        public meta: { [index: string]: string; };
        public constructor(init?: Partial<RegenerateApiKeys>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'RegenerateApiKeys'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new RegenerateApiKeysResponse(); }
    }
    // @Route("/access-token")
    // @DataContract
    export class GetAccessToken implements IReturn<GetAccessTokenResponse>, IPost
    {
        // @DataMember(Order=1)
        public refreshToken: string;
        // @DataMember(Order=2)
        public meta: { [index: string]: string; };
        public constructor(init?: Partial<GetAccessToken>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'GetAccessToken'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new GetAccessTokenResponse(); }
    }
    // @Route("/auth/mfa", "POST")
    export class AuthenticateMfa implements IReturn<AuthenticateResponse>, IHasUserName, IHasPassword, IHasMfaVerificationCode
    {
        public mfaVerificationCode: string;
        public password: string;
        public userName: string;
        public constructor(init?: Partial<AuthenticateMfa>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'AuthenticateMfa'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new AuthenticateResponse(); }
    }
    // @Route("/auth/mfa/authenticate", "POST")
    export class MfaAuthenticate implements IReturn<MfaAuthenticateResponse>, IHasUserName, IHasPassword
    {
        public password: string;
        public userName: string;
        public constructor(init?: Partial<MfaAuthenticate>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'MfaAuthenticate'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new MfaAuthenticateResponse(); }
    }
    // @Route("/auth/mfa/pre-enroll", "POST")
    export class MfaPreEnroll implements IReturn<MfaPreEnrollResponse>, IHasEmailAddress
    {
        public emailAddress: string;
        public constructor(init?: Partial<MfaPreEnroll>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'MfaPreEnroll'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new MfaPreEnrollResponse(); }
    }
    // @Route("/auth/mfa/enroll", "POST")
    export class MfaEnroll implements IReturn<MfaEnrollResponse>, IHasEmailAddress, IHasEmailVerificationCode, IHasSecuredAccessCode
    {
        public emailAddress: string;
        public emailVerificationCode: string;
        public securedAccessCode: string;
        public constructor(init?: Partial<MfaEnroll>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'MfaEnroll'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new MfaEnrollResponse(); }
    }
    // @Route("/auth/mfa/confirm", "POST")
    export class MfaConfirm implements IReturn<MfaConfirmResponse>, IHasEmailAddress, IConfirmMfaPins
    {
        public pin1: string;
        public pin2: string;
        public emailAddress: string;
        public constructor(init?: Partial<MfaConfirm>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'MfaConfirm'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new MfaConfirmResponse(); }
    }
    // @Route("/auth/mfa/logout", "POST")
    export class MfaLogout implements IReturnVoid
    {
        public constructor(init?: Partial<MfaLogout>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'MfaLogout'; }
        public getMethod() { return 'POST'; }
        public createResponse() {}
    }
    // @Route("/auth/change/password", "POST")
    export class ChangePasswordRequest implements IReturn<ChangePasswordResponse>, IHasCurrentPassword, IHasNewPassword, IHasMfaVerificationCode
    {
        public currentPassword: string;
        public mfaVerificationCode: string;
        public newPassword: string;
        public constructor(init?: Partial<ChangePasswordRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ChangePasswordRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ChangePasswordResponse(); }
    }
    // @Route("/auth/password/reset", "POST")
    export class PasswordReset implements IReturn<PasswordResetResponse>, IHasEmailAddress
    {
        public emailAddress: string;
        public constructor(init?: Partial<PasswordReset>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'PasswordReset'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new PasswordResetResponse(); }
    }
    // @Route("/auth/password/reset/confirm", "POST")
    export class PasswordResetConfirm implements IReturn<PasswordResetConfirmResponse>, IHasEmailAddress, IHasNewPassword, IHasEmailVerificationCode, IHasMfaVerificationCode
    {
        public emailAddress: string;
        public emailVerificationCode: string;
        public mfaVerificationCode: string;
        public newPassword: string;
        public constructor(init?: Partial<PasswordResetConfirm>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'PasswordResetConfirm'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new PasswordResetConfirmResponse(); }
    }
    // @Route("/beneficiary/batch", "POST")
    export class BatchBeneficiaryAddRequest implements IReturn<BatchBeneficiaryAddResponse>, ICsvImport
    {
        public csvFileName: string;
        public csvContents: string;
        public constructor(init?: Partial<BatchBeneficiaryAddRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'BatchBeneficiaryAddRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new BatchBeneficiaryAddResponse(); }
    }
    // @Route("/list/beneficiary/documents", "POST")
    export class ListBeneficiaryDocumentsRequest implements IReturn<ListBeneficiaryDocumentsResponse>, IHasBeneficiaryERN
    {
        public beneficiaryERN: string;
        public constructor(init?: Partial<ListBeneficiaryDocumentsRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ListBeneficiaryDocumentsRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ListBeneficiaryDocumentsResponse(); }
    }
    // @Route("/beneficiary/document", "DELETE")
    export class RemoveBeneficiaryDocumentRequest implements IReturn<RemoveBeneficiaryDocumentResponse>, IHasDocumentERN, IHasBeneficiaryAccountERN
    {
        public beneficiaryAccountERN: string;
        public documentERN: string;
        public constructor(init?: Partial<RemoveBeneficiaryDocumentRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'RemoveBeneficiaryDocumentRequest'; }
        public getMethod() { return 'DELETE'; }
        public createResponse() { return new RemoveBeneficiaryDocumentResponse(); }
    }
    // @Route("/beneficiary/{ERN}")
    export class GetBeneficiaryRequest implements IReturn<GetBeneficiaryResponse>, IHasERN
    {
        public ern: string;
        public constructor(init?: Partial<GetBeneficiaryRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'GetBeneficiaryRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new GetBeneficiaryResponse(); }
    }
    // @Route("/link/beneficiary", "POST, DELETE")
    export class LinkBeneficiaryRequest implements IReturn<LinkBeneficiaryResponse>, IHasAccountERN, IHasBeneficiaryAccountERN
    {
        public accountERN: string;
        public beneficiaryAccountERN: string;
        public constructor(init?: Partial<LinkBeneficiaryRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'LinkBeneficiaryRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new LinkBeneficiaryResponse(); }
    }
    // @Route("/beneficiary", "POST")
    export class AddBeneficiaryRequest implements IReturn<AddBeneficiaryResponse>, IHasBatchJobERN
    {
        public beneficiary: BeneficiaryWithDocumentERNs;
        public account: BeneficiaryAccount;
        public linkToAccountERN: string;
        public batchJobERN: string;
        public constructor(init?: Partial<AddBeneficiaryRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'AddBeneficiaryRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new AddBeneficiaryResponse(); }
    }
    // @Route("/beneficiary", "PUT")
    export class EditBeneficiaryRequest implements IReturn<EditBeneficiaryResponse>, IHasBeneficiaryAccountERN, IHasNickName, IHasDocumentERNs
    {
        public beneficiaryAccountERN: string;
        public documentERNs: string[];
        public nickName: string;
        public constructor(init?: Partial<EditBeneficiaryRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'EditBeneficiaryRequest'; }
        public getMethod() { return 'PUT'; }
        public createResponse() { return new EditBeneficiaryResponse(); }
    }
    // @Route("/list/beneficiary/accounts", "POST")
    export class ListBeneficiaryAccountsRequest implements IReturn<ListBeneficiaryAccountsResponse>, IHasAccountERN, IPaging, IHasNickName
    {
        public accountERN: string;
        public nickName: string;
        public skip?: number;
        public take?: number;
        public page?: number;
        public pageSize?: number;
        public constructor(init?: Partial<ListBeneficiaryAccountsRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ListBeneficiaryAccountsRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ListBeneficiaryAccountsResponse(); }
    }
    // @Route("/list/owner/beneficiary/accounts", "POST")
    export class ListAccountOwnerBeneficiaryAccountsRequest implements IReturn<ListAccountOwnerBeneficiaryAccountsResponse>, IHasAccountERN, IPaging, IHasNickName, IHasGetDelta
    {
        public accountERN: string;
        public getDelta: boolean;
        public nickName: string;
        public skip?: number;
        public take?: number;
        public page?: number;
        public pageSize?: number;
        public constructor(init?: Partial<ListAccountOwnerBeneficiaryAccountsRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ListAccountOwnerBeneficiaryAccountsRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ListAccountOwnerBeneficiaryAccountsResponse(); }
    }
    // @Route("/notifications/business/{BusinessERN}/summary", "GET")
    export class GetNotificationsBusinessSummaryRequest implements IReturn<GetNotificationsBusinessSummaryResponse>, IHasBusinessERN
    {
        public businessERN: string;
        public constructor(init?: Partial<GetNotificationsBusinessSummaryRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'GetNotificationsBusinessSummaryRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new GetNotificationsBusinessSummaryResponse(); }
    }
    // @Route("/business/{BusinessERN}/summary", "GET")
    export class GetBusinessSummaryRequest implements IReturn<GetBusinessSummaryResponse>, IHasBusinessERN
    {
        public businessERN: string;
        public constructor(init?: Partial<GetBusinessSummaryRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'GetBusinessSummaryRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new GetBusinessSummaryResponse(); }
    }
    // @Route("/list/business/pending/payments", "POST")
    export class ListBusinessPendingPaymentsRequest implements IReturn<ListBusinessPendingPaymentsResponse>, IHasBusinessERNs
    {
        public businessERNs: string[];
        public constructor(init?: Partial<ListBusinessPendingPaymentsRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ListBusinessPendingPaymentsRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ListBusinessPendingPaymentsResponse(); }
    }
    // @Route("/list/business/pending/requests", "POST")
    export class ListBusinessPendingRequestsRequest implements IReturn<ListBusinessPendingRequestsResponse>, IHasBusinessERN, IPaging
    {
        public businessERN: string;
        public skip?: number;
        public take?: number;
        public page?: number;
        public pageSize?: number;
        public constructor(init?: Partial<ListBusinessPendingRequestsRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ListBusinessPendingRequestsRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ListBusinessPendingRequestsResponse(); }
    }
    // @Route("/list/business/payments", "POST")
    export class ListBusinessPaymentsRequest implements IReturn<ListBusinessPaymentsResponse>, IHasAccountERN, IPaging
    {
        public accountERN: string;
        public skip?: number;
        public take?: number;
        public page?: number;
        public pageSize?: number;
        public constructor(init?: Partial<ListBusinessPaymentsRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ListBusinessPaymentsRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ListBusinessPaymentsResponse(); }
    }
    // @Route("/business/job/approve", "POST")
    export class BusinessJobApproveRequest implements IReturn<BusinessJobApproveResponse>, IHasJobERN, ISmsVerification, IHasMfaVerificationCode
    {
        public jobERN: string;
        public mfaVerificationCode: string;
        public smsVerificationCode: string;
        public sendVerificationCode: boolean;
        public constructor(init?: Partial<BusinessJobApproveRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'BusinessJobApproveRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new BusinessJobApproveResponse(); }
    }
    // @Route("/business/job/reject", "POST")
    export class BusinessJobRejectRequest implements IReturn<BusinessJobRejectResponse>, IHasJobERN
    {
        public jobERN: string;
        public constructor(init?: Partial<BusinessJobRejectRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'BusinessJobRejectRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new BusinessJobRejectResponse(); }
    }
    // @Route("/business/job/retry", "POST")
    export class BusinessJobRetryRequest implements IReturn<BusinessJobRetryResponse>, IHasJobERN
    {
        public jobERN: string;
        public constructor(init?: Partial<BusinessJobRetryRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'BusinessJobRetryRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new BusinessJobRetryResponse(); }
    }
    // @Route("/business/grant/acl", "POST")
    export class BusinessGrantAclRequest implements IReturn<BusinessGrantAclResponse>, IHasBusinessERN, IHasPrincipalERN, IHasAclOperation, IHasResourceERN, IHasLimitValue
    {
        public aclOperation?: ACLOperations;
        public businessERN: string;
        public limitValue?: number;
        public principalERN: string;
        public resourceERN: string;
        public constructor(init?: Partial<BusinessGrantAclRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'BusinessGrantAclRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new BusinessGrantAclResponse(); }
    }
    // @Route("/business/deny/acl", "POST")
    export class BusinessDenyAclRequest implements IReturn<BusinessDenyAclResponse>, IHasBusinessERN, IHasPrincipalERN, IHasAclOperation, IHasResourceERN
    {
        public aclOperation?: ACLOperations;
        public businessERN: string;
        public principalERN: string;
        public resourceERN: string;
        public constructor(init?: Partial<BusinessDenyAclRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'BusinessDenyAclRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new BusinessDenyAclResponse(); }
    }
    // @Route("/business/revoke/acl", "POST")
    export class BusinessRevokeAclRequest implements IReturn<BusinessRevokeAclResponse>, IHasBusinessERN, IHasPrincipalERN, IHasAclOperation, IHasResourceERN
    {
        public aclOperation?: ACLOperations;
        public businessERN: string;
        public principalERN: string;
        public resourceERN: string;
        public constructor(init?: Partial<BusinessRevokeAclRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'BusinessRevokeAclRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new BusinessRevokeAclResponse(); }
    }
    // @Route("/list/business/beneficiary/accounts", "POST")
    export class ListBusinessBeneficiaryAccountsRequest implements IReturn<ListBusinessBeneficiaryAccountsResponse>, IHasBusinessERN
    {
        public businessERN: string;
        public constructor(init?: Partial<ListBusinessBeneficiaryAccountsRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ListBusinessBeneficiaryAccountsRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ListBusinessBeneficiaryAccountsResponse(); }
    }
    // @Route("/update/mobile/phone", "POST")
    export class UpdateMobilePhoneRequest implements IReturn<UpdateMobilePhoneResponse>, IHasCRC, IHasMfaVerificationCode, IHasMobilePhone, IHasSecuredAccessCode
    {
        public crc: string;
        public mfaVerificationCode: string;
        public mobilePhone: string;
        public securedAccessCode: string;
        public constructor(init?: Partial<UpdateMobilePhoneRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'UpdateMobilePhoneRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new UpdateMobilePhoneResponse(); }
    }
    // @Route("/registration/reset", "POST")
    export class ResetCustomerRegistrationRequest implements IReturn<ResetCustomerRegistrationResponse>
    {
        public emailAddress: string;
        public constructor(init?: Partial<ResetCustomerRegistrationRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ResetCustomerRegistrationRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ResetCustomerRegistrationResponse(); }
    }
    // @Route("/resend/sms/verification", "POST")
    export class ResendSmsVerificationCodeRequest implements IReturn<ResendSmsVerificationCodeResponse>, IHasEmailAddress
    {
        public emailAddress: string;
        public constructor(init?: Partial<ResendSmsVerificationCodeRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ResendSmsVerificationCodeRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ResendSmsVerificationCodeResponse(); }
    }
    // @Route("/resend/email/verification", "POST")
    export class ResendEmailVerificationCodeRequest implements IReturn<ResendEmailVerificationCodeResponse>, IHasEmailAddress
    {
        public emailAddress: string;
        public constructor(init?: Partial<ResendEmailVerificationCodeRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ResendEmailVerificationCodeRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ResendEmailVerificationCodeResponse(); }
    }
    // @Route("/customer", "GET")
    export class CustomerRequest implements IReturn<CustomerResponse>
    {
        public constructor(init?: Partial<CustomerRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CustomerRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new CustomerResponse(); }
    }
    // @Route("/registration", "POST")
    export class StartRegistrationRequest implements IReturn<StartRegistrationResponse>
    {
        public accessCode: string;
        public accountCode: string;
        public birthDate: number;
        public emailAddress: string;
        public mobilePhone: string;
        public constructor(init?: Partial<StartRegistrationRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'StartRegistrationRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new StartRegistrationResponse(); }
    }
    // @Route("/registration/verify", "POST")
    export class FinishRegistrationRequest implements IReturn<FinishRegistrationResponse>, IHasEmailVerificationCode, IHasSmsVerificationCode
    {
        public emailAddress: string;
        public securityQuestion: string;
        public securityAnswer: string;
        public newPassword: string;
        public agreeTermsConditions: boolean;
        public agreePricingFees: boolean;
        public emailVerificationCode: string;
        public smsVerificationCode: string;
        public constructor(init?: Partial<FinishRegistrationRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'FinishRegistrationRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new FinishRegistrationResponse(); }
    }
    // @Route("/account/{Acno}/documents/{Type}", "GET")
    export class ListAccountDocumentsRequest implements IReturn<ListAccountDocumentsResponse>, IHasAcno, IPaging
    {
        public acno: string;
        public type: AccountDocumentType;
        public skip?: number;
        public take?: number;
        public page?: number;
        public pageSize?: number;
        public constructor(init?: Partial<ListAccountDocumentsRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ListAccountDocumentsRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new ListAccountDocumentsResponse(); }
    }
    // @Route("/account/{Acno}/document/{ERN}", "GET")
    export class GetAccountDocumentRequest implements IReturn<GetAccountDocumentResponse>, IHasAcno, IHasERN
    {
        public acno: string;
        public ern: string;
        public constructor(init?: Partial<GetAccountDocumentRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'GetAccountDocumentRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new GetAccountDocumentResponse(); }
    }
    // @Route("/enums", "GET")
    export class ListEnumsRequest implements IReturn<ListEnumsResponse>
    {
        public constructor(init?: Partial<ListEnumsRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ListEnumsRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new ListEnumsResponse(); }
    }
    // @Route("/notification-profile/{ERN}", "GET,POST")
    export class NotificationProfileRequest extends NotificationProfile implements IReturn<NotificationProfileResponse>
    {
        public constructor(init?: Partial<NotificationProfileRequest>) { super(init); (Object as any).assign(this, init); }
        public getTypeName() { return 'NotificationProfileRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new NotificationProfileResponse(); }
    }
    // @Route("/notification-profile/{ERN}/transactions", "GET,POST")
    export class NotificationProfileTransactionsRequest extends NotificationProfile implements IReturn<NotificationProfileTransactionsResponse>
    {
        public constructor(init?: Partial<NotificationProfileTransactionsRequest>) { super(init); (Object as any).assign(this, init); }
        public getTypeName() { return 'NotificationProfileTransactionsRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new NotificationProfileTransactionsResponse(); }
    }
    // @Route("/transactions/{TransactionId}/pending/id", "GET")
    export class GetPendingTransactionIdRequest implements IReturn<GetPendingTransactionIdResponse>, IHasTransactionId
    {
        public transactionId: string;
        public constructor(init?: Partial<GetPendingTransactionIdRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'GetPendingTransactionIdRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new GetPendingTransactionIdResponse(); }
    }
    // @Route("/transactions/pending/{PendingTransactionERN}/messages", "GET")
    export class ListPendingTransactionMessagesRequest implements IReturn<ListPendingTransactionMessagesResponse>, IHasPendingTransactionERN
    {
        public pendingTransactionERN: string;
        public constructor(init?: Partial<ListPendingTransactionMessagesRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ListPendingTransactionMessagesRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new ListPendingTransactionMessagesResponse(); }
    }
    // @Route("/transactions/pending/{PendingTransactionERN}/message", "POST")
    export class PendingTransactionClientMessageRequest extends NoteMessage implements IReturn<PendingTransactionClientMessageResponse>, IHasPendingTransactionERN
    {
        public pendingTransactionERN: string;
        public constructor(init?: Partial<PendingTransactionClientMessageRequest>) { super(init); (Object as any).assign(this, init); }
        public getTypeName() { return 'PendingTransactionClientMessageRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new PendingTransactionClientMessageResponse(); }
    }
    // @Route("/transactions/pending/{PendingTransactionERN}/reject", "POST")
    export class RejectPendingTransactionRequest extends NoteMessage implements IReturn<RejectPendingTransactionResponse>, IHasPendingTransactionERN
    {
        public pendingTransactionERN: string;
        public constructor(init?: Partial<RejectPendingTransactionRequest>) { super(init); (Object as any).assign(this, init); }
        public getTypeName() { return 'RejectPendingTransactionRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new RejectPendingTransactionResponse(); }
    }
    // @Route("/digital-signature/enroll", "POST")
    export class EnrollDigitalSignatureRequest implements IReturn<EnrollDigitalSignatureResponse>
    {
        public csr: string;
        public constructor(init?: Partial<EnrollDigitalSignatureRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'EnrollDigitalSignatureRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new EnrollDigitalSignatureResponse(); }
    }
    // @Route("/digital-signature/certificates", "GET")
    export class ListPkiCertificatesRequest implements IReturn<ListPkiCertificatesResponse>, IHasUserAuthId
    {
        public userAuthId: string;
        public constructor(init?: Partial<ListPkiCertificatesRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ListPkiCertificatesRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new ListPkiCertificatesResponse(); }
    }
    // @Route("/digital-signature/certificate", "DELETE")
    export class PkiCertificateRequest implements IReturn<PkiCertificateResponse>, IHasUserAuthId, IHasCertificateThumbprint
    {
        public certificateThumbprint: string;
        public userAuthId: string;
        public constructor(init?: Partial<PkiCertificateRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'PkiCertificateRequest'; }
        public getMethod() { return 'DELETE'; }
        public createResponse() { return new PkiCertificateResponse(); }
    }
    // @Route("/risk/modelCollection/{ERN}", "GET")
    export class RiskModelCollectionRequest extends RiskModelRecord implements IReturn<RiskModelCollectionResponse>
    {
        public constructor(init?: Partial<RiskModelCollectionRequest>) { super(init); (Object as any).assign(this, init); }
        public getTypeName() { return 'RiskModelCollectionRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new RiskModelCollectionResponse(); }
    }
    // @Route("/risk/audit-trail/{Owner}", "GET")
    // @Route("/risk/audit-trail/{Owner}/{Type}", "GET")
    export class ListRiskAuditTrailRequest implements IReturn<ListRiskAuditTrailResponse>, IHasOwner, ISkipTake
    {
        public type?: RiskAuditType;
        public owner: string;
        public skip?: number;
        public take?: number;
        public constructor(init?: Partial<ListRiskAuditTrailRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ListRiskAuditTrailRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new ListRiskAuditTrailResponse(); }
    }
    // @Route("/risk/templates", "GET")
    // @Route("/risk/templates/{Type}", "GET")
    export class ListRiskTemplateRequest implements IReturn<ListRiskTemplateResponse>, ISkipTake
    {
        public type?: RiskModelType;
        public skip?: number;
        public take?: number;
        public constructor(init?: Partial<ListRiskTemplateRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ListRiskTemplateRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new ListRiskTemplateResponse(); }
    }
    // @Route("/risk/template/{Owner}", "POST")
    export class RiskTemplateRequest implements IReturn<RiskTemplateResponse>, IHasOwner
    {
        public owner: string;
        public templateERN: string;
        public constructor(init?: Partial<RiskTemplateRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'RiskTemplateRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new RiskTemplateResponse(); }
    }
    // @Route("/risk/config/{Owner}", "POST,PUT,GET")
    export class RiskConfigRequest extends RiskConfigRecord implements IReturn<RiskConfigResponse>, IHasOwner
    {
        public owner: string;
        public constructor(init?: Partial<RiskConfigRequest>) { super(init); (Object as any).assign(this, init); }
        public getTypeName() { return 'RiskConfigRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new RiskConfigResponse(); }
    }
    // @Route("/risk/model/{Owner}", "POST")
    // @Route("/risk/model/{ERN}", "PUT,GET,DELETE,PATCH")
    export class RiskModelRequest extends RiskModelRecord implements IReturn<RiskModelResponse>, IHasOwner
    {
        public owner: string;
        public constructor(init?: Partial<RiskModelRequest>) { super(init); (Object as any).assign(this, init); }
        public getTypeName() { return 'RiskModelRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new RiskModelResponse(); }
    }
    // @Route("/risk/models/{Owner}", "GET")
    export class ListRiskModelRequest implements IReturn<ListRiskModelResponse>, IHasOwner, ISkipTake
    {
        public owner: string;
        public skip?: number;
        public take?: number;
        public constructor(init?: Partial<ListRiskModelRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ListRiskModelRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new ListRiskModelResponse(); }
    }
    // @Route("/risk/category/{Owner}", "POST")
    // @Route("/risk/category/{ERN}", "PUT,GET,DELETE")
    export class RiskCategoryRequest extends RiskCategoryRecord implements IReturn<RiskCategoryResponse>, IHasOwner
    {
        public owner: string;
        public constructor(init?: Partial<RiskCategoryRequest>) { super(init); (Object as any).assign(this, init); }
        public getTypeName() { return 'RiskCategoryRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new RiskCategoryResponse(); }
    }
    // @Route("/risk/categories/{Owner}", "GET")
    export class ListRiskCategoryRequest implements IReturn<ListRiskCategoryResponse>, IHasOwner, ISkipTake
    {
        public owner: string;
        public skip?: number;
        public take?: number;
        public constructor(init?: Partial<ListRiskCategoryRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ListRiskCategoryRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new ListRiskCategoryResponse(); }
    }
    // @Route("/risk/component/{Owner}", "POST")
    // @Route("/risk/component/{ERN}", "PUT,GET,DELETE")
    export class RiskComponentRequest extends RiskComponentRecord implements IReturn<RiskComponentResponse>, IHasOwner
    {
        public owner: string;
        public constructor(init?: Partial<RiskComponentRequest>) { super(init); (Object as any).assign(this, init); }
        public getTypeName() { return 'RiskComponentRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new RiskComponentResponse(); }
    }
    // @Route("/risk/components/{Owner}", "GET")
    export class ListRiskComponentRequest implements IReturn<ListRiskComponentResponse>, IHasOwner, ISkipTake
    {
        public owner: string;
        public skip?: number;
        public take?: number;
        public constructor(init?: Partial<ListRiskComponentRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ListRiskComponentRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new ListRiskComponentResponse(); }
    }
    // @Route("/risk/factor/{Owner}", "POST")
    // @Route("/risk/factor/{ERN}", "PUT,GET,DELETE")
    export class RiskFactorRequest extends RiskFactorRecord implements IReturn<RiskFactorResponse>, IHasOwner
    {
        public owner: string;
        public constructor(init?: Partial<RiskFactorRequest>) { super(init); (Object as any).assign(this, init); }
        public getTypeName() { return 'RiskFactorRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new RiskFactorResponse(); }
    }
    // @Route("/risk/factors/{Owner}", "GET")
    export class ListRiskFactorRequest implements IReturn<ListRiskFactorResponse>, IHasOwner, ISkipTake
    {
        public owner: string;
        public skip?: number;
        public take?: number;
        public constructor(init?: Partial<ListRiskFactorRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ListRiskFactorRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new ListRiskFactorResponse(); }
    }
    // @Route("/risk/answer/{Owner}", "POST")
    // @Route("/risk/answer/{ERN}", "PUT,GET,DELETE")
    export class RiskAnswerRequest extends RiskAnswerRecord implements IReturn<RiskAnswerResponse>, IHasOwner
    {
        public owner: string;
        public constructor(init?: Partial<RiskAnswerRequest>) { super(init); (Object as any).assign(this, init); }
        public getTypeName() { return 'RiskAnswerRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new RiskAnswerResponse(); }
    }
    // @Route("/risk/answers/{Owner}", "GET")
    export class ListRiskAnswerRequest implements IReturn<ListRiskAnswerResponse>, IHasOwner, ISkipTake
    {
        public owner: string;
        public skip?: number;
        public take?: number;
        public constructor(init?: Partial<ListRiskAnswerRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ListRiskAnswerRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new ListRiskAnswerResponse(); }
    }
    // @Route("/risk/override/{Owner}", "POST")
    // @Route("/risk/override/{ERN}", "PUT")
    // @Route("/risk/override/{ERN}", "GET")
    export class RiskOverrideRequest extends RiskOverrideRecord implements IReturn<RiskOverrideResponse>, IHasOwner
    {
        public owner: string;
        public constructor(init?: Partial<RiskOverrideRequest>) { super(init); (Object as any).assign(this, init); }
        public getTypeName() { return 'RiskOverrideRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new RiskOverrideResponse(); }
    }
    // @Route("/risk/overrides/{Owner}", "GET")
    export class ListRiskOverrideRequest implements IReturn<ListRiskOverrideResponse>, IHasOwner, ISkipTake
    {
        public owner: string;
        public skip?: number;
        public take?: number;
        public constructor(init?: Partial<ListRiskOverrideRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ListRiskOverrideRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new ListRiskOverrideResponse(); }
    }
    // @Route("/risk/answerKey/{Owner}", "POST")
    // @Route("/risk/answerKey/{ERN}", "PUT,PATCH,GET")
    export class RiskModelAnswerKeyRequest extends RiskModelAnswerKeyRecord implements IReturn<RiskModelAnswerKeyResponse>, IHasOwner
    {
        public patchAnswerKeyState?: RiskModelState;
        public patchCRA: KeyValuePair<string, string>;
        public patchBWRA: KeyValuePair<string, number[]>;
        public owner: string;
        public constructor(init?: Partial<RiskModelAnswerKeyRequest>) { super(init); (Object as any).assign(this, init); }
        public getTypeName() { return 'RiskModelAnswerKeyRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new RiskModelAnswerKeyResponse(); }
    }
    // @Route("/risk/answerKeys/{Owner}", "GET")
    export class ListRiskAnswerKeyRequest implements IReturn<ListRiskAnswerKeyResponse>, IHasOwner, ISkipTake
    {
        public owner: string;
        public type?: RiskModelType;
        public skip?: number;
        public take?: number;
        public constructor(init?: Partial<ListRiskAnswerKeyRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ListRiskAnswerKeyRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new ListRiskAnswerKeyResponse(); }
    }
    // @Route("/risk/list/{Owner}", "POST")
    // @Route("/risk/list/{ERN}", "PUT,GET,DELETE")
    export class RiskListRequest extends RiskListRecord implements IReturn<RiskListResponse>, IHasOwner
    {
        public owner: string;
        public constructor(init?: Partial<RiskListRequest>) { super(init); (Object as any).assign(this, init); }
        public getTypeName() { return 'RiskListRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new RiskListResponse(); }
    }
    // @Route("/risk/lists/{Owner}", "GET")
    export class ListRiskListRequest implements IReturn<ListRiskListResponse>, IHasOwner, ISkipTake
    {
        public type: RiskListType;
        public owner: string;
        public skip?: number;
        public take?: number;
        public constructor(init?: Partial<ListRiskListRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ListRiskListRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new ListRiskListResponse(); }
    }
    // @Route("/risk/system/list/{Owner}", "POST")
    // @Route("/risk/system/list/{ERN}", "PUT,GET,DELETE")
    export class RiskSystemListRequest extends RiskAnswerRecord implements IReturn<RiskSystemListResponse>, IHasOwner
    {
        public owner: string;
        public type?: RiskSystemListType;
        public constructor(init?: Partial<RiskSystemListRequest>) { super(init); (Object as any).assign(this, init); }
        public getTypeName() { return 'RiskSystemListRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new RiskSystemListResponse(); }
    }
    // @Route("/risk/system/list/{Owner}/{Type}", "GET")
    export class ListRiskSystemListRequest implements IReturn<ListRiskSystemListResponse>, IHasOwner, ISkipTake
    {
        public type?: RiskSystemListType;
        public owner: string;
        public skip?: number;
        public take?: number;
        public constructor(init?: Partial<ListRiskSystemListRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ListRiskSystemListRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new ListRiskSystemListResponse(); }
    }
    // @Route("/risk/assessment/{Owner}", "POST")
    // @Route("/risk/assessment/{ERN}", "GET")
    export class RiskAssessmentRequest extends RiskAssessmentRecord implements IReturn<RiskAssessmentResponse>, IHasOwner
    {
        public owner: string;
        public constructor(init?: Partial<RiskAssessmentRequest>) { super(init); (Object as any).assign(this, init); }
        public getTypeName() { return 'RiskAssessmentRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new RiskAssessmentResponse(); }
    }
    // @Route("/risk/assessments/{Owner}", "GET")
    // @Route("/risk/assessments/{Owner}/{Type}", "GET")
    export class ListRiskAssessmentRequest implements IReturn<ListRiskAssessmentResponse>, IHasOwner, ISkipTake
    {
        public type?: RiskModelType;
        public owner: string;
        public skip?: number;
        public take?: number;
        public constructor(init?: Partial<ListRiskAssessmentRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ListRiskAssessmentRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new ListRiskAssessmentResponse(); }
    }
    // @Route("/site/configuration/{AppName}")
    export class SiteConfigurationRequest implements IReturn<SiteConfigurationResponse>
    {
        public appName: string;
        public constructor(init?: Partial<SiteConfigurationRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'SiteConfigurationRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new SiteConfigurationResponse(); }
    }
    // @Route("/chaps/status/{LocalTimeMs}", "GET")
    export class ChapsStatusRequest implements IReturn<ChapsStatusResponse>
    {
        public localTimeMs?: number;
        public constructor(init?: Partial<ChapsStatusRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ChapsStatusRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new ChapsStatusResponse(); }
    }
    // @Route("/customer/limits", "GET")
    export class GetCustomerLimit implements IReturn<GetCustomerLimitResponse>
    {
        public constructor(init?: Partial<GetCustomerLimit>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'GetCustomerLimit'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new GetCustomerLimitResponse(); }
    }
    // @Route("/batch/payments", "GET")
    export class ListBatchPaymentsRequest implements IReturn<ListBatchPaymentsResponse>
    {
        public constructor(init?: Partial<ListBatchPaymentsRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ListBatchPaymentsRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new ListBatchPaymentsResponse(); }
    }
    // @Route("/batch/payment/{JobERN}", "DELETE")
    export class CancelBatchPaymentRequest implements IReturn<CancelBatchPaymentResponse>, IHasJobERN
    {
        public jobERN: string;
        public constructor(init?: Partial<CancelBatchPaymentRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CancelBatchPaymentRequest'; }
        public getMethod() { return 'DELETE'; }
        public createResponse() { return new CancelBatchPaymentResponse(); }
    }
    // @Route("/account/batch/transactions", "POST")
    export class ListTransactionsBatchRequest implements IReturn<ListTransactionsBatchResponse>, IPaging, IDateRange
    {
        public accountCodes: string;
        public state: string;
        public filterName: string;
        public filterAmount: string;
        public filterReference: string;
        public goFast: boolean;
        public from?: number;
        public to?: number;
        public skip?: number;
        public take?: number;
        public page?: number;
        public pageSize?: number;
        public constructor(init?: Partial<ListTransactionsBatchRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ListTransactionsBatchRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ListTransactionsBatchResponse(); }
    }
    // @Route("/account/{AccountCode}/transactions", "POST")
    export class ListTransactionsRequest implements IReturn<ListTransactionsResponse>, IPaging, IDateRange
    {
        public accountCode: string;
        public state: string;
        public filterName: string;
        public filterAmount: string;
        public filterReference: string;
        public from?: number;
        public to?: number;
        public skip?: number;
        public take?: number;
        public page?: number;
        public pageSize?: number;
        public goFast: boolean;
        public constructor(init?: Partial<ListTransactionsRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ListTransactionsRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ListTransactionsResponse(); }
    }
    // @Route("/account/{AccountCode}/pending/payments", "GET")
    export class ListPendingPaymentOrdersRequest implements IReturn<ListPendingPaymentOrdersResponse>
    {
        public accountCode: string;
        public constructor(init?: Partial<ListPendingPaymentOrdersRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ListPendingPaymentOrdersRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new ListPendingPaymentOrdersResponse(); }
    }
    // @Route("/send/api", "POST")
    export class ApiSendFundsRequest implements IReturn<ApiSendFundsResponse>, IHasAccountNumber, IHasBeneficiaryNickname, IHasAmount, IPaymentReference, IHasPaymentDate, IHasDocumentERNs, IRequiresDigitalSignature
    {
        public accountNumber: string;
        public amount: number;
        public beneficiaryNickname: string;
        public documentERNs: string[];
        public paymentDate: number;
        public paymentReference: string;
        public internalReference: string;
        public scheme: ClearBankPaymentScheme;
        public certificateThumbprint: string;
        public constructor(init?: Partial<ApiSendFundsRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ApiSendFundsRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ApiSendFundsResponse(); }
    }
    // @Route("/send/batch", "POST")
    export class BatchSendFundsRequest implements IReturn<BatchSendFundsResponse>, ICsvImport, IHasCRC, ISmsVerification, IMfaVerification
    {
        public csvFileName: string;
        public csvContents: string;
        public crc: string;
        public mfaVerificationCode: string;
        public sendVerificationCode: boolean;
        public smsVerificationCode: string;
        public constructor(init?: Partial<BatchSendFundsRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'BatchSendFundsRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new BatchSendFundsResponse(); }
    }
    // @Route("/send/bka", "POST")
    export class BkaSendFundsRequest implements IReturn<BkaSendFundsResponse>, IHasAccountERN, IHasBeneficiaryAccountERN, IHasAmount, IPaymentReference, IHasPaymentDate, IHasDocumentERNs, ISmsVerification
    {
        public accountERN: string;
        public amount: number;
        public beneficiaryAccountERN: string;
        public documentERNs: string[];
        public paymentDate: number;
        public paymentReference: string;
        public internalReference: string;
        public scheme: ClearBankPaymentScheme;
        public smsVerificationCode: string;
        public sendVerificationCode: boolean;
        public constructor(init?: Partial<BkaSendFundsRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'BkaSendFundsRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new BkaSendFundsResponse(); }
    }
    // @Route("/transfer/bka", "POST")
    export class BkaTransferFundsRequest implements IReturn<BkaTransferFundsResponse>, IHasAccountERN, IHasToAccountERN, IHasAmount, IHasNullablePaymentDate, IPaymentReference
    {
        public accountERN: string;
        public amount: number;
        public paymentDate?: number;
        public toAccountERN: string;
        public paymentReference: string;
        public internalReference: string;
        public scheme: ClearBankPaymentScheme;
        public constructor(init?: Partial<BkaTransferFundsRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'BkaTransferFundsRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new BkaTransferFundsResponse(); }
    }
    // @Route("/send/for", "POST")
    export class ForSendFundsRequest implements IReturn<ForSendFundsResponse>, IHasAmount, IHasAccountERN, IHasToAccountCode
    {
        public lastName: string;
        public accountERN: string;
        public amount: number;
        public toAccountCode: string;
        public constructor(init?: Partial<ForSendFundsRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ForSendFundsRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ForSendFundsResponse(); }
    }
    // @Route("/transfer/for", "POST")
    export class ForTransferFundsRequest implements IReturn<ForTransferFundsResponse>, IHasAmount, IHasAccountERN, IHasToAccountERN
    {
        public accountERN: string;
        public amount: number;
        public toAccountERN: string;
        public constructor(init?: Partial<ForTransferFundsRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ForTransferFundsRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ForTransferFundsResponse(); }
    }
    // @Route("/resend/webhook", "POST")
    export class ResendWebhookRequest implements IReturn<ResendWebhookResponse>, IHasERN
    {
        public ern: string;
        public constructor(init?: Partial<ResendWebhookRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ResendWebhookRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ResendWebhookResponse(); }
    }
    // @Route("/webhook/test", "POST")
    export class SendTestWebhookRequest extends WebhookSubscription implements IReturn<SendTestWebhookResponse>
    {
        public constructor(init?: Partial<SendTestWebhookRequest>) { super(init); (Object as any).assign(this, init); }
        public getTypeName() { return 'SendTestWebhookRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new SendTestWebhookResponse(); }
    }
    // @Route("/customer/list/webhooks", "GET")
    export class ListCustomerWebhooksRequest implements IReturn<ListCustomerWebhooksResponse>, IHasCustomerERN
    {
        public customerERN: string;
        public constructor(init?: Partial<ListCustomerWebhooksRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ListCustomerWebhooksRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new ListCustomerWebhooksResponse(); }
    }
    // @Route("/customer/webhook", "PUT")
    // @Route("/customer/webhook/{ERN}", "DELETE")
    export class CustomerWebhookRequest extends WebhookSubscription implements IReturn<CustomerWebhookResponse>
    {
        public constructor(init?: Partial<CustomerWebhookRequest>) { super(init); (Object as any).assign(this, init); }
        public getTypeName() { return 'CustomerWebhookRequest'; }
        public getMethod() { return 'PUT'; }
        public createResponse() { return new CustomerWebhookResponse(); }
    }
    // @Route("/job/approve", "POST")
    export class ApproveJob implements IReturn<JobResponse>, IHasJobERN
    {
        public approveJobNotes: string;
        public jobERN: string;
        public constructor(init?: Partial<ApproveJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ApproveJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    // @Route("/job/create", "POST")
    export class CreateJob implements IReturn<JobResponse>, IHasNullableJobType, IHasJobInput
    {
        public input: { [index: string]: string; };
        public type?: JobType;
        public constructor(init?: Partial<CreateJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    // @Route("/job/deny", "POST")
    export class DenyJob implements IReturn<JobResponse>, IHasJobERN
    {
        public denyJobNotes: string;
        public jobERN: string;
        public constructor(init?: Partial<DenyJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'DenyJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    // @Route("/job/list", "POST")
    export class ListJob implements IReturn<ListJobResponse>, IHasJobERN, IHasNullableJobType, IHasNullableJobState, IHasPrincipalERN, IHasNullablePendingApprovalState, IPaging
    {
        public jobERN: string;
        public state?: JobState;
        public type?: JobType;
        public approvalState?: PendingApproval;
        public principalERN: string;
        public skip?: number;
        public take?: number;
        public page?: number;
        public pageSize?: number;
        public constructor(init?: Partial<ListJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ListJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ListJobResponse(); }
    }
    // @Route("/job/retry", "POST")
    export class RetryJob implements IReturn<JobResponse>, IHasJobERN
    {
        public jobERN: string;
        public constructor(init?: Partial<RetryJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'RetryJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class CreateAccountDirectDebitCreateJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateAccountDirectDebitCreateJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateAccountDirectDebitCreateJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    // @Route("/v1/Accounts/{AccountId}/Mandates", "POST")
    export class AccountDirectDebitCreateJob extends CreateAccountMandateRequest implements IReturn<CreateAccountMandateResponse>, IHasJobERN, IHasAccountERN
    {
        public jobERN: string;
        public accountERN: string;
        public constructor(init?: Partial<AccountDirectDebitCreateJob>) { super(init); (Object as any).assign(this, init); }
        public getTypeName() { return 'AccountDirectDebitCreateJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new CreateAccountMandateResponse(); }
    }
    export class CreateAccountDirectDebitDeleteJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateAccountDirectDebitDeleteJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateAccountDirectDebitDeleteJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    // @Route("/v1/Accounts/{AccountId}/Mandates/{MandateId}", "DELETE")
    export class AccountDirectDebitDeleteJob extends DeleteAccountMandatesRequest implements IReturn<DeleteAccountMandatesResponse>, IHasJobERN, IHasAccountERN
    {
        public jobERN: string;
        public accountERN: string;
        public constructor(init?: Partial<AccountDirectDebitDeleteJob>) { super(init); (Object as any).assign(this, init); }
        public getTypeName() { return 'AccountDirectDebitDeleteJob'; }
        public getMethod() { return 'DELETE'; }
        public createResponse() { return new DeleteAccountMandatesResponse(); }
    }
    export class CreateAccountDirectDebitReturnJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateAccountDirectDebitReturnJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateAccountDirectDebitReturnJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    // @Route("/v1/Accounts/{AccountId}/Mandates/{MandateId}/Returns", "POST")
    export class AccountDirectDebitReturnJob extends CreateAccountMandateReturnRequest implements IReturn<CreateAccountMandateReturnResponse>, IHasJobERN, IHasAccountERN
    {
        public jobERN: string;
        public accountERN: string;
        public constructor(init?: Partial<AccountDirectDebitReturnJob>) { super(init); (Object as any).assign(this, init); }
        public getTypeName() { return 'AccountDirectDebitReturnJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new CreateAccountMandateReturnResponse(); }
    }
    export class CreateAccountDirectDebitUpdateJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateAccountDirectDebitUpdateJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateAccountDirectDebitUpdateJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    // @Route("/v1/Accounts/{AccountId}/Mandates/{MandateId}", "PATCH")
    export class AccountDirectDebitUpdateJob extends PatchAccountMandatesRequest implements IReturn<PatchAccountMandatesResponse>, IHasJobERN, IHasAccountERN
    {
        public jobERN: string;
        public accountERN: string;
        public constructor(init?: Partial<AccountDirectDebitUpdateJob>) { super(init); (Object as any).assign(this, init); }
        public getTypeName() { return 'AccountDirectDebitUpdateJob'; }
        public getMethod() { return 'PATCH'; }
        public createResponse() { return new PatchAccountMandatesResponse(); }
    }
    export class CreateAddBeneficiaryBlacklistJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateAddBeneficiaryBlacklistJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateAddBeneficiaryBlacklistJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class AddBeneficiaryBlacklistJob implements IReturn<AddBeneficiaryBlacklistJobResponse>, IHasJobERN, IHasIBan, IHasName, IHasMessage
    {
        public iBan: string;
        public jobERN: string;
        public message: string;
        public name: string;
        public constructor(init?: Partial<AddBeneficiaryBlacklistJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'AddBeneficiaryBlacklistJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new AddBeneficiaryBlacklistJobResponse(); }
    }
    export class CreateAddBusinessJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateAddBusinessJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateAddBusinessJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class AddBusinessJob implements IReturn<AddBusinessJobResponse>, IHasJobERN, IHasAccountTypeTag, IBusiness
    {
        public building: string;
        public street: string;
        public city: string;
        public stateDistrict: string;
        public zipPostcode: string;
        public country: string;
        public latitude: string;
        public longitude: string;
        public delvBuilding: string;
        public delvStreet: string;
        public delvCity: string;
        public delvStateDistrict: string;
        public delvZipPostcode: string;
        public delvCountry: string;
        public delvLatitude: string;
        public delvLongitude: string;
        public sendLimits: { [index: string]: number; };
        public transferLimits: { [index: string]: number; };
        public ern: string;
        public businessName: string;
        public accountManagerERN: string;
        public businessType?: BusinessEntityType;
        public incorporationJurisdiction?: IncorporationJurisdictionType;
        public incorporationNumber: string;
        public taxNumber: string;
        public vatNumber: string;
        public fatcaStatus?: FATCAStatusType;
        public telephoneNumber: string;
        public faxNumber: string;
        public emailAddress: string;
        public previousName: string;
        public accountsPeriodEnd?: number;
        public createdDate?: number;
        public modifiedDate?: number;
        public statusERN: string;
        public programIds: string[];
        public code: string;
        public riskScore?: number;
        public confidenceScore: number;
        public riskWeight: number;
        public overrideScore?: number;
        public overrideWeight?: number;
        public meta: { [index: string]: string; };
        public accountTypeTag: string;
        public jobERN: string;
        public industryERNs: string[];
        public constructor(init?: Partial<AddBusinessJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'AddBusinessJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new AddBusinessJobResponse(); }
    }
    export class CreateAddBusinessBeneficiaryJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateAddBusinessBeneficiaryJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateAddBusinessBeneficiaryJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class AddBusinessBeneficiaryJob implements IReturn<AddBusinessBeneficiaryJobResponse>, IHasJobERN, IHasLinkToAccountERN, IHasDocumentERNs
    {
        public businessName: string;
        public firstName: string;
        public lastName: string;
        public birthDate?: number;
        public beneficiaryType: BeneficiaryType;
        public confidenceScore: number;
        public bankName: string;
        public accountName: string;
        public swift: string;
        public iban: string;
        public sortCode: string;
        public accountNumber: string;
        public nickName: string;
        public documentERNs: string[];
        public jobERN: string;
        public linkToAccountERN: string;
        public constructor(init?: Partial<AddBusinessBeneficiaryJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'AddBusinessBeneficiaryJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new AddBusinessBeneficiaryJobResponse(); }
    }
    export class CreateAddBusinessProductJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateAddBusinessProductJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateAddBusinessProductJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class AddBusinessProductJob implements IReturn<AddBusinessProductJobResponse>, IHasJobERN, IHasBusinessERN, IHasCustomerERN, IHasAddressERN, IHasProductOfferERN, IHasProgramIdERN, IHasOverrides
    {
        public addressERN: string;
        public businessERN: string;
        public customerERN: string;
        public jobERN: string;
        public overrides: { [index: string]: string; };
        public productOfferERN: string;
        public programIdERN: string;
        public constructor(init?: Partial<AddBusinessProductJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'AddBusinessProductJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new AddBusinessProductJobResponse(); }
    }
    export class CreateAddCustomerJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateAddCustomerJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateAddCustomerJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class AddCustomerJob implements IReturn<AddCustomerJobResponse>, IHasJobERN, IHasAccountTypeTag, IHasConsumerIndustryERNs
    {
        public dateOfBirth: string;
        public title: string;
        public firstName: string;
        public middleName: string;
        public lastName: string;
        public gender?: GenderType;
        public nationality: string;
        public programId: string;
        public homePhone: string;
        public mobilePhone: string;
        public workPhone: string;
        public building: string;
        public street: string;
        public city: string;
        public stateDistrict: string;
        public zipPostcode: string;
        public country: string;
        public latitude: string;
        public longitude: string;
        public delvBuilding: string;
        public delvStreet: string;
        public delvCity: string;
        public delvStateDistrict: string;
        public delvZipPostcode: string;
        public delvCountry: string;
        public delvLatitude: string;
        public delvLongitude: string;
        public accountTypeTag: string;
        public jobERN: string;
        public industryERNs: string[];
        public workIndustryERNs: string[];
        public constructor(init?: Partial<AddCustomerJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'AddCustomerJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new AddCustomerJobResponse(); }
    }
    export class CreateAddCustomerProductJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateAddCustomerProductJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateAddCustomerProductJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class AddCustomerProductJob implements IReturn<AddCustomerProductJobResponse>, IHasJobERN, IHasCustomerERN, IHasProductOfferERN, IHasProgramIdERN, IHasOverrides, IHasCountryOfOrigin
    {
        public countryOfOrigin: string;
        public customerERN: string;
        public jobERN: string;
        public overrides: { [index: string]: string; };
        public productOfferERN: string;
        public programIdERN: string;
        public constructor(init?: Partial<AddCustomerProductJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'AddCustomerProductJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new AddCustomerProductJobResponse(); }
    }
    export class CreateAddDictionaryBlacklistJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateAddDictionaryBlacklistJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateAddDictionaryBlacklistJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class AddDictionaryBlacklistJob implements IReturn<AddDictionaryBlacklistJobResponse>, IHasJobERN, IHasIBan, IHasName, IHasMessage, IHasSource, IHasConfidenceScore
    {
        public iBan: string;
        public jobERN: string;
        public message: string;
        public name: string;
        public source: string;
        public riskScore?: number;
        public confidenceScore: number;
        public riskWeight: number;
        public overrideScore?: number;
        public overrideWeight?: number;
        public constructor(init?: Partial<AddDictionaryBlacklistJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'AddDictionaryBlacklistJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new AddDictionaryBlacklistJobResponse(); }
    }
    export class CreateAddRemitterBlacklistJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateAddRemitterBlacklistJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateAddRemitterBlacklistJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class AddRemitterBlacklistJob implements IReturn<AddRemitterBlacklistJobResponse>, IHasJobERN, IHasIBan, IHasName, IHasMessage
    {
        public iBan: string;
        public jobERN: string;
        public message: string;
        public name: string;
        public constructor(init?: Partial<AddRemitterBlacklistJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'AddRemitterBlacklistJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new AddRemitterBlacklistJobResponse(); }
    }
    export class CreateAddRemitterWhitelistJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateAddRemitterWhitelistJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateAddRemitterWhitelistJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class AddRemitterWhitelistJob implements IReturn<AddRemitterWhitelistJobResponse>, IHasJobERN, IHasIBan, IHasName, IHasMessage
    {
        public iBan: string;
        public jobERN: string;
        public message: string;
        public name: string;
        public constructor(init?: Partial<AddRemitterWhitelistJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'AddRemitterWhitelistJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new AddRemitterWhitelistJobResponse(); }
    }
    export class CreateBatchBeneficiaryAddJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateBatchBeneficiaryAddJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateBatchBeneficiaryAddJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class BatchBeneficiaryAddJob implements IReturn<BatchBeneficiaryAddJobResponse>, ICsvImport, IHasJobERN
    {
        public csvFileName: string;
        public csvContents: string;
        public jobERN: string;
        public constructor(init?: Partial<BatchBeneficiaryAddJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'BatchBeneficiaryAddJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new BatchBeneficiaryAddJobResponse(); }
    }
    export class CreateBatchImportTransactionsJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateBatchImportTransactionsJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateBatchImportTransactionsJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class BatchImportTransactionsJob implements IReturn<BatchImportTransactionsJobResponse>, IHasJobERN
    {
        public ubans: string[];
        public force: boolean;
        public maxBatchSize: number;
        public jobERN: string;
        public constructor(init?: Partial<BatchImportTransactionsJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'BatchImportTransactionsJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new BatchImportTransactionsJobResponse(); }
    }
    export class CreateBatchSendFundsJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateBatchSendFundsJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateBatchSendFundsJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class BatchSendFundsJob implements IReturn<BatchSendFundsJobResponse>, IHasJobERN, IHasAccountERNs
    {
        public csvFileName: string;
        public csvContents: string;
        public accountERNs: string[];
        public jobERN: string;
        public constructor(init?: Partial<BatchSendFundsJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'BatchSendFundsJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new BatchSendFundsJobResponse(); }
    }
    export class CreateChangeAccountProductOfferJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateChangeAccountProductOfferJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateChangeAccountProductOfferJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class ChangeAccountProductOfferJob implements IReturn<ChangeAccountProductOfferJobResponse>, IHasJobERN, IHasAccountERN, IHasProductOfferERN
    {
        public jobERN: string;
        public accountERN: string;
        public productOfferERN: string;
        public scheduleNow: boolean;
        public immediate: boolean;
        public constructor(init?: Partial<ChangeAccountProductOfferJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ChangeAccountProductOfferJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ChangeAccountProductOfferJobResponse(); }
    }
    export class CreateChangeAccountStatusJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateChangeAccountStatusJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateChangeAccountStatusJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class ChangeAccountStatusJob implements IReturn<ChangeAccountStatusJobResponse>, IHasJobERN, IHasAccountERN, IHasAccountStatusERN
    {
        public accountERN: string;
        public accountStatusERN: string;
        public jobERN: string;
        public constructor(init?: Partial<ChangeAccountStatusJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ChangeAccountStatusJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ChangeAccountStatusJobResponse(); }
    }
    export class CreateChangeBusinessContactJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateChangeBusinessContactJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateChangeBusinessContactJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class ChangeBusinessContactJob implements IReturn<ChangeBusinessContactJobResponse>, IHasJobERN, IHasBusinessERN
    {
        public businessName: string;
        public confidenceScore: number;
        public accountManagerERN: string;
        public businessType?: BusinessEntityType;
        public incorporationJurisdiction?: IncorporationJurisdictionType;
        public incorporationNumber: string;
        public taxNumber: string;
        public vatNumber: string;
        public fatcaStatus?: FATCAStatusType;
        public telephoneNumber: string;
        public faxNumber: string;
        public emailAddress: string;
        public previousName: string;
        public businessERN: string;
        public jobERN: string;
        public addresses: PrincipalAddressRecord[];
        public constructor(init?: Partial<ChangeBusinessContactJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ChangeBusinessContactJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ChangeBusinessContactJobResponse(); }
    }
    export class CreateChangeBusinessIndustryJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateChangeBusinessIndustryJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateChangeBusinessIndustryJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class ChangeBusinessIndustryJob implements IReturn<ChangeBusinessIndustryJobResponse>, IHasJobERN, IHasPrincipalERN, IHasIndustry
    {
        public principalERN: string;
        public industry: string;
        public jobERN: string;
        public constructor(init?: Partial<ChangeBusinessIndustryJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ChangeBusinessIndustryJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ChangeBusinessIndustryJobResponse(); }
    }
    export class CreateChangeBusinessStatusJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateChangeBusinessStatusJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateChangeBusinessStatusJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class ChangeBusinessStatusJob implements IReturn<ChangeBusinessStatusJobResponse>, IHasJobERN, IHasBusinessERN, IHasBusinessStatusERN
    {
        public businessERN: string;
        public businessStatusERN: string;
        public jobERN: string;
        public constructor(init?: Partial<ChangeBusinessStatusJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ChangeBusinessStatusJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ChangeBusinessStatusJobResponse(); }
    }
    export class CreateChangeCardGroupJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateChangeCardGroupJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateChangeCardGroupJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class ChangeCardGroupJob implements IReturn<ChangeCardGroupJobResponse>, IHasJobERN, IHasCardERN, IHasProductOfferERN, IHasOverrides
    {
        public cardERN: string;
        public jobERN: string;
        public overrides: { [index: string]: string; };
        public productOfferERN: string;
        public constructor(init?: Partial<ChangeCardGroupJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ChangeCardGroupJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ChangeCardGroupJobResponse(); }
    }
    export class CreateChangeCardStatusJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateChangeCardStatusJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateChangeCardStatusJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class ChangeCardStatusJob implements IReturn<ChangeCardStatusJobResponse>, IHasJobERN, IHasCardERN, IHasCardStatusERN
    {
        public cardERN: string;
        public cardStatusERN: string;
        public jobERN: string;
        public constructor(init?: Partial<ChangeCardStatusJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ChangeCardStatusJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ChangeCardStatusJobResponse(); }
    }
    export class CreateChangeCustomerContactJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateChangeCustomerContactJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateChangeCustomerContactJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class ChangeCustomerContactJob implements IReturn<ChangeCustomerContactJobResponse>, IHasJobERN, IHasCustomerERN
    {
        public dateOfBirth: string;
        public title: string;
        public firstName: string;
        public middleName: string;
        public lastName: string;
        public nationality: string;
        public homePhone: string;
        public mobilePhone: string;
        public workPhone: string;
        public addresses: PrincipalAddressRecord[];
        public customerERN: string;
        public jobERN: string;
        public constructor(init?: Partial<ChangeCustomerContactJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ChangeCustomerContactJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ChangeCustomerContactJobResponse(); }
    }
    export class CreateChangeCustomerIndustryJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateChangeCustomerIndustryJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateChangeCustomerIndustryJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class ChangeCustomerIndustryJob implements IReturn<ChangeCustomerIndustryJobResponse>, IHasJobERN, IHasPrincipalERN, IHasIndustry, IHasWorkIndustry
    {
        public principalERN: string;
        public industry: string;
        public jobERN: string;
        public workIndustry: string;
        public constructor(init?: Partial<ChangeCustomerIndustryJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ChangeCustomerIndustryJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ChangeCustomerIndustryJobResponse(); }
    }
    export class CreateChangeCustomerStatusJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateChangeCustomerStatusJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateChangeCustomerStatusJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class ChangeCustomerStatusJob implements IReturn<ChangeCustomerStatusJobResponse>, IHasJobERN, IHasCustomerERN, IHasCustomerStatusERN
    {
        public customerERN: string;
        public customerStatusERN: string;
        public jobERN: string;
        public constructor(init?: Partial<ChangeCustomerStatusJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ChangeCustomerStatusJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ChangeCustomerStatusJobResponse(); }
    }
    export class CreateComplianceBlacklistTransactionJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateComplianceBlacklistTransactionJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateComplianceBlacklistTransactionJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class ComplianceBlacklistTransactionJob implements IReturn<ComplianceBlacklistTransactionJobResponse>, IHasJobERN, IHasPendingTransactionERN
    {
        public blacklistName: boolean;
        public jobERN: string;
        public pendingTransactionERN: string;
        public constructor(init?: Partial<ComplianceBlacklistTransactionJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ComplianceBlacklistTransactionJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ComplianceBlacklistTransactionJobResponse(); }
    }
    export class CreateComplianceDenyBusinessAclJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateComplianceDenyBusinessAclJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateComplianceDenyBusinessAclJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class ComplianceDenyBusinessAclJob implements IReturn<ComplianceDenyBusinessAclJobResponse>, IHasJobERN, IHasBusinessERN, IHasPrincipalERN, IHasAclOperation, IHasResourceERN
    {
        public aclOperation?: ACLOperations;
        public businessERN: string;
        public jobERN: string;
        public principalERN: string;
        public resourceERN: string;
        public constructor(init?: Partial<ComplianceDenyBusinessAclJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ComplianceDenyBusinessAclJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ComplianceDenyBusinessAclJobResponse(); }
    }
    export class CreateComplianceGrantBusinessAclJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateComplianceGrantBusinessAclJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateComplianceGrantBusinessAclJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class ComplianceGrantBusinessAclJob implements IReturn<ComplianceGrantBusinessAclJobResponse>, IHasJobERN, IHasBusinessERN, IHasPrincipalERN, IHasAclOperation, IHasResourceERN, IHasLimitValue
    {
        public aclOperation?: ACLOperations;
        public businessERN: string;
        public jobERN: string;
        public limitValue?: number;
        public principalERN: string;
        public resourceERN: string;
        public constructor(init?: Partial<ComplianceGrantBusinessAclJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ComplianceGrantBusinessAclJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ComplianceGrantBusinessAclJobResponse(); }
    }
    export class CreateCompliancePendingTransactionLockJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateCompliancePendingTransactionLockJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateCompliancePendingTransactionLockJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class CompliancePendingTransactionLockJob implements IReturn<CompliancePendingTransactionLockJobResponse>, IHasJobERN, IHasPendingTransactionERN
    {
        public jobERN: string;
        public pendingTransactionERN: string;
        public constructor(init?: Partial<CompliancePendingTransactionLockJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CompliancePendingTransactionLockJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new CompliancePendingTransactionLockJobResponse(); }
    }
    export class CreateCompliancePendingTransactionResetJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateCompliancePendingTransactionResetJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateCompliancePendingTransactionResetJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class CompliancePendingTransactionResetJob implements IReturn<CompliancePendingTransactionResetJobResponse>, IHasJobERN, IHasPendingTransactionERN
    {
        public jobERN: string;
        public pendingTransactionERN: string;
        public force: boolean;
        public constructor(init?: Partial<CompliancePendingTransactionResetJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CompliancePendingTransactionResetJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new CompliancePendingTransactionResetJobResponse(); }
    }
    export class CreateCompliancePendingTransactionUnlockJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateCompliancePendingTransactionUnlockJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateCompliancePendingTransactionUnlockJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class CompliancePendingTransactionUnlockJob implements IReturn<CompliancePendingTransactionUnlockJobResponse>, IHasJobERN, IHasPendingTransactionERN
    {
        public jobERN: string;
        public pendingTransactionERN: string;
        public constructor(init?: Partial<CompliancePendingTransactionUnlockJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CompliancePendingTransactionUnlockJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new CompliancePendingTransactionUnlockJobResponse(); }
    }
    export class CreateComplianceRejectTransactionJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateComplianceRejectTransactionJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateComplianceRejectTransactionJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class ComplianceRejectTransactionJob implements IReturn<ComplianceRejectTransactionJobResponse>, IHasJobERN, IHasPendingTransactionERN, IHasPrincipalERN, IHasUseRecoveredFundsAccount
    {
        public jobERN: string;
        public pendingTransactionERN: string;
        public principalERN: string;
        public useRecoveredFundsAccount: boolean;
        public constructor(init?: Partial<ComplianceRejectTransactionJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ComplianceRejectTransactionJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ComplianceRejectTransactionJobResponse(); }
    }
    export class CreateComplianceReleaseTransactionJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateComplianceReleaseTransactionJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateComplianceReleaseTransactionJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class ComplianceReleaseTransactionJob implements IReturn<ComplianceReleaseTransactionJobResponse>, IHasJobERN, IHasPendingTransactionERN, IHasPrincipalERN
    {
        public jobERN: string;
        public pendingTransactionERN: string;
        public principalERN: string;
        public constructor(init?: Partial<ComplianceReleaseTransactionJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ComplianceReleaseTransactionJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ComplianceReleaseTransactionJobResponse(); }
    }
    export class CreateComplianceRevokeBusinessAclJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateComplianceRevokeBusinessAclJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateComplianceRevokeBusinessAclJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class ComplianceRevokeBusinessAclJob implements IReturn<ComplianceRevokeBusinessAclJobResponse>, IHasJobERN, IHasBusinessERN, IHasPrincipalERN, IHasAclOperation, IHasResourceERN
    {
        public aclOperation?: ACLOperations;
        public businessERN: string;
        public jobERN: string;
        public principalERN: string;
        public resourceERN: string;
        public constructor(init?: Partial<ComplianceRevokeBusinessAclJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ComplianceRevokeBusinessAclJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ComplianceRevokeBusinessAclJobResponse(); }
    }
    export class CreateComplianceSetConfidenceScoreJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateComplianceSetConfidenceScoreJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateComplianceSetConfidenceScoreJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class ComplianceSetConfidenceScoreJob implements IReturn<ComplianceSetConfidenceScoreJobResponse>, IHasPrincipalERN, IHasConfidenceScore, IHasJobERN
    {
        public riskScore?: number;
        public confidenceScore: number;
        public riskWeight: number;
        public overrideScore?: number;
        public overrideWeight?: number;
        public jobERN: string;
        public principalERN: string;
        public constructor(init?: Partial<ComplianceSetConfidenceScoreJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ComplianceSetConfidenceScoreJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ComplianceSetConfidenceScoreJobResponse(); }
    }
    export class CreateComplianceWhitelistTransactionJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateComplianceWhitelistTransactionJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateComplianceWhitelistTransactionJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class ComplianceWhitelistTransactionJob implements IReturn<ComplianceWhitelistTransactionJobResponse>, IHasJobERN, IHasPendingTransactionERN, IHasPrincipalERN
    {
        public whitelistAccount: boolean;
        public jobERN: string;
        public pendingTransactionERN: string;
        public principalERN: string;
        public constructor(init?: Partial<ComplianceWhitelistTransactionJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ComplianceWhitelistTransactionJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ComplianceWhitelistTransactionJobResponse(); }
    }
    export class CreateDeleteBusinessJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateDeleteBusinessJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateDeleteBusinessJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class DeleteBusinessJob implements IReturn<DeleteBusinessJobResponse>, IHasJobERN, IHasBusinessERN
    {
        public businessERN: string;
        public jobERN: string;
        public constructor(init?: Partial<DeleteBusinessJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'DeleteBusinessJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new DeleteBusinessJobResponse(); }
    }
    export class CreateDeleteCustomerJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateDeleteCustomerJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateDeleteCustomerJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class DeleteCustomerJob implements IReturn<DeleteCustomerJobResponse>, IHasJobERN, IHasCustomerERN
    {
        public customerERN: string;
        public jobERN: string;
        public constructor(init?: Partial<DeleteCustomerJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'DeleteCustomerJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new DeleteCustomerJobResponse(); }
    }
    export class CreateDenyBusinessAclJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateDenyBusinessAclJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateDenyBusinessAclJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class DenyBusinessAclJob implements IReturn<DenyBusinessAclJobResponse>, IHasJobERN, IHasBusinessERN, IHasPrincipalERN, IHasAclOperation, IHasResourceERN
    {
        public aclOperation?: ACLOperations;
        public businessERN: string;
        public jobERN: string;
        public principalERN: string;
        public resourceERN: string;
        public constructor(init?: Partial<DenyBusinessAclJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'DenyBusinessAclJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new DenyBusinessAclJobResponse(); }
    }
    export class CreateExecuteBeneficiaryReportJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateExecuteBeneficiaryReportJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateExecuteBeneficiaryReportJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class ExecuteBeneficiaryReportJob implements IReturn<ExecuteBeneficiaryReportJobResponse>, IHasJobERN
    {
        public date?: string;
        public dailyReport: boolean;
        public jobERN: string;
        public constructor(init?: Partial<ExecuteBeneficiaryReportJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ExecuteBeneficiaryReportJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ExecuteBeneficiaryReportJobResponse(); }
    }
    export class CreateExecuteBillingReportJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateExecuteBillingReportJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateExecuteBillingReportJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class ExecuteBillingReportJob implements IReturn<ExecuteBillingReportJobResponse>, IHasJobERN
    {
        public date?: string;
        public jobERN: string;
        public constructor(init?: Partial<ExecuteBillingReportJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ExecuteBillingReportJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ExecuteBillingReportJobResponse(); }
    }
    export class CreateExecuteBlacklistReportJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateExecuteBlacklistReportJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateExecuteBlacklistReportJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class ExecuteBlacklistReportJob implements IReturn<ExecuteBlacklistReportJobResponse>, IHasJobERN
    {
        public date?: string;
        public dailyReport: boolean;
        public jobERN: string;
        public constructor(init?: Partial<ExecuteBlacklistReportJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ExecuteBlacklistReportJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ExecuteBlacklistReportJobResponse(); }
    }
    export class CreateExecuteClearBankAccountsReportJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateExecuteClearBankAccountsReportJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateExecuteClearBankAccountsReportJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class ExecuteClearBankAccountsReportJob implements IReturn<ExecuteClearBankAccountsReportJobResponse>, IHasJobERN
    {
        public date?: string;
        public jobERN: string;
        public constructor(init?: Partial<ExecuteClearBankAccountsReportJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ExecuteClearBankAccountsReportJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ExecuteClearBankAccountsReportJobResponse(); }
    }
    export class CreateExecuteClearBankNonCustomerReportJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateExecuteClearBankNonCustomerReportJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateExecuteClearBankNonCustomerReportJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class ExecuteClearBankNonCustomerReportJob implements IReturn<ExecuteClearBankNonCustomerReportJobResponse>, IHasJobERN
    {
        public date?: string;
        public jobERN: string;
        public constructor(init?: Partial<ExecuteClearBankNonCustomerReportJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ExecuteClearBankNonCustomerReportJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ExecuteClearBankNonCustomerReportJobResponse(); }
    }
    export class CreateExecuteClearBankTransactionsReportJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateExecuteClearBankTransactionsReportJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateExecuteClearBankTransactionsReportJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class ExecuteClearBankTransactionsReportJob implements IReturn<ExecuteClearBankTransactionsReportJobResponse>, IHasJobERN
    {
        public date?: string;
        public jobERN: string;
        public constructor(init?: Partial<ExecuteClearBankTransactionsReportJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ExecuteClearBankTransactionsReportJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ExecuteClearBankTransactionsReportJobResponse(); }
    }
    export class CreateExecuteDailyCdeReportJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateExecuteDailyCdeReportJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateExecuteDailyCdeReportJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class ExecuteDailyCdeReportJob implements IReturn<ExecuteDailyCdeReportJobResponse>, IHasJobERN
    {
        public date?: string;
        public jobERN: string;
        public constructor(init?: Partial<ExecuteDailyCdeReportJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ExecuteDailyCdeReportJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ExecuteDailyCdeReportJobResponse(); }
    }
    export class CreateExecuteDocumentsReportJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateExecuteDocumentsReportJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateExecuteDocumentsReportJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class ExecuteDocumentsReportJob implements IReturn<ExecuteDocumentsReportJobResponse>, IHasJobERN
    {
        public jobERN: string;
        public date?: string;
        public constructor(init?: Partial<ExecuteDocumentsReportJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ExecuteDocumentsReportJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ExecuteDocumentsReportJobResponse(); }
    }
    export class CreateExecuteFeesReportJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateExecuteFeesReportJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateExecuteFeesReportJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class ExecuteFeesReportJob implements IReturn<ExecuteFeesReportJobResponse>, IHasJobERN
    {
        public date?: string;
        public jobERN: string;
        public constructor(init?: Partial<ExecuteFeesReportJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ExecuteFeesReportJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ExecuteFeesReportJobResponse(); }
    }
    export class CreateExecuteKycCheckJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateExecuteKycCheckJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateExecuteKycCheckJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class ExecuteKycCheckJob implements IReturn<ExecuteKycCheckJobResponse>, IHasJobERN, IHasBusinessERN, IHasCustomerERN, IHasBeneficiaryERN
    {
        public profileId: string;
        public beneficiaryERN: string;
        public businessERN: string;
        public customerERN: string;
        public jobERN: string;
        public constructor(init?: Partial<ExecuteKycCheckJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ExecuteKycCheckJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ExecuteKycCheckJobResponse(); }
    }
    export class CreateExecuteNightlyReportsJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateExecuteNightlyReportsJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateExecuteNightlyReportsJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class ExecuteNightlyReportsJob implements IReturn<ExecuteNightlyReportsJobResponse>, IHasJobERN
    {
        public date?: string;
        public jobERN: string;
        public constructor(init?: Partial<ExecuteNightlyReportsJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ExecuteNightlyReportsJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ExecuteNightlyReportsJobResponse(); }
    }
    export class CreateExecuteOutgoingTransactionMonitoringPipelineJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateExecuteOutgoingTransactionMonitoringPipelineJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateExecuteOutgoingTransactionMonitoringPipelineJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class ExecuteOutgoingTransactionMonitoringPipelineJob implements IReturn<ExecuteOutgoingTransactionMonitoringPipelineJobResponse>, IHasJobERN
    {
        public jobERN: string;
        public constructor(init?: Partial<ExecuteOutgoingTransactionMonitoringPipelineJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ExecuteOutgoingTransactionMonitoringPipelineJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ExecuteOutgoingTransactionMonitoringPipelineJobResponse(); }
    }
    export class CreateExecutePendingTransactionsReportJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateExecutePendingTransactionsReportJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateExecutePendingTransactionsReportJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class ExecutePendingTransactionsReportJob implements IReturn<ExecutePendingTransactionsReportJobResponse>, IHasJobERN
    {
        public date?: string;
        public dailyReport: boolean;
        public jobERN: string;
        public constructor(init?: Partial<ExecutePendingTransactionsReportJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ExecutePendingTransactionsReportJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ExecutePendingTransactionsReportJobResponse(); }
    }
    export class CreateExecuteSanctionCheckJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateExecuteSanctionCheckJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateExecuteSanctionCheckJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class ExecuteSanctionCheckJob implements IReturn<ExecuteSanctionCheckJobResponse>, IHasJobERN, IHasBusinessERN, IHasCustomerERN, IHasBeneficiaryERN
    {
        public beneficiaryERN: string;
        public businessERN: string;
        public customerERN: string;
        public jobERN: string;
        public constructor(init?: Partial<ExecuteSanctionCheckJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ExecuteSanctionCheckJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ExecuteSanctionCheckJobResponse(); }
    }
    export class CreateExecuteSanctionCheckUpdateJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateExecuteSanctionCheckUpdateJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateExecuteSanctionCheckUpdateJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class ExecuteSanctionCheckUpdateJob implements IReturn<ExecuteSanctionCheckUpdateJobResponse>, IHasJobERN
    {
        public reference: string;
        public found: boolean;
        public jobERN: string;
        public constructor(init?: Partial<ExecuteSanctionCheckUpdateJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ExecuteSanctionCheckUpdateJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ExecuteSanctionCheckUpdateJobResponse(); }
    }
    export class CreateExecuteSanctionsReportJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateExecuteSanctionsReportJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateExecuteSanctionsReportJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class ExecuteSanctionsReportJob implements IReturn<ExecuteSanctionsReportJobResponse>, IHasJobERN
    {
        public date?: string;
        public jobERN: string;
        public constructor(init?: Partial<ExecuteSanctionsReportJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ExecuteSanctionsReportJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ExecuteSanctionsReportJobResponse(); }
    }
    export class CreateGrantBusinessAclJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateGrantBusinessAclJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateGrantBusinessAclJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class GrantBusinessAclJob implements IReturn<GrantBusinessAclJobResponse>, IHasJobERN, IHasBusinessERN, IHasPrincipalERN, IHasAclOperation, IHasResourceERN, IHasLimitValue
    {
        public aclOperation?: ACLOperations;
        public businessERN: string;
        public jobERN: string;
        public limitValue?: number;
        public principalERN: string;
        public resourceERN: string;
        public constructor(init?: Partial<GrantBusinessAclJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'GrantBusinessAclJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new GrantBusinessAclJobResponse(); }
    }
    export class CreateLinkBusinessAccountJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateLinkBusinessAccountJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateLinkBusinessAccountJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class LinkBusinessAccountJob implements IReturn<LinkBusinessAccountJobResponse>, IHasJobERN, IHasBusinessERN, IHasAccountERN
    {
        public accountERN: string;
        public businessERN: string;
        public jobERN: string;
        public constructor(init?: Partial<LinkBusinessAccountJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'LinkBusinessAccountJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new LinkBusinessAccountJobResponse(); }
    }
    export class CreateLinkBusinessBeneficiaryJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateLinkBusinessBeneficiaryJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateLinkBusinessBeneficiaryJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class LinkBusinessBeneficiaryJob implements IReturn<LinkBusinessBeneficiaryJobResponse>, IHasJobERN, IHasAccountERN, IHasBeneficiaryAccountERN
    {
        public accountERN: string;
        public beneficiaryAccountERN: string;
        public jobERN: string;
        public constructor(init?: Partial<LinkBusinessBeneficiaryJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'LinkBusinessBeneficiaryJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new LinkBusinessBeneficiaryJobResponse(); }
    }
    export class CreateLinkBusinessEntityJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateLinkBusinessEntityJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateLinkBusinessEntityJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class LinkBusinessEntityJob implements IReturn<LinkBusinessEntityJobResponse>, IHasJobERN, IHasBusinessERN, IHasAclOperation, IHasPrincipalERN
    {
        public aclOperation?: ACLOperations;
        public businessERN: string;
        public jobERN: string;
        public principalERN: string;
        public constructor(init?: Partial<LinkBusinessEntityJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'LinkBusinessEntityJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new LinkBusinessEntityJobResponse(); }
    }
    export class CreateLoadAccountJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateLoadAccountJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateLoadAccountJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class LoadAccountJob implements IReturn<LoadAccountJobResponse>, IHasJobERN, IHasCardERN, IHasAmount
    {
        public loadSource: string;
        public loadType: string;
        public bankAccount: string;
        public bankRef: string;
        public receiptDate: number;
        public description: string;
        public amount: number;
        public cardERN: string;
        public jobERN: string;
        public constructor(init?: Partial<LoadAccountJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'LoadAccountJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new LoadAccountJobResponse(); }
    }
    export class CreateMergeCustomerJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateMergeCustomerJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateMergeCustomerJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class MergeCustomerJob implements IReturn<MergeCustomerJobResponse>, IHasJobERN, IHasSourceCustomerERN, IHasDestinationCustomerERN
    {
        public destinationCustomerERN: string;
        public jobERN: string;
        public sourceCustomerERN: string;
        public constructor(init?: Partial<MergeCustomerJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'MergeCustomerJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new MergeCustomerJobResponse(); }
    }
    export class CreateNotificationProfilesJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateNotificationProfilesJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateNotificationProfilesJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class NotificationProfilesJob extends NotificationProfile implements IReturn<NotificationProfilesJobResponse>, IHasJobERN
    {
        public jobERN: string;
        public constructor(init?: Partial<NotificationProfilesJob>) { super(init); (Object as any).assign(this, init); }
        public getTypeName() { return 'NotificationProfilesJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new NotificationProfilesJobResponse(); }
    }
    export class CreateNotificationTemplatesJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateNotificationTemplatesJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateNotificationTemplatesJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class NotificationTemplatesJob extends NotificationTemplate implements IReturn<NotificationTemplatesJobResponse>, IHasJobERN
    {
        public jobERN: string;
        public constructor(init?: Partial<NotificationTemplatesJob>) { super(init); (Object as any).assign(this, init); }
        public getTypeName() { return 'NotificationTemplatesJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new NotificationTemplatesJobResponse(); }
    }
    export class CreateProcessAccountFeeJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateProcessAccountFeeJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateProcessAccountFeeJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class ProcessAccountFeeJob implements IReturn<ProcessAccountFeeJobResponse>, IHasJobERN, IHasFeePaymentOrderERN, IHasSourceERN
    {
        public jobERN: string;
        public feePaymentOrderERN: string;
        public sourceERN: string;
        public constructor(init?: Partial<ProcessAccountFeeJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ProcessAccountFeeJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ProcessAccountFeeJobResponse(); }
    }
    export class CreateRebuildVirtualViewJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateRebuildVirtualViewJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateRebuildVirtualViewJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class RebuildVirtualViewJob implements IReturn<RebuildVirtualViewJobResponse>, IHasJobERN, IHasName, IHasPrincipalERN
    {
        public jobERN: string;
        public name: string;
        public principalERN: string;
        public constructor(init?: Partial<RebuildVirtualViewJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'RebuildVirtualViewJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new RebuildVirtualViewJobResponse(); }
    }
    export class CreateRegenerateCardJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateRegenerateCardJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateRegenerateCardJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class RegenerateCardJob implements IReturn<RegenerateCardJobResponse>, IHasJobERN, IHasCardERN
    {
        public cardERN: string;
        public jobERN: string;
        public constructor(init?: Partial<RegenerateCardJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'RegenerateCardJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new RegenerateCardJobResponse(); }
    }
    export class CreateReleasePendingTransactionJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateReleasePendingTransactionJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateReleasePendingTransactionJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class ReleasePendingTransactionJob implements IReturn<ReleasePendingTransactionJobResponse>, IHasJobERN, IHasPendingTransactionERN
    {
        public jobERN: string;
        public pendingTransactionERN: string;
        public constructor(init?: Partial<ReleasePendingTransactionJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ReleasePendingTransactionJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ReleasePendingTransactionJobResponse(); }
    }
    export class CreateRenewCardJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateRenewCardJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateRenewCardJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class RenewCardJob implements IReturn<RenewCardJobResponse>, IHasJobERN, IHasCardERN
    {
        public cardERN: string;
        public jobERN: string;
        public constructor(init?: Partial<RenewCardJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'RenewCardJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new RenewCardJobResponse(); }
    }
    export class CreateReversePendingTransactionJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateReversePendingTransactionJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateReversePendingTransactionJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class ReversePendingTransactionJob implements IReturn<ReversePendingTransactionJobResponse>, IHasJobERN, IHasPendingTransactionERN, IHasPrincipalERN, IHasUseRecoveredFundsAccount
    {
        public jobERN: string;
        public pendingTransactionERN: string;
        public principalERN: string;
        public useRecoveredFundsAccount: boolean;
        public constructor(init?: Partial<ReversePendingTransactionJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ReversePendingTransactionJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ReversePendingTransactionJobResponse(); }
    }
    export class CreateRevokeBusinessAclJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateRevokeBusinessAclJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateRevokeBusinessAclJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class RevokeBusinessAclJob implements IReturn<RevokeBusinessAclJobResponse>, IHasJobERN, IHasBusinessERN, IHasPrincipalERN, IHasAclOperation, IHasResourceERN
    {
        public aclOperation?: ACLOperations;
        public businessERN: string;
        public jobERN: string;
        public principalERN: string;
        public resourceERN: string;
        public constructor(init?: Partial<RevokeBusinessAclJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'RevokeBusinessAclJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new RevokeBusinessAclJobResponse(); }
    }
    export class CreateSendFundsJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateSendFundsJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateSendFundsJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class SendFundsJob implements IReturn<SendFundsJobResponse>, IHasJobERN, IHasAmount, IHasAccountERN, IHasToAccountCode, IHasBeneficiaryAccountERN, IHasNullablePaymentDate, IPaymentReference, IHasDocumentERNs
    {
        public accountERN: string;
        public amount: number;
        public beneficiaryAccountERN: string;
        public documentERNs: string[];
        public jobERN: string;
        public paymentDate?: number;
        public toAccountCode: string;
        public paymentReference: string;
        public internalReference: string;
        public scheme: ClearBankPaymentScheme;
        public constructor(init?: Partial<SendFundsJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'SendFundsJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new SendFundsJobResponse(); }
    }
    export class CreateSendFundsBkaJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateSendFundsBkaJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateSendFundsBkaJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class SendFundsBkaJob implements IReturn<SendFundsBkaJobResponse>, IHasJobERN, IHasAccountERN, IHasBeneficiaryAccountERN, IHasNullablePaymentDate, IHasAmount, IPaymentReference, IHasDocumentERNs
    {
        public accountERN: string;
        public amount: number;
        public beneficiaryAccountERN: string;
        public documentERNs: string[];
        public jobERN: string;
        public paymentDate?: number;
        public paymentReference: string;
        public internalReference: string;
        public scheme: ClearBankPaymentScheme;
        public constructor(init?: Partial<SendFundsBkaJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'SendFundsBkaJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new SendFundsBkaJobResponse(); }
    }
    export class CreateSendFundsForJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateSendFundsForJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateSendFundsForJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class SendFundsForJob implements IReturn<SendFundsForJobResponse>, IHasJobERN, IHasAmount, IHasAccountERN, IHasToAccountCode, IHasLastName
    {
        public accountERN: string;
        public amount: number;
        public jobERN: string;
        public lastName: string;
        public toAccountCode: string;
        public constructor(init?: Partial<SendFundsForJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'SendFundsForJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new SendFundsForJobResponse(); }
    }
    export class CreateTestJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateTestJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateTestJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class TestJob implements IReturn<TestJobResponse>, IHasJobERN
    {
        public test: string;
        public jobERN: string;
        public constructor(init?: Partial<TestJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'TestJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new TestJobResponse(); }
    }
    export class CreateTestBatchJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateTestBatchJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateTestBatchJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class TestBatchJob implements IReturn<TestBatchJobResponse>, IHasJobERN
    {
        public total: number;
        public jobERN: string;
        public constructor(init?: Partial<TestBatchJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'TestBatchJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new TestBatchJobResponse(); }
    }
    export class CreateTestBatch2Job implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateTestBatch2Job>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateTestBatch2Job'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class TestBatch2Job implements IReturn<TestBatch2JobResponse>, IHasJobERN
    {
        public total: number;
        public jobERN: string;
        public constructor(init?: Partial<TestBatch2Job>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'TestBatch2Job'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new TestBatch2JobResponse(); }
    }
    export class CreateTestScheduleJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateTestScheduleJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateTestScheduleJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class TestScheduleJob implements IReturn<TestScheduleJobResponse>, IHasJobERN
    {
        public test: string;
        public scheduleDate?: number;
        public jobERN: string;
        public constructor(init?: Partial<TestScheduleJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'TestScheduleJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new TestScheduleJobResponse(); }
    }
    export class CreateToggleAccountShowPendingJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateToggleAccountShowPendingJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateToggleAccountShowPendingJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class ToggleAccountShowPendingJob implements IReturn<ToggleAccountShowPendingJobResponse>, IHasJobERN, IHasAccountERN, IShowPendingNullable
    {
        public jobERN: string;
        public accountERN: string;
        public showPending?: boolean;
        public constructor(init?: Partial<ToggleAccountShowPendingJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ToggleAccountShowPendingJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ToggleAccountShowPendingJobResponse(); }
    }
    export class CreateToggleAccountVisibilityJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateToggleAccountVisibilityJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateToggleAccountVisibilityJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class ToggleAccountVisibilityJob implements IReturn<ToggleAccountVisibilityJobResponse>, IHasJobERN, IHasAccountERN, IIsHiddenNullable
    {
        public accountERN: string;
        public jobERN: string;
        public isHidden?: boolean;
        public constructor(init?: Partial<ToggleAccountVisibilityJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ToggleAccountVisibilityJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ToggleAccountVisibilityJobResponse(); }
    }
    export class CreateToggleBeneficiaryBlacklistJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateToggleBeneficiaryBlacklistJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateToggleBeneficiaryBlacklistJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class ToggleBeneficiaryBlacklistJob implements IReturn<ToggleBeneficiaryBlacklistJobResponse>, IHasJobERN, IHasBeneficiaryBlacklistERN, IHasEnabled
    {
        public beneficiaryBlacklistERN: string;
        public enabled?: boolean;
        public jobERN: string;
        public constructor(init?: Partial<ToggleBeneficiaryBlacklistJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ToggleBeneficiaryBlacklistJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ToggleBeneficiaryBlacklistJobResponse(); }
    }
    export class CreateToggleDictionaryBlacklistJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateToggleDictionaryBlacklistJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateToggleDictionaryBlacklistJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class ToggleDictionaryBlacklistJob implements IReturn<ToggleDictionaryBlacklistJobResponse>, IHasJobERN, IHasDictionaryBlacklistERN, IHasEnabled
    {
        public dictionaryBlacklistERN: string;
        public enabled?: boolean;
        public jobERN: string;
        public constructor(init?: Partial<ToggleDictionaryBlacklistJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ToggleDictionaryBlacklistJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ToggleDictionaryBlacklistJobResponse(); }
    }
    export class CreateToggleRemitterBlacklistJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateToggleRemitterBlacklistJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateToggleRemitterBlacklistJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class ToggleRemitterBlacklistJob implements IReturn<ToggleRemitterBlacklistJobResponse>, IHasJobERN, IHasRemitterBlacklistERN, IHasEnabled
    {
        public enabled?: boolean;
        public jobERN: string;
        public remitterBlacklistERN: string;
        public constructor(init?: Partial<ToggleRemitterBlacklistJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ToggleRemitterBlacklistJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ToggleRemitterBlacklistJobResponse(); }
    }
    export class CreateToggleRemitterWhitelistJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateToggleRemitterWhitelistJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateToggleRemitterWhitelistJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class ToggleRemitterWhitelistJob implements IReturn<ToggleRemitterWhitelistJobResponse>, IHasJobERN, IHasRemitterWhitelistERN, IHasEnabled
    {
        public enabled?: boolean;
        public jobERN: string;
        public remitterWhitelistERN: string;
        public constructor(init?: Partial<ToggleRemitterWhitelistJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ToggleRemitterWhitelistJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ToggleRemitterWhitelistJobResponse(); }
    }
    export class CreateTransactionMonitoringAddPresetJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateTransactionMonitoringAddPresetJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateTransactionMonitoringAddPresetJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class TransactionMonitoringAddPresetJob implements IReturn<TransactionMonitoringAddPresetJobResponse>, IHasJobERN
    {
        public preset: string;
        public jobERN: string;
        public constructor(init?: Partial<TransactionMonitoringAddPresetJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'TransactionMonitoringAddPresetJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new TransactionMonitoringAddPresetJobResponse(); }
    }
    export class CreateTransactionMonitoringAddRuleJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateTransactionMonitoringAddRuleJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateTransactionMonitoringAddRuleJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class TransactionMonitoringAddRuleJob implements IReturn<TransactionMonitoringAddRuleJobResponse>, IHasJobERN
    {
        public rule: string;
        public jobERN: string;
        public constructor(init?: Partial<TransactionMonitoringAddRuleJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'TransactionMonitoringAddRuleJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new TransactionMonitoringAddRuleJobResponse(); }
    }
    export class CreateTransactionMonitoringDeletePresetJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateTransactionMonitoringDeletePresetJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateTransactionMonitoringDeletePresetJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class TransactionMonitoringDeletePresetJob implements IReturn<TransactionMonitoringDeletePresetJobResponse>, IHasJobERN
    {
        public preset: string;
        public jobERN: string;
        public constructor(init?: Partial<TransactionMonitoringDeletePresetJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'TransactionMonitoringDeletePresetJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new TransactionMonitoringDeletePresetJobResponse(); }
    }
    export class CreateTransactionMonitoringDeleteRuleJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateTransactionMonitoringDeleteRuleJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateTransactionMonitoringDeleteRuleJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class TransactionMonitoringDeleteRuleJob implements IReturn<TransactionMonitoringDeleteRuleJobResponse>, IHasJobERN
    {
        public rule: string;
        public jobERN: string;
        public constructor(init?: Partial<TransactionMonitoringDeleteRuleJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'TransactionMonitoringDeleteRuleJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new TransactionMonitoringDeleteRuleJobResponse(); }
    }
    export class CreateTransactionMonitoringUpdatePresetJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateTransactionMonitoringUpdatePresetJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateTransactionMonitoringUpdatePresetJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class TransactionMonitoringUpdatePresetJob implements IReturn<TransactionMonitoringUpdatePresetJobResponse>, IHasJobERN
    {
        public newValue: string;
        public oldValue: string;
        public jobERN: string;
        public constructor(init?: Partial<TransactionMonitoringUpdatePresetJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'TransactionMonitoringUpdatePresetJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new TransactionMonitoringUpdatePresetJobResponse(); }
    }
    export class CreateTransactionMonitoringUpdateRuleJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateTransactionMonitoringUpdateRuleJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateTransactionMonitoringUpdateRuleJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class TransactionMonitoringUpdateRuleJob implements IReturn<TransactionMonitoringUpdateRuleJobResponse>, IHasJobERN
    {
        public newValue: string;
        public oldValue: string;
        public jobERN: string;
        public constructor(init?: Partial<TransactionMonitoringUpdateRuleJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'TransactionMonitoringUpdateRuleJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new TransactionMonitoringUpdateRuleJobResponse(); }
    }
    export class CreateTransferFundsJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateTransferFundsJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateTransferFundsJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class TransferFundsJob implements IReturn<TransferFundsJobResponse>, IHasJobERN, IHasAccountERN, IHasToAccountERN, IHasToAccountCode, IHasBeneficiaryAccountERN, IHasAmount, IHasNullablePaymentDate, IPaymentReference
    {
        public accountERN: string;
        public amount: number;
        public beneficiaryAccountERN: string;
        public jobERN: string;
        public paymentDate?: number;
        public toAccountCode: string;
        public toAccountERN: string;
        public paymentReference: string;
        public internalReference: string;
        public scheme: ClearBankPaymentScheme;
        public constructor(init?: Partial<TransferFundsJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'TransferFundsJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new TransferFundsJobResponse(); }
    }
    export class CreateTransferFundsBkaJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateTransferFundsBkaJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateTransferFundsBkaJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class TransferFundsBkaJob implements IReturn<TransferFundsBkaJobResponse>, IHasJobERN, IHasAccountERN, IHasToAccountERN, IHasAmount, IHasNullablePaymentDate, IPaymentReference
    {
        public accountERN: string;
        public amount: number;
        public jobERN: string;
        public paymentDate?: number;
        public toAccountERN: string;
        public paymentReference: string;
        public internalReference: string;
        public scheme: ClearBankPaymentScheme;
        public constructor(init?: Partial<TransferFundsBkaJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'TransferFundsBkaJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new TransferFundsBkaJobResponse(); }
    }
    export class CreateTransferFundsForJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateTransferFundsForJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateTransferFundsForJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class TransferFundsForJob implements IReturn<TransferFundsForJobResponse>, IHasJobERN, IHasAmount, IHasAccountERN, IHasToAccountERN
    {
        public accountERN: string;
        public amount: number;
        public jobERN: string;
        public toAccountERN: string;
        public constructor(init?: Partial<TransferFundsForJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'TransferFundsForJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new TransferFundsForJobResponse(); }
    }
    export class CreateUnlinkBusinessAccountJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateUnlinkBusinessAccountJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateUnlinkBusinessAccountJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class UnlinkBusinessAccountJob implements IReturn<UnlinkBusinessAccountJobResponse>, IHasJobERN, IHasBusinessERN, IHasAccountERN
    {
        public accountERN: string;
        public businessERN: string;
        public jobERN: string;
        public constructor(init?: Partial<UnlinkBusinessAccountJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'UnlinkBusinessAccountJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new UnlinkBusinessAccountJobResponse(); }
    }
    export class CreateUnlinkBusinessBeneficiaryJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateUnlinkBusinessBeneficiaryJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateUnlinkBusinessBeneficiaryJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class UnlinkBusinessBeneficiaryJob implements IReturn<UnlinkBusinessBeneficiaryJobResponse>, IHasJobERN, IHasAccountERN, IHasBeneficiaryAccountERN
    {
        public accountERN: string;
        public beneficiaryAccountERN: string;
        public jobERN: string;
        public constructor(init?: Partial<UnlinkBusinessBeneficiaryJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'UnlinkBusinessBeneficiaryJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new UnlinkBusinessBeneficiaryJobResponse(); }
    }
    export class CreateUnlinkBusinessEntityJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateUnlinkBusinessEntityJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateUnlinkBusinessEntityJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class UnlinkBusinessEntityJob implements IReturn<UnlinkBusinessEntityJobResponse>, IHasJobERN, IHasBusinessERN, IHasAclOperation, IHasPrincipalERN
    {
        public aclOperation?: ACLOperations;
        public businessERN: string;
        public jobERN: string;
        public principalERN: string;
        public constructor(init?: Partial<UnlinkBusinessEntityJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'UnlinkBusinessEntityJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new UnlinkBusinessEntityJobResponse(); }
    }
    export class CreateUnloadAccountJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateUnloadAccountJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateUnloadAccountJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class UnloadAccountJob implements IReturn<UnloadAccountJobResponse>, IHasJobERN, IHasCardERN, IHasAmount
    {
        public loadSource: string;
        public loadType: string;
        public amount: number;
        public cardERN: string;
        public jobERN: string;
        public constructor(init?: Partial<UnloadAccountJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'UnloadAccountJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new UnloadAccountJobResponse(); }
    }
    export class CreateUpdate3DSecureJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateUpdate3DSecureJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateUpdate3DSecureJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class Update3DSecureJob implements IReturn<Update3DSecureJobResponse>, IHasJobERN, IHasPublicToken, IHasMobilePhone, IHasMemorableDate
    {
        public jobERN: string;
        public mobilePhone: string;
        public publicToken: number;
        public memorableDate: string;
        public constructor(init?: Partial<Update3DSecureJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'Update3DSecureJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new Update3DSecureJobResponse(); }
    }
    export class CreateUpdateBeneficiaryBlacklistJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateUpdateBeneficiaryBlacklistJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateUpdateBeneficiaryBlacklistJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class UpdateBeneficiaryBlacklistJob implements IReturn<UpdateBeneficiaryBlacklistJobResponse>, IHasJobERN, IHasBeneficiaryBlacklistERN, IHasMessage
    {
        public beneficiaryBlacklistERN: string;
        public jobERN: string;
        public message: string;
        public constructor(init?: Partial<UpdateBeneficiaryBlacklistJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'UpdateBeneficiaryBlacklistJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new UpdateBeneficiaryBlacklistJobResponse(); }
    }
    export class CreateUpdateBillingProfileAccountJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateUpdateBillingProfileAccountJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateUpdateBillingProfileAccountJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class UpdateBillingProfileAccountJob implements IReturn<UpdateBillingProfileAccountJobResponse>, IHasJobERN, IHasERN, IHasPrincipalERN
    {
        public credits: CreditSchedule;
        public balanceSheet: FeeBalanceSheet;
        public billToAccount: string;
        public nonBillableAccount: boolean;
        public billableAccount: boolean;
        public transactionalBilling: boolean;
        public showTransactionFee?: boolean;
        public hideTransactionFee?: boolean;
        public ern: string;
        public jobERN: string;
        public principalERN: string;
        public constructor(init?: Partial<UpdateBillingProfileAccountJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'UpdateBillingProfileAccountJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new UpdateBillingProfileAccountJobResponse(); }
    }
    export class CreateUpdateBillingProfileProductOfferJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateUpdateBillingProfileProductOfferJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateUpdateBillingProfileProductOfferJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class UpdateBillingProfileProductOfferJob implements IReturn<UpdateBillingProfileProductOfferJobResponse>, IHasJobERN, IHasERN, IHasPrincipalERN
    {
        public fees: FeeSchedule;
        public prePaid: CreditSchedule;
        public ern: string;
        public jobERN: string;
        public principalERN: string;
        public constructor(init?: Partial<UpdateBillingProfileProductOfferJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'UpdateBillingProfileProductOfferJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new UpdateBillingProfileProductOfferJobResponse(); }
    }
    export class CreateUpdateBusinessBeneficiaryJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateUpdateBusinessBeneficiaryJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateUpdateBusinessBeneficiaryJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class UpdateBusinessBeneficiaryJob implements IReturn<UpdateBusinessBeneficiaryJobResponse>, IHasJobERN, IHasBeneficiaryAccountERN, IHasNickName, IHasDocumentERNs
    {
        public beneficiaryAccountERN: string;
        public documentERNs: string[];
        public jobERN: string;
        public nickName: string;
        public constructor(init?: Partial<UpdateBusinessBeneficiaryJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'UpdateBusinessBeneficiaryJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new UpdateBusinessBeneficiaryJobResponse(); }
    }
    export class CreateUpdateDictionaryBlacklistJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateUpdateDictionaryBlacklistJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateUpdateDictionaryBlacklistJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class UpdateDictionaryBlacklistJob implements IReturn<UpdateDictionaryBlacklistJobResponse>, IHasJobERN, IHasDictionaryBlacklistERN, IHasMessage, IHasConfidenceScore
    {
        public dictionaryBlacklistERN: string;
        public jobERN: string;
        public message: string;
        public riskScore?: number;
        public confidenceScore: number;
        public riskWeight: number;
        public overrideScore?: number;
        public overrideWeight?: number;
        public constructor(init?: Partial<UpdateDictionaryBlacklistJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'UpdateDictionaryBlacklistJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new UpdateDictionaryBlacklistJobResponse(); }
    }
    export class CreateUpdateRemitterBlacklistJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateUpdateRemitterBlacklistJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateUpdateRemitterBlacklistJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class UpdateRemitterBlacklistJob implements IReturn<UpdateRemitterBlacklistJobResponse>, IHasJobERN, IHasRemitterBlacklistERN, IHasMessage
    {
        public jobERN: string;
        public message: string;
        public remitterBlacklistERN: string;
        public constructor(init?: Partial<UpdateRemitterBlacklistJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'UpdateRemitterBlacklistJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new UpdateRemitterBlacklistJobResponse(); }
    }
    export class CreateUpdateRemitterWhitelistJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateUpdateRemitterWhitelistJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateUpdateRemitterWhitelistJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class UpdateRemitterWhitelistJob implements IReturn<UpdateRemitterWhitelistJobResponse>, IHasJobERN, IHasRemitterWhitelistERN, IHasMessage
    {
        public jobERN: string;
        public message: string;
        public remitterWhitelistERN: string;
        public constructor(init?: Partial<UpdateRemitterWhitelistJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'UpdateRemitterWhitelistJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new UpdateRemitterWhitelistJobResponse(); }
    }
    export class CreateUpdateVelocityLimitsJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateUpdateVelocityLimitsJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateUpdateVelocityLimitsJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class UpdateVelocityLimitsJob implements IReturn<UpdateVelocityLimitsJobResponse>, IHasJobERN
    {
        public uban: string;
        public acno: string;
        public values: TimePeriodMatrix<VelocityLimit>;
        public outValues: TimePeriodMatrix<VelocityLimit>;
        public jobERN: string;
        public constructor(init?: Partial<UpdateVelocityLimitsJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'UpdateVelocityLimitsJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new UpdateVelocityLimitsJobResponse(); }
    }
    export class CreateUpsertCountryJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateUpsertCountryJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateUpsertCountryJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class UpsertCountryJob extends Country implements IReturn<UpsertCountryJobResponse>, IHasJobERN
    {
        public jobERN: string;
        public constructor(init?: Partial<UpsertCountryJob>) { super(init); (Object as any).assign(this, init); }
        public getTypeName() { return 'UpsertCountryJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new UpsertCountryJobResponse(); }
    }
    export class CreateUpsertIndustryJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateUpsertIndustryJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateUpsertIndustryJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class UpsertIndustryJob extends Industry implements IReturn<UpsertIndustryJobResponse>, IHasJobERN
    {
        public jobERN: string;
        public constructor(init?: Partial<UpsertIndustryJob>) { super(init); (Object as any).assign(this, init); }
        public getTypeName() { return 'UpsertIndustryJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new UpsertIndustryJobResponse(); }
    }
    export class CreateUpsertInstitutionJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateUpsertInstitutionJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateUpsertInstitutionJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class UpsertInstitutionJob implements IReturn<UpsertInstitutionJobResponse>, IHasJobERN, IHasERN
    {
        public name: string;
        public code: string;
        public ern: string;
        public jobERN: string;
        public constructor(init?: Partial<UpsertInstitutionJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'UpsertInstitutionJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new UpsertInstitutionJobResponse(); }
    }
    export class CreateUpsertKycCheckProfileJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateUpsertKycCheckProfileJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateUpsertKycCheckProfileJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class UpsertKycCheckProfileJob implements IReturn<UpsertKycCheckProfileJobResponse>, IHasJobERN
    {
        public name: string;
        public code: string;
        public jobERN: string;
        public constructor(init?: Partial<UpsertKycCheckProfileJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'UpsertKycCheckProfileJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new UpsertKycCheckProfileJobResponse(); }
    }
    export class CreateUpsertProcessorJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateUpsertProcessorJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateUpsertProcessorJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class UpsertProcessorJob implements IReturn<UpsertProcessorJobResponse>, IHasJobERN
    {
        public code: string;
        public name: string;
        public productTypes: ProductType[];
        public currencies: string[];
        public ern: string;
        public jobERN: string;
        public constructor(init?: Partial<UpsertProcessorJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'UpsertProcessorJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new UpsertProcessorJobResponse(); }
    }
    export class CreateUpsertProductOfferJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateUpsertProductOfferJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateUpsertProductOfferJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class UpsertProductOfferJob extends ProductOfferGroupConstruct implements IReturn<UpsertProductOfferJobResponse>, IHasJobERN
    {
        public jobERN: string;
        public constructor(init?: Partial<UpsertProductOfferJob>) { super(init); (Object as any).assign(this, init); }
        public getTypeName() { return 'UpsertProductOfferJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new UpsertProductOfferJobResponse(); }
    }
    export class CreateUpsertProgramIdJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateUpsertProgramIdJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateUpsertProgramIdJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class UpsertProgramIdJob extends ProgramId implements IReturn<UpsertProgramIdJobResponse>, IHasJobERN
    {
        public jobERN: string;
        public constructor(init?: Partial<UpsertProgramIdJob>) { super(init); (Object as any).assign(this, init); }
        public getTypeName() { return 'UpsertProgramIdJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new UpsertProgramIdJobResponse(); }
    }
    export class CreateUpsertStatusJob implements IReturn<JobResponse>, IHasJobInput
    {
        public input: { [index: string]: string; };
        public constructor(init?: Partial<CreateUpsertStatusJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateUpsertStatusJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new JobResponse(); }
    }
    export class UpsertStatusJob implements IReturn<UpsertStatusJobResponse>, IHasJobERN
    {
        public csv: string;
        public jobERN: string;
        public constructor(init?: Partial<UpsertStatusJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'UpsertStatusJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new UpsertStatusJobResponse(); }
    }
    export class ExecuteJob implements IReturn<ExecuteJobResponse>, IHasJobERN
    {
        public jobERN: string;
        public constructor(init?: Partial<ExecuteJob>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ExecuteJob'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ExecuteJobResponse(); }
    }
    export class ExecuteJobTask implements IReturn<ExecuteJobTaskResponse>, IHasJobERN
    {
        public jobERN: string;
        public constructor(init?: Partial<ExecuteJobTask>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ExecuteJobTask'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new ExecuteJobTaskResponse(); }
    }
    // @Route("/banner/notifications", "GET")
    export class GetBannerNotifications implements IReturn<GetBannerNotificationsResponse>
    {
        public constructor(init?: Partial<GetBannerNotifications>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'GetBannerNotifications'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new GetBannerNotificationsResponse(); }
    }
    // @Route("/auth/banner/notifications", "GET")
    export class GetAuthBannerNotifications implements IReturn<GetBannerNotificationsResponse>
    {
        public constructor(init?: Partial<GetAuthBannerNotifications>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'GetAuthBannerNotifications'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new GetBannerNotificationsResponse(); }
    }
    // @Route("/banner/notification", "POST,PUT,DELETE")
    export class BannerNotificationRequest extends BannerNotification implements IReturn<BannerNotificationResponse>
    {
        public constructor(init?: Partial<BannerNotificationRequest>) { super(init); (Object as any).assign(this, init); }
        public getTypeName() { return 'BannerNotificationRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new BannerNotificationResponse(); }
    }
    // @Route("/authenticator/user/devices", "GET")
    export class GetAuthDevicesRequest implements IReturn<GetAuthDevicesResponse>, IHasUserAuthId
    {
        public userAuthId: string;
        public constructor(init?: Partial<GetAuthDevicesRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'GetAuthDevicesRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new GetAuthDevicesResponse(); }
    }
    // @Route("/authenticator/device/recover", "POST")
    export class RecoverDeviceRequest implements IReturn<RecoverDeviceResponse>, IHasAuthorizationCode, IHasDeviceId
    {
        public authorizationCode: string;
        public deviceId: string;
        public constructor(init?: Partial<RecoverDeviceRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'RecoverDeviceRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new RecoverDeviceResponse(); }
    }
    // @Route("/authenticator/notification/{ERN}", "GET")
    export class GetNotificationRequest implements IReturn<GetNotificationResponse>, IHasERN
    {
        public ern: string;
        public constructor(init?: Partial<GetNotificationRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'GetNotificationRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new GetNotificationResponse(); }
    }
    // @Route("/authenticator/user/enroll", "POST")
    export class EnrollUserRequest implements IReturn<EnrollUserResponse>, IHasUserAuthId, IHasSecuredAccessCode
    {
        public userAuthId: string;
        public securedAccessCode: string;
        public constructor(init?: Partial<EnrollUserRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'EnrollUserRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new EnrollUserResponse(); }
    }
    // @Route("/authenticator/device/enroll", "POST")
    export class EnrollDeviceRequest implements IReturn<EnrollDeviceResponse>, IHasAuthorizationCode, IHasDeviceId
    {
        public authorizationCode: string;
        public deviceId: string;
        public constructor(init?: Partial<EnrollDeviceRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'EnrollDeviceRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new EnrollDeviceResponse(); }
    }
    // @Route("/authenticator/enroll/complete", "POST")
    export class EnrollCompleteRequest implements IReturn<EnrollCompleteResponse>, IHasDeviceId, IHasMfaVerificationCode
    {
        public deviceId: string;
        public mfaVerificationCode: string;
        public constructor(init?: Partial<EnrollCompleteRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'EnrollCompleteRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new EnrollCompleteResponse(); }
    }
    // @Route("/authenticator/authenticate", "POST")
    export class CreateAuthRequest implements IReturn<CreateAuthResponse>, IHasOriginalRequest, IHasNotification, IHasAuthenticatedAuthorization, IHasUserAuthId, IHasFactoryType
    {
        public authenticatedAuthorization: string;
        public factoryType: string;
        public notification: Notification;
        public originalRequest: string;
        public userAuthId: string;
        public constructor(init?: Partial<CreateAuthRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CreateAuthRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new CreateAuthResponse(); }
    }
    // @Route("/authenticator/authorize", "POST")
    export class AuthorizeRequest implements IReturn<AuthorizeResponse>, IHasAuthRequestERN, IIsAuthorized, IHasMfaVerificationCode
    {
        public authRequestERN: string;
        public mfaVerificationCode: string;
        public isAuthorized?: boolean;
        public constructor(init?: Partial<AuthorizeRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'AuthorizeRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new AuthorizeResponse(); }
    }
    // @Route("/counterparty", "POST,PUT,DELETE")
    export class CounterpartyRequest extends Counterparty implements IReturn<CounterpartyResponse>, IHasUBAN, IHasPrincipalERN
    {
        public uban: string;
        public principalERN: string;
        public constructor(init?: Partial<CounterpartyRequest>) { super(init); (Object as any).assign(this, init); }
        public getTypeName() { return 'CounterpartyRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new CounterpartyResponse(); }
    }
    // @Route("/Counterparty/Todo", "GET")
    export class CounterpartyTodoRequest implements IReturn<CounterpartyTodoResponse>
    {
        public constructor(init?: Partial<CounterpartyTodoRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'CounterpartyTodoRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new CounterpartyTodoResponse(); }
    }
    // @Route("/uban/{UBAN}", "GET")
    export class UbanFromCounterpartiesRequest implements IReturn<UbanFromCounterpartiesResponse>, IHasUBAN
    {
        public uban: string;
        public constructor(init?: Partial<UbanFromCounterpartiesRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'UbanFromCounterpartiesRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new UbanFromCounterpartiesResponse(); }
    }
    // @Route("/mailbox/admin/{MailboxERN}/messages/{SubjectERN}/pdf", "GET")
    export class AdminMailboxMessagePdfRequest implements IReturn<MailboxMessagePdfResponse>
    {
        public mailboxERN: string;
        public subjectERN: string;
        public constructor(init?: Partial<AdminMailboxMessagePdfRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'AdminMailboxMessagePdfRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new MailboxMessagePdfResponse(); }
    }
    // @Route("/mailbox/owner/admin/{ERN}", "GET")
    export class AdminMailboxOwnerRequest implements IReturn<MailboxOwnerResponse>, IHasERN
    {
        public ern: string;
        public constructor(init?: Partial<AdminMailboxOwnerRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'AdminMailboxOwnerRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new MailboxOwnerResponse(); }
    }
    // @Route("/mailbox/admin/subject/workflow", "PUT")
    export class AdminSubjectWorkflowRequest implements IReturn<SubjectWorkflowResponse>
    {
        public mailboxERN: string;
        public subjectERN: string;
        public workflowStatus?: MailboxWorkflowStatus;
        public constructor(init?: Partial<AdminSubjectWorkflowRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'AdminSubjectWorkflowRequest'; }
        public getMethod() { return 'PUT'; }
        public createResponse() { return new SubjectWorkflowResponse(); }
    }
    // @Route("/mailbox/admin/list", "GET")
    export class AdminListMailboxRequest implements IReturn<ListMailboxResponse>, IHasOwner
    {
        public owner: string;
        public constructor(init?: Partial<AdminListMailboxRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'AdminListMailboxRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new ListMailboxResponse(); }
    }
    // @Route("/mailbox/admin/subjects/{Owner}", "GET")
    export class AdminListMailboxSubjectRequest implements IReturn<AdminListMailboxSubjectResponse>, IHasOwner
    {
        public workflowStatus?: MailboxWorkflowStatus;
        public skip?: number;
        public take?: number;
        public owner: string;
        public constructor(init?: Partial<AdminListMailboxSubjectRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'AdminListMailboxSubjectRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new AdminListMailboxSubjectResponse(); }
    }
    // @Route("/mailbox/admin/{MailboxERN}/messages/{SubjectERN}", "GET")
    export class AdminListMailboxMessageRequest implements IReturn<ListMailboxMessageResponse>
    {
        public mailboxERN: string;
        public subjectERN: string;
        public constructor(init?: Partial<AdminListMailboxMessageRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'AdminListMailboxMessageRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new ListMailboxMessageResponse(); }
    }
    // @Route("/mailbox/admin/message/{ERN}", "GET")
    // @Route("/mailbox/admin/message", "POST,PUT")
    export class AdminMailboxMessageRequest implements IReturn<MailboxMessageResponse>, IHasERN
    {
        public from: string;
        public to: string;
        public subject: string;
        public message: string;
        public addFlags?: MailboxMessageFlags;
        public ern: string;
        public constructor(init?: Partial<AdminMailboxMessageRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'AdminMailboxMessageRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new MailboxMessageResponse(); }
    }
    // @Route("/mailbox/admin/subject/messages", "GET")
    export class AdminListSubjectMessagesRequest implements IReturn<AdminListSubjectMessagesResponse>
    {
        public subject: string;
        public constructor(init?: Partial<AdminListSubjectMessagesRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'AdminListSubjectMessagesRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new AdminListSubjectMessagesResponse(); }
    }
    // @Route("/mailbox/admin/subject/message", "POST")
    export class AdminSubjectMessageRequest implements IReturn<SubjectMessageResponse>
    {
        public subject: string;
        public message: string;
        public flags: MailboxMessageFlags;
        public constructor(init?: Partial<AdminSubjectMessageRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'AdminSubjectMessageRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new SubjectMessageResponse(); }
    }
    // @Route("/mailbox/admin/subject/{SubjectERN}/owner", "POST,PUT")
    export class AdminMailboxSubjectOwnerRequest implements IReturn<MailboxSubjectOwnerResponse>
    {
        public subjectERN: string;
        public userAuthId: string;
        public constructor(init?: Partial<AdminMailboxSubjectOwnerRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'AdminMailboxSubjectOwnerRequest'; }
        public getMethod() { return 'POST'; }
        public createResponse() { return new MailboxSubjectOwnerResponse(); }
    }
    // @Route("/mailbox/{MailboxERN}/messages/{SubjectERN}/pdf", "GET")
    export class MailboxMessagePdfRequest implements IReturn<MailboxMessagePdfResponse>
    {
        public mailboxERN: string;
        public subjectERN: string;
        public constructor(init?: Partial<MailboxMessagePdfRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'MailboxMessagePdfRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new MailboxMessagePdfResponse(); }
    }
    // @Route("/mailbox/subject/workflow", "PUT")
    export class SubjectWorkflowRequest implements IReturn<SubjectWorkflowResponse>
    {
        public mailboxERN: string;
        public subjectERN: string;
        public workflowStatus?: MailboxWorkflowStatus;
        public constructor(init?: Partial<SubjectWorkflowRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'SubjectWorkflowRequest'; }
        public getMethod() { return 'PUT'; }
        public createResponse() { return new SubjectWorkflowResponse(); }
    }
    // @Route("/mailbox/list", "GET")
    export class ListMailboxRequest implements IReturn<ListMailboxResponse>
    {
        public constructor(init?: Partial<ListMailboxRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ListMailboxRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new ListMailboxResponse(); }
    }
    // @Route("/mailbox/subjects/{Owner}", "GET")
    export class ListMailboxSubjectRequest implements IReturn<ListMailboxSubjectResponse>, IHasOwner
    {
        public workflowStatus?: MailboxWorkflowStatus;
        public skip?: number;
        public take?: number;
        public owner: string;
        public constructor(init?: Partial<ListMailboxSubjectRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ListMailboxSubjectRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new ListMailboxSubjectResponse(); }
    }
    // @Route("/mailbox/{MailboxERN}/messages/{SubjectERN}", "GET")
    export class ListMailboxMessageRequest implements IReturn<ListMailboxMessageResponse>
    {
        public mailboxERN: string;
        public subjectERN: string;
        public constructor(init?: Partial<ListMailboxMessageRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'ListMailboxMessageRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new ListMailboxMessageResponse(); }
    }
    // @Route("/mailbox/message/{ERN}", "GET")
    // @Route("/mailbox/message", "POST,PUT")
    export class MailboxMessageRequest implements IReturn<MailboxMessageResponse>, IHasERN
    {
        public from: string;
        public to: string;
        public subject: string;
        public message: string;
        public ern: string;
        public constructor(init?: Partial<MailboxMessageRequest>) { (Object as any).assign(this, init); }
        public getTypeName() { return 'MailboxMessageRequest'; }
        public getMethod() { return 'GET'; }
        public createResponse() { return new MailboxMessageResponse(); }
    }
}