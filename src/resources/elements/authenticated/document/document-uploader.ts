import {bindable, bindingMode} from 'aurelia-framework';
import {BaseElement} from '../../../../bases/base-element';
import {DocumentStoreApi} from "../../../../dtos/documentstore-api.dtos";
import {DocumentDropzoneCustomElement} from "../../dropzone/document-dropzone";


export class DocumentUploaderCustomElement extends BaseElement {
    @bindable({defaultBindingMode: bindingMode.twoWay}) value: string[];
    @bindable validation: Function;
    @bindable header = 'Add Documents:';
    @bindable types = "Identification Document, Address Verification, Additional Documentation";

    public documentDropZone: DocumentDropzoneCustomElement

    constructor(...args) {
        super(...args);
    }

    uploadComplete(response: DocumentStoreApi.DocumentUploadResponse) {
        if (!this.value) this.value = new Array<string>();
        this.value.push(response.results[0].ern);
        if (this.validation) this.validation();
    }

    detached() {
        this.documentDropZone.myDropZone.destroy();
    }
}

