/* Options:
Date: 2021-03-08 17:34:14
Version: 5.104
Tip: To override a DTO option, remove "//" prefix before updating
BaseUrl: https://localhost:5016

GlobalNamespace: WebhookApi
//MakePropertiesOptional: False
AddServiceStackTypes: True
AddResponseStatus: True
//AddImplicitVersion: 
AddDescriptionAsComments: True
//IncludeTypes: 
//ExcludeTypes: 
DefaultImports: SortedDictionary from "./sorted-dictionary", ObservableCollection from "./observable-collection",HttpStatusCode from "./http-status-codes",WebhookEvents from "./webhook-events",IList from "./i-list",IEnumerable from "./i-enumerable"
*/

import HttpStatusCode from "./http-status-codes";

export module WebhookApi {

    export interface IReturn<T> {
        createResponse(): T;
    }

    export interface IReturnVoid {
        createResponse(): void;
    }

    export interface IHasSessionId {
        sessionId: string;
    }

    export interface IHasBearerToken {
        bearerToken: string;
    }

    export interface IPost {
    }

    export interface IGet {
    }

    export interface IPut {
    }

    export interface IDelete {
    }

    export class PlatformHost {
        public baseUrl: string;
        public basePath: string;
        public url: string;

        public constructor(init?: Partial<PlatformHost>) {
            (Object as any).assign(this, init);
        }
    }

    export class IM implements IPlatformLayer {
        public version: string;

        public constructor(init?: Partial<IM>) {
            (Object as any).assign(this, init);
        }
    }

    export class Enumis implements IPlatformLayer {
        public version: string;

        public constructor(init?: Partial<Enumis>) {
            (Object as any).assign(this, init);
        }
    }

    export class PlatformSummary {
        public serviceName: string;
        public host: PlatformHost;
        public im: IM;
        public enumis: Enumis;
        public apiVersion: string;

        public constructor(init?: Partial<PlatformSummary>) {
            (Object as any).assign(this, init);
        }
    }

    // @DataContract
    export class ResponseError {
        // @DataMember(Order=1)
        public errorCode: string;

        // @DataMember(Order=2)
        public fieldName: string;

        // @DataMember(Order=3)
        public message: string;

        // @DataMember(Order=4)
        public meta: { [index: string]: string; };

        public constructor(init?: Partial<ResponseError>) {
            (Object as any).assign(this, init);
        }
    }

    // @DataContract
    export class ResponseStatus {
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

        public constructor(init?: Partial<ResponseStatus>) {
            (Object as any).assign(this, init);
        }
    }

    export interface IHasUserAuthId {
        userAuthId: string;
    }

    // @DataContract
    export class UserApiKey {
        // @DataMember(Order=1)
        public key: string;

        // @DataMember(Order=2)
        public keyType: string;

        // @DataMember(Order=3)
        public expiryDate?: string;

        // @DataMember(Order=4)
        public meta: { [index: string]: string; };

        public constructor(init?: Partial<UserApiKey>) {
            (Object as any).assign(this, init);
        }
    }

    export interface IHasUserName {
        userName: string;
    }

    export interface IHasPassword {
        password: string;
    }

    export interface IHasMfaVerificationCode {
        mfaVerificationCode: string;
    }

    export interface IHasEmailAddress {
        emailAddress: string;
    }

    export interface IHasEmailVerificationCode {
        emailVerificationCode: string;
    }

    export interface IHasSecuredAccessCode {
        securedAccessCode: string;
    }

    export class SetupCode {
        public account: string;
        public manualEntryKey: string;
        public base64PngImage: string;

        public constructor(init?: Partial<SetupCode>) {
            (Object as any).assign(this, init);
        }
    }

    export interface IConfirmMfaPins {
        pin1: string;
        pin2: string;
    }

    export interface IHasCurrentPassword {
        currentPassword: string;
    }

    export interface IHasNewPassword {
        newPassword: string;
    }

    export class WebhookEvent {
        public eventName: string;
        public createdDateUtc: string;
        public data: Object;
        public origin: string;
        public id: string;

        public constructor(init?: Partial<WebhookEvent>) {
            (Object as any).assign(this, init);
        }
    }

    export class SubscriptionConfig {
        public url: string;
        public contentType: string;
        public secret: string;

