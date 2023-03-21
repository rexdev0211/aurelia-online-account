import {BaseElement} from '../../../../bases/base-element';
import {OnlineAccountApi} from "../../../../dtos/onlineaccount-api.dtos";
import Enumerable from "linq";
import {observable} from "aurelia-framework";
import RiskConfigRequest = OnlineAccountApi.RiskConfigRequest;
import ListRiskAnswerRequest = OnlineAccountApi.ListRiskAnswerRequest;
import ListRiskModelRequest = OnlineAccountApi.ListRiskModelRequest;
import ListRiskTemplateRequest = OnlineAccountApi.ListRiskTemplateRequest;
import ListRiskAuditTrailRequest = OnlineAccountApi.ListRiskAuditTrailRequest;
import RiskModelAnswerKeyRequest = OnlineAccountApi.RiskModelAnswerKeyRequest;
import RiskModelCollectionRequest = OnlineAccountApi.RiskModelCollectionRequest;
import KeyValuePair = OnlineAccountApi.KeyValuePair;

// @leonid: Please make all components follow this pattern of a view and view-model which extends BaseElement.
// extending gives you access to everything in the BaseElement / BaseProperties class.
export class RiskConfigCustomElement extends BaseElement {
    @observable selectedBusiness;
    @observable riskProfiles: OnlineAccountApi.RiskModelRecord[];
    @observable riskConfig: OnlineAccountApi.RiskConfigRecord;

    private riskTemplates: OnlineAccountApi.RiskModelRecord[];
    private riskIndustries: OnlineAccountApi.RiskAnswerRecord[];
    private riskCountries: OnlineAccountApi.RiskAnswerRecord[];
    private businessRecords: OnlineAccountApi.CustomerBusinessLookup[];
    private auditTrailRecords: OnlineAccountApi.RiskAuditTrailRecord[];
    private auditTrailTotal: number;
    private showAudit: boolean;
    private riskResidualMethodTypes = Object.entries(OnlineAccountApi.RiskResidualMethodType).map(([key, value]) => ({ key, value }));
    private defaultLabelsForFiveMatrix: string[] = ['Very Low', 'Low', 'Medium', 'High', 'Very High'];
    private defaultLabelsForThreeMatrix: string[] = ['Low', 'Medium', 'High'];
    private riskMatrixImpact: number;
    private riskMatrixProbability: number;
    private defaultRiskConfig: OnlineAccountApi.RiskConfigRecord = {
        ern: null,
        owners: [],
        riskMatrix: [5, 5],
        maximumWeightAdjustment: [0, 0],
        riskReductionFloor: [0, 0],
        controlMethodLabel: ['Impact', 'Probability'],
        riskImpactLabel: this.defaultLabelsForFiveMatrix,
        riskProbabilityLabel: this.defaultLabelsForFiveMatrix,
        residualRiskMethod: OnlineAccountApi.RiskResidualMethodType.AggregateMinusAggregate,
        customPropertySchema: null,
        name: null
    };

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

