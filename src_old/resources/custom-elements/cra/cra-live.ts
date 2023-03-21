import { autoinject, observable, TaskQueue } from 'aurelia-framework';
import { connectTo, dispatchify } from 'aurelia-store';
import { CRAApi } from './common/dtos/cra-api.dtos';
import { State } from './store/state';
import { getCRACountries, getCRAIndustries, getCRAModel, setCRAModel, getCRAProfileRecords } from './store/actions';
import { CraController } from './cra-controller';

@connectTo()
@autoinject()
export class CraLive extends CraController {
  private isLoaded: boolean = false;
  @observable private model: CRAApi.CRAModel = null;
  private profileRecords: CRAApi.CRAProfileRecord[] = [];
  private selectedCategoryIndex: number = 0;
  private selectedComponentIndex: number = 0;
  private selectedRiskFactorIndex: number = 0;
  private activeRiskFactor: CRAApi.RiskFactor = {
    name: '',
    question: '',
    answers: [],
    answerType: CRAApi.RiskAnswerType.Answer,
    selectedAnswer: null,
    confidenceScore: 0
  };
  private endAnswering = false;

  constructor(private taskQueue: TaskQueue) { 
    super();
  }

  async bind() {
    // await dispatchify(getCRAModel)();
    await dispatchify(getCRAProfileRecords)();
    await dispatchify(getCRACountries)();
    await dispatchify(getCRAIndustries)();
  }

  attached() {
    this.taskQueue.queueTask(() => {
      this.profileRecords = this.state.profileRecords;
      this.model = this.profileRecords[0].model;
      console.log('GetModel', this.model);
      this.activeRiskFactor = this.model['categories'][this.selectedCategoryIndex]['components'][this.selectedComponentIndex]['riskFactors'][this.selectedRiskFactorIndex];
      this.countries = this.state.countries;
      this.industries = this.state.industries;
      this.isLoaded = true;
    });
  }

  modelChanged(newModel: CRAApi.CRAModel, oldModel: CRAApi.CRAModel) {
    if (newModel && oldModel) {
      this.selectedCategoryIndex = 0;
      this.selectedComponentIndex = 0;
      this.selectedRiskFactorIndex = 0;
      this.activeRiskFactor = this.model['categories'][this.selectedCategoryIndex]['components'][this.selectedComponentIndex]['riskFactors'][this.selectedRiskFactorIndex];
    }
  }

  async saveUpdatedModelToState() {
    await dispatchify(setCRAModel)(this.model);
  }

  updateModelBySelectedAnswer() {
    if (this.activeRiskFactor['AnswerType'] === 'Date') {
      this.activeRiskFactor['answerIndex'] = (this.activeRiskFactor['confidenceScore'] === 0.94 ? 0 : null);
    }
    this.model['categories'][this.selectedCategoryIndex]['components'][this.selectedComponentIndex]['riskFactors'][this.selectedRiskFactorIndex]['answerIndex'] = this.activeRiskFactor['answerIndex'];
    this.saveUpdatedModelToState();
  }

  moveToNextRiskFactor() {
    this.selectedRiskFactorIndex++;
    if (this.model['categories'][this.selectedCategoryIndex]['components'][this.selectedComponentIndex]['riskFactors'].length === this.selectedRiskFactorIndex) {
      this.selectedRiskFactorIndex = 0;
      this.selectedComponentIndex++;
      if (this.model['categories'][this.selectedCategoryIndex]['components'].length === this.selectedComponentIndex) {
        this.selectedComponentIndex = 0;
        this.selectedCategoryIndex++;
        if (this.model['categories'].length === this.selectedCategoryIndex) {
          this.selectedCategoryIndex--;
          this.selectedComponentIndex--;
          this.endAnswering = true;
        }
      }
    }
  }

  updateActiveRiskFactor() {
    if (!this.endAnswering) {
      this.activeRiskFactor = this.model['categories'][this.selectedCategoryIndex]['components'][this.selectedComponentIndex]['riskFactors'][this.selectedRiskFactorIndex];
    }
  }

  nextRiskFactor() {
    this.updateModelBySelectedAnswer();

    this.moveToNextRiskFactor();

    this.updateActiveRiskFactor();
  }

  moveToNextRiskFactorsForComponent() {
    this.selectedComponentIndex++;
    if (this.model['categories'][this.selectedCategoryIndex]['components'].length === this.selectedComponentIndex) {
      this.selectedComponentIndex = 0;
      this.selectedCategoryIndex++;
      if (this.model['categories'].length === this.selectedCategoryIndex) {
        this.selectedCategoryIndex--;
        this.selectedComponentIndex--;
        this.endAnswering = true;
      }
    }
  }

  nextRiskFactorsForComponent() {
    this.setCurrentPage(1);
    this.moveToNextRiskFactorsForComponent();
    this.saveUpdatedModelToState();
  }

  submitAllAnswers() {
    console.log('Submit-model', this.model);
    this.saveUpdatedModelToState();
  }

  selectCategory(index: number) {
    this.selectedCategoryIndex = index;
    this.selectedComponentIndex = 0;
  }
  
  selectComponent(index: number) {
    this.selectedComponentIndex = index;
  }

  getActiveProfiles() {
    return this.profileRecords.filter(item => this.getModelStatus(item?.model) === 'Active');
  }
}
