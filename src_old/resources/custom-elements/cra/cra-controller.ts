import { autoinject } from 'aurelia-framework';
import { connectTo, dispatchify } from 'aurelia-store';
import { CRAApi } from './common/dtos/cra-api.dtos';
import { State } from './store/state';
import { getCRACountries, getCRAIndustries } from './store/actions';

@connectTo()
@autoinject()
export class CraController {
  public state: State;
  public countries: CRAApi.RiskAnswer[] = [];
  public industries: CRAApi.RiskAnswer[] = [];
  public answerTypes = Object.entries(CRAApi.RiskAnswerType).map(([key, value]) => ({ key, value }));
  private pageSize: number = 5;
  private pageable = {
    refresh: true,
    pageSizes: true,
    buttonCount: 10
  };
  private currentPage = 1;
  private modes: string[] = ['consumer', 'admin'];
  private mode: string = 'consumer';
  private debugMode: boolean = false;
  private levels: string[] = ['Models', 'Categories', 'Components', 'RiskFactors', 'Answers'];

  constructor() {  }

  setPageSize(pageSize: number) {
    this.pageSize = pageSize;
  }

  getPageSize() {
    return this.pageSize;
  }

  setCurrentPage(currentPage: number) {
    this.currentPage = currentPage;
  }
  
  getPageCount(totalCount: number, pageSize: number) {
    return Math.ceil( totalCount / (pageSize ? pageSize : 1));
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  setMode(mode: string) {
    this.mode = mode;
  }

  getMode() {
    return this.mode;
  }

  setDebugMode(debugMode: boolean) {
    this.debugMode = debugMode;
  }

  getDebugMode() {
    return this.debugMode;
  }

  getLevels() {
    return this.levels;
  }
  
  getDate(time: number) {
    return new Date(time).toLocaleDateString();
  }

  getModelStatus(model: CRAApi.CRAModel) {
    let status = 'Inactive';
    let active = true;

    if (model && model.categories.length > 0) {
      model.categories.forEach(cat => {
        if (cat.components.length === 0) {
          active = false;
          status = 'Inactive';
          return;
        }
        if (!active) return;
        cat.components.forEach(com => {
          if (com.riskFactors.length === 0) {
            active = false;
            status = 'Inactive';
            return;
          }
          if (!active) return;
          com.riskFactors.forEach(rf => {
            if (!rf.answers || (rf.answers.length === 0 && rf.answerType === CRAApi.RiskAnswerType.Answer)) {
              console.log('Inactive');
              active = false;
              status = 'Inactive';
              return;
            }
            console.log('Active');
            status = 'Active';
          })
        })
      });
    }
    return status;
  }
}
