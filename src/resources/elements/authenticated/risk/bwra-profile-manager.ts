import {BaseElement} from '../../../../bases/base-element';
import {OnlineAccountApi} from "../../../../dtos/onlineaccount-api.dtos";
import Enumerable from "linq";
import {observable} from "aurelia-framework";
import RiskConfigRequest = OnlineAccountApi.RiskConfigRequest;
import ListRiskModelRequest = OnlineAccountApi.ListRiskModelRequest;
import ListRiskAssessmentRequest = OnlineAccountApi.ListRiskAssessmentRequest;
import ListRiskAssessmentResponse = OnlineAccountApi.ListRiskAssessmentResponse;
import ListRiskAnswerKeyRequest = OnlineAccountApi.ListRiskAnswerKeyRequest;
import ListRiskAnswerKeyResponse = OnlineAccountApi.ListRiskAnswerKeyResponse;
import RiskModelCollectionRequest = OnlineAccountApi.RiskModelCollectionRequest;
import RiskModelAnswerKeyRequest = OnlineAccountApi.RiskModelAnswerKeyRequest;
import KeyValuePair = OnlineAccountApi.KeyValuePair;

export class BwraProfileManagerCustomElement extends BaseElement {
    @observable selectedBusiness;
    @observable riskProfiles: OnlineAccountApi.RiskModelRecord[];
    @observable riskConfig: OnlineAccountApi.RiskConfigRecord;
    @observable riskModel: OnlineAccountApi.RiskModelRecord;
    @observable riskModelCollection: OnlineAccountApi.RiskModelCollection;
    @observable riskCategories: OnlineAccountApi.RiskCategoryRecord[];
    @observable riskComponents: OnlineAccountApi.RiskComponentRecord[];
    @observable riskComponentsByCategory: OnlineAccountApi.RiskComponentRecord[];
    @observable riskFactors: OnlineAccountApi.RiskFactorRecord[];
    @observable riskFactorsByComponent: OnlineAccountApi.RiskFactorRecord[];
    @observable riskAnswers: OnlineAccountApi.RiskAnswerRecord[];
    @observable isLoadedRiskModel: boolean = false;
    
    private riskMatrix: number[];
    private businessCode: string;
    private businessName: string;
    private businessRecords: OnlineAccountApi.CustomerBusinessLookup[];
    private riskAssessments: OnlineAccountApi.RiskAssessmentRecord[];
    private businessAssessments;
    private riskModelAnswerKeys: OnlineAccountApi.RiskModelAnswerKeyRecord[];
    private riskModelAnswerKeysCount: number = 0;
    @observable isLoadedBusinessAssessments: boolean = false;
    @observable isLoadedRiskModelAnswerKeys: boolean = false;
    private activeBusinessName: string;
    private activeRiskAnswerKeyERN: string;
    private activeRiskModelAnswerKey: OnlineAccountApi.RiskModelAnswerKeyRecord;
    private activeRiskModel: OnlineAccountApi.RiskModelRecord;

    @observable selectedCategoryIndex: number;
    @observable selectedComponentIndex: number;
    @observable selectedRiskFactorIndex: number;
    @observable activeRiskFactor;
    endAnswering = false;
    currentPage = 1;
    @observable pageSize = 5;
    modes = ['admin', 'consumer'];
    @observable mode = 'admin';
    debugMode = false;
    private pageable = {
        refresh: true,
        pageSizes: true,
        buttonCount: 10
    };

    private activeLevelIndex: number = 1;
    private levels: string[] = ['BWRA'];
    @observable activeListERN: string = '';
    @observable gridData;
    private patchBWRA = {};
    private assessmentsGrid;
    private detailsGrid;

    constructor(...args) {
        super(...args);
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
        console.log('getRequest', getRequest);
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
        let businessName = newValue.name;
        this.businessCode = businessCode;
        this.businessName = businessName;

        let riskProfilesResponse = this.serviceClients.onlineAccountApi.get(new ListRiskModelRequest({owner: businessCode}));
        
        // let's set the risk profiles
        riskProfilesResponse.then(response => {
            this.riskProfiles = response.results;

            this.isLoadedBusinessAssessments = true;
        });
    }

