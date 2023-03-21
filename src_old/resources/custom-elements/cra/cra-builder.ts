import { autoinject, TaskQueue } from 'aurelia-framework';
import { connectTo, dispatchify } from 'aurelia-store';
import {
  ValidationControllerFactory,
  ValidationController,
  ValidationRules,
  validateTrigger,
  Validator
} from 'aurelia-validation';
import { CRAApi } from './common/dtos/cra-api.dtos';
import { State } from './store/state';
import { getCRAProfileRecords, setCRAProfileRecords } from './store/actions';
import { CraController } from './cra-controller';
import $ from 'jquery';

const initProfileRecord: CRAApi.CRAProfileRecord = {
  name: '',
  ern: '',
  principalERN: '',
  createdDate: null,
  model: {
    name: '',
    categories: []
  }
};

const initCategory: CRAApi.RiskCategory = {
  name: '',
  calculatedScore: 0,
  components: []
}

const initComponent: CRAApi.RiskComponent = {
  name: '',
  nonZeroFactorAnswers: 0,
  calcFactorOverrideCount: 0,
  calcFactorWeight: 0,
  calcRawScore: 0,
  calculatedScore: 0,
  riskFactors: []
}

const initRiskFactor: CRAApi.RiskFactor = {
  name: '',
  question: '',
  answers: [],
  answerType: CRAApi.RiskAnswerType.Answer,
  selectedAnswer: null,
  confidenceScore: 0
}

const initAnswer: CRAApi.RiskAnswer = {
  name: '',
  tag: '',
  value: '',
  confidenceScore: 0,
  riskWeight: 0
}

const profileRecordForm = {
  name: 'Model Name',
  ern: 'Ern',
  principalERN: 'Principal ERN',
  createdDate: 'Date Created'
};

const categoryForm = {
  name: 'Category Name',
  weight: 'Weight',
  calculatedScore: 'Calculated Score',
};

const componentForm = {
  name: 'Component Name',
  calcFactorWeight: 'Calc Factor Weight',
  calcRawScore: 'Calc Raw Score',
  calculatedScore: 'Calculated Score',
};

const riskFactorForm = {
  name: 'Risk Factor Name',
  question: 'Question',
  answerType: 'Answer Type',
  confidenceScore: 'Confidence Score',
};

const answerForm = {
  name: 'Answer Name',
  tag: 'Tag',
  value: 'Value',
  confidenceScore: 'Confidence Score',
  riskWeight: 'Risk Weight',
};

@autoinject()
@connectTo()
export class CraBuilder extends CraController {
  private isLoaded: boolean = false;
  private griddata = [];
  private profileRecords: CRAApi.CRAProfileRecord[] = [];
  private newProfileRecord: CRAApi.CRAProfileRecord = initProfileRecord;
  private newCategory: CRAApi.RiskCategory = initCategory;
  private newComponent: CRAApi.RiskComponent = initComponent;
  private newRiskFactor: CRAApi.RiskFactor = initRiskFactor;
  private newAnswer: CRAApi.RiskAnswer = initAnswer;
  private activeLevelIndex: number = 1;
  private activeModelIndex: number = -1;
  private activeCategoryIndex: number = -1;
  private activeComponentIndex: number = -1;
  private activeRiskFactorIndex: number = -1;
  
  private profileRecordLabels = Object.values(profileRecordForm);
  private profileRecordProperties = Object.keys(profileRecordForm);
  private categoryLabels = Object.values(categoryForm);
  private categoryProperties = Object.keys(categoryForm);
  private componentLabels = Object.values(componentForm);
  private componentProperties = Object.keys(componentForm);
  private riskFactorLabels = Object.values(riskFactorForm);
  private riskFactorProperties = Object.keys(riskFactorForm);
  private answerLabels = Object.values(answerForm);
  private answerProperties = Object.keys(answerForm);

  constructor(private taskQueue: TaskQueue) {
    super();
  }

  async bind() {
    await dispatchify(getCRAProfileRecords)();
  }

  attached() {
    this.taskQueue.queueTask(() => {
      this.profileRecords = this.state.profileRecords;
      this.isLoaded = true;
    });
  }

  async saveProfileRecordsToState() {
    await dispatchify(setCRAProfileRecords)(this.profileRecords);
  }

  moveToLevel(activeLevelIndex: number) {
    this.activeLevelIndex = activeLevelIndex;
  }

