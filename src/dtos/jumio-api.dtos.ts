/* Options:
Date: 2019-07-14 00:51:37
Version: 5.50
Tip: To override a DTO option, remove "//" prefix before updating
BaseUrl: https://api.local.enumis.co.uk:5000/vendors-jumio-api

GlobalNamespace: JumioApi
AddServiceStackTypes: True
AddResponseStatus: True
//AddImplicitVersion: 
AddDescriptionAsComments: True
//IncludeTypes: 
//ExcludeTypes: 
DefaultImports: SortedDictionary from "./sorted-dictionary", ObservableCollection from "./observable-collection",HttpStatusCode from "./http-status-codes",WebhookEvents from "./webhook-events",IList from "./i-list",IEnumerable from "./i-enumerable"
*/

import IEnumerable from "./i-enumerable";
import IList from "./i-list";

export module JumioApi {

  export interface IReturn<T> {
    createResponse(): T;
  }

  export interface IReturnVoid {
    createResponse(): void;
  }

  export enum Classifier {
    UNDEFINED = 'UNDEFINED',
    Front = 'front',
    Face = 'face',
    Back = 'back',
  }

  export enum Maskhint {
    UNDEFINED = 'UNDEFINED',
    Masked = 'masked',
    Unmasked = 'unmasked',
  }

  // @DataContract
  export class ResponseError {
    // @DataMember(Order=1, EmitDefaultValue=false)
    public errorCode: string;
    // @DataMember(Order=2, EmitDefaultValue=false)
    public fieldName: string;
    // @DataMember(Order=3, EmitDefaultValue=false)
    public message: string;
    // @DataMember(Order=4, EmitDefaultValue=false)
    public meta: { [index: string]: string; };

    public constructor(init?: Partial<ResponseError>) {
      (<any>Object).assign(this, init);
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
      (<any>Object).assign(this, init);
    }
  }

  export class FileResponse {
    public statusCode: number;
    public headers: { [index: string]: IEnumerable<string>; };
    public isPartial: boolean;

    public constructor(init?: Partial<FileResponse>) {
      (<any>Object).assign(this, init);
    }
  }

  export class CommonDocumentModel {
    public timestamp: string;
    public scanReference: string;

    public constructor(init?: Partial<CommonDocumentModel>) {
      (<any>Object).assign(this, init);
    }
  }

  export enum DocumentStatusStatus {
    UNDEFINED = 'UNDEFINED',
    DONE = 'DONE',
    FAILED = 'FAILED',
  }

  export class DocumentStatus extends CommonDocumentModel {
    public status: DocumentStatusStatus;

    public constructor(init?: Partial<DocumentStatus>) {
      super(init);
      (<any>Object).assign(this, init);
    }
  }

  export enum DocDocumentDataOnlyStatus {
    UNDEFINED = 'UNDEFINED',
    UPLOADED = 'UPLOADED',
    EXTRACTED = 'EXTRACTED',
    DISCARDED = 'DISCARDED',
  }

  export enum DocDocumentDataOnlyType {
    UNDEFINED = 'UNDEFINED',
    CC = 'CC',
    BS = 'BS',
    IC = 'IC',
    UB = 'UB',
    CAAP = 'CAAP',
    CRC = 'CRC',
    CCS = 'CCS',
    LAG = 'LAG',
    LOAP = 'LOAP',
    MOAP = 'MOAP',
    TR = 'TR',
    VT = 'VT',
    VC = 'VC',
    STUC = 'STUC',
    HCC = 'HCC',
    CB = 'CB',
    SENC = 'SENC',
    MEDC = 'MEDC',
    BC = 'BC',
    WWCC = 'WWCC',
    SS = 'SS',
    TAC = 'TAC',
    SEL = 'SEL',
    PB = 'PB',
    USSS = 'USSS',
    SSC = 'SSC',
    CUSTOM = 'CUSTOM',
  }

