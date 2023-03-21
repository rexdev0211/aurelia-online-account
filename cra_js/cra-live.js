import {inject, observable, TaskQueue} from 'aurelia-framework';
import {connectTo, dispatchify} from 'aurelia-store';
import {CRAApi} from './common/dtos/cra-api.dtos';
import {CraController} from './cra-controller';

@connectTo()
@inject(TaskQueue)
export class CraLiveCustomElement extends CraController {
    @observable stateCra;
    model = null;
    selectedCategoryIndex = 0;
    selectedComponentIndex = 0;
    selectedRiskFactorIndex = 0;
    activeRiskFactor = {
        name: '',
        question: '',
        answers: [],
        answerType: CRAApi.RiskAnswerType.Answer,
        selectedAnswer: null,
        confidenceScore: 0
    };
    endAnswering = false;
    taskQueue;

    constructor(TaskQueue) {
        super();
        this.taskQueue = TaskQueue;
    }

    async bind() {
        await Promise.all([
            dispatchify('getCRAModel')(),
            dispatchify('getCRACountries')(),
            dispatchify('getCRAIndustries')()]);
    }

    stateChanged(newValue) {
        this.stateCra = newValue.cra;
    }

    stateCraChanged(newValue, oldValue) {
        if (newValue && !this.model) {
            this.model = newValue.model;
            console.log('GetModel', this.model);
            this.activeRiskFactor = newValue.model['Categories'][this.selectedCategoryIndex]['Components'][this.selectedComponentIndex]['RiskFactors'][this.selectedRiskFactorIndex];
            this.countries = newValue.countries;
            this.industries = newValue.industries;
        }
    }

    // attached() {
    //     this.model = this.state.cra.model;
    //     console.log('GetModel', this.model);
    //     this.activeRiskFactor = this.state.cra.model['Categories'][this.selectedCategoryIndex]['Components'][this.selectedComponentIndex]['RiskFactors'][this.selectedRiskFactorIndex];
    //     this.countries = this.state.cra.countries;
    //     this.industries = this.state.cra.industries;
    // }

    async saveUpdatedModelToState() {
        await dispatchify('setCRAModel')(this.model);
    }

    updateModelBySelectedAnswer() {
        if (this.activeRiskFactor['AnswerType'] === 'Date') {
            this.activeRiskFactor['AnswerIndex'] = (this.activeRiskFactor['ConfidenceScore'] === 0.94 ? 0 : null);
        }
        this.model['Categories'][this.selectedCategoryIndex]['Components'][this.selectedComponentIndex]['RiskFactors'][this.selectedRiskFactorIndex]['AnswerIndex'] = this.activeRiskFactor['AnswerIndex'];
        this.saveUpdatedModelToState();
    }

    moveToNextRiskFactor() {
        this.selectedRiskFactorIndex++;
        if (this.model['Categories'][this.selectedCategoryIndex]['Components'][this.selectedComponentIndex]['RiskFactors'].length === this.selectedRiskFactorIndex) {
            this.selectedRiskFactorIndex = 0;
            this.selectedComponentIndex++;
            if (this.model['Categories'][this.selectedCategoryIndex]['Components'].length === this.selectedComponentIndex) {
                this.selectedComponentIndex = 0;
                this.selectedCategoryIndex++;
                if (this.model['Categories'].length === this.selectedCategoryIndex) {
                    this.selectedCategoryIndex--;
                    this.selectedComponentIndex--;
                    this.endAnswering = true;
                }
            }
        }
    }

    updateActiveRiskFactor() {
        if (!this.endAnswering) {
            this.activeRiskFactor = this.model['Categories'][this.selectedCategoryIndex]['Components'][this.selectedComponentIndex]['RiskFactors'][this.selectedRiskFactorIndex];
        }
    }

    nextRiskFactor() {
        this.updateModelBySelectedAnswer();

        this.moveToNextRiskFactor();

        this.updateActiveRiskFactor();
    }

    moveToNextRiskFactorsForComponent() {
        this.selectedComponentIndex++;
        if (this.model['Categories'][this.selectedCategoryIndex]['Components'].length === this.selectedComponentIndex) {
            this.selectedComponentIndex = 0;
            this.selectedCategoryIndex++;
            if (this.model['Categories'].length === this.selectedCategoryIndex) {
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

    selectCategory(index) {
        this.selectedCategoryIndex = index;
        this.selectedComponentIndex = 0;
    }

    selectComponent(index) {
        this.selectedComponentIndex = index;
    }
}