  selectItem(index: number) {
    switch (this.activeLevelIndex) {
      case 1:
        this.activeModelIndex = index;
        break;
      case 2:
        this.activeCategoryIndex = index;
        break;
      case 3:
        this.activeComponentIndex = index;
        break;
      case 4:
        this.activeRiskFactorIndex = index;
        break;
      default:
        break;
    }
    this.activeLevelIndex ++;
  }

  removeItem(index: number) {
    switch (this.activeLevelIndex) {
      case 1:
        this.profileRecords.splice(index, 1);
        this.profileRecords = [...this.profileRecords];
        break;
      case 2:
        this.profileRecords[this.activeModelIndex].model.categories.splice(index, 1);
        this.profileRecords[this.activeModelIndex].model.categories = [...this.profileRecords[this.activeModelIndex].model.categories];
        break;
      case 3:
        this.profileRecords[this.activeModelIndex].model.categories[this.activeCategoryIndex].components.splice(index, 1);
        this.profileRecords[this.activeModelIndex].model.categories[this.activeCategoryIndex].components = [...this.profileRecords[this.activeModelIndex].model.categories[this.activeCategoryIndex].components];
        break;
      case 4:
        this.profileRecords[this.activeModelIndex].model.categories[this.activeCategoryIndex].components[this.activeComponentIndex].riskFactors.splice(index, 1);
        this.profileRecords[this.activeModelIndex].model.categories[this.activeCategoryIndex].components[this.activeComponentIndex].riskFactors = [...this.profileRecords[this.activeModelIndex].model.categories[this.activeCategoryIndex].components[this.activeComponentIndex].riskFactors];
        break;
      case 5:
        this.profileRecords[this.activeModelIndex].model.categories[this.activeCategoryIndex].components[this.activeComponentIndex].riskFactors[this.activeRiskFactorIndex].answers.splice(index, 1);
        this.profileRecords[this.activeModelIndex].model.categories[this.activeCategoryIndex].components[this.activeComponentIndex].riskFactors[this.activeRiskFactorIndex].answers = [...this.profileRecords[this.activeModelIndex].model.categories[this.activeCategoryIndex].components[this.activeComponentIndex].riskFactors[this.activeRiskFactorIndex].answers];
        break;
      default:
        break;
    }
    this.saveProfileRecordsToState();
  }

  initializeNewProfileRecord() {
    this.newProfileRecord = {
      name: '',
      ern: '',
      principalERN: '',
      createdDate: null,
      model: {
        name: '',
        categories: []
      }
    }
  }

  addNewModel() {
    this.newProfileRecord.name = this.newProfileRecord.model.name;
    this.newProfileRecord.ern = `ERN-${this.profileRecords.length + 1}`;
    this.newProfileRecord.principalERN = `principalERN-${this.profileRecords.length + 1}`;
    this.newProfileRecord.createdDate = new Date().getTime();
    this.profileRecords.push(this.newProfileRecord);
    this.profileRecords = [...this.profileRecords];
    this.initializeNewProfileRecord();
    this.saveProfileRecordsToState();
  }

  initializeNewCategory() {
    this.newCategory = {
      name: '',
      calculatedScore: 0,
      components: []
    };
  }

  addNewCategory() {
    this.profileRecords[this.activeModelIndex].model.categories.push(this.newCategory);
    this.profileRecords[this.activeModelIndex].model.categories = [...this.profileRecords[this.activeModelIndex].model.categories];
    this.initializeNewCategory();
    this.saveProfileRecordsToState();
  }

  initializeNewComponent() {
    this.newComponent = {
      name: '',
      nonZeroFactorAnswers: 0,
      calcFactorOverrideCount: 0,
      calcFactorWeight: 0,
      calcRawScore: 0,
      calculatedScore: 0,
      riskFactors: []
    };
  }

  addNewComponent() {
    this.profileRecords[this.activeModelIndex].model.categories[this.activeCategoryIndex].components.push(this.newComponent);
    this.profileRecords[this.activeModelIndex].model.categories[this.activeCategoryIndex].components = [...this.profileRecords[this.activeModelIndex].model.categories[this.activeCategoryIndex].components];
    this.initializeNewComponent();
    this.saveProfileRecordsToState();
  }

  initializeNewRiskFactor() {
    this.newRiskFactor = {
      name: '',
      question: '',
      answers: [],
      answerType: CRAApi.RiskAnswerType.Answer,
      selectedAnswer: null,
      confidenceScore: 0
    };
  }

