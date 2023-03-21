import {BaseElement} from '../../../../bases/base-element';
import {OnlineAccountApi} from "../../../../dtos/onlineaccount-api.dtos";
import Enumerable from "linq";
import {observable} from "aurelia-framework";
import RiskConfigRequest = OnlineAccountApi.RiskConfigRequest;
import ListRiskAnswerRequest = OnlineAccountApi.ListRiskAnswerRequest;
import ListRiskModelRequest = OnlineAccountApi.ListRiskModelRequest;
import ListRiskListRequest = OnlineAccountApi.ListRiskListRequest;
import ListRiskAssessmentRequest = OnlineAccountApi.ListRiskAssessmentRequest;
import ListRiskAnswerKeyRequest = OnlineAccountApi.ListRiskAnswerKeyRequest;
import RiskModelCollectionRequest = OnlineAccountApi.RiskModelCollectionRequest;
import RiskModelAnswerKeyRequest = OnlineAccountApi.RiskModelAnswerKeyRequest;
import KeyValuePair = OnlineAccountApi.KeyValuePair;


export class CraProfileManagerCustomElement extends BaseElement {
    @observable selectedBusiness;
    private riskIndustries: OnlineAccountApi.RiskAnswerRecord[];
    private riskCountries: OnlineAccountApi.RiskAnswerRecord[];
    private riskProducts: OnlineAccountApi.RiskAnswerRecord[];
    @observable riskLists: OnlineAccountApi.RiskListRecord[];
    @observable riskListsByTypes: OnlineAccountApi.RiskListRecord[];
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
    @observable riskAnswersByFactor: OnlineAccountApi.RiskAnswerRecord[];
    @observable isLoadedRiskModel: boolean = false;

    private businessCode;
    private businessRecords: OnlineAccountApi.CustomerBusinessLookup[];
    private riskListAssessments;
    private riskAssessments: OnlineAccountApi.RiskAssessmentRecord[];
    private riskModelAnswerKeys: OnlineAccountApi.RiskModelAnswerKeyRecord[];
    @observable isLoadedRiskListAssessments: boolean = false;
    @observable isLoadedRiskModelAnswerKeys: boolean = false;
    private activeRiskListName: string;
    private activeRiskAnswerKeyERN: string;
    private activeRiskModelAnswerKey: OnlineAccountApi.RiskModelAnswerKeyRecord;
    private activeRiskModel: OnlineAccountApi.RiskModelRecord;
    private riskListTypes = Object.entries(OnlineAccountApi.RiskListType).map(([key, value]) => ({ key, value }));
    @observable riskListType: string;

    @observable selectedCategoryIndex: number;
    @observable selectedComponentIndex: number;
    @observable selectedRiskFactorIndex: number;
    @observable activeRiskFactor;
    @observable endAnswering = false;
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
    private levels: string[] = ['CRA'];
    @observable activeRiskListERN: string = '';
    @observable gridData;
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
        this.businessCode = businessCode;

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

        let lookupResponse = this.serviceClients.onlineAccountApi.get(new ListRiskAnswerRequest({owner: businessCode}));
        let riskListsResponse = this.serviceClients.onlineAccountApi.get(new ListRiskListRequest({owner: businessCode}));
        let riskProfilesResponse = this.serviceClients.onlineAccountApi.get(new ListRiskModelRequest({owner: businessCode}));
        
        await Promise.all([lookupResponse, riskListsResponse, riskProfilesResponse]);

        // let's set the industries and countries
        lookupResponse.then(response => {
            this.riskIndustries = Enumerable.from(response.results).where(x => x.owners[1] === 'Industry').toArray();
            this.riskCountries = Enumerable.from(response.results).where(x => x.owners[1] === 'Country').toArray();
            this.riskProducts = Enumerable.from(response.results).where(x => x.owners[1] === 'Product').toArray();
            console.log('riskProducts', this.riskProducts);
        });

