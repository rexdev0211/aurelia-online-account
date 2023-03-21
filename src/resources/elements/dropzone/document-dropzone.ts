import {bindable} from 'aurelia-framework';
import * as Dropzone from 'dropzone';
import environment from "../../../environment";
import {BaseElement} from '../../../bases/base-element';

export class DropzoneFile implements Dropzone.DropzoneFile {
  previewElement: HTMLElement;
  previewTemplate: HTMLElement;
  previewsContainer: HTMLElement;
  status: string;
  accepted: boolean;
  xhr?: XMLHttpRequest;
  readonly lastModified: number;
  readonly name: string;
  readonly size: number;
  readonly type: string;

  slice = (start?: number, end?: number, contentType?: string): Blob => {
    return new Blob();
  };

  constructor(init?: Partial<DropzoneFile>) {
    (<any>Object).assign(this, init);
  }

  arrayBuffer(): Promise<ArrayBuffer> {
    return Promise.resolve(undefined);
  }

  stream(): ReadableStream;
  stream(): ReadableStream;
  stream(): ReadableStream {
    return undefined;
  }

  text(): Promise<string> {
    return Promise.resolve("");
  }
}

export class DocumentDropzoneCustomElement extends BaseElement {
  @bindable type: string;
  @bindable types: string;
  @bindable dropDownHidden: boolean = false;
  // eslint-disable-next-line @typescript-eslint/ban-types
  @bindable successCallback: Function;
  @bindable body: string = 'Drop files here or click to upload.<br>(*.pdf, *.png, *.jpg, *.gif)';

  public dropZone: HTMLElement;
  public dzMessage: HTMLElement;
  public myDropZone: Dropzone;
  private url: string;
  private docTypes: { value: string; description: string }[] = [];
  private docTypeERN: string;

  constructor(...args) {
    super(...args);
    const dz = Dropzone
    dz.autoDiscover = false;
    //Dropzone.autoDiscover = false;
  }

  attached() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;

    if (this.types) this.docTypes = Array.from(this.types.split(',').map(x => ({
      value: x.trim(),
      description: x.trim()
    })));

    this.myDropZone = new Dropzone(this.dropZone, {
      url: `${environment().apiRoot}/documentstore-api/json/reply/DocumentUploadRequest`,
      maxFilesize: 5,
      headers: (() => ({'Authorization': `Bearer ${_this.state.authentication.user.bearerToken}`}))(),
      init: function () {
        this.on('addedfile', (file) => {
           $(_this.dzMessage).height(0);
          _this.progressService.startProgress();
        });
        this.on('complete', (file) => {
          _this.progressService.stopProgress();
        });
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      success: (file, response) => {
        if (_this.successCallback) _this.successCallback({response: response});
        file.previewElement.classList.add("dz-success");
      },
      sending: (file, xhr, formData) => {
        formData.append('DocumentTypeERN', this.docTypeERN)
      },
      acceptedFiles: '.pdf,.gif,.jpg,.jpeg,.png,.json',
      parallelUploads: 5,
    });

    this.typeChanged(this.type);
  }

  typeChanged(newValue: string) {
    if (newValue) {
      let docType = this.state.documentTypes.find(x => x.name.toLowerCase() == newValue.toLowerCase());
      this.docTypeERN = this.utils.getSafeERN(docType.ern);
      this.myDropZone.enable();
    } else {
      this.myDropZone.disable();
    }
  }

}