        public constructor(init?: Partial<SubscriptionConfig>) {
            (Object as any).assign(this, init);
        }
    }

    export class WebhookSubscription implements IMongoEntity {
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

        public constructor(init?: Partial<WebhookSubscription>) {
            (Object as any).assign(this, init);
        }
    }

    export class SubscriptionRelayConfig {
        public subscriptionId: string;
        public config: SubscriptionConfig;

        public constructor(init?: Partial<SubscriptionRelayConfig>) {
            (Object as any).assign(this, init);
        }
    }

    export class WebhookDeliveryResult implements IMongoEntity {
        public attemptedDateUtc: string;
        public statusDescription: string;
        public statusCode: HttpStatusCode;
        public subscriptionId: string;
        public eventId: string;
        public ern: string;
        public id: string;
        public createdDate?: number;
        public modifiedDate?: number;

        public constructor(init?: Partial<WebhookDeliveryResult>) {
            (Object as any).assign(this, init);
        }
    }

    export interface IMongoEntity extends IHasERN, IDateTracking {
    }

    export interface IHasERN extends IIsERN {
        ern: string;
    }

    export interface IIsERN {
    }

    export interface IDateTracking extends IHasCreateDate, IHasModifiedDate {
    }

    export interface IHasCreateDate {
        createdDate?: number;
    }

    export interface IHasModifiedDate {
        modifiedDate?: number;
    }

    export interface IPlatformLayer {
        version: string;
    }

    export class PlatformResponse {
        public platform: PlatformSummary;
        public responseStatus: ResponseStatus;

        public constructor(init?: Partial<PlatformResponse>) {
            (Object as any).assign(this, init);
        }
    }

    export class MockErrorResponse {
        public responseStatus: ResponseStatus;

        public constructor(init?: Partial<MockErrorResponse>) {
            (Object as any).assign(this, init);
        }
    }

    export class UpTimeResponse {
        public startedAt: string;
        public currentTime: string;
        public duration: string;
        public timeSpan: string;
        public responseStatus: ResponseStatus;

        public constructor(init?: Partial<UpTimeResponse>) {
            (Object as any).assign(this, init);
        }
    }

    export class PingResponse {
        public response: string;
        public upTime: UpTimeResponse;
        public responseStatus: ResponseStatus;

        public constructor(init?: Partial<PingResponse>) {
            (Object as any).assign(this, init);
        }
    }

    // @DataContract
    export class AuthenticateResponse implements IHasSessionId, IHasBearerToken {
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

        public constructor(init?: Partial<AuthenticateResponse>) {
            (Object as any).assign(this, init);
        }
    }

    export class NormalizeUserRolesResponse {
        public responseStatus: ResponseStatus;
        public results: string[];

        public constructor(init?: Partial<NormalizeUserRolesResponse>) {
            (Object as any).assign(this, init);
        }
    }

    // @DataContract
    export class AssignRolesResponse {
        // @DataMember(Order=1)
        public allRoles: string[];

        // @DataMember(Order=2)
        public allPermissions: string[];

        // @DataMember(Order=3)
        public meta: { [index: string]: string; };

        // @DataMember(Order=4)
        public responseStatus: ResponseStatus;

        public constructor(init?: Partial<AssignRolesResponse>) {
            (Object as any).assign(this, init);
        }
    }

    // @DataContract
    export class UnAssignRolesResponse {
        // @DataMember(Order=1)
        public allRoles: string[];

        // @DataMember(Order=2)
        public allPermissions: string[];

        // @DataMember(Order=3)
        public meta: { [index: string]: string; };

        // @DataMember(Order=4)
        public responseStatus: ResponseStatus;

        public constructor(init?: Partial<UnAssignRolesResponse>) {
            (Object as any).assign(this, init);
        }
    }

    // @DataContract
    export class RegisterResponse {
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
        public responseStatus: ResponseStatus;

        // @DataMember(Order=8)
        public meta: { [index: string]: string; };

        public constructor(init?: Partial<RegisterResponse>) {
            (Object as any).assign(this, init);
        }
    }

    // @DataContract
    export class GetApiKeysResponse {
        // @DataMember(Order=1)
        public results: UserApiKey[];

        // @DataMember(Order=2)
        public meta: { [index: string]: string; };

        // @DataMember(Order=3)
        public responseStatus: ResponseStatus;

