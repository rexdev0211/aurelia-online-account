import { CRAApi } from "../common/dtos/cra-api.dtos";

export interface State {
  model: CRAApi.CRAModel;
  countries: CRAApi.RiskAnswer[],
  industries: CRAApi.RiskAnswer[],
  profileRecords: CRAApi.CRAProfileRecord[]
}

export const initialState: State = {
  model: {
    name: '',
    categories: [],
    calculatedScore: 0
  },
  countries: [],
  industries: [],
  profileRecords: []
};
