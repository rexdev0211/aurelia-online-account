// import {CRAApi} from "../../../../dtos/cra-api.dtos";
// import RiskModel = CRAApi.RiskModel;
// import RiskAnswer = CRAApi.RiskAnswer;

// @Leonid: You can find all of these models in the OnlineAccountApi.dtos.ts file
import RiskModel = OnlineAccountApi.RiskModelRecord;
import RiskAnswer = OnlineAccountApi.RiskAnswerRecord;
import {OnlineAccountApi} from "../../../../dtos/onlineaccount-api.dtos";

export class RiskProfileManagerState {
    model: RiskModel
    countries: RiskAnswer[]
    industries: RiskAnswer[]

    constructor(init?: Partial<RiskProfileManagerState>) {
        (<any>Object).assign(this, init);
    }
}