        public constructor(init?: Partial<GetApiKeysResponse>) {
            (Object as any).assign(this, init);
        }
    }

    // @DataContract
    export class RegenerateApiKeysResponse {
        // @DataMember(Order=1)
        public results: UserApiKey[];

        // @DataMember(Order=2)
        public meta: { [index: string]: string; };

        // @DataMember(Order=3)
        public responseStatus: ResponseStatus;

        public constructor(init?: Partial<RegenerateApiKeysResponse>) {
            (Object as any).assign(this, init);
        }
    }

    // @DataContract
    export class ConvertSessionToTokenResponse {
        // @DataMember(Order=1)
        public meta: { [index: string]: string; };

        // @DataMember(Order=2)
        public accessToken: string;

        // @DataMember(Order=3)
        public refreshToken: string;

        // @DataMember(Order=4)
        public responseStatus: ResponseStatus;

        public constructor(init?: Partial<ConvertSessionToTokenResponse>) {
            (Object as any).assign(this, init);
        }
    }

    // @DataContract
    export class GetAccessTokenResponse {
        // @DataMember(Order=1)
        public accessToken: string;

        // @DataMember(Order=2)
        public meta: { [index: string]: string; };

        // @DataMember(Order=3)
        public responseStatus: ResponseStatus;

        public constructor(init?: Partial<GetAccessTokenResponse>) {
            (Object as any).assign(this, init);
        }
    }

    export class MfaAuthenticateResponse {
        public responseStatus: ResponseStatus;
        public result: string;

        public constructor(init?: Partial<MfaAuthenticateResponse>) {
            (Object as any).assign(this, init);
        }
    }

    export class MfaPreEnrollResponse {
        public responseStatus: ResponseStatus;
        public result: boolean;

        public constructor(init?: Partial<MfaPreEnrollResponse>) {
            (Object as any).assign(this, init);
        }
    }

    export class MfaEnrollResponse {
        public responseStatus: ResponseStatus;
        public result: SetupCode;

        public constructor(init?: Partial<MfaEnrollResponse>) {
            (Object as any).assign(this, init);
        }
    }

    export class MfaConfirmResponse {
        public responseStatus: ResponseStatus;
        public result: boolean;

        public constructor(init?: Partial<MfaConfirmResponse>) {
            (Object as any).assign(this, init);
        }
    }

    export class ChangePasswordResponse {
        public responseStatus: ResponseStatus;
        public result: boolean;

        public constructor(init?: Partial<ChangePasswordResponse>) {
            (Object as any).assign(this, init);
        }
    }

    export class PasswordResetResponse {
        public mfa: boolean;
        public responseStatus: ResponseStatus;
        public result: boolean;

        public constructor(init?: Partial<PasswordResetResponse>) {
            (Object as any).assign(this, init);
        }
    }

    export class PasswordResetConfirmResponse {
        public responseStatus: ResponseStatus;
        public result: boolean;

        public constructor(init?: Partial<PasswordResetConfirmResponse>) {
            (Object as any).assign(this, init);
        }
    }

    export class WebhookEventSinkRelayResponse {
        public responseStatus: ResponseStatus;
        public result: boolean;

        public constructor(init?: Partial<WebhookEventSinkRelayResponse>) {
            (Object as any).assign(this, init);
        }
    }

    export class CreateSubscriptionResponse {
        public responseStatus: ResponseStatus;
        public subscriptions: WebhookSubscription[];

        public constructor(init?: Partial<CreateSubscriptionResponse>) {
            (Object as any).assign(this, init);
        }
    }

    export class SearchSubscriptionsResponse {
        public responseStatus: ResponseStatus;
        public subscribers: SubscriptionRelayConfig[];

        public constructor(init?: Partial<SearchSubscriptionsResponse>) {
            (Object as any).assign(this, init);
        }
    }

    export class GetSubscriptionResponse {
        public responseStatus: ResponseStatus;
        public subscription: WebhookSubscription;
        public history: WebhookDeliveryResult[];

        public constructor(init?: Partial<GetSubscriptionResponse>) {
            (Object as any).assign(this, init);
        }
    }

    export class ListSubscriptionsResponse {
        public responseStatus: ResponseStatus;
        public subscriptions: WebhookSubscription[];

        public constructor(init?: Partial<ListSubscriptionsResponse>) {
            (Object as any).assign(this, init);
        }
    }

