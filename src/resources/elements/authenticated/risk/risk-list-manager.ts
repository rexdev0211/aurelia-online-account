import {BaseElement} from '../../../../bases/base-element';
import {OnlineAccountApi} from "../../../../dtos/onlineaccount-api.dtos";
import Enumerable from "linq";
import {observable} from "aurelia-framework";
import RiskConfigRequest = OnlineAccountApi.RiskConfigRequest;
import ListRiskSystemListRequest = OnlineAccountApi.ListRiskSystemListRequest;
import ListRiskSystemListResponse = OnlineAccountApi.ListRiskSystemListResponse;
import ListRiskListRequest = OnlineAccountApi.ListRiskListRequest;
import ListRiskListResponse = OnlineAccountApi.ListRiskListResponse;
import RiskListRequest = OnlineAccountApi.RiskListRequest;
import RiskSystemListRequest = OnlineAccountApi.RiskSystemListRequest;
import RiskSystemListType = OnlineAccountApi.RiskSystemListType;
import RiskListType = OnlineAccountApi.RiskListType;

export class RiskListManagerCustomElement extends BaseElement {
    @observable selectedBusiness;
    @observable riskSystemListsByTypes: OnlineAccountApi.RiskAnswerRecord[];
    @observable riskListsByTypes: OnlineAccountApi.RiskListRecord[];
    @observable riskConfig: OnlineAccountApi.RiskConfigRecord;

    private riskSystemListsCount: number = 0;
    private riskListsCount: number = 0;
    private businessRecords: OnlineAccountApi.CustomerBusinessLookup[];
    private businessCode: string;

    @observable isLoadedOfRiskTypes: boolean = false;
    private activeLevelIndex: number = 1;
    private pageSize: number = 10;
    private pageable = {
        refresh: true,
        pageSizes: true,
        buttonCount: 10
    };
    private tabs = [{ ern: 'SystemLists', name: 'System Lists' }, { ern: 'UserLists', name: 'User Lists' }];
    private riskSystemListTypes = Object.entries(RiskSystemListType).map(([key, value]) => ({ key, value }));
    private riskListTypes = Object.entries(RiskListType).map(([key, value]) => ({ key, value }));
    private levels: string[] = ['Lists'];
    @observable activeCategoryERN: string = '';
    private activeType: string = '';
    private systemListsGrid;
    private riskListsGrid;

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

