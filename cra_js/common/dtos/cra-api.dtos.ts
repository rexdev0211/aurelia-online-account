export module CRAApi {

  // Servicestack

  export interface IReturn<T> {
    createResponse(): T;
  }

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

  // Interfaces

  export enum RiskAnswerType {
    Answer = 'Answer',
    Country = 'Country',
    Date = 'Date',
    Industry = 'Industry',
  }

  export enum RiskAnswerProbability {
    NotSet = 'NotSet',
    VeryLow = 'VeryLow',
    Low = 'Low',
    Medium = 'Medium',
    High = 'High',
    VeryHigh = 'VeryHigh',
  }

  export interface IHasERN extends IIsERN {
    ern: string;
  }

  export interface IIsERN {
  }

  export interface IHasCreateDate {
    createdDate?: number;
  }

  export interface IHasModifiedDate {
    modifiedDate?: number;
  }

  export interface IDateTracking extends IHasCreateDate, IHasModifiedDate {
  }

  export interface IHasName {
    name: string;
  }

  export interface IHasPrincipalERN extends IIsERN {
    principalERN: string;
  }

  export interface IRiskModel extends IHasName {
    categories: RiskCategory[];
  }

  export interface IHasName {
    name: string;
  }

  export interface ICRAModel extends IRiskModel {
  }

  export interface IRiskFactor extends IHasName, IHasWeight {
    question: string;
    answers: RiskAnswer[];
    answerIndex?: number;
    answerType: RiskAnswerType;
    answerProbability?: RiskAnswerProbability;
    selectedAnswer: RiskAnswer;
    confidenceScore: number;
    overrideWeight?: number;
    overrideScore?: number;
  }

  export interface IHasWeight extends IIsWeight {
    weight?: number;
  }

  export interface IIsWeight {
  }

  export interface IRiskAnswer extends IHasName {
    tag: string;
    value: string;
    confidenceScore: number;
    overrideScore?: number;
    overrideWeight?: number;
  }

  export interface IHasOverridableWeight {
    weight?: number;
    overrideWeight?: number;
  }

  export interface IRiskComponent extends IHasName, IHasOverridableWeight {
    riskFactors: RiskFactor[];
  }

  export interface IRiskCategory extends IHasName, IHasOverridableWeight {
    components: RiskComponent[];
  }

  export interface ICRAProfile extends IHasERN, IDateTracking, IHasPrincipalERN {
    name: string;
    model: CRAModel;
  }

  // Models

  export class RiskAnswer implements IRiskAnswer {
    public name: string;
    public tag: string;
    public value: string;
    public confidenceScore: number;
    public riskWeight: number;
    public overrideScore?: number;
    public overrideWeight?: number;

    public constructor(init?: Partial<RiskAnswer>) {
      (Object as any).assign(this, init);
    }
  }

  export class RiskFactor implements IRiskFactor {
    public name: string;
    public question: string;
    public answers: RiskAnswer[];
    public answerIndex?: number;
    public answerType: RiskAnswerType;
    public answerProbability?: RiskAnswerProbability;
    public selectedAnswer: RiskAnswer;
    public weight?: number;
    public confidenceScore: number;
    public overrideScore?: number;
    public overrideWeight?: number;

    public constructor(init?: Partial<RiskFactor>) {
      (Object as any).assign(this, init);
    }
  }

  export class RiskComponent implements IRiskComponent {
    public nonZeroFactorAnswers: number;
    public calcFactorOverrideCount: number;
    public calcFactorOverrideWeight?: number;
    public calcFactorWeight: number;
    public calcRawScore: number;
    public calculatedScore: number;
    public calcOverrideScore?: number;
    public name: string;
    public riskFactors: RiskFactor[];
    public weight?: number;
    public overrideWeight?: number;

    public constructor(init?: Partial<RiskComponent>) {
      (Object as any).assign(this, init);
    }
  }

  export class RiskCategory implements IRiskCategory {
    public name: string;
    public weight?: number;
    public overrideWeight?: number;
    public components: RiskComponent[];
    public calcOverrideScore?: number;
    public calculatedScore: number;

    public constructor(init?: Partial<RiskCategory>) {
      (Object as any).assign(this, init);
    }
  }

  export class RiskModel implements IRiskModel {
    public name: string;
    public categories: RiskCategory[];
    public calcOverrideScore?: number;

    public constructor(init?: Partial<RiskModel>) {
      (Object as any).assign(this, init);
    }
  }

  export class CRAModel extends RiskModel implements ICRAModel {
    public calculatedScore?: number;

    public constructor(init?: Partial<CRAModel>) {
      super(init);
      (Object as any).assign(this, init);
    }
  }

  export class CRAProfileRecord implements ICRAProfile {
    public ern: string;
    public createdDate?: number;
    public modifiedDate?: number;
    public principalERN: string;
    public name: string;
    public model: CRAModel;

    public constructor(init?: Partial<CRAProfileRecord>) {
      (Object as any).assign(this, init);
    }
  }

  // DTOS

  export class CRAProfileResponse {
    public responseStatus: ResponseStatus;
    public result: CRAProfileRecord;

    public constructor(init?: Partial<CRAProfileResponse>) {
      (Object as any).assign(this, init);
    }
  }

  // @Route("/cra", "POST,PUT,DELETE")
  // @Route("/cra/profile/{ERN}", "GET")
  export class CRAProfileRequest extends CRAProfileRecord implements IReturn<CRAProfileResponse> {
    public constructor(init?: Partial<CRAProfileRequest>) {
      super(init);
      (Object as any).assign(this, init);
    }

    public getTypeName() {
      return 'CRAProfileRequest';
    }

    public getMethod() {
      return 'GET';
    }

    public createResponse() {
      return new CRAProfileResponse();
    }
  }
}
