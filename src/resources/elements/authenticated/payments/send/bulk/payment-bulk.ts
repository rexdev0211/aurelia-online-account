import {bindable, observable} from 'aurelia-framework';
import {dispatchify} from "aurelia-store";
import * as FileSaver from "file-saver";
import {BaseElement} from '../../../../../../bases/base-element';
import {OnlineAccountApi} from "../../../../../../dtos/onlineaccount-api.dtos";
import {BatchSendFundsModel} from "./bulk-send-funds-model";
import {CsvViewerCustomElement} from "../../../csv/csv-viewer";
import BatchSendFundsResponse = OnlineAccountApi.BatchSendFundsResponse;
import JobState = OnlineAccountApi.JobState;
import PendingApproval = OnlineAccountApi.PendingApproval;
import CsvValidationErrors = OnlineAccountApi.CsvValidationErrors;

export class PaymentBulkCustomElement extends BaseElement {
    @observable csvFile: FileList;
    @bindable validationErrors: CsvValidationErrors;
    private model: BatchSendFundsModel;
    private csvSample: string = 'Account,Beneficiary,Date,Amount,Scheme,PaymentReference,InternalReference';
    private drop_zone: HTMLDivElement;
    private file_upload: HTMLInputElement;
    private validated: boolean;
    private csvViewer: CsvViewerCustomElement;
    private upload_form: HTMLFormElement;

    constructor(...args) {
        super(...args);
        this.model = new BatchSendFundsModel();
        this.validated = false;
    }

    csvFileChanged(newValue: FileList, oldValue: FileList) {
        if (newValue && newValue.length) this.readCsvFile(newValue[0]);
    }

    resend() {
        kendo.confirm('Are you sure you want to resend your SMS code?')
            .then(async t => {
                this.model.sendVerificationCode = true;
                let response: BatchSendFundsResponse = await this.serviceClients.onlineAccountApi.post(this.model)
                this.validated = response.validated;
                if (response.sendVerificationCode) {
                    this.model.sendVerificationCode = false;
                    await this.notificationService.showMessage('success', 'SMS Verification Code Sent', `Please check your mobile phone [${this.state.customerSummary.mobilePhone}] for your SMS verification code.`);
                }
            });
    }

    async submit() {
        if (!this.validated) {
            this.model = new BatchSendFundsModel();
            this.model.csvContents = this.state.payments.bulk.csvContents;
            this.model.csvFileName = this.state.payments.bulk.csvFileName;
            let response: BatchSendFundsResponse = await this.serviceClients.onlineAccountApi.post(this.model);
            this.validated = response.validated;
            this.model.crc = response.crc;
            this.csvViewer.validationErrors = response.validationErrors;

            if (response.sendVerificationCode)
                await this.notificationService.showMessage('success', 'SMS Verification Code Sent', `Please check your mobile phone [${this.state.customerSummary.mobilePhone}] for your SMS verification code.`);
        } else {
            let validationResult = await this.validationController.validate({object: this.model});
            if (!validationResult.valid) return;

            let response: BatchSendFundsResponse = await this.serviceClients.onlineAccountApi.post(this.model);
            this.validated = response.validated;
            this.csvViewer.validationErrors = response.validationErrors;
            if (response.result) {
                await dispatchify("upsertJob")(response.result);
                await dispatchify('setJobViewerERN')(response.result.jobERN);

                await this.notificationService.showMessage('success', 'Success', 'Bulk Payment Saved Successfully');
                if (response.result.state === JobState.Scheduled || response.result.requestedBy.approvalState === PendingApproval.Pending) {
                    location.hash = "#";
                } else {
                    location.hash = "#/job/status";
                }
            }
        }
    }

    async back() {
        await dispatchify('clearPayments')();
        this.validated = false;
    }

    attached() {
        this.drop_zone.addEventListener('dragover', (evt) => {
            evt.stopPropagation();
            evt.preventDefault();
            evt.dataTransfer.dropEffect = 'copy';
        }, false);

        this.drop_zone.addEventListener('drop', (evt) => {
            evt.stopPropagation();
            evt.preventDefault();
            this.readCsvFile(evt.dataTransfer.files[0]);
        }, false);
    }

    upload() {
        $(this.file_upload).click();
    }

    readCsvFile(value: File) {
        let reader = new FileReader();

        reader.onloadend = async (evt) => {
            if (evt.target.readyState == FileReader.DONE) { // DONE == 2
                let lines = evt.target.result.toString().split(/\r?\n/);
                let array1 = lines[0].split(',').sort();
                let array2 = this.csvSample.split(',').sort();
                let match = array1.length === array2.length && array1.every((value, index) => value === array2[index]);
                if (match) {
                    let csvLines = lines.filter(line => {
                        let trim = line.replace(/\s/g, "");
                        return trim.length > this.csvSample.split(',').length;
                    });
                    if (csvLines.length > 251) {
                        kendo.alert('Invalid CSV format.  Please limit the number of lines to 250 or less');
                        this.file_upload.value = '';
                        return;
                    }
                    let csv = csvLines.join('\r\n');
                    await dispatchify('setBulkPayments')(value.name, csv);
                    this.csvViewer.csv = csv;
                } else {
                    kendo.alert('Invalid CSV format.  Please download and start with the sample to ensure proper format');
                    this.file_upload.value = '';
                }
            }
        };

        reader.readAsBinaryString(value);
        this.upload_form.reset();
    }

    download() {
        kendo.confirm('Are you sure you want to download the Bulk Payments template file')
            .then(t => {
                let blob = new Blob([this.csvSample], {
                    type: "text/plain;charset=utf-8"
                });
                FileSaver.saveAs(blob, 'Bulk_Send_Template.csv', false);
            })
    }

}

