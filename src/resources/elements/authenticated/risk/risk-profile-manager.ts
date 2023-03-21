import {BaseElement} from '../../../../bases/base-element';
import {OnlineAccountApi} from "../../../../dtos/onlineaccount-api.dtos";
import Enumerable from "linq";
import {observable} from "aurelia-framework";
import RiskConfigRequest = OnlineAccountApi.RiskConfigRequest;
import RiskModelRequest = OnlineAccountApi.RiskModelRequest;
import RiskModelCollectionRequest = OnlineAccountApi.RiskModelCollectionRequest;
import RiskCategoryRequest = OnlineAccountApi.RiskCategoryRequest;
import RiskComponentRequest = OnlineAccountApi.RiskComponentRequest;
import RiskFactorRequest = OnlineAccountApi.RiskFactorRequest;
import RiskAnswerRequest = OnlineAccountApi.RiskAnswerRequest;
import RiskOverrideRequest = OnlineAccountApi.RiskOverrideRequest;
import ListRiskModelRequest = OnlineAccountApi.ListRiskModelRequest;
import ListRiskCategoryRequest = OnlineAccountApi.ListRiskCategoryRequest;
import ListRiskComponentRequest = OnlineAccountApi.ListRiskComponentRequest;
import ListRiskFactorRequest = OnlineAccountApi.ListRiskFactorRequest;
import ListRiskAnswerRequest = OnlineAccountApi.ListRiskAnswerRequest;
import ListRiskOverrideRequest = OnlineAccountApi.ListRiskOverrideRequest;
import RiskModelType = OnlineAccountApi.RiskModelType;
import RiskModelState = OnlineAccountApi.RiskModelState;
import RiskAnswerType = OnlineAccountApi.RiskAnswerType;
import RiskOverrideTerm = OnlineAccountApi.RiskOverrideTerm;
import RiskOverrideOperatorType = OnlineAccountApi.RiskOverrideOperatorType;
import RiskOverrideCompareSymbolType = OnlineAccountApi.RiskOverrideCompareSymbolType;

export class RiskProfileManagerCustomElement extends BaseElement {
    @observable selectedBusiness;
    @observable riskConfig: OnlineAccountApi.RiskConfigRecord;
    @observable riskProfiles: OnlineAccountApi.RiskModelRecord[];
    @observable riskProfilesFiltered: OnlineAccountApi.RiskModelRecord[];
    @observable riskCategories: OnlineAccountApi.RiskCategoryRecord[];
    @observable riskComponents: OnlineAccountApi.RiskComponentRecord[];
    @observable riskFactors: OnlineAccountApi.RiskFactorRecord[];
    @observable riskAnswers: OnlineAccountApi.RiskAnswerRecord[];
    @observable riskOverrides: OnlineAccountApi.RiskOverrideRecord[];
    @observable riskComponentsOverride: OnlineAccountApi.RiskComponentRecord[] = [];
    @observable riskFactorsOverride: OnlineAccountApi.RiskFactorRecord[] = [];
    @observable riskModelCollection: OnlineAccountApi.RiskModelCollection;
    @observable riskComponentsAll: OnlineAccountApi.RiskComponentRecord[];
    @observable riskFactorsAll: OnlineAccountApi.RiskFactorRecord[];
    @observable riskAnswersAll: OnlineAccountApi.RiskAnswerRecord[];

    private businessRecords: OnlineAccountApi.CustomerBusinessLookup[];
    private businessCode: string;

    private isLoadedOfRiskProfiles: boolean = false;
    private isLoadedOfRiskCategories: boolean = false;
    private isLoadedOfRiskComponents: boolean = false;
    @observable isLoadedOfRiskFactors: boolean = false;
    @observable isLoadedOfRiskAnswers: boolean = false;
    @observable isLoadedOfRiskOverrides: boolean = false;
    @observable selectedRiskCategoryOverrideERN: string = '';
    @observable selectedRiskComponentOverrideERN: string = '';
    @observable selectedRiskFactorOverrideERN: string = '';
    @observable isLoadedOfRiskComponentsOverrride: boolean = false;
    @observable activeLevelIndex: number = 1;
    private pageSize: number = 10;
    private pageable = {
        refresh: true,
        pageSizes: true,
        buttonCount: 10
    };
    private types = Object.entries(RiskModelType).map(([key, value]) => ({ key, value }));
    private states = Object.entries(RiskModelState).map(([key, value]) => ({ key, value }));
    private answerTypes = Object.entries(RiskAnswerType).map(([key, value]) => ({ key, value }));
    private levels = [{ title:'Profiles', invalid: false }];
    private activeModelERN: string = '';
    private activeCategoryERN: string = '';
    private activeComponentERN: string = '';
    private activeRiskFactorERN: string = '';
    @observable isCRAEnabled: boolean = false;
    @observable isBWRAEnabled: boolean = false;
    @observable activeRiskModelType: string = '';
    @observable overridesGrid;
    private overridesParentGrid;
    private profilesGrid;
    private profilesFilterGrid;
    private categoriesGrid;
    private componentsGrid;
    private factorsGrid;
    private answersGrid;
    private activeRiskOverride;
    private that;

    private sortCategoriesDialog;
    private sortComponentsDialog;
    private sortFactorsDialog;
    private sortAnswersDialog;
    private sortOverridesDialog;
    private sortingActions = [
        { 
            text: 'Cancel' 
        },
        { 
            text: 'Save changes', 
            action: async (e) => {
                switch (this.activeLevelIndex) {
                    case 3:
                        this.riskCategories = await Promise.all(this.riskCategories.map(async (item, index) => {
                            const response = await this.updateRiskCategory({ ...item, sortOrder: index });
                            return response.result;
                        }));
                        this.categoriesGrid.dataSource.read();
                        break;
                    case 4:
                        this.riskComponents = await Promise.all(this.riskComponents.map(async (item, index) => {
                            const response = await this.updateRiskComponent({ ...item, sortOrder: index });
                            return response.result;
                        }));
                        this.componentsGrid.dataSource.read();
                        break;
                    case 5:
                        this.riskFactors = await Promise.all(this.riskFactors.map(async (item, index) => {
                            const response = await this.updateRiskFactor({ ...item, sortOrder: index });
                            return response.result;
                        }));
                        this.factorsGrid.dataSource.read();
                        break;
                    case 6:
                        this.riskAnswers = await Promise.all(this.riskAnswers.map(async (item, index) => {
                            const response = await this.updateRiskAnswer({ ...item, sortOrder: index });
                            return response.result;
                        }));
                        this.answersGrid.dataSource.read();
                        break;
                    case 7:
                        this.riskOverrides = await Promise.all(this.riskOverrides.map(async (item, index) => {
                            const response = await this.updateRiskOverride({ ...item, sortOrder: index });
                            return response.result;
                        }));
                        if (this.overridesParentGrid) {
                            this.overridesParentGrid.dataSource.read();
                        } else {
                            this.overridesGrid.dataSource.read();
                        }
                        break;
                    default:
                        break;
                }
            },
            primary: true,
        }
    ];

    constructor(...args) {
        super(...args);
        this.that = this;
    }

    async attached() {
        // Sample code to get the current user config
        // We will want to move this logic to state inside data-store.ts and kick it off with a dispatchify('loadRiskConfig')();

        this.businessRecords = Enumerable
            .from(this.state.customerSummary.aclClaims)
            .where(x => x.operation.startsWith('Risk Profile Manager'))
            .select(x => Enumerable.from(this.state.customerSummary.businesses).firstOrDefault(y => y.ern === x.resource))
            .toArray();

        if (this.businessRecords.length === 1) this.selectedBusiness = this.businessRecords[0].code;
        // if we have more than one, we need to show them the list, so they can choose which one they want to use.
    }

    async selectedBusinessChanged(businessCode) {
        if (!businessCode) return;

        let getRequest = await this.serviceClients.onlineAccountApi.get(new RiskConfigRequest({owner: businessCode}));
        // if not existing, lets create one
        if (!getRequest.result) {
            let postRequest = await this.serviceClients.onlineAccountApi.post(new RiskConfigRequest({owner: businessCode}));
            if (postRequest.result) {
                this.riskConfig = postRequest.result;
            }
        } else {
            this.riskConfig = getRequest.result;
        }
    }