  export class ExtractedData {
    public signatureAvailable: string;
    public ssn: string;
    public firstName: string;
    public lastName: string;
    public swiftCode: string;

    public constructor(init?: Partial<ExtractedData>) {
      (<any>Object).assign(this, init);
    }
  }

  export class DocDocumentDataOnly {
    public status: DocDocumentDataOnlyStatus;
    public type: DocDocumentDataOnlyType;
    public country: string;
    public originalDocument: string;
    public customDocumentCode: string;
    public extractedData: ExtractedData;

    public constructor(init?: Partial<DocDocumentDataOnly>) {
      (<any>Object).assign(this, init);
    }
  }

  export enum DocTransactionDataOnlyStatus {
    UNDEFINED = 'UNDEFINED',
    DONE = 'DONE',
    FAILED = 'FAILED',
  }

  export enum DocTransactionDataOnlySource {
    UNDEFINED = 'UNDEFINED',
    DOC_API = 'DOC_API',
    DOC_UPLOAD = 'DOC_UPLOAD',
  }

  export class DocTransactionDataOnly {
    public status: DocTransactionDataOnlyStatus;
    public source: DocTransactionDataOnlySource;
    public customerId: string;
    public merchantScanReference: string;
    public merchantReportingCriteria: string;

    public constructor(init?: Partial<DocTransactionDataOnly>) {
      (<any>Object).assign(this, init);
    }
  }

  export class DocumentDetails extends CommonDocumentModel {
    public document: DocDocumentDataOnly;
    public transaction: DocTransactionDataOnly;

    public constructor(init?: Partial<DocumentDetails>) {
      super(init);
      (<any>Object).assign(this, init);
    }
  }

  export class DocDocumentData extends CommonDocumentModel {
    public status: DocDocumentDataOnlyStatus;
    public type: DocDocumentDataOnlyType;
    public country: string;
    public originalDocument: string;
    public customDocumentCode: string;
    public extractedData: ExtractedData;

    public constructor(init?: Partial<DocDocumentData>) {
      super(init);
      (<any>Object).assign(this, init);
    }
  }

  export class DocTransactionData extends CommonDocumentModel {
    public status: DocTransactionDataOnlyStatus;
    public source: DocTransactionDataOnlySource;
    public customerId: string;
    public merchantScanReference: string;
    public merchantReportingCriteria: string;

    public constructor(init?: Partial<DocTransactionData>) {
      super(init);
      (<any>Object).assign(this, init);
    }
  }

  export enum ScanDocumentDataOnlyStatus {
    UNDEFINED = 'UNDEFINED',
    APPROVED_VERIFIED = 'APPROVED_VERIFIED',
    DENIED_FRAUD = 'DENIED_FRAUD',
    DENIED_UNSUPPORTED_ID_TYPE = 'DENIED_UNSUPPORTED_ID_TYPE',
    DENIED_UNSUPPORTED_ID_COUNTRY = 'DENIED_UNSUPPORTED_ID_COUNTRY',
    ERROR_NOT_READABLE_ID = 'ERROR_NOT_READABLE_ID',
    NO_ID_UPLOADED = 'NO_ID_UPLOADED',
  }

  export enum ScanDocumentDataOnlyType {
    UNDEFINED = 'UNDEFINED',
    PASSPORT = 'PASSPORT',
    DRIVING_LICENSE = 'DRIVING_LICENSE',
    ID_CARD = 'ID_CARD',
    VISA = 'VISA',
    UNSUPPORTED = 'UNSUPPORTED',
  }