    getKendoGridDataSource() {
        const self = this;
        switch (self.activeLevelIndex) {
            case 1:
                return {
                    serverPaging: true,
                    pageSize: 10,
                    batch: false,
                    schema: {
                        total: "total",
                        data: "data",
                        model: {
                            id: "ern",
                            fields: {
                                ern: { editable: false, nullable: true }
                            }
                        }
                    },
                    transport: {
                        read: async (e: any) => {
                            let skip = (e.data.skip != null) ? e.data.skip : 0;
                            let take = (e.data.take != null) ? e.data.take : skip === 0 ? e.data.pageSize : (e.data.page - 1) * e.data.pageSize;

                            let errorThrown: boolean = false;

                            this.serviceClients.onlineAccountApi.get(new ListRiskAssessmentRequest({
                                owner: self.businessCode,
                                type: OnlineAccountApi.RiskModelType.BWRA,
                                skip: skip,
                                take: take,
                            }))
                                .catch(response => {
                                    errorThrown = true;
                                    e.error(new Error(response.responseStatus.message));
                                })
                                .then(value => {
                                    if (!errorThrown) {
                                        let response = (value as ListRiskAssessmentResponse);
                                        self.riskAssessments = response.results;
                                        if (self.riskAssessments.length > 0) {
                                            console.log('riskAssessments', self.riskAssessments);
                                            console.log('riskProfiles', self.riskProfiles);
                                            self.businessAssessments = this.riskAssessments.map(item => ({ 
                                                businessName: self.businessName, 
                                                modelName: self.riskProfiles.find(model => item.owners.includes(model.ern))?.name, 
                                                riskScore: item.riskScore, 
                                                createdDate: item.createdDate
                                            }));
                                        } else {
                                            self.businessAssessments = [{ 
                                                businessName: self.businessName, 
                                                modelName: null, 
                                                riskScore: null, 
                                                createdDate: null 
                                            }];
                                        }
                                        e.success({
                                            "total": response.count,
                                            "data": self.utils.rehydrateMeta(self.businessAssessments)
                                        });
                                    }
                                });
                        },
                    },
                };
            case 2:
                return {
                    serverPaging: true,
                    pageSize: 10,
                    batch: false,
                    schema: {
                        total: "total",
                        data: "data",
                        model: {
                            id: "ern",
                            fields: {
                                ern: { editable: false, nullable: true },
                                riskScore: { editable: false },
                                answerKeyState: { editable: false },
                            }
                        }
                    },
                    transport: {
                        // read: function (e) {
                        //     e.success(self.riskModelAnswerKeys.sort((a, b) => a.createdDate < b.createdDate ? 1: -1));
                        // },
                        read: async (e: any) => {
                            let skip = (e.data.skip != null) ? e.data.skip : 0;
                            let take = (e.data.take != null) ? e.data.take : skip === 0 ? e.data.pageSize : (e.data.page - 1) * e.data.pageSize;

                            let errorThrown: boolean = false;

                            this.serviceClients.onlineAccountApi.get(new ListRiskAnswerKeyRequest({
                                owner: self.businessCode,
                                type: OnlineAccountApi.RiskModelType.BWRA,
                                skip: skip,
                                take: take,
                            }))
                                .catch(response => {
                                    errorThrown = true;
                                    e.error(new Error(response.responseStatus.message));
                                })
                                .then(value => {
                                    if (!errorThrown) {
                                        let response = (value as ListRiskAnswerKeyResponse);
                                        self.riskModelAnswerKeys = response.results;
                                        self.riskModelAnswerKeysCount = response.count;
                                        e.success({
                                            "total": response.count,
                                            "data": self.utils.rehydrateMeta(self.riskModelAnswerKeys)
                                        });
                                    }
                                });
                        },
                        create: async (e: any) => {
                            // console.log('owners', e.data.owners);
                            // if (self.riskModelAnswerKeys.find(x => x.owners.includes(e.data.owners.ern) && x.answerKeyState === OnlineAccountApi.RiskModelState.Draft)) {
                            //     this.notificationService.showMessage('warning', 'Validation Warning', `${e.data.owners.name} is already in progress!`);
                            //     e.error(new Error(`${e.data.owners.name} is already in progress!`));
                            //     return;
                            // }
                            try {
                                const rowData = { owner: e.data.owners.ern, name: self.activeBusinessName, principalERN: self.riskConfig.owners[0] };
                                console.log('rowData', rowData);
                                const response = await self.addRiskModelAnswerKey(rowData);
                                console.log('addRiskModel', response.result);
                                self.riskModelAnswerKeys.push(response.result);
                                self.detailsGrid.dataSource.page(1);
                                // self.detailsGrid.dataSource.page(Math.ceil((self.riskModelAnswerKeysCount + 1) / self.pageSize));
                                e.success(response.result);
                            } catch (error) {
                                e.error(new Error(error.responseStatus.message));
                            }
                        }
                    }
                };
            default:
                break;
        }
    }
    