    async riskConfigChanged(newValue) {
        let businessCode = newValue.owners[0];
        this.businessCode = businessCode;

        let riskProfilesResponse = this.serviceClients.onlineAccountApi.get(new ListRiskModelRequest({owner: businessCode}));

        await riskProfilesResponse;

        // let's set the risk profiles
        riskProfilesResponse.then(response => {this.riskProfiles = response.results; this.isLoadedOfRiskProfiles = true; console.log('riskProfiles', this.riskProfiles)});
    }

    getKendoGridDataSource() {
        const self = this;
        switch (self.activeLevelIndex) {
            case 1:
                return {
                    transport: {
                        read: function (e) {
                            e.success(self.riskProfiles.map(item => ({ ...item, visible: (item.state !== RiskModelState.Approved || self.riskProfiles?.findIndex(item2 => item2.previousERN === item.ern) === -1) })).sort((a, b) => b.createdDate - a.createdDate));
                        },
                        create: async (e) => {
                            if (self.riskProfiles.find(x => x.name === e.data.name && x.type === e.data.type.value)) {
                                await self.notificationService.showMessage('warning', 'Validation Warning', 'Duplicate Name');
                                e.error({ errorMsg: 'Duplicate Name' });
                            } else {
                                try {
                                    const rowData = { ...e.data, type: e.data.type.value, isModelValid: false };
                                    const response = await self.addRiskModel(rowData);
                                    console.log('addRiskModel', response.result);
                                    const addModel = { ...response.result, createdDate: new Date().getTime(), isModelValid: false };
                                    self.riskProfiles.push(addModel);
                                    console.log('profilesGrid', self.profilesGrid);
                                    self.profilesGrid.dataSource.read();
                                    e.success(addModel);
                                } catch (error) {
                                    e.error({ errorMsg: error.responseStatus?.message });
                                }
                            }
                        },
                        update: async (e) => {
                            console.log('updateRiskModelRequest', e.data);
                            const objIndex = self.riskProfiles.findIndex((obj => obj.ern == e.data.ern));
                            if (self.riskProfiles[objIndex].state !== e.data.state) {
                                try {
                                    const response = await self.updateRiskModelState(e.data);
                                    console.log('updateRiskModelStateResponse', response);
                                    if (self.riskProfiles[objIndex].state === RiskModelState.Approved && e.data.state === RiskModelState.Draft) {
                                        self.riskProfiles.push({ ...response.result, createdDate: new Date().getTime(), isModelValid: true });
                                        self.profilesGrid.dataSource.read();
                                    } else if (self.riskProfiles[objIndex].state === RiskModelState.Submitted && e.data.state === RiskModelState.Approved && self.riskProfiles[objIndex].version > 1) {
                                        let riskProfilesResponse = await self.serviceClients.onlineAccountApi.get(new ListRiskModelRequest({owner: self.businessCode}));

                                        self.riskProfiles = riskProfilesResponse.results;
                                        self.profilesGrid.dataSource.read();
                                    } else {
                                        self.riskProfiles[objIndex] = response.result;
                                    }
                                } catch (error) {
                                    e.error({ errorMsg: error.responseStatus?.message });
                                }
                            } else {
                                if (self.riskProfiles.find(x => x.ern !== e.data.ern && x.type === e.data.type && x.name === e.data.name)) {
                                    await self.notificationService.showMessage('warning', 'Validation Warning', 'Duplicate Name');
                                    e.error({ errorMsg: `${e.data.name} already exists!` });
                                    return;
                                }
                                try {
                                    const response = await self.updateRiskModel(e.data);
                                    console.log('updateRiskModelResponse', response);
                                    self.riskProfiles[objIndex] = response.result;
                                } catch (error) {
                                    e.error({ errorMsg: error.responseStatus?.message });
                                }
                            }
                            
                            e.success();
                        },
                        destroy: async (e) => {
                            try {
                                const response = await self.deleteRiskModel(e.data);
                                const objIndex = self.riskProfiles.findIndex((obj => obj.ern == response.result.ern));
                                self.riskProfiles.splice(objIndex, 1);
                                self.profilesGrid.dataSource.read();
                                e.success();
                            } catch (error) {
                                e.error({ errorMsg: error.responseStatus?.message });
                            }
                        }
                    },
                    error: function (e) {
                        console.log("Error: " + e?.xhr?.errorMsg);
                    },
                    pageSize: self.pageSize,
                    batch: false,
                    schema: {
                        model: {
                            id: "ern",
                            fields: {
                                ern: { editable: false, nullable: true },
                                name: { type: "string", validation: { required: true } },
                                version: { editable: false }
                            }
                        }
                    }
                };
            case 2:
                return {
                    transport: {
                        read: function (e) {
                            e.success(self.riskProfiles.filter(x => x.type === self.activeRiskModelType).map(item => ({ ...item, visible: (item.state !== RiskModelState.Approved || self.riskProfiles?.findIndex(item2 => item2.previousERN === item.ern) === -1) })).sort((a, b) => b.createdDate - a.createdDate));
                        },
                        create: async (e) => {
                            if (self.riskProfiles.find(x => x.type === self.activeRiskModelType && x.name === e.data.name)) {
                                await self.notificationService.showMessage('warning', 'Validation Warning', 'Duplicate Name');
                                e.error({ errorMsg: 'Duplicate Name' });
                            } else {
                                try {
                                    const rowData = { ...e.data, type: e.data.type.value, isModelValid: false };
                                    const response = await self.addRiskModel(rowData);
                                    console.log('addRiskModel', response.result);
                                    const addModel = { ...response.result, createdDate: new Date().getTime(), isModelValid: false };
                                    self.riskProfiles.push(addModel);
                                    self.profilesFilterGrid.dataSource.read();
                                    e.success(addModel);
                                } catch (error) {
                                    e.error({ errorMsg: error.responseStatus?.message });
                                }
                            }
                        },
                        update: async (e) => {
                            console.log('updateRiskModelRequest', e.data);
                            const objIndex = self.riskProfiles.findIndex((obj => obj.ern == e.data.ern));
                            if (self.riskProfiles[objIndex].state !== e.data.state) {
                                try {
                                    const response = await self.updateRiskModelState(e.data);
                                    console.log('updateRiskModelStateResponse', response);
                                    if (self.riskProfiles[objIndex].state === RiskModelState.Approved && e.data.state === RiskModelState.Draft) {
                                        self.riskProfiles.push({ ...response.result, createdDate: new Date().getTime(), isModelValid: true });
                                        self.profilesFilterGrid.dataSource.read();
                                    } else if (self.riskProfiles[objIndex].state === RiskModelState.Submitted && e.data.state === RiskModelState.Approved && self.riskProfiles[objIndex].version > 1) {
                                        let riskProfilesResponse = await self.serviceClients.onlineAccountApi.get(new ListRiskModelRequest({owner: self.businessCode}));
        
                                        self.riskProfiles = riskProfilesResponse.results;
                                        console.log('selfProfiles', self.riskProfiles);
                                        self.profilesFilterGrid.dataSource.read();
                                    } else {
                                        self.riskProfiles[objIndex] = response.result;
                                    }
                                } catch (error) {
                                    e.error({ errorMsg: error.responseStatus?.message });
                                }
                            } else {
                                if (self.riskProfiles.find(x => x.ern !== e.data.ern && x.type === self.activeRiskModelType && x.name === e.data.name)) {
                                    await self.notificationService.showMessage('warning', 'Validation Warning', 'Duplicate Name');
                                    e.error({ errorMsg: `${e.data.name} already exists!` });
                                    return;
                                }
                                try {
                                    const response = await self.updateRiskModel(e.data);
                                    console.log('updateRiskModelResponse', response);
                                    self.riskProfiles[objIndex] = response.result;
                                } catch (error) {
                                    e.error({ errorMsg: error.responseStatus?.message });
                                }
                            }
                            
                            e.success();
                        },
                        destroy: async (e) => {
                            try {
                                const response = await self.deleteRiskModel(e.data);
                                const objIndex = self.riskProfiles.findIndex((obj => obj.ern == response.result.ern));
                                self.riskProfiles.splice(objIndex, 1);
                                self.profilesFilterGrid.dataSource.read();
                                e.success();
                            } catch (error) {
                                e.error({ errorMsg: error.responseStatus?.message });
                            }
                        }
                    },
                    error: function (e) {
                        console.log("Error: " + e?.xhr?.errorMsg);
                    },
                    pageSize: self.pageSize,
                    batch: false,
                    schema: {
                        model: {
                            id: "ern",
                            fields: {
                                ern: { editable: false, nullable: true },
                                name: { type: "string", validation: { required: true } },
                                version: { editable: false }
                            }
                        }
                    }
                };
            case 3:
                return {
                    transport: {
                        read: function (e) {
                            e.success(self.riskCategories.map(obj => ({ ...obj, overrideWeight: Math.round(obj.overrideWeight * 100) })));
                        },
                        create: async (e) => {
                            if (self.riskCategories.find(x => x.name === e.data.name)) {
                                await self.notificationService.showMessage('warning', 'Validation Warning', 'Duplicate Name');
                                e.error({ errorMsg: `${e.data.name} already exists!` });
                                return;
                            }
                            try {
                                const rowData = { ...e.data, overrideWeight: e.data.overrideWeight / 100 };
                                if (!rowData.overrideWeight) delete rowData.overrideWeight;
                                const response = await self.addRiskCategory(rowData);
                                self.riskCategories.push(response.result);
                                self.categoriesGrid.dataSource.read();
                                self.categoriesGrid.dataSource.page(Math.ceil(self.riskCategories.length / self.pageSize));
                                // Validate Risk Model
                                await self.validateRiskModel();
                                e.success({ ...response.result, overrideWeight: Math.round(response.result.overrideWeight * 100) });
                            } catch (error) {
                                e.error({ errorMsg: error.responseStatus?.message });
                            }
                        },
                        update: async (e) => {
                            if (self.riskCategories.find(x => x.ern !== e.data.ern && x.name === e.data.name)) {
                                await self.notificationService.showMessage('warning', 'Validation Warning', 'Duplicate Name');
                                e.error({ errorMsg: `${e.data.name} already exists!` });
                                return;
                            }
                            try {
                                const rowData = { ...e.data, overrideWeight: e.data.overrideWeight / 100 };
                                if (!rowData.overrideWeight) delete rowData.overrideWeight;
                                const response = await self.updateRiskCategory(rowData);
                                const objIndex = self.riskCategories.findIndex((obj => obj.ern == response.result.ern));
                                self.riskCategories[objIndex] = response.result;
                                // Validate Risk Model
                                await self.validateRiskModel();
                                e.success({ ...response.result, overrideWeight: Math.round(response.result.overrideWeight * 100) });
                            } catch (error) {
                                e.error({ errorMsg: error.responseStatus?.message });
                            }
                        },
                        destroy: async (e) => {
                            try {
                                const response = await self.deleteRiskCategory(e.data);
                                const objIndex = self.riskCategories.findIndex((obj => obj.ern == response.result.ern));
                                self.riskCategories.splice(objIndex, 1);
                                // Validate Risk Model
                                await self.validateRiskModel();
                                e.success();
                            } catch (error) {
                                e.error({ errorMsg: error.responseStatus?.message });
                            }
                        }
                    },
                    error: function (e) {
                        console.log("Error: " + e?.xhr?.errorMsg);
                    },
                    pageSize: self.pageSize,
                    batch: false,
                    schema: {
                        model: {
                            id: "ern",
                            fields: {
                                ern: { editable: false, nullable: true },
                                name: { type: "string", validation: { required: true } }
                            }
                        }
                    }
                };
            case 4:
                return {
                    transport: {
                        read: function (e) {
                            e.success(self.riskComponents.map(obj => ({ ...obj, overrideWeight: Math.round(obj.overrideWeight * 100) })));
                        },
                        create: async (e) => {
                            if (self.riskComponents.find(x => x.name === e.data.name)) {
                                await self.notificationService.showMessage('warning', 'Validation Warning', 'Duplicate Name');
                                e.error({ errorMsg: `${e.data.name} already exists!` });
                                return;
                            }
                            try {
                                const rowData = { ...e.data, overrideWeight: e.data.overrideWeight / 100 };
                                if (!rowData.overrideWeight) delete rowData.overrideWeight;
                                const response = await self.addRiskComponent(rowData);
                                self.riskComponents.push(response.result);
                                self.riskComponentsAll.push(response.result);
                                self.componentsGrid.dataSource.read();
                                self.componentsGrid.dataSource.page(Math.ceil(self.riskComponents.length / self.pageSize));

                                // Validate Risk Category
                                const validCategory = self.isValidCategory(this.activeCategoryERN);
                                self.levels[3].invalid = !validCategory;

                                // Validate Risk Model
                                await self.validateRiskModel();
                                e.success({ ...response.result, overrideWeight: Math.round(response.result.overrideWeight * 100) });
                            } catch (error) {
                                e.error({ errorMsg: error.responseStatus?.message });
                            }
                        },
                        update: async (e) => {
                            if (self.riskComponents.find(x => x.ern !== e.data.ern && x.name === e.data.name)) {
                                await self.notificationService.showMessage('warning', 'Validation Warning', 'Duplicate Name');
                                e.error({ errorMsg: `${e.data.name} already exists!` });
                                return;
                            }
                            try {
                                console.log('update-data', e.data);
                                const rowData = { ...e.data, overrideWeight: e.data.overrideWeight / 100 }
                                if (!rowData.overrideWeight) delete rowData.overrideWeight;
                                const response = await self.updateRiskComponent(rowData);
                                const objIndex = self.riskComponents.findIndex((obj => obj.ern == response.result.ern));
                                self.riskComponents[objIndex] = response.result;
                                
                                const objIndexAll = self.riskComponentsAll.findIndex((obj => obj.ern == response.result.ern));
                                self.riskComponentsAll[objIndexAll] = response.result;

                                // Validate Risk Category
                                const validCategory = self.isValidCategory(this.activeCategoryERN);
                                self.levels[3].invalid = !validCategory;
                                
                                // Validate Risk Model
                                await self.validateRiskModel();
                                e.success({ ...response.result, overrideWeight: Math.round(response.result.overrideWeight * 100) });
                            } catch (error) {
                                e.error({ errorMsg: error.responseStatus?.message });
                            }
                        },
                        destroy: async (e) => {
                            try {
                                const response = await self.deleteRiskComponent(e.data);
                                const objIndex = self.riskComponents.findIndex((obj => obj.ern == response.result.ern));
                                self.riskComponents.splice(objIndex, 1);
                                
                                const objIndexAll = self.riskComponentsAll.findIndex((obj => obj.ern == response.result.ern));
                                self.riskComponentsAll.splice(objIndexAll, 1);

                                // Validate Risk Category
                                const validCategory = self.isValidCategory(this.activeCategoryERN);
                                self.levels[3].invalid = !validCategory;

                                // Validate Risk Model
                                await self.validateRiskModel();
                                e.success();
                            } catch (error) {
                                e.error({ errorMsg: error.responseStatus?.message });
                            }
                        }
                    },
                    error: function (e) {
                        console.log("Error: " + e?.xhr?.errorMsg);
                    },
                    pageSize: self.pageSize,
                    batch: false,
                    schema: {
                        model: {
                            id: "ern",
                            fields: {
                                ern: { editable: false, nullable: true },
                                name: { type: "string", validation: { required: true } }
                            }
                        }
                    }
                };
            case 5:
                return {
                    transport: {
                        read: function (e) {
                            e.success(self.riskFactors);
                        },
                        create: async (e) => {
                            if (self.riskFactors.find(x => x.question === e.data.question)) {
                                await self.notificationService.showMessage('warning', 'Validation Warning', 'Duplicate Question');
                                e.error({ errorMsg: `${e.data.question} already exists!` });
                                return;
                            }
                            try {
                                const rowData = { ...e.data };
                                if (self.activeRiskModelType === RiskModelType.CRA) {
                                    rowData.answerType = e.data.answerType;
                                } else {
                                    rowData.answerType = RiskAnswerType.Matrix;
                                }
                                console.log('rowData', rowData);
                                const response = await self.addRiskFactor(rowData);
                                self.riskFactors.push(response.result);
                                self.riskFactorsAll.push(response.result);
                                self.factorsGrid.dataSource.read();
                                self.factorsGrid.dataSource.page(Math.ceil(self.riskFactors.length / self.pageSize));
    
                                // Validate Risk Component
                                const validComponent = self.isValidComponent(this.activeComponentERN);
                                self.levels[4].invalid = !validComponent;
    
                                // Validate Risk Category
                                const validCategory = self.isValidCategory(this.activeCategoryERN);
                                self.levels[3].invalid = !validCategory;
    
                                // Validate Risk Model
                                await self.validateRiskModel();
                                
                                e.success(response.result);
                            } catch (error) {
                                e.error({ errorMsg: error.responseStatus?.message });
                            }
                        },
                        update: async (e) => {
                            if (self.riskFactors.find(x => x.ern !== e.data.ern && x.question === e.data.question)) {
                                await self.notificationService.showMessage('warning', 'Validation Warning', 'Duplicate Question');
                                e.error({ errorMsg: `${e.data.question} already exists!` });
                                return;
                            }
                            try {
                                const response = await self.updateRiskFactor(e.data);
                                const objIndex = self.riskFactors.findIndex((obj => obj.ern == response.result.ern));
                                self.riskFactors[objIndex] = response.result;
                                const objIndexAll = self.riskFactorsAll.findIndex((obj => obj.ern == response.result.ern));
                                self.riskFactorsAll[objIndexAll] = response.result;

                                // Validate Risk Component
                                const validComponent = self.isValidComponent(this.activeComponentERN);
                                self.levels[4].invalid = !validComponent;

                                // Validate Risk Category
                                const validCategory = self.isValidCategory(this.activeCategoryERN);
                                self.levels[3].invalid = !validCategory;

                                // Validate Risk Model
                                await self.validateRiskModel();
                                
                                e.success();
                            } catch (error) {
                                e.error({ errorMsg: error.responseStatus?.message });
                            }
                        },
                        destroy: async (e) => {
                            try {
                                const response = await self.deleteRiskFactor(e.data);
                                const objIndex = self.riskFactors.findIndex((obj => obj.ern == response.result.ern));
                                self.riskFactors.splice(objIndex, 1);
                                const objIndexAll = self.riskFactorsAll.findIndex((obj => obj.ern == response.result.ern));
                                self.riskFactorsAll.splice(objIndexAll, 1);
                                
                                // Validate Risk Component
                                const validComponent = self.isValidComponent(this.activeComponentERN);
                                self.levels[4].invalid = !validComponent;

                                // Validate Risk Category
                                const validCategory = self.isValidCategory(this.activeCategoryERN);
                                self.levels[3].invalid = !validCategory;

                                // Validate Risk Model
                                await self.validateRiskModel();
                                
                                e.success();
                            } catch (error) {
                                e.error({ errorMsg: error.responseStatus?.message });
                            }
                        }
                    },
                    error: function (e) {
                        console.log("Error: " + e?.xhr?.errorMsg);
                    },
                    pageSize: self.pageSize,
                    batch: false,
                    schema: {
                        model: {
                            id: "ern",
                            fields: {
                                ern: { editable: false, nullable: true },
                                question: { type: "string", validation: { required: true } },
                                answerType: { defaultValue: RiskAnswerType.Answer }
                            }
                        }
                    }
                };
            case 6:
                return {
                    transport: {
                        read: function (e) {
                            e.success(self.riskAnswers);
                        },
                        create: async (e) => {
                            if (self.riskAnswers.find(x => x.answer === e.data.answer)) {
                                await self.notificationService.showMessage('warning', 'Validation Warning', 'Duplicate Answer');
                                e.error({ errorMsg: `${e.data.answer} already exists!` });
                                return;
                            }
                            try {
                                const rowData = { ...e.data };
                                if (rowData.riskScore < 0) delete rowData.riskScore;
                                if (rowData.overrideScore < 1) delete rowData.overrideScore;
                                const response = await self.addRiskAnswer(rowData);
                                self.riskAnswers.push(response.result);
                                self.riskAnswersAll.push(response.result);
                                self.answersGrid.dataSource.read();
                                self.answersGrid.dataSource.page(Math.ceil(self.riskAnswers.length / self.pageSize));

                                // Validate Risk Factor
                                const validRiskFactor = self.isValidRiskFactor(this.activeRiskFactorERN);
                                self.levels[5].invalid = !validRiskFactor;

                                // Validate Risk Component
                                const validComponent = self.isValidComponent(this.activeComponentERN);
                                self.levels[4].invalid = !validComponent;

                                // Validate Risk Category
                                const validCategory = self.isValidCategory(this.activeCategoryERN);
                                self.levels[3].invalid = !validCategory;

                                // Validate Risk Model
                                await self.validateRiskModel();
                                
                                e.success(response.result);
                            } catch (error) {
                                e.error({ errorMsg: error.responseStatus?.message });
                            }
                        },
                        update: async (e) => {
                            if (self.riskAnswers.find(x => x.ern !== e.data.ern && x.answer === e.data.answer)) {
                                await self.notificationService.showMessage('warning', 'Validation Warning', 'Duplicate Answer');
                                e.error({ errorMsg: `${e.data.answer} already exists!` });
                                return;
                            }
                            try {
                                const rowData = { ...e.data };
                                if (rowData.riskScore < 0) delete rowData.riskScore;
                                if (rowData.overrideScore < 1) delete rowData.overrideScore;
                                const response = await self.updateRiskAnswer(rowData);
                                const objIndex = self.riskAnswers.findIndex((obj => obj.ern == response.result.ern));
                                self.riskAnswers[objIndex] = response.result;
                                const objIndexAll = self.riskAnswersAll.findIndex((obj => obj.ern == response.result.ern));
                                self.riskAnswersAll[objIndexAll] = response.result;

                                e.success();
                            } catch (error) {
                                e.error({ errorMsg: error.responseStatus?.message });
                            }
                        },
                        destroy: async (e) => {
                            try {
                                const response = await self.deleteRiskAnswer(e.data);
                                const objIndex = self.riskAnswers.findIndex((obj => obj.ern == response.result.ern));
                                self.riskAnswers.splice(objIndex, 1);

                                const objIndexAll = self.riskAnswersAll.findIndex((obj => obj.ern == response.result.ern));
                                self.riskAnswersAll.splice(objIndexAll, 1);

                                // Validate Risk Factor
                                const validRiskFactor = self.isValidRiskFactor(this.activeRiskFactorERN);
                                self.levels[5].invalid = !validRiskFactor;

                                // Validate Risk Component
                                const validComponent = self.isValidComponent(this.activeComponentERN);
                                self.levels[4].invalid = !validComponent;

                                // Validate Risk Category
                                const validCategory = self.isValidCategory(this.activeCategoryERN);
                                self.levels[3].invalid = !validCategory;

                                // Validate Risk Model
                                await self.validateRiskModel();
                                
                                e.success();
                            } catch (error) {
                                e.error({ errorMsg: error.responseStatus?.message });
                            }
                        }
                    },
                    error: function (e) {
                        console.log("Error: " + e?.xhr?.errorMsg);
                    },
                    pageSize: self.pageSize,
                    batch: false,
                    schema: {
                        model: {
                            id: "ern",
                            fields: {
                                ern: { editable: false, nullable: true },
                                answer: { type: "string", validation: { required: true } },
                                riskScore: { type: "number", defaultValue: 1, validation: { min: 0, max: self.riskConfig.riskMatrix[0] } },
                                overrideScore: { type: "number", validation: { min: 1, max: self.riskConfig.riskMatrix[0] } },
                            }
                        }
                    }
                };
            case 7:
                return {
                    transport: {
                        read: function (e) {
                            e.success(self.riskOverrides);
                        },
                        create: async (e) => {
                            const rowData = { ...e.data };
                            const data = { ...self.activeRiskOverride };
                            self.riskOverrides.push(data);
                            self.activeRiskOverride = null;
                            self.overridesGrid.dataSource.read();
                            self.overridesGrid.dataSource.page(Math.ceil(self.riskOverrides.length / self.pageSize));
                            e.success(data);
                        },
                        update: async (e) => {
                            try {
                                const objIndex = self.riskOverrides.findIndex((obj => obj.ern == e.data.ern));
                                const response = await self.updateRiskOverride(e.data);
                                e.success();
                            } catch (error) {
                                e.error({ errorMsg: error.responseStatus?.message });
                            }
                        },
                        destroy: async (e) => {
                            try {
                                const response = await self.deleteRiskOverride(e.data);
                                const objIndex = self.riskOverrides.findIndex((obj => obj.ern == response.result.ern));
                                self.riskOverrides.splice(objIndex, 1);
                                e.success();
                            } catch (error) {
                                e.error({ errorMsg: error.responseStatus?.message });
                            }
                        }
                    },
                    error: function (e) {
                        console.log("Error: " + e?.xhr?.errorMsg);
                    },
                    pageSize: self.pageSize,
                    batch: false,
                    schema: {
                        model: {
                            id: "ern",
                            fields: {
                                ern: { editable: false, nullable: true },
                                description: { type: "string", validation: { required: true } },
                                overrideScore: { type: "number", nullable: true, validation: { min: 1, max: self.riskConfig.riskMatrix[0] } },
                                overrideWeight: { type: "number", validation: { min: 1, max: (self.riskConfig.maximumWeightAdjustment[0] || 500) } },
                            }
                        }
                    },
                };
            default:
                break;
        }
    }

