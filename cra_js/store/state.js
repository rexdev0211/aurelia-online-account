import {CRAApi} from "../common/dtos/cra-api.dtos";

export const initialState = {
  cra: {
      model: {
          name: '',
          categories: [],
          calculatedScore: 0
      },
      countries: [],
      industries: [],
      profileRecords: []
  }
};