    async goToLevelDown(name: string, ern: string = '') {
        switch (this.activeLevelIndex) {
            case 1:
                this.activeBusinessName = name;
                this.levels.push(name);
                this.isLoadedRiskModelAnswerKeys = true; 
                this.activeLevelIndex ++;
                break;
            case 2:
                this.activeRiskAnswerKeyERN = ern;
                let riskModelAnswerKeyRespnse = this.serviceClients.onlineAccountApi.get(new RiskModelAnswerKeyRequest({
                    ern
                }));
                riskModelAnswerKeyRespnse.then(response => {
                    this.activeRiskModelAnswerKey = response.result;
                    console.log('riskModelAnswerKeyRespnse', this.activeRiskModelAnswerKey);
                    this.activeRiskModel = this.getRiskModelByERN(this.activeRiskModelAnswerKey.owners[1]);
                    this.levels.push(this.activeRiskModel.name);

                    let listRiskModelCollectionResponse = this.serviceClients.onlineAccountApi.get(new RiskModelCollectionRequest({
                        ern: this.activeRiskModel.ern
                    }));
                    listRiskModelCollectionResponse.then(response => {
                        this.riskModelCollection = response.result; 
                        console.log('riskFactors', Object.values(this.riskModelCollection.factors));
                        this.isLoadedRiskModel = true;
                        this.riskCategories = Object.values(this.riskModelCollection.categories).sort((a, b) => a.sortOrder - b.sortOrder);
                        this.riskComponents = this.riskCategories.reduce((prev, currentCategory) => [...prev, ...Object.values(this.riskModelCollection.components).filter(component => component.owners.includes(currentCategory.ern)).sort((a, b) => a.sortOrder - b.sortOrder)], []);
                        console.log('riskComponents', this.riskComponents);
                        this.riskFactors = this.riskComponents.reduce((prev, currentComponent) => [...prev, ...Object.values(this.riskModelCollection.factors).filter(factor => factor.owners.includes(currentComponent.ern)).sort((a, b) => a.sortOrder - b.sortOrder)], []);
                        console.log('riskFactors', this.riskFactors);
                        this.riskFactors.forEach(item => {
                            this.patchBWRA[item.ern] = this.activeRiskModelAnswerKey.bwra[item.ern] ? this.activeRiskModelAnswerKey.bwra[item.ern] : [];
                        });
                        this.riskMatrix = this.riskModelCollection.riskMatrix;
                        
                        if (this.riskCategories.length > 0) this.selectedCategoryIndex = 0;
                        this.activeLevelIndex ++;
                    });
                })
            default:
                break;
        }
    }
    
    riskModelDropDownEditor(container, options) {
        const self = this;
        (<any>$('<input required data-text-field="name" data-value-field="ern" data-bind="value:' + options.field + '"/>')
        .appendTo(container))
        .kendoDropDownList({
            dataSource: {
                transport: {
                    read: function (e) {
                        e.success(self.riskProfiles.filter(item => item.type === OnlineAccountApi.RiskModelType.BWRA && item.state === OnlineAccountApi.RiskModelState.Approved));
                    }
                }
            }
        });
    }