  export enum ScanDocumentDataOnlyIdSubtype {
    UNDEFINED = 'UNDEFINED',
    NATIONAL_ID = 'NATIONAL_ID',
    CONSULAR_ID = 'CONSULAR_ID',
    ELECTORAL_ID = 'ELECTORAL_ID',
    RESIDENT_PERMIT_ID = 'RESIDENT_PERMIT_ID',
    TAX_ID = 'TAX_ID',
    STUDENT_ID = 'STUDENT_ID',
    PASSPORT_CARD_ID = 'PASSPORT_CARD_ID',
    MILITARY_ID = 'MILITARY_ID',
    PUBLIC_SAFETY_ID = 'PUBLIC_SAFETY_ID',
    OTHER_ID = 'OTHER_ID',
    VISA = 'VISA',
    UNKNOWN = 'UNKNOWN',
  }

  export class ScanDocumentDataOnly {
    public status: ScanDocumentDataOnlyStatus;
    public type: ScanDocumentDataOnlyType;
    public idSubtype: ScanDocumentDataOnlyIdSubtype;
    public issuingCountry: string;
    public firstName: string;
    public lastName: string;
    public dob: string;
    public expiry: string;
    public issuingDate: string;
    public number: string;
    public usState: string;
    public personalNumber: string;
    public optionalData1: string;
    public optionalData2: string;
    public address: string;
    public issuingAuthority: string;
    public issuingPlace: string;

    public constructor(init?: Partial<ScanDocumentDataOnly>) {
      (<any>Object).assign(this, init);
    }
  }

  export enum ScanTransactionDataOnlyStatus {
    UNDEFINED = 'UNDEFINED',
    PENDING = 'PENDING',
    DONE = 'DONE',
    FAILED = 'FAILED',
  }

  export class ScanTransactionDataOnly {
    public status: ScanTransactionDataOnlyStatus;
    public source: string;
    public date: string;
    public clientIp: string;
    public customerId: string;
    public merchantScanReference: string;
    public merchantReportingCriteria: string;

    public constructor(init?: Partial<ScanTransactionDataOnly>) {
      (<any>Object).assign(this, init);
    }
  }

  export class RejectReasonDetails {
    public detailsCode: string;
    public detailsDescription: string;

    public constructor(init?: Partial<RejectReasonDetails>) {
      (<any>Object).assign(this, init);
    }
  }

  export class RejectReason {
    public rejectReasonCode: string;
    public rejectReasonDescription: string;
    public rejectReasonDetails: RejectReasonDetails;

    public constructor(init?: Partial<RejectReason>) {
      (<any>Object).assign(this, init);
    }
  }

  export enum IdentifyVerificationSimilarity {
    UNDEFINED = 'UNDEFINED',
    MATCH = 'MATCH',
    NO_MATCH = 'NO_MATCH',
    NOT_POSSIBLE = 'NOT_POSSIBLE',
  }

  export enum IdentifyVerificationValidity {
    UNDEFINED = 'UNDEFINED',
    TRUE = 'TRUE',
    FALSE = 'FALSE',
  }

  export enum IdentifyVerificationReason {
    UNDEFINED = 'UNDEFINED',
    SELFIE_CROPPED_FROM_ID = 'SELFIE_CROPPED_FROM_ID',
    ENTIRE_ID_USED_AS_SELFIE = 'ENTIRE_ID_USED_AS_SELFIE',
    MULTIPLE_PEOPLE = 'MULTIPLE_PEOPLE',
    SELFIE_IS_SCREEN_PAPER_VIDEO = 'SELFIE_IS_SCREEN_PAPER_VIDEO',
    SELFIE_MANIPULATED = 'SELFIE_MANIPULATED',
    AGE_DIFFERENCE_TOO_BIG = 'AGE_DIFFERENCE_TOO_BIG',
    NO_FACE_PRESENT = 'NO_FACE_PRESENT',
    FACE_NOT_FULLY_VISIBLE = 'FACE_NOT_FULLY_VISIBLE',
    BAD_QUALITY = 'BAD_QUALITY',
    BLACK_AND_WHITE = 'BLACK_AND_WHITE',
  }