    onCategoriesGridReady(e) {
        this.categoriesGrid = e;
    }

    onComponentsGridReady(e) {
        this.componentsGrid = e;
    }

    onFactorsGridReady(e) {
        this.factorsGrid = e;
    }

    onAnswersGridReady(e) {
        this.answersGrid = e;
    }

    isRiskProfileNameEditable(e) {
        return e.ern === null || e.state === RiskModelState.Draft;
    }

    isRiskProfileTypeEditable(e) {
        return e.ern === null;
    }

    isRiskProfileStateEditable(e) {
        return e.ern !== null;
    }

    typeDropDownEditor(container, options) {
        const self = this;
        (<any>$('<input required data-text-field="value" data-value-field="key" data-bind="value:' + options.field + '"/>')
        .appendTo(container))
        .kendoDropDownList({
            dataSource: {
                transport: {
                    read: function (e) {
                        e.success(self.types.filter(type => self.activeLevelIndex === 1 || type.value === self.activeRiskModelType));
                    }
                }
            }
        });
    }

    stateDropDownEditor(container, options) {
        const currentState = options.model[options.field];
        let availableStates = [];
        switch (currentState) {
            case RiskModelState.Draft:
                availableStates = this.states.filter(obj => obj.value === RiskModelState.Draft || (options.model.isModelValid === true && obj.value === RiskModelState.Submitted));
                break;
            case RiskModelState.Submitted:
                availableStates = this.states.filter(obj => obj.value === RiskModelState.Draft || obj.value === RiskModelState.Submitted || obj.value === RiskModelState.Approved);
                break;
            case RiskModelState.Approved:
                availableStates = this.states.filter(obj => obj.value === RiskModelState.Draft || obj.value === RiskModelState.Approved);
                break;
            default:
                break;
        }
        (<any>$('<input required data-text-field="value" data-value-field="key" data-bind="value:' + options.field + '"/>')
        .appendTo(container))
        .kendoDropDownList({
            dataSource: {
                transport: {
                    read: function (e) {
                        e.success(availableStates);
                    }
                }
            }
        });
    }

