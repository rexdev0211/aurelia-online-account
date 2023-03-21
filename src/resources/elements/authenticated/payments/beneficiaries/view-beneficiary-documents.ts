import {bindable, observable} from 'aurelia-framework';
import {base64StringToBlob} from "blob-util";
import * as FileSaver from "file-saver";
import {ApplicationState} from "../../../../../applicationState";
import {BaseElement} from '../../../../../bases/base-element';
import {DocumentStoreApi} from "../../../../../dtos/documentstore-api.dtos";
import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";
import {BeneficiaryViewType} from "./beneficiary-state";
import BeneficiaryAccount = OnlineAccountApi.BeneficiaryAccount;
import DocumentSummary = OnlineAccountApi.DocumentSummary;
import ListBeneficiaryDocumentsRequest = OnlineAccountApi.ListBeneficiaryDocumentsRequest;
import ListBeneficiaryDocumentsResponse = OnlineAccountApi.ListBeneficiaryDocumentsResponse;

export class ViewBeneficiaryDocumentsCustomElement extends BaseElement {
    @observable beneficiarySelected: BeneficiaryAccount;
    @observable viewType: BeneficiaryViewType;
    @bindable header: string;
    @bindable boldHeader: string;

    private treeView: kendo.ui.TreeView;
    private hasDocuments: boolean;
    private documents: Array<DocumentSummary>;

    constructor(...args) {
        super(...args);
    }

    download(e) {
        let dataItem: any = this.treeView.dataSource.getByUid(this.treeView.select()[0].dataset.uid);
        let document = this.documents.find(x => x.ern == dataItem.ern);

        kendo.confirm(`Are you sure you want to download the file ${document.fileName}`)
            .then(async t => {
                let response: DocumentStoreApi.DocumentContentResponse = await this.serviceClients.documentStoreApi.get(new DocumentStoreApi.DocumentContentRequest({ern: document.ern}));
                FileSaver.saveAs(base64StringToBlob(response.result, document.contentType), document.fileName, false);
            });
    }

    select(e) {
        //e.preventDefault();
    }

    attached() {
        this.hasDocuments = false;
    }

    async onReady(e) {
        this.treeView = e;
        await this.bindTreeView();
    }

    stateChanged(value: ApplicationState) {
        this.beneficiarySelected = this.utils.getPropertyValue<BeneficiaryAccount>(this.state, '.beneficiaries.selectedBeneficiary');
        this.viewType = this.utils.getPropertyValue<BeneficiaryViewType>(this.state, '.beneficiaries.view');
    }

    viewTypeChanged(value: BeneficiaryViewType) {
        if (value === BeneficiaryViewType.Manage)
            this.hasDocuments = false;
    }

    async beneficiarySelectedChanged(value: BeneficiaryAccount, oldValue: BeneficiaryAccount) {
        if (!value) return;

        if (value !== oldValue)
            await this.bindTreeView();
    }

    private async bindTreeView() {
        if (this.treeView)
            this.treeView.setDataSource(new kendo.data.HierarchicalDataSource({data: await this.getTreeViewData()}));
    }

    private async getTreeViewData() {
        let response: ListBeneficiaryDocumentsResponse = await this.serviceClients.onlineAccountApi.post(new ListBeneficiaryDocumentsRequest({beneficiaryERN: this.state.beneficiaries.selectedBeneficiary.beneficiaryERN}));

        this.documents = response.results;

        let map = new Map();
        response.results.forEach(doc => {
            if (!map.has(doc.documentType))
                map.set(doc.documentType, []);

            map.get(doc.documentType).push(this.buildTreeViewItem(doc));
        });

        let rootFolders = [];// {text: 'Beneficiary Documents', expanded: true, spriteCssClass: 'rootfolder', items: []};

        let iterator = map.keys();
        let key = iterator.next().value;
        this.hasDocuments = !!key;
        while (key) {
            rootFolders.push({text: key, expanded: false, spriteCssClass: 'folder', items: map.get(key)});
            key = iterator.next().value;
        }

        return rootFolders;
    }

    private buildTreeViewItem(doc: DocumentSummary): KendoTreeViewItem {
        return [doc].map(x => this.mapDocument(x))[0];
    }

    private mapDocument(doc: DocumentSummary) {
        let getSpriteCssClass = (documentType: string) => {
            switch (documentType) {
                case 'application/pdf':
                    return 'pdf';
                case 'image/jpeg':
                    return 'image';
                default:
                    return 'html';
            }
        };

        let menuItem = new KendoTreeViewItem({
            text: doc.fileName,
            ern: doc.ern,
            spriteCssClass: getSpriteCssClass(doc.contentType)
        });

        return menuItem;
    }

}

export class KendoTreeViewItem {
    ern: string;
    text: string;
    spriteCssClass: string;

    constructor(init?: Partial<KendoTreeViewItem>) {
        (<any>Object).assign(this, init);
    }
}