  export enum IdentifyVerificationHandwrittenNoteMatches {
    UNDEFINED = 'UNDEFINED',
    TRUE = 'TRUE',
    FALSE = 'FALSE',
  }

  export class IdentifyVerification {
    public similarity: IdentifyVerificationSimilarity;
    public validity: IdentifyVerificationValidity;
    public reason: IdentifyVerificationReason;
    public handwrittenNoteMatches: IdentifyVerificationHandwrittenNoteMatches;

    public constructor(init?: Partial<IdentifyVerification>) {
      (<any>Object).assign(this, init);
    }
  }

  export class ScanVerificationDataOnly {
    public mrzCheck: string;
    public rejectReason: RejectReason;
    public identityVerification: IdentifyVerification;

    public constructor(init?: Partial<ScanVerificationDataOnly>) {
      (<any>Object).assign(this, init);
    }
  }

  export class ScanDetails extends CommonDocumentModel {
    public document: ScanDocumentDataOnly;
    public transaction: ScanTransactionDataOnly;
    public verification: ScanVerificationDataOnly;

    public constructor(init?: Partial<ScanDetails>) {
      super(init);
      (<any>Object).assign(this, init);
    }
  }

  export class ScanDocumentData extends CommonDocumentModel {
    public status: ScanDocumentDataOnlyStatus;
    public type: ScanDocumentDataOnlyType;
    public idSubtype: ScanDocumentDataOnlyIdSubtype;
    public issuingCountry: string;
    public firstName: string;
    public lastName: string;
    public dob: string;
    public expiry: string;
    public issuingDate: string;
    public number: string;
    public usState: string;
    public personalNumber: string;
    public optionalData1: string;
    public optionalData2: string;
    public address: string;
    public issuingAuthority: string;
    public issuingPlace: string;

    public constructor(init?: Partial<ScanDocumentData>) {
      super(init);
      (<any>Object).assign(this, init);
    }
  }

  export enum ImageClassifier {
    UNDEFINED = 'UNDEFINED',
    Front = 'front',
    Face = 'face',
    Back = 'back',
  }

  export class Image {
    public classifier: ImageClassifier;
    public href: string;
    public maskhint: string;

    public constructor(init?: Partial<Image>) {
      (<any>Object).assign(this, init);
    }
  }

  export class Images extends CommonDocumentModel {
    public images1: IList<Image>;

    public constructor(init?: Partial<Images>) {
      super(init);
      (<any>Object).assign(this, init);
    }
  }

  export enum ScanStatusStatus {
    UNDEFINED = 'UNDEFINED',
    PENDING = 'PENDING',
    DONE = 'DONE',
    FAILED = 'FAILED',
  }

  export class ScanStatus extends CommonDocumentModel {
    public status: ScanStatusStatus;

    public constructor(init?: Partial<ScanStatus>) {
      super(init);
      (<any>Object).assign(this, init);
    }
  }

  export enum UserSettingsWorkflowId {
    _0 = '0',
    _100 = '100',
    _101 = '101',
    _102 = '102',
    _200 = '200',
    _201 = '201',
    _202 = '202',
  }

  export enum PresetType {
    UNDEFINED = 'UNDEFINED',
    PASSPORT = 'PASSPORT',
    DRIVING_LICENSE = 'DRIVING_LICENSE',
    ID_CARD = 'ID_CARD',
  }

  export class Preset {
    public index: number;
    public country: string;
    public type: PresetType;
    public phrase: string;

    public constructor(init?: Partial<Preset>) {
      (<any>Object).assign(this, init);
    }
  }