    answerTypeDropDownEditor(container, options) {
        const self = this;
        (<any>$('<input required data-text-field="value" data-value-field="key" data-bind="value:' + options.field + '"/>')
        .appendTo(container))
        .kendoDropDownList({
            dataSource: {
                transport: {
                    read: function (e) {
                        e.success(self.answerTypes.filter(item => item.value !== RiskAnswerType.Matrix));
                    }
                }
            }
        });
    }

    categoryWeightEditor(container, options) {
        let totalOverrideWeight = this.riskCategories.reduce((partialSum, category) => partialSum + (category.overrideWeight && category.ern !== options.model.ern ? category.overrideWeight * 100 : 0), 0);
        const numberOfOverrideWeightItems = this.riskCategories.filter(category => !category.overrideWeight && category.ern !== options.model.ern).length;
        const max = 100 - numberOfOverrideWeightItems - totalOverrideWeight;
        const value = options.model[options.field] ? options.model[options.field] : 0;
        (<any>$('<div class="slider"><input ak-slider="k-min.bind: 0;k-max.bind: ' + (max < value ? value : max) + ';k-small-step.bind: 1;k-large-step.bind: 10;" class="balSlider" data-bind="value:' + options.field + '" k-on-change.delegate="onCategoryWeightChange($event.detail)" k-on-slide.delegate="onCategoryWeightSlide($event.detail)" /><span id="weight-text">' + `${value}%` +'</span></div>')
        .appendTo(container));
    }