        // Let's grab the templates
        let templateResponse = await this.serviceClients.onlineAccountApi.get(new ListRiskTemplateRequest());
        if (templateResponse.results) this.riskTemplates = templateResponse.results;
    }

    async patchAnswerKey() {
        let answerKeyERN = 'IRiskModelAnswerKey:01GE1TSP9NJW3B3WDDE31HFSRQ';
        let answerKey = (await this.serviceClients.onlineAccountApi.get(new RiskModelAnswerKeyRequest({ern: answerKeyERN})))?.result;
        let riskModel = (await this.serviceClients.onlineAccountApi.get(new RiskModelCollectionRequest({ern: answerKey.owners[1]})))?.result;
        let factorERN = Object.keys(riskModel.factors)[0];
        let bwraAnswer = new KeyValuePair<string, number[]>({key: factorERN, value: [1, 1]});
        let updatedAnswerKey = (await this.serviceClients.onlineAccountApi.patch(new RiskModelAnswerKeyRequest({
            ern: answerKeyERN,
            patchBWRA: bwraAnswer
        })))?.result;

        // You can now replace your current answer key with the one that comes back as it wil be complete and up-to-date.
        debugger;
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
            console.log('riskConfig', this.riskConfig);
        }
        this.riskConfig = { ...this.defaultRiskConfig, ...this.riskConfig };
        console.log('this.riskConfig', this.riskConfig);
        this.riskMatrixImpact = this.riskConfig.riskMatrix[0];
        this.riskMatrixProbability = this.riskConfig.riskMatrix[1];
    }

    async riskConfigChanged(newValue) {
        console.log('riskConfigChanged', newValue);
        // let businessCode = newValue.owners[0];
        // // lets gets the industries and countries asynchronously
        // let lookupResponse = this.serviceClients.onlineAccountApi.get(new ListRiskAnswerRequest({owner: businessCode}));
        // let riskProfilesResponse = this.serviceClients.onlineAccountApi.get(new ListRiskModelRequest({owner: businessCode}));
        // let auditResponse = this.serviceClients.onlineAccountApi.get(new ListRiskAuditTrailRequest({
        //     owner: businessCode,
        //     take: 5
        // }));

        // await Promise.all([lookupResponse, riskProfilesResponse, auditResponse]);

        // // let's set the industries and countries
        // lookupResponse.then(response => {
        //     this.riskIndustries = Enumerable.from(response.results).where(x => x.owners[1] === 'Industry').toArray();
        //     this.riskCountries = Enumerable.from(response.results).where(x => x.owners[1] === 'Country').toArray();
        // });

        // // let's set the risk profiles
        // riskProfilesResponse.then(response => this.riskProfiles = response.results);

        // // let's save the last audit trails
        // auditResponse.then(response => {
        //     this.auditTrailRecords = response.results;
        //     this.auditTrailTotal = response.count;
        // })
    }

    createProfileFromTemplate() {
        kendo.confirm(`Create new profile <strong>${this.riskTemplates[0].name}</strong> ?`)
            .then(async () => {
                // we can store / move this all in state / data-store
                let craResponse = this.serviceClients.onlineAccountApi.post(new OnlineAccountApi.RiskTemplateRequest({
                    owner: this.riskConfig.owners[0],
                    templateERN: this.riskTemplates[0].ern
                }));
                let bwraResponse = this.serviceClients.onlineAccountApi.post(new OnlineAccountApi.RiskTemplateRequest({
                    owner: this.riskConfig.owners[0],
                    templateERN: this.riskTemplates[1].ern
                }));

                await Promise.all([craResponse, bwraResponse]);

                craResponse.then(res => this.notificationService.showMessage('success', 'Success', `CRA Risk Profile <strong>${res.result.name}</strong> Created Sucessfully`));
                bwraResponse.then(bwraResponse => this.notificationService.showMessage('success', 'Success', `BWRA Risk Profile <strong>${bwraResponse.result.name}</strong> Created Sucessfully`));
            });
    }

    toggleAudit() {
        this.showAudit = !this.showAudit;
    }

    getArrayOfIntegersFromZeroToNumber(value) {
        return Array.from(Array(value * 1).keys());
    }

    changeImpactLabels(riskMatrixImpact) {
        this.riskMatrixImpact = riskMatrixImpact;
        if (riskMatrixImpact === 5)
            this.riskConfig.riskImpactLabel = this.defaultLabelsForFiveMatrix;
        else if (riskMatrixImpact === 3)
            this.riskConfig.riskImpactLabel = this.defaultLabelsForThreeMatrix;
        else
            this.riskConfig.riskImpactLabel = this.riskConfig.riskImpactLabel.slice(0, riskMatrixImpact);
    }

    changeProbabilityLabels(riskMatrixProbability) {
        this.riskMatrixProbability = riskMatrixProbability;
        if (riskMatrixProbability === 5)
            this.riskConfig.riskProbabilityLabel = this.defaultLabelsForFiveMatrix;
        else if (riskMatrixProbability === 3)
            this.riskConfig.riskProbabilityLabel = this.defaultLabelsForThreeMatrix;
        else
            this.riskConfig.riskProbabilityLabel = this.riskConfig.riskProbabilityLabel.slice(0, riskMatrixProbability);
    }

    async saveRiskConfig() {
        console.log('saveRiskConfig', this.riskConfig);
        this.riskConfig = { 
            ...this.riskConfig, 
            riskImpactLabel: this.riskConfig.riskImpactLabel.slice(0, this.riskConfig.riskMatrix[0]),
            riskProbabilityLabel: this.riskConfig.riskProbabilityLabel.slice(0, this.riskConfig.riskMatrix[1])
        };
        console.log('updateRiskConfig', this.riskConfig);

        let putRiskConfigRequest = await this.serviceClients.onlineAccountApi.put(new RiskConfigRequest(this.riskConfig));
        if (putRiskConfigRequest.result) {
            console.log('putRiskConfigRequest', putRiskConfigRequest.result);
            this.riskConfig = putRiskConfigRequest.result;
            await this.notificationService.showMessage("success", "Risk Configuration is Sucessfully Saved", "");
        }
    }

    async refresh() {
        await this.riskConfigChanged(this.riskConfig)
    }

    back() {
        history.back();
    }
}