    export class UpdateSubscriptionResponse {
        public responseStatus: ResponseStatus;
        public subscription: WebhookSubscription;

        public constructor(init?: Partial<UpdateSubscriptionResponse>) {
            (Object as any).assign(this, init);
        }
    }

    export class DeleteSubscriptionResponse {
        public responseStatus: ResponseStatus;

        public constructor(init?: Partial<DeleteSubscriptionResponse>) {
            (Object as any).assign(this, init);
        }
    }

    export class UpdateSubscriptionHistoryResponse {
        public responseStatus: ResponseStatus;

        public constructor(init?: Partial<UpdateSubscriptionHistoryResponse>) {
            (Object as any).assign(this, init);
        }
    }

    // @Route("/platform")
    export class Platform implements IReturn<PlatformResponse> {

        public constructor(init?: Partial<Platform>) {
            (Object as any).assign(this, init);
        }

        public createResponse() {
            return new PlatformResponse();
        }

        public getTypeName() {
            return 'Platform';
        }
    }

    // @Route("/system/exception/", "GET")
    // @Route("/system/exception/{Type}", "GET")
    export class MockErrorRequest implements IReturn<MockErrorResponse> {
        public type: string;

        public constructor(init?: Partial<MockErrorRequest>) {
            (Object as any).assign(this, init);
        }

        public createResponse() {
            return new MockErrorResponse();
        }

        public getTypeName() {
            return 'MockErrorRequest';
        }
    }

    // @Route("/system/uptime", "GET")
    export class UpTimeRequest implements IReturn<UpTimeResponse> {

        public constructor(init?: Partial<UpTimeRequest>) {
            (Object as any).assign(this, init);
        }

        public createResponse() {
            return new UpTimeResponse();
        }

        public getTypeName() {
            return 'UpTimeRequest';
        }
    }

    // @Route("/system/ping", "GET")
    export class PingRequest implements IReturn<PingResponse> {

        public constructor(init?: Partial<PingRequest>) {
            (Object as any).assign(this, init);
        }

        public createResponse() {
            return new PingResponse();
        }

        public getTypeName() {
            return 'PingRequest';
        }
    }

    // @Route("/system/debug")
    export class DebugRequest implements IReturn<Object> {

        public constructor(init?: Partial<DebugRequest>) {
            (Object as any).assign(this, init);
        }

        public createResponse() {
            return new Object();
        }

        public getTypeName() {
            return 'DebugRequest';
        }
    }

    // @Route("/impersonate", "POST")
    // @Route("/impersonate/{UserName}", "POST")
    export class ImpersonateUser implements IReturn<AuthenticateResponse> {
        public userName: string;

        public constructor(init?: Partial<ImpersonateUser>) {
            (Object as any).assign(this, init);
        }

        public createResponse() {
            return new AuthenticateResponse();
        }

        public getTypeName() {
            return 'ImpersonateUser';
        }
    }

    // @Route("/auth/{UserAuthId}/roles", "GET")
    export class NormalizeUserRolesRequest implements IReturn<NormalizeUserRolesResponse>, IHasUserAuthId {
        public key: string;
        public userAuthId: string;

        public constructor(init?: Partial<NormalizeUserRolesRequest>) {
            (Object as any).assign(this, init);
        }

        public createResponse() {
            return new NormalizeUserRolesResponse();
        }

        public getTypeName() {
            return 'NormalizeUserRolesRequest';
        }
    }

    // @Route("/auth")
    // @Route("/auth/{provider}")
    // @DataContract
    export class Authenticate implements IReturn<AuthenticateResponse>, IPost {
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

        // @DataMember(Order=16)
        public useTokenCookie?: boolean;

        // @DataMember(Order=17)
        public accessToken: string;

        // @DataMember(Order=18)
        public accessTokenSecret: string;

        // @DataMember(Order=19)
        public scope: string;

        // @DataMember(Order=20)
        public meta: { [index: string]: string; };

        public constructor(init?: Partial<Authenticate>) {
            (Object as any).assign(this, init);
        }

        public createResponse() {
            return new AuthenticateResponse();
        }

        public getTypeName() {
            return 'Authenticate';
        }
    }

    // @Route("/assignroles")
    // @DataContract
    export class AssignRoles implements IReturn<AssignRolesResponse>, IPost {
        // @DataMember(Order=1)
        public userName: string;