        // let's set the risk lists
        riskListsResponse.then(async (response) => {
            this.riskLists = response.results; 
            console.log('riskLists', this.riskLists);
            this.riskListAssessments = await Promise.all(this.riskLists.map(async (riskList) => {
                const riskAssessments = (await this.serviceClients.onlineAccountApi.get(new ListRiskAssessmentRequest({owner: riskList.ern, type: OnlineAccountApi.RiskModelType.CRA})))?.results;
                return { ...riskList, riskScore: riskAssessments.length > 0 ? riskAssessments[0].riskScore : null, createdDate: riskAssessments.length > 0 ? riskAssessments[0].createdDate: null };
            }))
            
            this.isLoadedRiskListAssessments = true;
            console.log('riskListAssessments', this.riskListAssessments);

            const self = this;
            this.gridData = new kendo.data.DataSource({
                transport: {
                    read: function (e) {
                        console.log('read', self.riskListAssessments);
                        e.success(self.riskListAssessments);
                    },
                },
                pageSize: 10,
                batch: false,
                schema: {
                    model: {
                        id: "ern",
                        fields: {
                            ern: { editable: false, nullable: true }
                        }
                    }
                }
            });
            this.riskListType = OnlineAccountApi.RiskListType.Customer;
        });

        // let's set the risk profiles
        riskProfilesResponse.then(response => {
            this.riskProfiles = response.results;
            console.log('riskProfiles', this.riskProfiles);
        });
    }

    async selectedCategoryIndexChanged(index) {
        this.riskComponentsByCategory = this.riskComponents.filter(item => item.owners.includes(this.riskCategories[index].ern));
        if (this.riskComponentsByCategory.length > 0) {
            this.selectedComponentIndex = 0;
            this.riskFactorsByComponent = this.riskFactors.filter(item => item.owners.includes(this.riskComponentsByCategory[this.selectedComponentIndex].ern));
        } 
        this.setCurrentPage(1);
    }
    
    async selectedComponentIndexChanged(index) {
        this.riskFactorsByComponent = this.riskFactors.filter(item => item.owners.includes(this.riskComponentsByCategory[index].ern));
        if (this.riskFactorsByComponent.length > 0) this.selectedRiskFactorIndex = 0;
        this.setCurrentPage(1);
    }
    
    getRiskAnswersByFactor(riskFactorERN) {
        return this.riskAnswers.filter(item => item.owners.includes(riskFactorERN));
    }

    riskListTypeChanged(riskListType) {
        console.log('riskListTypeChanged', riskListType);
        if (riskListType) {
            let riskListsResponse = this.serviceClients.onlineAccountApi.get(new ListRiskListRequest({
                owner: this.businessCode,
                type: riskListType
            }));
    
            riskListsResponse.then(async (response) => {
                this.riskLists = response.results;
                this.riskListAssessments = await Promise.all(this.riskLists.map(async (riskList) => {
                    const riskAssessments = (await this.serviceClients.onlineAccountApi.get(new ListRiskAssessmentRequest({owner: riskList.ern, type: OnlineAccountApi.RiskModelType.CRA})))?.results;
                    return { ...riskList, riskScore: riskAssessments.length > 0 ? riskAssessments[0].riskScore : null, createdDate: riskAssessments.length > 0 ? riskAssessments[0].createdDate: null };
                }))
                
                this.isLoadedRiskListAssessments = true;
                console.log('riskListAssessments', this.riskListAssessments);
                this.assessmentsGrid.dataSource.read();
                this.assessmentsGrid.dataSource.page(1);
            })
        }
        
        // this.riskListsByTypes = Enumerable.from(this.riskLists).where(x => x.type === riskListType).toArray();
        // console.log('riskListsByTypes', this.riskListsByTypes);
        // this.activeLevelIndex = 1;
        
        // if (riskListType) {
        //     this.gridData.filter({ field: 'type', operator: 'eq', value: riskListType });
        // } else {
        //     this.gridData.filter({});
        // }
        // console.log('griddata', this.gridData);
    }
    
    getKendoGridDataSource() {
        const self = this;
        switch (self.activeLevelIndex) {
            case 1:
                return {
                    transport: {
                        read: function (e) {
                            e.success(self.riskListAssessments);
                        },
                    },
                    pageSize: 10,
                    batch: false,
                    schema: {
                        model: {
                            id: "ern",
                            fields: {
                                ern: { editable: false, nullable: true }
                            }
                        }
                    }
                };
            case 2:
                return {
                    transport: {
                        read: function (e) {
                            e.success(self.riskModelAnswerKeys.sort((a, b) => a.createdDate < b.createdDate ? 1: -1));
                        },
                        create: async (e) => {
                            console.log('owners', e.data.owners);
                            if (self.riskModelAnswerKeys.find(x => x.owners.includes(e.data.owners.ern) && x.answerKeyState === OnlineAccountApi.RiskModelState.Draft)) {
                                e.error({ errorMsg: `${e.data.owners.name} is already in progress!` });
                                return;
                            }
                            const rowData = { owner: e.data.owners.ern, name: self.activeRiskListName, principalERN: self.activeRiskListERN };
                            console.log('rowData', rowData);
                            const response = await self.addRiskModelAnswerKey(rowData);
                            console.log('addRiskModel', response.result);
                            self.riskModelAnswerKeys.push(response.result);
                            self.detailsGrid.setDataSource(self.getKendoGridDataSource());
                            self.detailsGrid.refresh();
                            e.success(response.result);
                        }
                    },
                    error: function (e) {
                        alert("Error: " + e?.xhr?.errorMsg);
                    },
                    pageSize: 10,
                    batch: false,
                    schema: {
                        model: {
                            id: "ern",
                            fields: {
                                ern: { editable: false, nullable: true },
                                riskScore: { editable: false },
                                answerKeyState: { editable: false },
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
                this.activeRiskListName = name;
                this.activeRiskListERN = ern;
                this.levels.push(name);

                let listRiskAnswerKeyResponse = this.serviceClients.onlineAccountApi.get(new ListRiskAnswerKeyRequest({
                    owner: this.activeRiskListERN
                }));

                let listRiskAssessmentResponse = this.serviceClients.onlineAccountApi.get(new ListRiskAssessmentRequest({
                    owner: this.activeRiskListERN, 
                    type: OnlineAccountApi.RiskModelType.CRA
                }));

                Promise.all([listRiskAssessmentResponse, listRiskAnswerKeyResponse]);

                listRiskAssessmentResponse.then(response => {
                    this.riskAssessments = response.results;
                    this.activeLevelIndex ++;
                })

                listRiskAnswerKeyResponse.then(response => {
                    this.riskModelAnswerKeys = response.results.filter(item => !!item.name);
                    console.log('riskModelAnswerKeys', this.riskModelAnswerKeys);
                    this.isLoadedRiskModelAnswerKeys = true; 
                });
                break;
            case 2:
                this.activeRiskAnswerKeyERN = ern;
                let riskModelAnswerKeyRespnse = this.serviceClients.onlineAccountApi.get(new RiskModelAnswerKeyRequest({
                    ern
                }));
                riskModelAnswerKeyRespnse.then(response => {
                    this.activeRiskModelAnswerKey = response.result;
                    console.log('riskModelAnswerKeyRespnse', this.activeRiskModelAnswerKey);
                    this.activeRiskModel = this.getRiskModelByERN(this.activeRiskModelAnswerKey.owners);
                    this.levels.push(this.activeRiskModel.name);

                    let listRiskModelCollectionResponse = this.serviceClients.onlineAccountApi.get(new RiskModelCollectionRequest({
                        ern: this.activeRiskModel.ern
                    }));
                    listRiskModelCollectionResponse.then(response => {
                        this.riskModelCollection = response.result; 
                        console.log('riskModelCollection', this.riskModelCollection);
                        this.isLoadedRiskModel = true;
                        this.riskCategories = Object.values(this.riskModelCollection.categories).sort((a, b) => a.sortOrder - b.sortOrder);
                        this.riskComponents = this.riskCategories.reduce((prev, currentCategory) => [...prev, ...Object.values(this.riskModelCollection.components).filter(component => component.owners.includes(currentCategory.ern)).sort((a, b) => a.sortOrder - b.sortOrder)], []);
                        console.log('riskComponents', this.riskComponents);
                        // this.riskComponents = Object.values(this.riskModelCollection.components).sort((a, b) => a.sortOrder - b.sortOrder);
                        this.riskFactors = this.riskComponents.reduce((prev, currentComponent) => [...prev, ...Object.values(this.riskModelCollection.factors).filter(factor => factor.owners.includes(currentComponent.ern)).sort((a, b) => a.sortOrder - b.sortOrder)], []);
                        console.log('riskFactors', this.riskFactors);
                        // this.riskFactors = Object.values(this.riskModelCollection.factors).sort((a, b) => a.sortOrder - b.sortOrder);
                        this.riskAnswers = this.riskFactors.reduce((prev, currentFactor) => [...prev, ...Object.values(this.riskModelCollection.answers).filter(answer => answer.owners.includes(currentFactor.ern)).sort((a, b) => a.sortOrder - b.sortOrder)], []);
                        console.log('riskAnswers', this.riskAnswers);
                        // this.riskAnswers = Object.values(this.riskModelCollection.answers).sort((a, b) => a.sortOrder - b.sortOrder);
                        
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
                        e.success(self.riskProfiles.filter(item => item.type === OnlineAccountApi.RiskModelType.CRA && item.state === OnlineAccountApi.RiskModelState.Approved));
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

    getRiskModelByERN(owners: string[]) {
        const riskModel = this.riskProfiles.find(item => owners.includes(item.ern) || owners.includes(item.previousERN));
        
        return riskModel;
    }

    getRiskModelNameByERN(riskModelERN) {
        const riskModel = this.riskProfiles.find(item => item.ern === riskModelERN || item.previousERN === riskModelERN);
        
        return riskModel?.name;
    }

    async moveToLevel(level: number) {
        if (level !== this.activeLevelIndex) {
            this.levels = this.levels.slice(0, level);
            this.activeLevelIndex = level;
            console.log('levels', this.levels);
            if (level === 1) {
                this.isLoadedRiskModelAnswerKeys = false;
                this.riskListAssessments = await Promise.all(this.riskLists.map(async (riskList) => {
                    const riskAssessments = (await this.serviceClients.onlineAccountApi.get(new ListRiskAssessmentRequest({owner: riskList.ern, type: OnlineAccountApi.RiskModelType.CRA})))?.results;
                    return { ...riskList, riskScore: riskAssessments.length > 0 ? riskAssessments[0].riskScore : null, createdDate: riskAssessments.length > 0 ? riskAssessments[0].createdDate: null };
                }))
                
                this.isLoadedRiskListAssessments = true;
                console.log('riskListAssessments', this.riskListAssessments);
                this.assessmentsGrid.dataSource.read();
            }
        }
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
                    let listRiskAssessmentResponse = this.serviceClients.onlineAccountApi.get(new ListRiskAssessmentRequest({
                        owner: this.activeRiskListERN, 
                        type: OnlineAccountApi.RiskModelType.CRA
                    }));

                    listRiskAssessmentResponse.then(response => {
                        this.riskAssessments = response.results;

                        let listRiskAnswerKeyResponse = this.serviceClients.onlineAccountApi.get(new ListRiskAnswerKeyRequest({
                            owner: this.activeRiskListERN
                        }));
                        listRiskAnswerKeyResponse.then(response => {
                            this.riskModelAnswerKeys = response.results; 
                            this.isLoadedRiskModelAnswerKeys = true; 
                            this.activeLevelIndex = 2;
                            this.levels = this.levels.slice(0, 2);
                            this.endAnswering = false;
                            // this.detailsGrid.dataSource.read();
                            console.log('riskModelAnswerKeys', this.riskModelAnswerKeys);
                        });
                    });
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

    async elementChanged(event, riskFactorERN) {
        const answerERN = event.target.value;
        console.log('event', event.target.value);
        let craAnswer = new KeyValuePair<string, string>({key: riskFactorERN, value: answerERN});
        let updatedAnswerKey = (await this.serviceClients.onlineAccountApi.patch(new RiskModelAnswerKeyRequest({
            ern: this.activeRiskAnswerKeyERN,
            patchCRA: craAnswer
        })))?.result;

        console.log('updatedAnswerKey', updatedAnswerKey);
        this.activeRiskModelAnswerKey = updatedAnswerKey;
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