    async addRiskModelAnswerKey(riskModelAnswerKey) {
        let addRiskModelAnswerKeyResponse = this.serviceClients.onlineAccountApi.post(new RiskModelAnswerKeyRequest({
            owner: this.riskConfig.owners[0],
            ...riskModelAnswerKey
        }));

        return await addRiskModelAnswerKeyResponse;
    }

    getRiskModelByERN(riskModelERN) {
        const riskModel = this.riskProfiles.find(item => item.ern === riskModelERN);
        
        return riskModel;
    }

    getRiskModelNameByERN(riskModelERN) {
        const riskModel = this.riskProfiles.find(item => item.ern === riskModelERN);
        
        return riskModel?.name;
    }

    async moveToLevel(level: number) {
        if (level !== this.activeLevelIndex) {
            this.levels = this.levels.slice(0, level);
            this.activeLevelIndex = level;
            console.log('levels', this.levels);
            this.selectedCategoryIndex = -1;
            if (level === 1) {
                this.isLoadedRiskModelAnswerKeys = false;
                // if (this.riskAssessments.length > 0) {
                //     console.log('riskAssessments', this.riskAssessments);
                //     console.log('riskProfiles', this.riskProfiles);
                //     this.businessAssessments = this.riskAssessments.map(item => ({ businessName: this.businessName, modelName: this.riskProfiles.find(model => item.owners.includes(model.ern))?.name, riskScore: item.riskScore, createdDate: item.createdDate }));
                // } else {
                //     this.businessAssessments = [{ businessName: this.businessName, modelName: null, riskScore: null, createdDate: null }];
                // }
                // console.log('businessAssessments', this.businessAssessments);
                this.isLoadedBusinessAssessments = true;
                this.assessmentsGrid.dataSource.read();
                // console.log('riskAssessments', this.riskAssessments);
            }
        }
    }
    
    async selectedCategoryIndexChanged(index: number) {
        if (index < 0) return;
        this.riskComponentsByCategory = this.riskComponents.filter(item => item.owners.includes(this.riskCategories[index].ern));
        if (this.riskComponentsByCategory.length > 0) {
            this.selectedComponentIndex = 0;
            this.riskFactorsByComponent = this.riskFactors.filter(item => item.owners.includes(this.riskComponentsByCategory[this.selectedComponentIndex].ern));
        } 
        this.setCurrentPage(1);
    }
    
    async selectedComponentIndexChanged(index: number) {
        this.riskFactorsByComponent = this.riskFactors.filter(item => item.owners.includes(this.riskComponentsByCategory[index].ern));
        if (this.riskFactorsByComponent.length > 0) this.selectedRiskFactorIndex = 0;
        this.setCurrentPage(1);
    }
    
    getContinueEnabled(answerKeyState) {
        return answerKeyState === OnlineAccountApi.RiskModelState.Draft;
    }

    selectCategory(index) {
        this.selectedCategoryIndex = index;
    }

    selectComponent(index) {
        this.selectedComponentIndex = index;
    }

    setCurrentPage(currentPage) {
        this.currentPage = currentPage;
    }
        
    getPageCount(totalCount, pageSize) {
        return Math.ceil(totalCount / (pageSize ? pageSize : 1));
    }

    goToPage(page) {
        this.currentPage = page;
    }
    
    moveToNextRiskFactorsForComponent() {
        if (this.riskFactorsByComponent.some(riskFactor => !this.activeRiskModelAnswerKey.bwra[riskFactor.ern])) {
            this.notificationService.showMessage('warning', 'Validation Warning', 'Please answer all the questions before moving to next component');
        } else {
            if (this.riskComponentsByCategory.length === this.selectedComponentIndex + 1) {
                if (this.riskCategories.length === this.selectedCategoryIndex + 1) {
                    this.endAnswering = true;
                } else {
                    this.selectedCategoryIndex++;
                }
            } else {
                this.selectedComponentIndex++;
            }
        }
        
    }