        // @DataMember(Order=2)
        public permissions: string[];

        // @DataMember(Order=3)
        public roles: string[];

        // @DataMember(Order=4)
        public meta: { [index: string]: string; };

        public constructor(init?: Partial<AssignRoles>) {
            (Object as any).assign(this, init);
        }

        public createResponse() {
            return new AssignRolesResponse();
        }

        public getTypeName() {
            return 'AssignRoles';
        }
    }

    // @Route("/unassignroles")
    // @DataContract
    export class UnAssignRoles implements IReturn<UnAssignRolesResponse>, IPost {
        // @DataMember(Order=1)
        public userName: string;

        // @DataMember(Order=2)
        public permissions: string[];

        // @DataMember(Order=3)
        public roles: string[];

        // @DataMember(Order=4)
        public meta: { [index: string]: string; };

        public constructor(init?: Partial<UnAssignRoles>) {
            (Object as any).assign(this, init);
        }

        public createResponse() {
            return new UnAssignRolesResponse();
        }

        public getTypeName() {
            return 'UnAssignRoles';
        }
    }

    // @Route("/register")
    // @DataContract
    export class Register implements IReturn<RegisterResponse>, IPost {
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

        public constructor(init?: Partial<Register>) {
            (Object as any).assign(this, init);
        }

        public createResponse() {
            return new RegisterResponse();
        }

        public getTypeName() {
            return 'Register';
        }
    }

    // @Route("/apikeys")
    // @Route("/apikeys/{Environment}")
    // @DataContract
    export class GetApiKeys implements IReturn<GetApiKeysResponse>, IGet {
        // @DataMember(Order=1)
        public environment: string;

        // @DataMember(Order=2)
        public meta: { [index: string]: string; };

        public constructor(init?: Partial<GetApiKeys>) {
            (Object as any).assign(this, init);
        }

        public createResponse() {
            return new GetApiKeysResponse();
        }

        public getTypeName() {
            return 'GetApiKeys';
        }
    }

    // @Route("/apikeys/regenerate")
    // @Route("/apikeys/regenerate/{Environment}")
    // @DataContract
    export class RegenerateApiKeys implements IReturn<RegenerateApiKeysResponse>, IPost {
        // @DataMember(Order=1)
        public environment: string;

        // @DataMember(Order=2)
        public meta: { [index: string]: string; };

        public constructor(init?: Partial<RegenerateApiKeys>) {
            (Object as any).assign(this, init);
        }

        public createResponse() {
            return new RegenerateApiKeysResponse();
        }

        public getTypeName() {
            return 'RegenerateApiKeys';
        }
    }

    // @Route("/session-to-token")
    // @DataContract
    export class ConvertSessionToToken implements IReturn<ConvertSessionToTokenResponse>, IPost {
        // @DataMember(Order=1)
        public preserveSession: boolean;

        // @DataMember(Order=2)
        public meta: { [index: string]: string; };

        public constructor(init?: Partial<ConvertSessionToToken>) {
            (Object as any).assign(this, init);
        }

        public createResponse() {
            return new ConvertSessionToTokenResponse();
        }

        public getTypeName() {
            return 'ConvertSessionToToken';
        }
    }

    // @Route("/access-token")
    // @DataContract
    export class GetAccessToken implements IReturn<GetAccessTokenResponse>, IPost {
        // @DataMember(Order=1)
        public refreshToken: string;

        // @DataMember(Order=2)
        public useTokenCookie?: boolean;

        // @DataMember(Order=3)
        public meta: { [index: string]: string; };

        public constructor(init?: Partial<GetAccessToken>) {
            (Object as any).assign(this, init);
        }

        public createResponse() {
            return new GetAccessTokenResponse();
        }

        public getTypeName() {
            return 'GetAccessToken';
        }
    }

    // @Route("/auth/mfa", "POST")
    export class AuthenticateMfa implements IReturn<AuthenticateResponse>, IHasUserName, IHasPassword, IHasMfaVerificationCode {
        public mfaVerificationCode: string;
        public password: string;
        public userName: string;

        public constructor(init?: Partial<AuthenticateMfa>) {
            (Object as any).assign(this, init);
        }

        public createResponse() {
            return new AuthenticateResponse();
        }