    componentWeightEditor(container, options) {
        let totalOverrideWeight = this.riskComponents.reduce((partialSum, item) => partialSum + (item.overrideWeight && item.ern !== options.model.ern ? item.overrideWeight * 100 : 0), 0);
        const numberOfOverrideWeightItems = this.riskComponents.filter(item => !item.overrideWeight && item.ern !== options.model.ern).length;
        const max = 100 - numberOfOverrideWeightItems - totalOverrideWeight;
        const value = options.model[options.field] ? options.model[options.field] : 0;
        (<any>$('<div class="slider"><input ak-slider="k-min.bind: 0;k-max.bind: ' + (max < value ? value : max) + ';k-small-step.bind: 1;k-large-step.bind: 10;" class="balSlider" data-bind="value:' + options.field + '" k-on-change.delegate="onCategoryWeightChange($event.detail)" k-on-slide.delegate="onCategoryWeightSlide($event.detail)" /><span id="weight-text">' + `${value}%` +'</span></div>')
        .appendTo(container));
    }

    isValidModel(modelERN: string) {
        if (!modelERN) return false;
        let validModel: boolean = false;
        const riskCategories = this.riskCategories.filter(item => item.owners.includes(modelERN));
        validModel = this.isWeightCalcuateValid(riskCategories) && riskCategories.every(category => this.isValidCategory(category.ern));
        return validModel;
    }

    isValidCategory(categoryERN: string) {
        if (!categoryERN) return false;
        const riskComponents = this.riskComponentsAll.filter(item => item.owners[2] === categoryERN);
        return this.isWeightCalcuateValid(riskComponents) && riskComponents.every(component => this.isValidComponent(component.ern));
    }

    isValidComponent(componentERN: string) {
        if (!componentERN) return false;
        const riskFactors = this.riskFactorsAll.filter(item => item.owners.includes(componentERN));
        return riskFactors.length > 0 && riskFactors.every(factor => this.isValidRiskFactor(factor.ern));
    }

    isValidRiskFactor(factorERN: string) {
        if (!factorERN) return false;
        const riskFactor = this.riskFactorsAll.find(item => item.ern === factorERN);
        if (riskFactor?.answerType !== RiskAnswerType.Answer) return true;
        const riskAnswers = this.riskAnswersAll.filter(item => item.owners.includes(factorERN));
        return riskAnswers.length > 1;
    }

    isWeightCalcuateValid(values = []) {
        if (!values || values.length === 0) return false;
        const totalOverrideWeight = values.reduce((partialSum, item) => partialSum + (item.overrideWeight ? item.overrideWeight * 100 : 0), 0);
        const numberOfOverrideWeightItems = values.filter(item => !item.overrideWeight).length;
        return (numberOfOverrideWeightItems > 0 && Math.round(totalOverrideWeight) <= 100 - numberOfOverrideWeightItems) || (numberOfOverrideWeightItems === 0 && Math.round(totalOverrideWeight) === 100);
    }

    textareaEditor(container, options) {
        (<any>$('<textarea class="k-textbox" rows="3" data-bind="value:' + options.field + '" required>' + options.model[options.field] + '</textarea>')
        .appendTo(container));
    }

    async addRiskModel(riskModel) {
        let addRiskModelResponse = this.serviceClients.onlineAccountApi.post(new RiskModelRequest({
            owner: this.riskConfig.owners[0],
            ...riskModel,
            isTemplate: false
        }));

        return await addRiskModelResponse;
    }

    async updateRiskModel(riskModel) {
        let updateRiskModelResponse = this.serviceClients.onlineAccountApi.put(new RiskModelRequest(riskModel));

        return await updateRiskModelResponse;
    }