    submitAllAnswers() {
        if (this.activeRiskModelAnswerKey.isAnswerKeyValid) {
            let riskModelAnswerKeyResponse = this.serviceClients.onlineAccountApi.patch(new RiskModelAnswerKeyRequest({
                ern: this.activeRiskAnswerKeyERN,
                patchAnswerKeyState: OnlineAccountApi.RiskModelState.Submitted,
            }));
            riskModelAnswerKeyResponse.then(response => {
                console.log('submitAllAnswers', response.result);
                this.activeRiskModelAnswerKey = response.result;
                this.notificationService.showMessage('success', 'Success', 'Successfully Submitted');
                setTimeout(() => {
                    // let riskAssessmentResponse = this.serviceClients.onlineAccountApi.get(new ListRiskAssessmentRequest({owner: this.businessCode, type: OnlineAccountApi.RiskModelType.BWRA}));

                    // // let's set the risk assessments
                    // riskAssessmentResponse.then(response => {
                    //     this.riskAssessments = response.results;
                    //     console.log('riskAssessments', this.riskAssessments);
                    this.isLoadedRiskModelAnswerKeys = true; 
                    this.activeLevelIndex = 2;
                    this.levels = this.levels.slice(0, 2);
                    this.endAnswering = false;
                    this.detailsGrid.dataSource.read();
                        // let listRiskAnswerKeyResponse = this.serviceClients.onlineAccountApi.get(new ListRiskAnswerKeyRequest({
                        //     owner: this.riskConfig.owners[0]
                        // }));
                        // listRiskAnswerKeyResponse.then(response => {
                        //     this.riskModelAnswerKeys = response.results.filter(item => item.modelType === OnlineAccountApi.RiskModelType.BWRA); 
                        //     this.isLoadedRiskModelAnswerKeys = true; 
                        //     this.activeLevelIndex = 2;
                        //     this.levels = this.levels.slice(0, 2);
                        //     this.endAnswering = false;
                        // });
                    // })
                    
                }, 1000);
                
            });
        } else {
            this.notificationService.showMessage('warning', 'Validation Warning', 'Please answer all the questions before submitting');
        }
        
    }

    nextRiskFactorsForComponent() {
        this.setCurrentPage(1);
        this.moveToNextRiskFactorsForComponent();
    }

    async elementBlurred(event, riskFactorERN, index) {
        if (event.target.value > (this.riskConfig.riskMatrix[index] || 5)) {
            event.target.value = (this.riskConfig.riskMatrix[index] || 5);
        }
        this.patchBWRA[riskFactorERN][index] = event.target.value;
        console.log('elementBlurred', event.target.value);
        console.log('patch-values', this.patchBWRA[riskFactorERN]);
        if (this.patchBWRA[riskFactorERN].length === 2 && this.patchBWRA[riskFactorERN][0] !== '' && !isNaN(this.patchBWRA[riskFactorERN][0]) && this.patchBWRA[riskFactorERN][1] !== '' && !isNaN(this.patchBWRA[riskFactorERN][1])) {
            let bwraAnswer = new KeyValuePair<string, number[]>({key: riskFactorERN, value: this.patchBWRA[riskFactorERN].map(Number)});
            let updatedAnswerKey = (await this.serviceClients.onlineAccountApi.patch(new RiskModelAnswerKeyRequest({
                ern: this.activeRiskAnswerKeyERN,
                patchBWRA: bwraAnswer
            })))?.result;

            console.log('updatedAnswerKey', updatedAnswerKey);
            this.activeRiskModelAnswerKey = updatedAnswerKey;
        }
    }

    getAssessmentScore(answerKeyERN) {
        return this.riskAssessments.find(item => item.owners.includes(answerKeyERN))?.riskScore || 'N/A';
    }

    pageSizeChanged(value) {
        console.log('pageSizeChanged', value);
        this.currentPage = 1;
    }

    back() {
        if (this.activeLevelIndex === 1)
            history.back();
        else if (this.activeLevelIndex === 3) {
            if (this.endAnswering) this.endAnswering = !this.endAnswering;
            else this.moveToLevel(this.activeLevelIndex - 1);
        }
        else 
            this.moveToLevel(this.activeLevelIndex - 1);
    }
}