  addNewRiskFactor() {
    this.profileRecords[this.activeModelIndex].model.categories[this.activeCategoryIndex].components[this.activeComponentIndex].riskFactors.push(this.newRiskFactor);
    this.profileRecords[this.activeModelIndex].model.categories[this.activeCategoryIndex].components[this.activeComponentIndex].riskFactors = [...this.profileRecords[this.activeModelIndex].model.categories[this.activeCategoryIndex].components[this.activeComponentIndex].riskFactors];
    this.initializeNewRiskFactor();
    this.saveProfileRecordsToState();
  }

  initializeNewAnswer() {
    this.newAnswer = {
      name: '',
      tag: '',
      value: '',
      confidenceScore: 0,
      riskWeight: 0
    };
  }

  addNewAnswer() {
    this.profileRecords[this.activeModelIndex].model.categories[this.activeCategoryIndex].components[this.activeComponentIndex].riskFactors[this.activeRiskFactorIndex].answers.push(this.newAnswer);
    this.profileRecords[this.activeModelIndex].model.categories[this.activeCategoryIndex].components[this.activeComponentIndex].riskFactors[this.activeRiskFactorIndex].answers = [...this.profileRecords[this.activeModelIndex].model.categories[this.activeCategoryIndex].components[this.activeComponentIndex].riskFactors[this.activeRiskFactorIndex].answers];
    this.initializeNewAnswer();
    this.saveProfileRecordsToState();
  }