    async updateRiskModelState(riskModel) {
        let updateRiskModelStateResponse = this.serviceClients.onlineAccountApi.patch(new RiskModelRequest(riskModel));

        return await updateRiskModelStateResponse;   
    }

    async deleteRiskModel(riskModel) {
        let deleteRiskModelResponse = this.serviceClients.onlineAccountApi.delete(new RiskModelRequest({ ern: riskModel.ern }));

        return await deleteRiskModelResponse;
    }

    async addRiskCategory(riskCategory) {
        let addRiskCategoryResponse = this.serviceClients.onlineAccountApi.post(new RiskCategoryRequest({
            owner: this.activeModelERN,
            ...riskCategory,
            sortOrder: this.riskCategories.length
        }));

        return await addRiskCategoryResponse;
    }

    async updateRiskCategory(riskCategory) {
        let updateRiskCategoryResponse = this.serviceClients.onlineAccountApi.put(new RiskCategoryRequest(riskCategory));

        return await updateRiskCategoryResponse;
    }

    async deleteRiskCategory(riskCategory) {
        let deleteRiskCategoryResponse = this.serviceClients.onlineAccountApi.delete(new RiskCategoryRequest({ ern: riskCategory.ern }));

        return await deleteRiskCategoryResponse;
    }

    async addRiskComponent(riskComponent) {
        let addRiskComponentResponse = this.serviceClients.onlineAccountApi.post(new RiskComponentRequest({
            owner: this.activeCategoryERN,
            ...riskComponent,
            sortOrder: this.riskComponents.length
        }));

        return await addRiskComponentResponse;
    }

    async updateRiskComponent(riskComponent) {
        let updateRiskComponentResponse = this.serviceClients.onlineAccountApi.put(new RiskComponentRequest(riskComponent));

        return await updateRiskComponentResponse;
    }

    async deleteRiskComponent(riskComponent) {
        let deleteRiskComponentResponse = this.serviceClients.onlineAccountApi.delete(new RiskComponentRequest({ ern: riskComponent.ern }));

        return await deleteRiskComponentResponse;
    }

    async addRiskFactor(riskFactor) {
        let addRiskFactorResponse = this.serviceClients.onlineAccountApi.post(new RiskFactorRequest({
            owner: this.activeComponentERN,
            ...riskFactor,
            sortOrder: this.riskFactors.length
        }));

        return await addRiskFactorResponse;
    }

    async updateRiskFactor(riskFactor) {
        let updateRiskFactorResponse = this.serviceClients.onlineAccountApi.put(new RiskFactorRequest(riskFactor));

        return await updateRiskFactorResponse;
    }

    async deleteRiskFactor(riskFactor) {
        let deleteRiskFactorResponse = this.serviceClients.onlineAccountApi.delete(new RiskFactorRequest({ ern: riskFactor.ern }));

        return await deleteRiskFactorResponse;
    }

    async addRiskAnswer(riskAnswer) {
        let addRiskAnswerResponse = this.serviceClients.onlineAccountApi.post(new RiskAnswerRequest({
            owner: this.activeRiskFactorERN,
            ...riskAnswer,
            sortOrder: this.riskAnswers.length
        }));

        return await addRiskAnswerResponse;
    }

    async updateRiskAnswer(riskAnswer) {
        let updateRiskAnswerResponse = this.serviceClients.onlineAccountApi.put(new RiskAnswerRequest(riskAnswer));

        return await updateRiskAnswerResponse;
    }

    async deleteRiskAnswer(riskAnswer) {
        let deleteRiskAnswerResponse = this.serviceClients.onlineAccountApi.delete(new RiskAnswerRequest({ ern: riskAnswer.ern }));

        return await deleteRiskAnswerResponse;
    }

    async addRiskOverride(riskOverride) {
        let addRiskOverrideResponse = this.serviceClients.onlineAccountApi.post(new RiskOverrideRequest(riskOverride));

        return await addRiskOverrideResponse;
    }

    async updateRiskOverride(riskOverride) {
        let updateRiskOverrideResponse = this.serviceClients.onlineAccountApi.put(new RiskOverrideRequest(riskOverride));

        return await updateRiskOverrideResponse;
    }

    async deleteRiskOverride(riskOverride) {
        let deleteRiskOverrideResponse = this.serviceClients.onlineAccountApi.delete(new RiskOverrideRequest({ ern: riskOverride.ern }));

        return await deleteRiskOverrideResponse;
    }

    async goToLevelDown(ern: string, name: string, type: string = '') {
        switch (this.activeLevelIndex) {
            case 1:
                this.activeModelERN = ern;
                this.activeRiskModelType = type;
                if (type === 'CRA') this.isCRAEnabled = true;
                if (type === 'BWRA') this.isBWRAEnabled = true;
                this.activeLevelIndex = this.activeLevelIndex + 2;

                let listRiskModelCollectionResponse = this.serviceClients.onlineAccountApi.get(new RiskModelCollectionRequest({
                    ern: this.activeModelERN
                }));
                listRiskModelCollectionResponse.then(response => {
                    this.riskModelCollection = response.result; 
                    console.log('riskModelCollection', this.riskModelCollection);
                    this.isLoadedOfRiskCategories = true;
                    this.riskCategories = Object.values(this.riskModelCollection.categories).sort((a, b) => a.sortOrder - b.sortOrder);
                    this.riskComponentsAll = Object.values(this.riskModelCollection.components);
                    this.riskFactorsAll = Object.values(this.riskModelCollection.factors);
                    this.riskAnswersAll = Object.values(this.riskModelCollection.answers);

                    this.levels.push({title: type, invalid: false}, {title: name, invalid: !this.riskProfiles.find(item => item.ern === ern).isModelValid});
                });
                break;
            case 2:
                this.activeModelERN = ern;
                this.activeLevelIndex++;

                let listRiskModelCollectionFilteredResponse = this.serviceClients.onlineAccountApi.get(new RiskModelCollectionRequest({
                    ern: this.activeModelERN
                }));
                listRiskModelCollectionFilteredResponse.then(response => {
                    this.riskModelCollection = response.result; 
                    console.log('riskModelCollection', this.riskModelCollection);
                    this.isLoadedOfRiskCategories = true;
                    this.riskCategories = Object.values(this.riskModelCollection.categories).sort((a, b) => a.sortOrder - b.sortOrder);
                    this.riskComponentsAll = Object.values(this.riskModelCollection.components);
                    this.riskFactorsAll = Object.values(this.riskModelCollection.factors);
                    this.riskAnswersAll = Object.values(this.riskModelCollection.answers);
                    
                    this.levels.push({title: name, invalid: !this.riskProfiles.find(item => item.ern === ern).isModelValid});
                });
                break;
            case 3:
                this.activeCategoryERN = ern;
                this.levels.push({title: name, invalid: !this.isValidCategory(ern)});
                this.activeLevelIndex++;
                let listRiskComponentResponse = this.serviceClients.onlineAccountApi.get(new ListRiskComponentRequest({
                    owner: ern
                }));
                await listRiskComponentResponse;
                listRiskComponentResponse.then(response => {this.riskComponents = response.results.sort((a, b) => a.sortOrder - b.sortOrder); this.isLoadedOfRiskComponents = true; console.log('listRiskComponentResponse', response)});
                break;
            case 4:
                this.activeComponentERN = ern;
                this.levels.push({title: name, invalid: !this.isValidComponent(ern)});
                this.activeLevelIndex++;
                let listRiskFactorResponse = this.serviceClients.onlineAccountApi.get(new ListRiskFactorRequest({
                    owner: ern
                }));
                await listRiskFactorResponse;
                listRiskFactorResponse.then(response => {this.riskFactors = response.results.sort((a, b) => a.sortOrder - b.sortOrder); this.isLoadedOfRiskFactors = true; console.log('listRiskFactorResponse', response)});
                break;
            case 5:
                this.activeRiskFactorERN = ern;
                this.levels.push({title: name, invalid: !this.isValidRiskFactor(ern)});
                this.activeLevelIndex++;
                let listRiskAnswerResponse = this.serviceClients.onlineAccountApi.get(new ListRiskAnswerRequest({
                    owner: ern
                }));
                await listRiskAnswerResponse;
                listRiskAnswerResponse.then(response => {this.riskAnswers = response.results.sort((a, b) => a.sortOrder - b.sortOrder); this.isLoadedOfRiskAnswers = true; console.log('listRiskAnswerResponse', response)});
                break;
            default:
                break;
        }
    }

