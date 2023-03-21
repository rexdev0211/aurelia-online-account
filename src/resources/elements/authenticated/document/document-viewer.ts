import {bindable} from 'aurelia-framework';
import {base64StringToBlob} from "blob-util";
import * as FileSaver from "file-saver";
import {DocumentStoreApi} from "../../../../dtos/documentstore-api.dtos";
import {BaseElement} from '../../../../bases/base-element';

export class DocumentViewerCustomElement extends BaseElement {
    @bindable documents: DocumentStoreApi.DocumentSummary[];
    @bindable removeDocument: Function;
    @bindable header: string;
    @bindable boldHeader: string;

    constructor(...args) {
        super(...args);
    }

    async download(document: DocumentStoreApi.DocumentSummary) {
        kendo.confirm(`Are you sure you want to download the file ${document.fileName}`)
            .then(async t => {
                let response: DocumentStoreApi.DocumentContentResponse = await this.serviceClients.documentStoreApi.get(new DocumentStoreApi.DocumentContentRequest({ern: document.ern}));
                FileSaver.saveAs(base64StringToBlob(response.result, document.contentType), document.fileName, false);
            })
    }

    async remove(document: DocumentStoreApi.DocumentSummary) {
        kendo.confirm(`Are you sure you want to remove the file ${document.fileName}`)
            .then(t => {
                if (this.removeDocument) this.removeDocument(document);
            })
    }
}

