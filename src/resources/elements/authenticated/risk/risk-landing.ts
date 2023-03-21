import {BaseElement} from '../../../../bases/base-element';
import {OnlineAccountApi} from "../../../../dtos/onlineaccount-api.dtos";
import Enumerable from "linq";
import {observable} from "aurelia-framework";
import ListRiskTemplateRequest = OnlineAccountApi.ListRiskTemplateRequest;
import ListRiskModelRequest = OnlineAccountApi.ListRiskModelRequest;
import RiskConfigRequest = OnlineAccountApi.RiskConfigRequest;

export class RiskLandingCustomElement extends BaseElement {
    @observable selectedBusiness;
    @observable riskProfiles: OnlineAccountApi.RiskModelRecord[];
    @observable riskConfig: OnlineAccountApi.RiskConfigRecord;

    private riskTemplates: OnlineAccountApi.RiskModelRecord[];
    private businessRecords: OnlineAccountApi.CustomerBusinessLookup[];

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

        let riskProfilesResponse = this.serviceClients.onlineAccountApi.get(new ListRiskModelRequest({owner: businessCode}));
        
        // let's set the risk profiles
        riskProfilesResponse.then(response => this.riskProfiles = response.results);

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

    back() {
        history.back();
    }
}