    async goToOverride(ern, name) {
        this.activeRiskFactorERN = ern;
        this.levels.push({title: name, invalid: false});
        let listRiskOverrideResponse = this.serviceClients.onlineAccountApi.get(new ListRiskOverrideRequest({
            owner: ern
        }));
        await listRiskOverrideResponse;
        listRiskOverrideResponse.then(response => {this.riskOverrides = response.results.sort((a, b) => a.sortOrder - b.sortOrder); this.isLoadedOfRiskOverrides = true; console.log('listRiskOverrideResponse', response)});
        this.activeLevelIndex = 7;
    }

    async goToOverrideFromAnswersGrid() {
        let listRiskOverrideResponse = this.serviceClients.onlineAccountApi.get(new ListRiskOverrideRequest({
            owner: this.activeRiskFactorERN
        }));
        await listRiskOverrideResponse;
        listRiskOverrideResponse.then(response => {this.riskOverrides = response.results.sort((a, b) => a.sortOrder - b.sortOrder); this.isLoadedOfRiskOverrides = true; console.log('listRiskOverrideResponse', response)});
        this.activeLevelIndex = 7;
    }

    moveToLevel(level: number) {
        if (level === 1) {
            this.isCRAEnabled = false;
            this.isBWRAEnabled = false;
        }
        if (level !== this.activeLevelIndex) {
            switch (level) {
                case 1:
                case 2:
                    this.isLoadedOfRiskCategories = false;
                    this.isLoadedOfRiskComponents = false;
                    this.isLoadedOfRiskFactors = false;
                    this.isLoadedOfRiskAnswers = false;
                    this.isLoadedOfRiskOverrides = false;
                    break;
                case 3:
                    this.isLoadedOfRiskComponents = false;
                    this.isLoadedOfRiskFactors = false;
                    this.isLoadedOfRiskAnswers = false;
                    this.isLoadedOfRiskOverrides = false;
                    break;
                case 4:
                    this.isLoadedOfRiskFactors = false;
                    this.isLoadedOfRiskAnswers = false;
                    this.isLoadedOfRiskOverrides = false;
                    break;
                case 5:
                    this.isLoadedOfRiskAnswers = false;
                    this.isLoadedOfRiskOverrides = false;
                    break;
                case 6:
                    this.isLoadedOfRiskOverrides = false;
                    break;
                case 7:
                    this.isLoadedOfRiskAnswers = false;
                    break;
                default:
                    break;
            }
            this.levels = this.levels.slice(0, level);
            this.activeLevelIndex = level;
        }
    }

    getSumOfProperties(data, prop) {
        return data.reduce(function(a, b) { if (!isNaN(b[prop])) { return a + b[prop]; } else { return a } }, 0);
    }

    getMissingPropertiesCount(data, prop) {
        let count = 0;
        data.forEach(item => { if (isNaN(item[prop])) count++ });
        return count;
    }

    getCalculatedWeight() {
        let data = [];
        if (this.activeLevelIndex === 3) {
            data = this.riskCategories;
        } else if (this.activeLevelIndex === 4) {
            data = this.riskComponents;
        }
        const sumOfOverrideWeight = this.getSumOfProperties(data, 'overrideWeight');
        const countOfCalculated = this.getMissingPropertiesCount(data, 'overrideWeight');
        if (sumOfOverrideWeight < 1) {
            return Math.round((1 - sumOfOverrideWeight) / countOfCalculated * 100);
        } else {
            return 1;
        }
    }

    onCategoryWeightChange(e) {
        document.getElementById('weight-text').innerText = `${e.value}%`;
    }

    onCategoryWeightSlide(e) {
        document.getElementById('weight-text').innerText = `${e.value}%`;
    }

    getDesignEnabled(state) {
        return state === 'Draft';
    }

    filterModelType(type) {
        if (type === 'CRA') this.isCRAEnabled = !this.isCRAEnabled;
        if (type === 'BWRA') this.isBWRAEnabled = !this.isBWRAEnabled;

        if (this.isCRAEnabled === this.isBWRAEnabled) {
            this.activeRiskModelType = '';
            this.moveToLevel(this.activeLevelIndex > 1 ? this.activeLevelIndex - 1 : 1);
        }
        else {
            this.activeRiskModelType = this.isCRAEnabled ? 'CRA' : 'BWRA';
            this.riskProfilesFiltered = this.riskProfiles.filter(x => x.type === this.activeRiskModelType);
            this.levels.push({title: this.activeRiskModelType, invalid: false});
            this.activeLevelIndex ++;
        }
    }

    visibleForEditModel(model) {
        return model?.visible;
    }

    visibleForNotApproved(model) {
        return model.state !== 'Approved';
    }
    
    onOverridesGridReady(e) {
        console.log('onOverridesGridReady', e);
        this.overridesGrid = e;
        if (this.overridesGrid.columns.length >= 5) {
            const parentRow = this.overridesGrid.wrapper.closest("tr.k-detail-row").prev("tr");
            const parentGrid = parentRow.closest("[data-role=grid]").data("kendoGrid");
            parentGrid.bind('edit', this.checkEditOverrideGrid);
        } else {
            this.overridesGrid.bind('edit', this.checkEditOverrideGrid);
        }
        
    }

    async saveOverride(parentElement, riskOverrideERN, terms, index) {
        console.log('saveOverride');
        console.log('riskOverrideERN', riskOverrideERN);
        console.log('terms', terms);
        console.log('index', index);
        console.log('this', this);
        console.log('parent', parentElement);
        console.log('activeRiskOverride', parentElement.activeRiskOverride);
        const indexes = String(index).split('-').slice(1);
        if (riskOverrideERN || parentElement.activeRiskOverride?.ern) {
            const riskOverride = parentElement.riskOverrides.find(item => item.ern === (riskOverrideERN || parentElement.activeRiskOverride?.ern));
            const riskOverrideIndex = parentElement.riskOverrides.findIndex(item => item.ern === (riskOverrideERN || parentElement.activeRiskOverride?.ern));
            let query = terms;
            if (indexes.length > 0) {
                parentElement.setQuery(riskOverride.query, indexes, terms);
                query = riskOverride.query;
            }
            const updateData = { ...riskOverride, query };
            console.log('updateRiskOverrideData', updateData);
            const response = await parentElement.updateRiskOverride(updateData);
            console.log('updateRiskOverrideResponse', response);
            parentElement.riskOverrides[riskOverrideIndex] = response.result;
            return true;
        } else {
            const parentRow = parentElement.overridesGrid.wrapper.closest("tr.k-detail-row").prev("tr");
            const parentGrid = parentRow.closest("[data-role=grid]").data("kendoGrid");
            const dataItem = parentGrid.dataItem(parentRow);
            console.log('dataItem', dataItem);
            if (!dataItem.description.replace(/(\r?\n|\r|\s)/gm, '')) {
                await parentElement.notificationService.showMessage('warning', 'Validation Warning', 'Description is required.');
                return false;
            } 
            const addData = { owner: parentElement.activeRiskFactorERN, description: dataItem.description, overrideScore: dataItem.overrideScore, overrideWeight: dataItem.overrideWeight, query: terms, sortOrder: parentElement.riskOverrides.length };
            console.log('addRiskOverrideData', addData);
            const response = await parentElement.addRiskOverride(addData);
            console.log('addRiskOverrideResponse', response);
            parentElement.activeRiskOverride = response.result;
            parentGrid.element.find('.k-grid-update').show();
            parentGrid.element.find('.k-grid-cancel').show();
            parentGrid.element.find('.k-grid-update').click();
            parentGrid.dataSource.read();
            parentElement.overridesParentGrid = parentGrid;
            return true;
        }
    }

    setQuery(arr, indexs, value) {
        if (indexs.length === 1) {
            arr[indexs[0]].additionalTerms = value;
            return [value];
        }
        arr = this.setQuery(arr[indexs[0]].additionalTerms, indexs.slice(1), value);
    }