  export enum UserSettingsLocale {
    UNDEFINED = 'UNDEFINED',
    Bg = 'bg',
    Cs = 'cs',
    Da = 'da',
    De = 'de',
    El = 'el',
    En = 'en',
    EnGB = 'en-GB',
    Es = 'es',
    EsMX = 'es-MX',
    Et = 'et',
    Fi = 'fi',
    Fr = 'fr',
    Hu = 'hu',
    It = 'it',
    Ja = 'ja',
    Ko = 'ko',
    Lt = 'lt',
    Nl = 'nl',
    No = 'no',
    Pl = 'pl',
    Pt = 'pt',
    PtBR = 'pt-BR',
    Ro = 'ro',
    Ru = 'ru',
    Sk = 'sk',
    Sv = 'sv',
    Tr = 'tr',
    Vl = 'vl',
    ZhCN = 'zh-CN',
    ZhHK = 'zh-HK',
  }

  export class UserSettings {
    public customerInternalReference: string;
    public userReference: string;
    public reportingCriteria: string;
    public successUrl: string;
    public errorUrl: string;
    public callbackUrl: string;
    public workflowId: UserSettingsWorkflowId;
    public presets: IList<Preset>;
    public locale: UserSettingsLocale;
    public tokenLifetimeInMinutes: number;

    public constructor(init?: Partial<UserSettings>) {
      (<any>Object).assign(this, init);
    }
  }

  export class ConnectionSettings {
    public timestamp: string;
    public redirectUrl: string;
    public transactionReference: string;

    public constructor(init?: Partial<ConnectionSettings>) {
      (<any>Object).assign(this, init);
    }
  }

  export class GetDocumentImageResponse {
    public responseStatus: ResponseStatus;
    public result: FileResponse;

    public constructor(init?: Partial<GetDocumentImageResponse>) {
      (<any>Object).assign(this, init);
    }
  }

  export class GetDocumentStatusResponse {
    public responseStatus: ResponseStatus;
    public result: DocumentStatus;

    public constructor(init?: Partial<GetDocumentStatusResponse>) {
      (<any>Object).assign(this, init);
    }
  }

  export class GetDocumentDataResponse {
    public responseStatus: ResponseStatus;
    public result: DocumentDetails;

    public constructor(init?: Partial<GetDocumentDataResponse>) {
      (<any>Object).assign(this, init);
    }
  }

  export class GetDocumentsDocumentDataResponse {
    public responseStatus: ResponseStatus;
    public result: DocDocumentData;

    public constructor(init?: Partial<GetDocumentsDocumentDataResponse>) {
      (<any>Object).assign(this, init);
    }
  }

  export class GetDocumentsTransactionDataResponse {
    public result: DocTransactionData;
    public responseStatus: ResponseStatus;

    public constructor(init?: Partial<GetDocumentsTransactionDataResponse>) {
      (<any>Object).assign(this, init);
    }
  }

  export class MergeDocumentResponse {
    public responseStatus: ResponseStatus;

    public constructor(init?: Partial<MergeDocumentResponse>) {
      (<any>Object).assign(this, init);
    }
  }

  export class GetScanDataResponse {
    public responseStatus: ResponseStatus;
    public result: ScanDetails;

    public constructor(init?: Partial<GetScanDataResponse>) {
      (<any>Object).assign(this, init);
    }
  }

  export class GetScanDocumentDataResponse {
    public responseStatus: ResponseStatus;
    public result: ScanDocumentData;

    public constructor(init?: Partial<GetScanDocumentDataResponse>) {
      (<any>Object).assign(this, init);
    }
  }

  export class GetScanImagesResponse {
    public responseStatus: ResponseStatus;
    public result: Images;

    public constructor(init?: Partial<GetScanImagesResponse>) {
      (<any>Object).assign(this, init);
    }
  }

  export class GetScanImageResponse {
    public responseStatus: ResponseStatus;
    public result: FileResponse;

    public constructor(init?: Partial<GetScanImageResponse>) {
      (<any>Object).assign(this, init);
    }
  }

  export class GetScanStatusResponse {
    public responseStatus: ResponseStatus;
    public result: ScanStatus;

    public constructor(init?: Partial<GetScanStatusResponse>) {
      (<any>Object).assign(this, init);
    }
  }