        public getTypeName() {
            return 'AuthenticateMfa';
        }
    }

    // @Route("/auth/mfa/authenticate", "POST")
    export class MfaAuthenticate implements IReturn<MfaAuthenticateResponse>, IHasUserName, IHasPassword {
        public password: string;
        public userName: string;

        public constructor(init?: Partial<MfaAuthenticate>) {
            (Object as any).assign(this, init);
        }

        public createResponse() {
            return new MfaAuthenticateResponse();
        }

        public getTypeName() {
            return 'MfaAuthenticate';
        }
    }

    // @Route("/auth/mfa/pre-enroll", "POST")
    export class MfaPreEnroll implements IReturn<MfaPreEnrollResponse>, IHasEmailAddress {
        public emailAddress: string;

        public constructor(init?: Partial<MfaPreEnroll>) {
            (Object as any).assign(this, init);
        }

        public createResponse() {
            return new MfaPreEnrollResponse();
        }

        public getTypeName() {
            return 'MfaPreEnroll';
        }
    }

    // @Route("/auth/mfa/enroll", "POST")
    export class MfaEnroll implements IReturn<MfaEnrollResponse>, IHasEmailAddress, IHasEmailVerificationCode, IHasSecuredAccessCode {
        public emailAddress: string;
        public emailVerificationCode: string;
        public securedAccessCode: string;

        public constructor(init?: Partial<MfaEnroll>) {
            (Object as any).assign(this, init);
        }

        public createResponse() {
            return new MfaEnrollResponse();
        }

        public getTypeName() {
            return 'MfaEnroll';
        }
    }

    // @Route("/auth/mfa/confirm", "POST")
    export class MfaConfirm implements IReturn<MfaConfirmResponse>, IHasEmailAddress, IConfirmMfaPins {
        public pin1: string;
        public pin2: string;
        public emailAddress: string;

        public constructor(init?: Partial<MfaConfirm>) {
            (Object as any).assign(this, init);
        }

        public createResponse() {
            return new MfaConfirmResponse();
        }

        public getTypeName() {
            return 'MfaConfirm';
        }
    }

    // @Route("/auth/mfa/logout", "POST")
    export class MfaLogout implements IReturnVoid {

        public constructor(init?: Partial<MfaLogout>) {
            (Object as any).assign(this, init);
        }

        public createResponse() {
        }

        public getTypeName() {
            return 'MfaLogout';
        }
    }

    // @Route("/auth/change/password", "POST")
    export class ChangePasswordRequest implements IReturn<ChangePasswordResponse>, IHasCurrentPassword, IHasNewPassword, IHasMfaVerificationCode {
        public currentPassword: string;
        public mfaVerificationCode: string;
        public newPassword: string;

        public constructor(init?: Partial<ChangePasswordRequest>) {
            (Object as any).assign(this, init);
        }

        public createResponse() {
            return new ChangePasswordResponse();
        }

        public getTypeName() {
            return 'ChangePasswordRequest';
        }
    }

    // @Route("/auth/password/reset", "POST")
    export class PasswordReset implements IReturn<PasswordResetResponse>, IHasEmailAddress {
        public emailAddress: string;

        public constructor(init?: Partial<PasswordReset>) {
            (Object as any).assign(this, init);
        }

        public createResponse() {
            return new PasswordResetResponse();
        }

        public getTypeName() {
            return 'PasswordReset';
        }
    }

    // @Route("/auth/password/reset/confirm", "POST")
    export class PasswordResetConfirm implements IReturn<PasswordResetConfirmResponse>, IHasEmailAddress, IHasNewPassword, IHasEmailVerificationCode, IHasMfaVerificationCode {
        public emailAddress: string;
        public emailVerificationCode: string;
        public mfaVerificationCode: string;
        public newPassword: string;

        public constructor(init?: Partial<PasswordResetConfirm>) {
            (Object as any).assign(this, init);
        }

        public createResponse() {
            return new PasswordResetConfirmResponse();
        }

        public getTypeName() {
            return 'PasswordResetConfirm';
        }
    }

    // @Route("/impersonate", "POST")
    // @Route("/impersonate/{UserName}", "POST")
    export class GetImpersonationCredentialsRequest implements IReturn<AuthenticateResponse> {
        public userName: string;