    checkEditOverrideGrid(e) {
        if (e.model.isNew()) {
            e.container.find($('.k-grid-update')[0]).hide();
            e.container.find($('.k-grid-cancel')[0]).hide();
            e.sender.expandRow(e.container);
        }
    }

    hint(e) {
        return $(e).clone().addClass('sortable-basic-use-hint');
    }
    
    placeholder(e) {
        return $(e).clone().addClass('sortable-basic-use-placeholder').text('drop here');
    }

    openDialog() {
        switch (this.activeLevelIndex) {
            case 3:
                this.sortCategoriesDialog.open();
                break;
            case 4:
                this.sortComponentsDialog.open();
                break;
            case 5:
                this.sortFactorsDialog.open();
                break;
            case 6:
                this.sortAnswersDialog.open();
                break;
            case 7:
                this.sortOverridesDialog.open();
                break;
            default:
                break;
        }
    }

    onSortingEnd(e) {
        let id = e.sender.element.attr('id');
        let text = e.item.text();
        let oldIndex = e.oldIndex;
        let newIndex = e.newIndex;

        let dataItem;
        switch (this.activeLevelIndex) {
            case 3:
                dataItem = this.riskCategories[oldIndex];
                this.riskCategories.splice(oldIndex, 1);
                this.riskCategories.splice(newIndex, 0, dataItem);
                console.log('riskCategories', this.riskCategories);
                break;
            case 4:
                dataItem = this.riskComponents[oldIndex];
                this.riskComponents.splice(oldIndex, 1);
                this.riskComponents.splice(newIndex, 0, dataItem);
                console.log('riskComponents', this.riskComponents);
                break;
            case 5:
                dataItem = this.riskFactors[oldIndex];
                this.riskFactors.splice(oldIndex, 1);
                this.riskFactors.splice(newIndex, 0, dataItem);
                console.log('riskFactors', this.riskFactors);
                break;
            case 6:
                dataItem = this.riskAnswers[oldIndex];
                this.riskAnswers.splice(oldIndex, 1);
                this.riskAnswers.splice(newIndex, 0, dataItem);
                console.log('riskAnswers', this.riskAnswers);
                break;
            case 7:
                dataItem = this.riskOverrides[oldIndex];
                this.riskOverrides.splice(oldIndex, 1);
                this.riskOverrides.splice(newIndex, 0, dataItem);
                console.log('riskOverrides', this.riskOverrides);
                break;
            default:
                break;
        }
    }

    async validateRiskModel() {
        // Set Risk Profile Validate
        const self = this;
        const itemIndex = self.riskProfiles.findIndex((obj => obj.ern == self.activeModelERN));
        const oldIsModelValid = self.riskProfiles[itemIndex].isModelValid;
        const newIsModelValid = self.isValidModel(self.activeModelERN);
        
        if (oldIsModelValid !== newIsModelValid) {
            self.riskProfiles[itemIndex].isModelValid = newIsModelValid;
            self.levels[2].invalid = !newIsModelValid;
            const modelResponse = await self.updateRiskModel(self.riskProfiles[itemIndex]);
            console.log('modelResponse', modelResponse);
        }
    }

    removeRecord(e) {
        e.preventDefault();
        const tr = $(e.target).closest("tr");
        const self = this;
        kendo.confirm("Are you sure you want to delete this record?").then(async () => {
            let data;
            let response;
            let objIndex;
            let objIndexAll;
            console.log('remove');
            switch (self.activeLevelIndex) {
                case 1:
                    data = self.profilesGrid.dataItem(tr);
                    response = await self.deleteRiskModel(data);
                    objIndex = self.riskProfiles.findIndex((obj => obj.ern == response.result.ern));
                    self.riskProfiles.splice(objIndex, 1);
                    self.profilesGrid.dataSource.read();
                    break;
                case 2:
                    data = self.profilesFilterGrid.dataItem(tr);
                    response = await self.deleteRiskModel(data);
                    objIndex = self.riskProfiles.findIndex((obj => obj.ern == response.result.ern));
                    self.riskProfiles.splice(objIndex, 1);
                    self.profilesFilterGrid.dataSource.read();
                    break;
                case 3:
                    data = self.categoriesGrid.dataItem(tr);
                    response = await self.deleteRiskCategory(data);
                    objIndex = self.riskCategories.findIndex((obj => obj.ern == response.result.ern));
                    self.riskCategories.splice(objIndex, 1);
                    // Validate Risk Model
                    await self.validateRiskModel();
                    self.categoriesGrid.dataSource.read();
                    break;
                case 4:
                    data = self.componentsGrid.dataItem(tr);
                    response = await self.deleteRiskComponent(data);
                    objIndex = self.riskComponents.findIndex((obj => obj.ern == response.result.ern));
                    self.riskComponents.splice(objIndex, 1);
                    
                    objIndexAll = self.riskComponentsAll.findIndex((obj => obj.ern == response.result.ern));
                    self.riskComponentsAll.splice(objIndexAll, 1);

                    // Validate Risk Category
                    const validCategory = self.isValidCategory(self.activeCategoryERN);
                    self.levels[3].invalid = !validCategory;

                    // Validate Risk Model
                    await self.validateRiskModel();
                    self.componentsGrid.dataSource.read();
                    break;
                case 5:
                    data = self.factorsGrid.dataItem(tr);
                    response = await self.deleteRiskFactor(data);
                    objIndex = self.riskFactors.findIndex((obj => obj.ern == response.result.ern));
                    self.riskFactors.splice(objIndex, 1);
                    objIndexAll = self.riskFactorsAll.findIndex((obj => obj.ern == response.result.ern));
                    self.riskFactorsAll.splice(objIndexAll, 1);
                    
                    // Validate Risk Component
                    const validComponent = self.isValidComponent(self.activeComponentERN);
                    self.levels[4].invalid = !validComponent;

                    // Validate Risk Category
                    const validCategoryParent = self.isValidCategory(self.activeCategoryERN);
                    self.levels[3].invalid = !validCategoryParent;

                    // Validate Risk Model
                    await self.validateRiskModel();
                    self.factorsGrid.dataSource.read();
                    break;
                case 6:
                    data = self.answersGrid.dataItem(tr);
                    response = await self.deleteRiskAnswer(data);
                    objIndex = self.riskAnswers.findIndex((obj => obj.ern == response.result.ern));
                    self.riskAnswers.splice(objIndex, 1);
                    objIndexAll = self.riskAnswersAll.findIndex((obj => obj.ern == response.result.ern));
                    self.riskAnswersAll.splice(objIndexAll, 1);

                    // Validate Risk Factor
                    const validRiskFactor = self.isValidRiskFactor(self.activeRiskFactorERN);
                    self.levels[5].invalid = !validRiskFactor;

                    // Validate Risk Component
                    const validComponentParent = self.isValidComponent(self.activeComponentERN);
                    self.levels[4].invalid = !validComponentParent;

                    // Validate Risk Category
                    const validCategoryParentParent = self.isValidCategory(self.activeCategoryERN);
                    self.levels[3].invalid = !validCategoryParentParent;

                    // Validate Risk Model
                    await self.validateRiskModel();
                    self.answersGrid.dataSource.read();
                    break;
                case 7:
                    if (self.overridesParentGrid) {
                        data = self.overridesParentGrid.dataItem(tr);
                        response = await self.deleteRiskOverride(data);
                        objIndex = self.riskOverrides.findIndex((obj => obj.ern == response.result.ern));
                        self.riskOverrides.splice(objIndex, 1);
                        self.overridesParentGrid.dataSource.read();
                    } else {
                        data = self.overridesGrid.dataItem(tr);
                        response = await self.deleteRiskOverride(data);
                        objIndex = self.riskOverrides.findIndex((obj => obj.ern == response.result.ern));
                        self.riskOverrides.splice(objIndex, 1);
                        self.overridesGrid.dataSource.read();
                    }
                    break;
                default:
                    break;
            }
            
        }, () => {
            console.log('cancel');
        });
    }

    async refresh() {
        await this.riskConfigChanged(this.riskConfig)
    }

    back() {
        if (this.activeLevelIndex === 1)
            history.back();
        else if (this.activeLevelIndex === 7)
            this.moveToLevel(5);
        else 
            this.moveToLevel(this.activeLevelIndex - 1);
    }
}