  export class UploadCallbackResponse {
    public responseStatus: ResponseStatus;

    public constructor(init?: Partial<UploadCallbackResponse>) {
      (<any>Object).assign(this, init);
    }
  }

  export class InitiateResponse {
    public responseStatus: ResponseStatus;
    public result: ConnectionSettings;

    public constructor(init?: Partial<InitiateResponse>) {
      (<any>Object).assign(this, init);
    }
  }

  export class UpTimeResponse {
    public startedAt: string;
    public currentTime: string;
    public duration: string;
    public timeSpan: string;
    public responseStatus: ResponseStatus;

    public constructor(init?: Partial<UpTimeResponse>) {
      (<any>Object).assign(this, init);
    }
  }

  export class PingResponse {
    public response: string;
    public upTime: UpTimeResponse;
    public responseStatus: ResponseStatus;

    public constructor(init?: Partial<PingResponse>) {
      (<any>Object).assign(this, init);
    }
  }

  // @Route("/doc/{ScanReference}/image/{Classifier}", "GET")
  export class GetDocumentImageRequest implements IReturn<GetDocumentImageResponse> {
    public scanReference: string;
    public classifier: Classifier;
    public maskhint: Maskhint;

    public constructor(init?: Partial<GetDocumentImageRequest>) {
      (<any>Object).assign(this, init);
    }

    public createResponse() {
      return new GetDocumentImageResponse();
    }

    public getTypeName() {
      return 'GetDocumentImageRequest';
    }
  }

  // @Route("/document/{ScanReference}/status", "GET")
  export class GetDocumentStatusRequest implements IReturn<GetDocumentStatusResponse> {
    public scanReference: string;

    public constructor(init?: Partial<GetDocumentStatusRequest>) {
      (<any>Object).assign(this, init);
    }

    public createResponse() {
      return new GetDocumentStatusResponse();
    }

    public getTypeName() {
      return 'GetDocumentStatusRequest';
    }
  }

  // @Route("/document/{ScanReference}", "GET")
  export class GetDocumentDataRequest implements IReturn<GetDocumentDataResponse> {
    public scanReference: string;

    public constructor(init?: Partial<GetDocumentDataRequest>) {
      (<any>Object).assign(this, init);
    }

    public createResponse() {
      return new GetDocumentDataResponse();
    }

    public getTypeName() {
      return 'GetDocumentDataRequest';
    }
  }

  // @Route("/document/{ScanReference}/document", "GET")
  export class GetDocumentsDocumentDataRequest implements IReturn<GetDocumentsDocumentDataResponse> {
    public scanReference: string;

    public constructor(init?: Partial<GetDocumentsDocumentDataRequest>) {
      (<any>Object).assign(this, init);
    }

    public createResponse() {
      return new GetDocumentsDocumentDataResponse();
    }

    public getTypeName() {
      return 'GetDocumentsDocumentDataRequest';
    }
  }

  // @Route("/document/{ScanReference}/transaction", "GET")
  export class GetDocumentsTransactionDataRequest implements IReturn<GetDocumentsTransactionDataResponse> {
    public scanReference: string;

    public constructor(init?: Partial<GetDocumentsTransactionDataRequest>) {
      (<any>Object).assign(this, init);
    }

    public createResponse() {
      return new GetDocumentsTransactionDataResponse();
    }

    public getTypeName() {
      return 'GetDocumentsTransactionDataRequest';
    }
  }

  // @Route("/merge/document", "POST")
  export class MergeDocumentRequest implements IReturn<MergeDocumentResponse> {
    public fileName: string;

    public constructor(init?: Partial<MergeDocumentRequest>) {
      (<any>Object).assign(this, init);
    }

    public createResponse() {
      return new MergeDocumentResponse();
    }

    public getTypeName() {
      return 'MergeDocumentRequest';
    }
  }

