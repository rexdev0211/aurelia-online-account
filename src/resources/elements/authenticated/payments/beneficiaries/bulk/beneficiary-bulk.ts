import {bindable, observable} from 'aurelia-framework';
import {dispatchify} from "aurelia-store";
import * as FileSaver from "file-saver";
import {BaseElement} from '../../../../../../bases/base-element';
import {OnlineAccountApi} from "../../../../../../dtos/onlineaccount-api.dtos";
import {CsvViewerCustomElement} from "../../../csv/csv-viewer";
import {BatchBeneficiaryAddModel} from "./batch-beneficiary-add-model";
import JobState = OnlineAccountApi.JobState;
import PendingApproval = OnlineAccountApi.PendingApproval;
import CsvValidationErrors = OnlineAccountApi.CsvValidationErrors;
import BatchBeneficiaryAddResponse = OnlineAccountApi.BatchBeneficiaryAddResponse;

export class BeneficiaryBulkCustomElement extends BaseElement {
    @observable csvFile: FileList;
    @bindable validationErrors: CsvValidationErrors;
    private model: BatchBeneficiaryAddModel;
    private csvSample: string = 'LinkToAccountNumber,BeneficiaryType,FirstName,LastName,DOB,BusinessName,AccountName,NickName,Iban,SortCode,AccountNumber';
    private drop_zone: HTMLDivElement;
    private file_upload: HTMLInputElement;
    private validated: boolean;
    private csvViewer: CsvViewerCustomElement;
    private upload_form: HTMLFormElement;
    private validate: boolean;
    private skipErrors: boolean;
    private downloadInvalidated: boolean;
    private downloadValidated: boolean;


    constructor(...args) {
        super(...args);
        this.model = new BatchBeneficiaryAddModel();
        this.validated = false;
    }

    csvFileChanged(newValue: FileList, oldValue: FileList) {
        if (newValue && newValue.length) this.readCsvFile(newValue[0]);
    }


    async submit() {
        if (!this.validate) {
            this.model = new BatchBeneficiaryAddModel();
            this.model.csvContents = this.state.beneficiaries.bulk.csvContents;
            this.model.csvFileName = this.state.beneficiaries.bulk.csvFileName;
            let response: BatchBeneficiaryAddResponse = await this.serviceClients.onlineAccountApi.post(this.model);
            if (response) {
                this.validate = true;
                this.validated = response.validated;
                this.csvViewer.validationErrors = response.validationErrors;
                if (response.result) {
                    await dispatchify("upsertJob")(response.result);

                    await this.notificationService.showMessage('success', 'Success', 'Bulk Beneficiaries Scheduled Successfully');
                    if (response.result.state === JobState.Scheduled || response.result.requestedBy.approvalState === PendingApproval.Pending) {
                        location.hash = "#";
                    } else {
                        await dispatchify('setJobViewerERN')(response.result.jobERN);
                        location.hash = "#/job/status";
                    }
                }
            }
        } else {
            if (this.skipErrors) {
                if (this.downloadInvalidated)
                    FileSaver.saveAs(new Blob([this.csvViewer.getInvalidCsv().join('\n')], {
                        type: "text/plain;charset=utf-8",
                        endings: 'native'
                    }), `Invalidated_${this.model.csvFileName}`, false);

                if (this.downloadValidated)
                    FileSaver.saveAs(new Blob([this.csvViewer.getValidCsv().join('\n')], {
                        type: "text/plain;charset=utf-8",
                        endings: 'native'
                    }), `Validated_${this.model.csvFileName}`, false);

                this.model.csvFileName = `Validated_${this.model.csvFileName}`;
                this.model.csvContents = this.csvViewer.getValidCsv().join('\n');
            }

            let validationResult = await this.validationController.validate({object: this.model});
            if (!validationResult.valid) return;

            let response: BatchBeneficiaryAddResponse = await this.serviceClients.onlineAccountApi.post(this.model);
            this.validated = response.validated;
            this.csvViewer.validationErrors = response.validationErrors;
            if (response.result) {
                await dispatchify("upsertJob")(response.result);

                await this.notificationService.showMessage('success', 'Success', 'Bulk Beneficiaries Scheduled Successfully');
                if (response.result.state === JobState.Scheduled || response.result.requestedBy.approvalState === PendingApproval.Pending) {
                    location.hash = "#";
                } else {
                    await dispatchify('setJobViewerERN')(response.result.jobERN);
                    location.hash = "#/job/status";
                }
            }
        }
    }

    async back() {
        await dispatchify('clearBulkBeneficiaries')();
        this.validated = this.validate = this.skipErrors = false;
        this.csvViewer.detached();
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
                    if (csvLines.length > 30001) {
                        kendo.alert('Invalid CSV format.  Please limit the number of lines to 3000 or less');
                        this.file_upload.value = '';
                        return;
                    }
                    let csv = csvLines.join('\r\n');
                    await dispatchify('setBulkBeneficiaries')(value.name, csv);
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
        kendo.confirm('Are you sure you want to download the Bulk Beneficiaries template file')
            .then(t => {
                let blob = new Blob([this.csvSample], {
                    type: "text/plain;charset=utf-8"
                });
                FileSaver.saveAs(blob, 'Bulk_Beneficiaries_Template.csv', false);
            })
    }

}