        public constructor(init?: Partial<GetImpersonationCredentialsRequest>) {
            (Object as any).assign(this, init);
        }

        public createResponse() {
            return new AuthenticateResponse();
        }

        public getTypeName() {
            return 'GetImpersonationCredentialsRequest';
        }
    }

    // @Route("/webhook/event/sink/relay", "POST")
    export class WebhookEventSinkRelayRequest extends WebhookEvent implements IReturn<WebhookEventSinkRelayResponse> {

        public constructor(init?: Partial<WebhookEventSinkRelayRequest>) {
            super(init);
            (Object as any).assign(this, init);
        }

        public createResponse() {
            return new WebhookEventSinkRelayResponse();
        }

        public getTypeName() {
            return 'WebhookEventSinkRelayRequest';
        }
    }

    export class EmitWebhook extends WebhookEvent implements IReturnVoid {

        public constructor(init?: Partial<EmitWebhook>) {
            super(init);
            (Object as any).assign(this, init);
        }

        public createResponse() {
        }

        public getTypeName() {
            return 'EmitWebhook';
        }
    }

    // @Route("/webhooks/subscriptions", "POST")
    export class CreateSubscription implements IReturn<CreateSubscriptionResponse>, IPost {
        public name: string;
        public events: string[];
        public config: SubscriptionConfig;

        public constructor(init?: Partial<CreateSubscription>) {
            (Object as any).assign(this, init);
        }

        public createResponse() {
            return new CreateSubscriptionResponse();
        }

        public getTypeName() {
            return 'CreateSubscription';
        }
    }

    // @Route("/webhooks/subscriptions/search", "GET")
    export class SearchSubscriptions implements IReturn<SearchSubscriptionsResponse>, IGet {
        public eventName: string;

        public constructor(init?: Partial<SearchSubscriptions>) {
            (Object as any).assign(this, init);
        }

        public createResponse() {
            return new SearchSubscriptionsResponse();
        }

        public getTypeName() {
            return 'SearchSubscriptions';
        }
    }

    // @Route("/webhooks/subscriptions/{Id}", "GET")
    export class GetSubscription implements IReturn<GetSubscriptionResponse>, IGet {
        public id: string;

        public constructor(init?: Partial<GetSubscription>) {
            (Object as any).assign(this, init);
        }

        public createResponse() {
            return new GetSubscriptionResponse();
        }

        public getTypeName() {
            return 'GetSubscription';
        }
    }

    // @Route("/webhooks/subscriptions", "GET")
    export class ListSubscriptions implements IReturn<ListSubscriptionsResponse>, IGet {

        public constructor(init?: Partial<ListSubscriptions>) {
            (Object as any).assign(this, init);
        }

        public createResponse() {
            return new ListSubscriptionsResponse();
        }

        public getTypeName() {
            return 'ListSubscriptions';
        }
    }

    // @Route("/webhooks/subscriptions/{Id}", "PUT")
    export class UpdateSubscription implements IReturn<UpdateSubscriptionResponse>, IPut {
        public url: string;
        public secret: string;
        public contentType: string;
        public isActive?: boolean;
        public id: string;

        public constructor(init?: Partial<UpdateSubscription>) {
            (Object as any).assign(this, init);
        }

        public createResponse() {
            return new UpdateSubscriptionResponse();
        }

        public getTypeName() {
            return 'UpdateSubscription';
        }
    }

    // @Route("/webhooks/subscriptions/{Id}", "DELETE")
    export class DeleteSubscription implements IReturn<DeleteSubscriptionResponse>, IDelete {
        public id: string;

        public constructor(init?: Partial<DeleteSubscription>) {
            (Object as any).assign(this, init);
        }

        public createResponse() {
            return new DeleteSubscriptionResponse();
        }

        public getTypeName() {
            return 'DeleteSubscription';
        }
    }

    // @Route("/webhooks/subscriptions/history", "PUT")
    export class UpdateSubscriptionHistory implements IReturn<UpdateSubscriptionHistoryResponse>, IPut {
        public results: WebhookDeliveryResult[];

        public constructor(init?: Partial<UpdateSubscriptionHistory>) {
            (Object as any).assign(this, init);
        }

        public createResponse() {
            return new UpdateSubscriptionHistoryResponse();
        }

        public getTypeName() {
            return 'UpdateSubscriptionHistory';
        }
    }

}