  getKendoGridDataSource() {
    const self = this;
    let nextId = 1;
    switch (self.activeLevelIndex) {
      case 1:
        self.griddata = self.profileRecords.map((x, i) => ({ id: i + 1, ...x }));
        nextId = self.griddata.length + 1;
        return {
          transport: {
            read: function (e) {
              e.success(self.griddata);
            },
            create: function (e) {
              if (self.griddata.find(x => x.name === e.data.name)) {
                e.error({ errorMsg: `${e.data.name} already exists!` });
                return;
              }
              e.data.id = nextId++;
              self.griddata.push(e.data);
              self.profileRecords = self.griddata.map(({ id, ...rest }) => ({ ...rest, model: { name: rest.name, categories: rest.model && rest.model.categories ? rest.model.categories : [] }}));
              self.saveProfileRecordsToState();
              e.success(e.data);
            },
            update: function (e) {
              if (self.griddata.find(x => x.name === e.data.name)) {
                e.error({ errorMsg: `${e.data.name} already exists!` });
                return;
              }
              const objIndex = self.griddata.findIndex((obj => obj.id == e.data.id));
              self.griddata[objIndex] = e.data;
              self.profileRecords = self.griddata.map(({ id, ...rest }) => rest);
              self.saveProfileRecordsToState();
              e.success();
            },
            destroy: function (e) {
              const objIndex = self.griddata.findIndex((obj => obj.id == e.data.id));
              self.griddata.splice(objIndex, 1);
              self.profileRecords = self.griddata.map(({ id, ...rest }) => rest);
              self.saveProfileRecordsToState();
              e.success();
            }
          },
          error: function (e) {
            alert("Error: " + e?.xhr?.errorMsg);
          },
          pageSize: this.getPageSize(),
          batch: false,
          schema: {
            model: {
              id: "id",
              fields: {
                id: { editable: false, nullable: true },
                name: { type: "string", validation: { required: true } }
              }
            }
          }
        };
      case 2:
        self.griddata = self.profileRecords[self.activeModelIndex].model.categories.map((x, i) => ({ id: i + 1, ...x }));
        nextId = self.griddata.length + 1;
        return {
          transport: {
            read: function (e) {
              e.success(self.griddata);
            },
            create: function (e) {
              if (self.griddata.find(x => x.name === e.data.name)) {
                e.error({ errorMsg: `${e.data.name} already exists!` });
                return;
              }
              e.data.id = nextId++;
              self.griddata.push(e.data);
              self.profileRecords[self.activeModelIndex].model.categories = self.griddata.map(({ id, ...rest }) => ({ ...rest, components: rest.components ? rest.components : [] }));
              self.saveProfileRecordsToState();
              e.success(e.data);
            },
            update: function (e) {
              if (self.griddata.find(x => x.name === e.data.name)) {
                e.error({ errorMsg: `${e.data.name} already exists!` });
                return;
              }
              const objIndex = self.griddata.findIndex((obj => obj.id == e.data.id));
              self.griddata[objIndex] = e.data;
              self.profileRecords[self.activeModelIndex].model.categories = self.griddata.map(({ id, ...rest }) => rest);
              self.saveProfileRecordsToState();
              e.success();
            },
            destroy: function (e) {
              const objIndex = self.griddata.findIndex((obj => obj.id == e.data.id));
              self.griddata.splice(objIndex, 1);
              self.profileRecords[self.activeModelIndex].model.categories = self.griddata.map(({ id, ...rest }) => rest);
              self.saveProfileRecordsToState();
              e.success();
            }
          },
          error: function (e) {
            alert("Error: " + e?.xhr?.errorMsg);
          },
          pageSize: this.getPageSize(),
          batch: false,
          schema: {
            model: {
              id: "id",
              fields: {
                id: { editable: false, nullable: true },
                name: { type: "string", validation: { required: true } },
                weight: { type: "number" }
              }
            }
          }
        };
      case 3:
        self.griddata = self.profileRecords[self.activeModelIndex].model.categories[self.activeCategoryIndex].components.map((x, i) => ({ id: i + 1, ...x }));
        nextId = self.griddata.length + 1;
        return {
          transport: {
            read: function (e) {
              e.success(self.griddata);
            },
            create: function (e) {
              if (self.griddata.find(x => x.name === e.data.name)) {
                e.error({ errorMsg: `${e.data.name} already exists!` });
                return;
              }
              e.data.id = nextId++;
              self.griddata.push(e.data);
              self.profileRecords[self.activeModelIndex].model.categories[self.activeCategoryIndex].components = self.griddata.map(({ id, ...rest }) => ({ ...rest, riskFactors: rest.riskFactors ? rest.riskFactors : [] }));
              self.saveProfileRecordsToState();
              e.success(e.data);
            },
            update: function (e) {
              if (self.griddata.find(x => x.name === e.data.name)) {
                e.error({ errorMsg: `${e.data.name} already exists!` });
                return;
              }
              const objIndex = self.griddata.findIndex((obj => obj.id == e.data.id));
              self.griddata[objIndex] = e.data;
              self.profileRecords[self.activeModelIndex].model.categories[self.activeCategoryIndex].components = self.griddata.map(({ id, ...rest }) => rest);
              self.saveProfileRecordsToState();
              e.success();
            },
            destroy: function (e) {
              const objIndex = self.griddata.findIndex((obj => obj.id == e.data.id));
              self.griddata.splice(objIndex, 1);
              self.profileRecords[self.activeModelIndex].model.categories[self.activeCategoryIndex].components = self.griddata.map(({ id, ...rest }) => rest);
              self.saveProfileRecordsToState();
              e.success();
            }
          },
          error: function (e) {
            alert("Error: " + e?.xhr?.errorMsg);
          },
          pageSize: this.getPageSize(),
          batch: false,
          schema: {
            model: {
              id: "id",
              fields: {
                id: { editable: false, nullable: true },
                name: { type: "string", validation: { required: true } },
                weight: { type: "number" }
              }
            }
          }
        };
      case 4:
        self.griddata = self.profileRecords[self.activeModelIndex].model.categories[self.activeCategoryIndex].components[self.activeComponentIndex].riskFactors.map((x, i) => ({ id: i + 1, ...x }));
        nextId = self.griddata.length + 1;
        return {
          transport: {
            read: function (e) {
              e.success(self.griddata);
            },
            create: function (e) {
              if (self.griddata.find(x => x.question === e.data.question)) {
                e.error({ errorMsg: `${e.data.question} already exists!` });
                return;
              }
              e.data.id = nextId++;
              self.griddata.push(e.data);
              self.profileRecords[self.activeModelIndex].model.categories[self.activeCategoryIndex].components[self.activeComponentIndex].riskFactors = self.griddata.map(({ id, ...rest }) => ({ ...rest, answers: rest.answers ? rest.answers : [] }));
              self.saveProfileRecordsToState();
              e.success(e.data);
            },
            update: function (e) {
              if (self.griddata.find(x => x.question === e.data.question)) {
                e.error({ errorMsg: `${e.data.question} already exists!` });
                return;
              }
              const objIndex = self.griddata.findIndex((obj => obj.id == e.data.id));
              self.griddata[objIndex] = e.data;
              self.profileRecords[self.activeModelIndex].model.categories[self.activeCategoryIndex].components[self.activeComponentIndex].riskFactors = self.griddata.map(({ id, ...rest }) => rest);
              self.saveProfileRecordsToState();
              e.success();
            },
            destroy: function (e) {
              const objIndex = self.griddata.findIndex((obj => obj.id == e.data.id));
              self.griddata.splice(objIndex, 1);
              self.profileRecords[self.activeModelIndex].model.categories[self.activeCategoryIndex].components[self.activeComponentIndex].riskFactors = self.griddata.map(({ id, ...rest }) => rest);
              self.saveProfileRecordsToState();
              e.success();
            }
          },
          error: function (e) {
            alert("Error: " + e?.xhr?.errorMsg);
          },
          pageSize: this.getPageSize(),
          batch: false,
          schema: {
            model: {
              id: "id",
              fields: {
                id: { editable: false, nullable: true },
                question: { type: "string", validation: { required: true } },
                answerType: { defaultValue: 'Answer' },
              }
            }
          }
        };
      case 5:
        self.griddata = self.profileRecords[self.activeModelIndex].model.categories[self.activeCategoryIndex].components[self.activeComponentIndex].riskFactors[self.activeRiskFactorIndex].answers.map((x, i) => ({ id: i + 1, ...x }));
        nextId = self.griddata.length + 1;
        return {
          transport: {
            read: function (e) {
              e.success(self.griddata);
            },
            create: function (e) {
              if (self.griddata.find(x => x.value === e.data.value)) {
                e.error({ errorMsg: `${e.data.value} already exists!` });
                return;
              }
              e.data.id = nextId++;
              self.griddata.push(e.data);
              self.profileRecords[self.activeModelIndex].model.categories[self.activeCategoryIndex].components[self.activeComponentIndex].riskFactors[self.activeRiskFactorIndex].answers = self.griddata.map(({ id, ...rest }) => rest);
              self.saveProfileRecordsToState();
              e.success(e.data);
            },
            update: function (e) {
              if (self.griddata.find(x => x.value === e.data.value)) {
                e.error({ errorMsg: `${e.data.value} already exists!` });
                return;
              }
              const objIndex = self.griddata.findIndex((obj => obj.id == e.data.id));
              self.griddata[objIndex] = e.data;
              self.profileRecords[self.activeModelIndex].model.categories[self.activeCategoryIndex].components[self.activeComponentIndex].riskFactors[self.activeRiskFactorIndex].answers = self.griddata.map(({ id, ...rest }) => rest);
              self.saveProfileRecordsToState();
              e.success();
            },
            destroy: function (e) {
              const objIndex = self.griddata.findIndex((obj => obj.id == e.data.id));
              self.griddata.splice(objIndex, 1);
              self.profileRecords[self.activeModelIndex].model.categories[self.activeCategoryIndex].components[self.activeComponentIndex].riskFactors[self.activeRiskFactorIndex].answers = self.griddata.map(({ id, ...rest }) => rest);
              self.saveProfileRecordsToState();
              e.success();
            }
          },
          error: function (e) {
            alert("Error: " + e?.xhr?.errorMsg);
          },
          pageSize: this.getPageSize(),
          batch: false,
          schema: {
            model: {
              id: "id",
              fields: {
                id: { editable: false, nullable: true },
                value: { type: "string", validation: { required: true } },
                confidenceScore: { type: "number" }
              }
            }
          }
        };
      default:
        break;
    }
  }

  goToLevelDownById(id: number) {
    this.selectItem(this.griddata.findIndex(x => x.id === id));
  }

  goToLevelDownByName(name: string) {
    this.selectItem(this.griddata.findIndex(x => x.name === name));
  }

  goToLevelDownByQuestion(question: string) {
    this.selectItem(this.griddata.findIndex(x => x.question === question));
  }

  getProfileStatus(id: number) {
    const item = this.griddata.find(x => x.id === id);
    return this.getModelStatus(item ? item.model : null);
  }

  answerTypeDropDownEditor(container, options) {
    const self = this;
    (<any>$('<input required data-text-field="value" data-value-field="key" data-bind="value:' + options.field + '"/>')
    .appendTo(container))
    .kendoDropDownList({
      dataSource: {
        transport: {
          read: function (e) {
            e.success(self.answerTypes);
          }
        }
      }
    });
  }
}
