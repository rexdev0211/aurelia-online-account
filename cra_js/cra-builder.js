import {autoinject, observable} from 'aurelia-framework';
import {connectTo, dispatchify} from 'aurelia-store';
import {CRAApi} from './common/dtos/cra-api.dtos';
import {CraController} from './cra-controller.js';

const initProfileRecord = {
    name: '',
    ern: '',
    principalERN: '',
    createdDate: null,
    model: {
        name: '',
        categories: []
    }
};

const initCategory = {
    name: '',
    calculatedScore: 0,
    components: []
}

const initComponent = {
    name: '',
    nonZeroFactorAnswers: 0,
    calcFactorOverrideCount: 0,
    calcFactorWeight: 0,
    calcRawScore: 0,
    calculatedScore: 0,
    riskFactors: []
}

const initRiskFactor = {
    name: '',
    question: '',
    answers: [],
    answerType: CRAApi.RiskAnswerType.Answer,
    selectedAnswer: null,
    confidenceScore: 0
}

const initAnswer = {
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

@connectTo()
@autoinject()
export class CraBuilder extends CraController {
    @observable stateCra;
    isLoaded = false;
    griddata = [];
    profileRecords = [];
    newProfileRecord = initProfileRecord;
    newCategory = initCategory;
    newComponent = initComponent;
    newRiskFactor = initRiskFactor;
    newAnswer = initAnswer;
    activeLevelIndex = 1;
    activeModelIndex = -1;
    activeCategoryIndex = -1;
    activeComponentIndex = -1;
    activeRiskFactorIndex = -1;

    profileRecordLabels = Object.values(profileRecordForm);
    profileRecordProperties = Object.keys(profileRecordForm);
    categoryLabels = Object.values(categoryForm);
    categoryProperties = Object.keys(categoryForm);
    componentLabels = Object.values(componentForm);
    componentProperties = Object.keys(componentForm);
    riskFactorLabels = Object.values(riskFactorForm);
    riskFactorProperties = Object.keys(riskFactorForm);
    answerLabels = Object.values(answerForm);
    answerProperties = Object.keys(answerForm);

    constructor() {
        super();
    }

    async bind() {
        await dispatchify('getCRAProfileRecords')();
    }

    stateChanged(newValue) {
        this.stateCra = newValue.cra;
    }

    stateCraChanged(newValue, oldValue) {
        if (newValue) {
            if (newValue.profileRecords && !this.profileRecords) {
                this.profileRecords = this.state.cra.profileRecords;
                console.log('profileRecords', this.profileRecords);
                this.isLoaded = true;
            }
        }
    }
    attached() {
        this.profileRecords = this.state.cra.profileRecords;
        console.log('profileRecords', this.profileRecords);
        this.isLoaded = true;
    }

    async saveProfileRecordsToState() {
        await dispatchify('setCRAProfileRecords')(this.profileRecords);
    }

    moveToLevel(activeLevelIndex) {
        this.activeLevelIndex = activeLevelIndex;
    }

    selectItem(index) {
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
        this.activeLevelIndex++;
    }

    removeItem(index) {
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
        console.log('profileRecords-remain', this.profileRecords);
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
        console.log('newProfileRecord', this.newProfileRecord);
    }

    addNewModel() {
        this.newProfileRecord.name = this.newProfileRecord.model.name;
        this.newProfileRecord.ern = `ERN-${this.profileRecords.length + 1}`;
        this.newProfileRecord.principalERN = `principalERN-${this.profileRecords.length + 1}`;
        this.newProfileRecord.createdDate = new Date().getTime();
        this.profileRecords.push(this.newProfileRecord);
        this.profileRecords = [...this.profileRecords];
        console.log('profileRecords', this.profileRecords);
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
        console.log('profileRecords', this.profileRecords);
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
        console.log('profileRecords', this.profileRecords);
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
        console.log('profileRecords', this.profileRecords);
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
        console.log('profileRecords', this.profileRecords);
        this.initializeNewAnswer();
        this.saveProfileRecordsToState();
    }

    getKendoGridDataSource() {
        const self = this;
        let nextId = 1;
        switch (self.activeLevelIndex) {
            case 1:
                self.griddata = self.profileRecords.map((x, i) => ({id: i + 1, ...x}));
                nextId = self.griddata.length + 1;
                return {
                    transport: {
                        read: function (e) {
                            e.success(self.griddata);
                        },
                        create: function (e) {
                            e.data.id = nextId++;
                            self.griddata.push(e.data);
                            self.profileRecords = self.griddata.map(({id, ...rest}) => ({
                                ...rest,
                                model: {name: rest.name, categories: []}
                            }));
                            self.saveProfileRecordsToState();
                            e.success(e.data);
                        },
                        update: function (e) {
                            const objIndex = self.griddata.findIndex((obj => obj.id == e.data.id));
                            self.griddata[objIndex] = e.data;
                            self.profileRecords = self.griddata.map(({id, ...rest}) => rest);
                            self.saveProfileRecordsToState();
                            e.success();
                        },
                        destroy: function (e) {
                            const objIndex = self.griddata.findIndex((obj => obj.id == e.data.id));
                            self.griddata.splice(objIndex, 1);
                            self.profileRecords = self.griddata.map(({id, ...rest}) => rest);
                            self.saveProfileRecordsToState();
                            e.success();
                        }
                    },
                    error: function (e) {
                        alert("Status: " + e.status + "; Error message: " + e.errorThrown);
                    },
                    pageSize: this.getPageSize(),
                    batch: false,
                    schema: {
                        model: {
                            id: "id",
                            fields: {
                                id: {editable: false, nullable: true},
                                name: {type: "string", validation: {required: true}}
                            }
                        }
                    }
                };
            case 2:
                self.griddata = self.profileRecords[self.activeModelIndex].model.categories.map((x, i) => ({id: i + 1, ...x}));
                nextId = self.griddata.length + 1;
                return {
                    transport: {
                        read: function (e) {
                            e.success(self.griddata);
                        },
                        create: function (e) {
                            e.data.id = nextId++;
                            self.griddata.push(e.data);
                            self.profileRecords[self.activeModelIndex].model.categories = self.griddata.map(({
                                                                                                                 id,
                                                                                                                 ...rest
                                                                                                             }) => ({
                                ...rest,
                                components: []
                            }));
                            self.saveProfileRecordsToState();
                            e.success(e.data);
                        },
                        update: function (e) {
                            const objIndex = self.griddata.findIndex((obj => obj.id == e.data.id));
                            self.griddata[objIndex] = e.data;
                            self.profileRecords[self.activeModelIndex].model.categories = self.griddata.map(({id, ...rest}) => rest);
                            self.saveProfileRecordsToState();
                            e.success();
                        },
                        destroy: function (e) {
                            const objIndex = self.griddata.findIndex((obj => obj.id == e.data.id));
                            self.griddata.splice(objIndex, 1);
                            self.profileRecords[self.activeModelIndex].model.categories = self.griddata.map(({id, ...rest}) => rest);
                            self.saveProfileRecordsToState();
                            e.success();
                        }
                    },
                    error: function (e) {
                        alert("Status: " + e.status + "; Error message: " + e.errorThrown);
                    },
                    pageSize: this.getPageSize(),
                    batch: false,
                    schema: {
                        model: {
                            id: "id",
                            fields: {
                                id: {editable: false, nullable: true},
                                name: {type: "string", validation: {required: true}},
                                weight: {type: "number"}
                            }
                        }
                    }
                };
            case 3:
                console.log('self.activeCategoryIndex', self.activeCategoryIndex);
                self.griddata = self.profileRecords[self.activeModelIndex].model.categories[self.activeCategoryIndex].components.map((x, i) => ({id: i + 1, ...x}));
                nextId = self.griddata.length + 1;
                return {
                    transport: {
                        read: function (e) {
                            e.success(self.griddata);
                        },
                        create: function (e) {
                            e.data.id = nextId++;
                            self.griddata.push(e.data);
                            self.profileRecords[self.activeModelIndex].model.categories[self.activeCategoryIndex].components = self.griddata.map(({
                                                                                                                                                      id,
                                                                                                                                                      ...rest
                                                                                                                                                  }) => ({
                                ...rest,
                                riskFactors: []
                            }));
                            self.saveProfileRecordsToState();
                            e.success(e.data);
                        },
                        update: function (e) {
                            const objIndex = self.griddata.findIndex((obj => obj.id == e.data.id));
                            self.griddata[objIndex] = e.data;
                            self.profileRecords[self.activeModelIndex].model.categories[self.activeCategoryIndex].components = self.griddata.map(({
                                                                                                                                                      id,
                                                                                                                                                      ...rest
                                                                                                                                                  }) => rest);
                            self.saveProfileRecordsToState();
                            e.success();
                        },
                        destroy: function (e) {
                            const objIndex = self.griddata.findIndex((obj => obj.id == e.data.id));
                            self.griddata.splice(objIndex, 1);
                            self.profileRecords[self.activeModelIndex].model.categories[self.activeCategoryIndex].components = self.griddata.map(({
                                                                                                                                                      id,
                                                                                                                                                      ...rest
                                                                                                                                                  }) => rest);
                            self.saveProfileRecordsToState();
                            e.success();
                        }
                    },
                    error: function (e) {
                        alert("Status: " + e.status + "; Error message: " + e.errorThrown);
                    },
                    pageSize: this.getPageSize(),
                    batch: false,
                    schema: {
                        model: {
                            id: "id",
                            fields: {
                                id: {editable: false, nullable: true},
                                name: {type: "string", validation: {required: true}},
                                weight: {type: "number"}
                            }
                        }
                    }
                };
            case 4:
                console.log('self.activeComponentIndex', self.activeComponentIndex);
                console.log('data', self.profileRecords[self.activeModelIndex].model.categories[self.activeCategoryIndex].components[self.activeComponentIndex]);
                self.griddata = self.profileRecords[self.activeModelIndex].model.categories[self.activeCategoryIndex].components[self.activeComponentIndex].riskFactors.map((x, i) => ({id: i + 1, ...x}));
                console.log('griddata', self.griddata);
                nextId = self.griddata.length + 1;
                return {
                    transport: {
                        read: function (e) {
                            e.success(self.griddata);
                        },
                        create: function (e) {
                            e.data.id = nextId++;
                            self.griddata.push(e.data);
                            self.profileRecords[self.activeModelIndex].model.categories[self.activeCategoryIndex].components[self.activeComponentIndex].riskFactors = self.griddata.map(({
                                                                                                                                                                                             id,
                                                                                                                                                                                             ...rest
                                                                                                                                                                                         }) => ({
                                ...rest,
                                answers: []
                            }));
                            self.saveProfileRecordsToState();
                            e.success(e.data);
                        },
                        update: function (e) {
                            const objIndex = self.griddata.findIndex((obj => obj.id == e.data.id));
                            self.griddata[objIndex] = e.data;
                            self.profileRecords[self.activeModelIndex].model.categories[self.activeCategoryIndex].components[self.activeComponentIndex].riskFactors = self.griddata.map(({
                                                                                                                                                                                             id,
                                                                                                                                                                                             ...rest
                                                                                                                                                                                         }) => rest);
                            self.saveProfileRecordsToState();
                            e.success();
                        },
                        destroy: function (e) {
                            const objIndex = self.griddata.findIndex((obj => obj.id == e.data.id));
                            self.griddata.splice(objIndex, 1);
                            self.profileRecords[self.activeModelIndex].model.categories[self.activeCategoryIndex].components[self.activeComponentIndex].riskFactors = self.griddata.map(({
                                                                                                                                                                                             id,
                                                                                                                                                                                             ...rest
                                                                                                                                                                                         }) => rest);
                            self.saveProfileRecordsToState();
                            e.success();
                        }
                    },
                    error: function (e) {
                        alert("Status: " + e.status + "; Error message: " + e.errorThrown);
                    },
                    pageSize: this.getPageSize(),
                    batch: false,
                    schema: {
                        model: {
                            id: "id",
                            fields: {
                                id: {editable: false, nullable: true},
                                question: {type: "string", validation: {required: true}},
                                answerType: {type: "string", validation: {required: true}}
                            }
                        }
                    }
                };
            case 5:
                console.log('self.activeRiskFactorIndex', self.activeRiskFactorIndex);
                self.griddata = self.profileRecords[self.activeModelIndex].model.categories[self.activeCategoryIndex].components[self.activeComponentIndex].riskFactors[self.activeRiskFactorIndex].answers.map((x, i) => ({id: i + 1, ...x}));
                console.log('griddata', self.griddata);
                nextId = self.griddata.length + 1;
                return {
                    transport: {
                        read: function (e) {
                            e.success(self.griddata);
                        },
                        create: function (e) {
                            e.data.id = nextId++;
                            self.griddata.push(e.data);
                            self.profileRecords[self.activeModelIndex].model.categories[self.activeCategoryIndex].components[self.activeComponentIndex].riskFactors[self.activeRiskFactorIndex].answers = self.griddata.map(({
                                                                                                                                                                                                                                 id,
                                                                                                                                                                                                                                 ...rest
                                                                                                                                                                                                                             }) => rest);
                            self.saveProfileRecordsToState();
                            e.success(e.data);
                        },
                        update: function (e) {
                            const objIndex = self.griddata.findIndex((obj => obj.id == e.data.id));
                            self.griddata[objIndex] = e.data;
                            self.profileRecords[self.activeModelIndex].model.categories[self.activeCategoryIndex].components[self.activeComponentIndex].riskFactors[self.activeRiskFactorIndex].answers = self.griddata.map(({
                                                                                                                                                                                                                                 id,
                                                                                                                                                                                                                                 ...rest
                                                                                                                                                                                                                             }) => rest);
                            self.saveProfileRecordsToState();
                            e.success();
                        },
                        destroy: function (e) {
                            const objIndex = self.griddata.findIndex((obj => obj.id == e.data.id));
                            self.griddata.splice(objIndex, 1);
                            self.profileRecords[self.activeModelIndex].model.categories[self.activeCategoryIndex].components[self.activeComponentIndex].riskFactors[self.activeRiskFactorIndex].answers = self.griddata.map(({
                                                                                                                                                                                                                                 id,
                                                                                                                                                                                                                                 ...rest
                                                                                                                                                                                                                             }) => rest);
                            self.saveProfileRecordsToState();
                            e.success();
                        }
                    },
                    error: function (e) {
                        alert("Status: " + e.status + "; Error message: " + e.errorThrown);
                    },
                    pageSize: this.getPageSize(),
                    batch: false,
                    schema: {
                        model: {
                            id: "id",
                            fields: {
                                id: {editable: false, nullable: true},
                                value: {type: "string", validation: {required: true}},
                                confidenceScore: {type: "number"}
                            }
                        }
                    }
                };
            default:
                break;
        }
    }

    goToLevelDownById(id) {
        console.log('id', id);
        console.log('index', this.griddata.findIndex(x => x.id === id));
        this.selectItem(this.griddata.findIndex(x => x.id === id));
    }

    goToLevelDownByName(name) {
        console.log('name', name);
        this.selectItem(this.griddata.findIndex(x => x.name === name));
    }

    goToLevelDownByQuestion(question) {
        console.log('question', question);
        this.selectItem(this.griddata.findIndex(x => x.question === question));
    }

    getProfileStatus(id) {
        console.log('aaa-id', id);
        return 'Active';
    }
}