  // @Route("/scan/{ScanReference}", "GET")
  export class GetScanDataRequest implements IReturn<GetScanDataResponse> {
    public scanReference: string;

    public constructor(init?: Partial<GetScanDataRequest>) {
      (<any>Object).assign(this, init);
    }

    public createResponse() {
      return new GetScanDataResponse();
    }

    public getTypeName() {
      return 'GetScanDataRequest';
    }
  }

  // @Route("/scan/{ScanReference}/documents", "GET")
  export class GetScanDocumentDataRequest implements IReturn<GetScanDocumentDataResponse> {
    public scanReference: string;

    public constructor(init?: Partial<GetScanDocumentDataRequest>) {
      (<any>Object).assign(this, init);
    }

    public createResponse() {
      return new GetScanDocumentDataResponse();
    }

    public getTypeName() {
      return 'GetScanDocumentDataRequest';
    }
  }

  // @Route("/scan/{ScanReference}/images", "GET")
  export class GetScanImagesRequest implements IReturn<GetScanImagesResponse> {
    public scanReference: string;
    public classifier: Classifier;
    public maskHint: Maskhint;

    public constructor(init?: Partial<GetScanImagesRequest>) {
      (<any>Object).assign(this, init);
    }

    public createResponse() {
      return new GetScanImagesResponse();
    }

    public getTypeName() {
      return 'GetScanImagesRequest';
    }
  }

  // @Route("/scan/{ScanReference}/image/{Classifier}", "GET")
  export class GetScanImageRequest implements IReturn<GetScanImageResponse> {
    public scanReference: string;
    public classifier: Classifier;
    public maskHint: Maskhint;

    public constructor(init?: Partial<GetScanImageRequest>) {
      (<any>Object).assign(this, init);
    }

    public createResponse() {
      return new GetScanImageResponse();
    }

    public getTypeName() {
      return 'GetScanImageRequest';
    }
  }

  // @Route("/scan/{ScanReference}/status", "GET")
  export class GetScanStatusRequest implements IReturn<GetScanStatusResponse> {
    public scanReference: string;

    public constructor(init?: Partial<GetScanStatusRequest>) {
      (<any>Object).assign(this, init);
    }

    public createResponse() {
      return new GetScanStatusResponse();
    }

    public getTypeName() {
      return 'GetScanStatusRequest';
    }
  }

  // @Route("/scan/{ScanReference}", "DELETE")
  export class DeleteScanRequest implements IReturnVoid {
    public scanReference: string;

    public constructor(init?: Partial<DeleteScanRequest>) {
      (<any>Object).assign(this, init);
    }

    public createResponse() {
    }

    public getTypeName() {
      return 'DeleteScanRequest';
    }
  }

  // @Route("/upload/callback")
  export class UploadCallbackRequest implements IReturn<UploadCallbackResponse> {
    public constructor(init?: Partial<UploadCallbackRequest>) {
      (<any>Object).assign(this, init);
    }

    public createResponse() {
      return new UploadCallbackResponse();
    }

    public getTypeName() {
      return 'UploadCallbackRequest';
    }
  }

  // @Route("/verification/initiate", "POST")
  export class InitiateRequest extends UserSettings implements IReturn<InitiateResponse> {
    public constructor(init?: Partial<InitiateRequest>) {
      super(init);
      (<any>Object).assign(this, init);
    }

    public createResponse() {
      return new InitiateResponse();
    }

    public getTypeName() {
      return 'InitiateRequest';
    }
  }

  // @Route("/system/uptime", "GET")
  export class UpTimeRequest implements IReturn<UpTimeResponse> {
    public constructor(init?: Partial<UpTimeRequest>) {
      (<any>Object).assign(this, init);
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
      (<any>Object).assign(this, init);
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
      (<any>Object).assign(this, init);
    }

    public createResponse() {
      return new Object();
    }

    public getTypeName() {
      return 'DebugRequest';
    }
  }

}