    getKendoGridDataSource() {
        const self = this;
        switch (self.activeLevelIndex) {
            case 1:
                return {
                    transport: {
                        read: function (e) {
                            e.success(self.tabs);
                        },
                    },
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
            case 2:
                return {
                    transport: {
                        read: function (e) {
                            e.success(self.activeCategoryERN === 'SystemLists' ? self.riskSystemListTypes : self.riskListTypes);
                        },
                    },
                    batch: false,
                    schema: {
                        model: {
                            id: "key",
                            fields: {
                                key: { editable: false, nullable: true },
                                value: { type: "string", validation: { required: true } }
                            }
                        }
                    }
                };
            case 3:
                if (self.activeCategoryERN === 'SystemLists')
                    return {
                        serverPaging: true,
                        pageSize: self.pageSize,
                        batch: false,
                        schema: {
                            total: "total",
                            data: "data",
                            model: {
                                id: "ern",
                                fields: {
                                    ern: { editable: false, nullable: true },
                                    answer: { type: "string", validation: { required: true } },
                                    riskScore: { type: "number", validation: { required: true, min: 1, max: self.riskConfig.riskMatrix[0] } },
                                }
                            }
                        },
                        requestStart: function () {
                            self.progressService.startProgress();
                        },
                        requestEnd: function () {
                            self.progressService.stopProgress();
                        },
                        transport: {
                            read: async (e: any) => {
                                let skip = (e.data.skip != null) ? e.data.skip : 0;
                                let take = (e.data.take != null) ? e.data.take : skip === 0 ? e.data.pageSize : (e.data.page - 1) * e.data.pageSize;

                                let errorThrown: boolean = false;

                                this.serviceClients.onlineAccountApi.get(new ListRiskSystemListRequest({
                                    owner: self.businessCode,
                                    type: <RiskSystemListType>self.activeType,
                                    skip: skip,
                                    take: take,
                                }))
                                    .catch(response => {
                                        errorThrown = true;
                                        e.error(new Error(response.responseStatus.message));
                                    })
                                    .then(value => {
                                        if (!errorThrown) {
                                            let response = (value as ListRiskSystemListResponse);
                                            self.riskSystemListsByTypes = response.results;
                                            self.riskSystemListsCount = response.count;
                                            e.success({
                                                "total": response.count,
                                                "data": self.utils.rehydrateMeta(response.results)
                                            });
                                        }
                                    });
                            },
                            create: async (e: any) => {
                                try {
                                    const rowData = { ...e.data };
                                    console.log('rowData', rowData);
                                    const response = await self.addRiskAnswer(rowData);
                                    console.log('addRiskAnswerResponse', response.result);
                                    self.riskSystemListsByTypes.push(response.result);
                                    self.systemListsGrid.dataSource.page(Math.ceil((self.riskSystemListsCount + 1) / self.pageSize));
                                    e.success(response.result);
                                } catch (error) {
                                    e.error(new Error(error.responseStatus.message));
                                }
                                
                            },
                            update: async (e: any) => {
                                try {
                                    console.log('updateRiskAnswerRequest', e.data);
                                    const objIndex = self.riskSystemListsByTypes.findIndex((obj => obj.ern == e.data.ern));
                                    const response = await self.updateRiskAnswer(e.data);
                                    console.log('updateRiskAnswerResponse', response);
                                    self.riskSystemListsByTypes[objIndex] = response.result;
                                    e.success();
                                } catch (error) {
                                    e.error(new Error(error.responseStatus.message));
                                }
                            },
                            destroy: async (e: any) => {
                                const response = await self.deleteRiskAnswer(e.data);
                                const objIndex = self.riskSystemListsByTypes.findIndex((obj => obj.ern == response.result.ern));
                                self.riskSystemListsByTypes.splice(objIndex, 1);
                                e.success();
                            }
                        }
                    };
                else 
                    return {
                        serverPaging: true,
                        pageSize: self.pageSize,
                        batch: false,
                        schema: {
                            total: "total",
                            data: "data",
                            model: {
                                id: "ern",
                                fields: {
                                    ern: { editable: false, nullable: true },
                                    name: { type: "string", validation: { required: true } },
                                    externalId: { type: "string" }
                                }
                            }
                        },
                        requestStart: function () {
                            self.progressService.startProgress();
                        },
                        requestEnd: function () {
                            self.progressService.stopProgress();
                        },
                        transport: {
                            read: async (e: any) => {
                                let skip = (e.data.skip != null) ? e.data.skip : 0;
                                let take = (e.data.take != null) ? e.data.take : skip === 0 ? e.data.pageSize : (e.data.page - 1) * e.data.pageSize;

                                let errorThrown: boolean = false;

                                this.serviceClients.onlineAccountApi.get(new ListRiskListRequest({
                                    owner: self.businessCode,
                                    type: <RiskListType>self.activeType,
                                    skip: skip,
                                    take: take,
                                }))
                                    .catch(response => {
                                        errorThrown = true;
                                        e.error(new Error(response.responseStatus.message));
                                    })
                                    .then(value => {
                                        if (!errorThrown) {
                                            let response = (value as ListRiskListResponse);
                                            self.riskListsByTypes = response.results;
                                            self.riskListsCount = response.count;
                                            e.success({
                                                "total": response.count,
                                                "data": self.utils.rehydrateMeta(response.results)
                                            });
                                        }
                                    });
                            },
                            create: async (e: any) => {
                                try {
                                    const rowData = { ...e.data };
                                    const response = await self.addRiskList(rowData);
                                    console.log('addRiskList', response.result);
                                    self.riskListsByTypes.push(response.result);
                                    self.riskListsGrid.dataSource.page(Math.ceil((self.riskListsCount + 1) / self.pageSize));
                                    e.success(response.result);
                                } catch (error) {
                                    e.error(new Error(error.responseStatus.message));
                                }
                            },
                            update: async (e: any) => {
                                try {
                                    console.log('updateRiskListRequest', e.data);
                                    const response = await self.updateRiskList(e.data);
                                    console.log('updateRiskListResponse', response);
                                    const objIndexByTypes = self.riskListsByTypes.findIndex((obj => obj.ern == e.data.ern));
                                    self.riskListsByTypes[objIndexByTypes] = response.result;
                                    e.success();
                                } catch (error) {
                                    e.error(new Error(error.responseStatus.message));
                                }
                            },
                            destroy: async (e: any) => {
                                const response = await self.deleteRiskList(e.data);
                                const objIndexByTypes = self.riskListsByTypes.findIndex((obj => obj.ern == response.result.ern));
                                self.riskListsByTypes.splice(objIndexByTypes, 1);
                                e.success();
                            }
                        },
                    };
            default:
                break;
        }
    }

    async goToLevelDown(ern: string, name: string) {
        switch (this.activeLevelIndex) {
            case 1:
                this.activeCategoryERN = ern;
                console.log('activeCategoryERN', this.activeCategoryERN);
                this.levels.push(name);
                break;
            case 2:
                this.activeType = ern;
                this.levels.push(name);
                break;
            default:
                break;
        }
        this.activeLevelIndex ++;
    }

    moveToLevel(level: number) {
        console.log('level', level);
        console.log('activeLevelIndex', this.activeLevelIndex);
        if (level !== this.activeLevelIndex) {
            this.levels = this.levels.slice(0, level);
            this.activeLevelIndex = level;
            console.log('levels', this.levels);
        }
    }

    
    async addRiskAnswer(riskAnswer) {
        console.log('addRiskAnswer', riskAnswer);
        console.log('activeType', this.activeType);
        let addRiskAnswerResponse = this.serviceClients.onlineAccountApi.post(new RiskSystemListRequest({
            owner: this.riskConfig.owners[0],
            type: this.activeType,
            ...riskAnswer,
            sortOrder: this.riskSystemListsCount
        }));

        return await addRiskAnswerResponse;
    }

    async updateRiskAnswer(riskAnswer) {
        let updateRiskAnswerResponse = this.serviceClients.onlineAccountApi.put(new RiskSystemListRequest(riskAnswer));

        return await updateRiskAnswerResponse;
    }

    async deleteRiskAnswer(riskAnswer) {
        let deleteRiskAnswerResponse = this.serviceClients.onlineAccountApi.delete(new RiskSystemListRequest({ ern: riskAnswer.ern }));

        return await deleteRiskAnswerResponse;
    }

    async addRiskList(riskList) {
        console.log('type', this.activeType);
        console.log('riskList', riskList);
        let addRiskListResponse = this.serviceClients.onlineAccountApi.post(new RiskListRequest({
            owner: this.riskConfig.owners[0],
            type: this.activeType,
            ...riskList
        }));

        return await addRiskListResponse;
    }

    async updateRiskList(riskList) {
        console.log('riskList', riskList);
        let updateRiskListResponse = this.serviceClients.onlineAccountApi.put(new RiskListRequest(riskList));

        return await updateRiskListResponse;
    }

    async deleteRiskList(riskList) {
        let deleteRiskListResponse = this.serviceClients.onlineAccountApi.delete(new RiskListRequest({ ern: riskList.ern }));

        return await deleteRiskListResponse;
    }

    textareaEditor(container, options) {
        (<any>$('<textarea class="k-textbox" rows="3" data-bind="value:' + options.field + '" required>' + options.model[options.field] + '</textarea>')
        .appendTo(container));
    }

    back() {
        if (this.activeLevelIndex === 1)
            history.back();
        else 
            this.moveToLevel(this.activeLevelIndex - 1);
    }
}

