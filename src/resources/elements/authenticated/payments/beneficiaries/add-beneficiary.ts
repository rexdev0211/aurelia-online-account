import {dispatchify} from "aurelia-store";
import {BaseElement} from '../../../../../bases/base-element';
import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";
import environment from "../../../../../environment";
import {InitiateModal} from "../../../../modals/jumio/initiate";
import {DocumentUploaderCustomElement} from "../../document/document-uploader";
import {AddBeneficiaryModel} from "./add-beneficiary-model";
import {BeneficiaryViewType} from "./beneficiary-state";
import Dropzone from "dropzone";

export class AddBeneficiaryCustomElement extends BaseElement {
    model: AddBeneficiaryModel = new AddBeneficiaryModel();
    beneficiaryTypes: Array<string>;
    accountType: string;
    private documentUploader: DocumentUploaderCustomElement;
    private showJumioButton: boolean = environment().region == 'int';


    constructor(...args) {
        super(...args);

        this.model = new AddBeneficiaryModel();
        this.beneficiaryTypes = Object.keys(OnlineAccountApi.BeneficiaryType);
    }

    attached() {
        this.model = new AddBeneficiaryModel();
        this.model.linkToAccountERN = this.state.beneficiaries.sourceAccount.ern;
        this.model.beneficiary.documentERNs = [];
        this.model.beneficiary.beneficiaryType = OnlineAccountApi.BeneficiaryType.Person;
        this.validationController.reset();
        this.validationController.addObject(this.model);
        this.validationController.addObject(this.model.beneficiary);
        this.validationController.addObject(this.model.account);
        this.selectAccountType(false);
    }

    detached(){
        this.validationController.removeObject(this.model);
        this.validationController.removeObject(this.model.beneficiary);
        this.validationController.removeObject(this.model.account);
    }

    async submit() {
        this.model.beneficiary.nickName = this.model.account.nickName;
        let validationResult = await this.validationController.validate();
        if (!validationResult.valid) return;

        await this.save();
    }

    async save() {
        let response: OnlineAccountApi.AddBeneficiaryResponse = await this.serviceClients.onlineAccountApi.post(this.model);

        if (response.result) {
            this.notificationService.showMessage('success', 'Success', `Scheduled Add Beneficiary Successfully: ${this.model.account.accountName}`);
            this.back()
        }
    }

    async back() {
        await dispatchify('setBeneficiariesView')(BeneficiaryViewType.Manage);
    }

    processAccountName() {
        if (this.model.beneficiary.beneficiaryType != OnlineAccountApi.BeneficiaryType.Person) {
            this.model.account.accountName = this.model.beneficiary.accountName = this.model.beneficiary.businessName;
            this.model.beneficiary.firstName = null;
            this.model.beneficiary.lastName = null;
        } else {
            this.model.account.accountName = `${this.model.beneficiary.firstName || ''} ${this.model.beneficiary.lastName || ''}`.trim();
            this.model.beneficiary.accountName = this.model.account.accountName;
        }
        this.model.account.nickName = this.model.account.accountName;
    }

    processBusinessName() {
        this.model.beneficiary.accountName = this.model.account.accountName;
    }

    selectAccountType(validate: boolean = true) {
        this.accountType = '';
        if (!!this.model.account.iban) {
            this.accountType = 'IBAN';
        } else if (!(!this.model.account.sortCode && !this.model.account.accountNumber)) {
            this.accountType = 'BBAN';
        }
        if (validate) {
            this.validationController.validate({object: this.model.account, propertyName: 'iban'});
            this.validationController.validate({object: this.model.account, propertyName: 'sortCode'});
            this.validationController.validate({object: this.model.account, propertyName: 'accountNumber'});
        }
    }

    initiateJumio() {
        this.showJumioButton = false;

        this.documentUploader.documentDropZone.type = 'Jumio Document';
        this.documentUploader.documentDropZone.body = 'Click here to add Jumio file';
        this.documentUploader.documentDropZone.dropDownHidden = true;
        this.documentUploader.header = 'Jumio Documents:';

        this.taskQueue.queueMicroTask(() => {
            (this.documentUploader.documentDropZone.myDropZone as any).removeEventListeners();
        })

        let clickActive = true;

        this.documentUploader.documentDropZone.dropZone.addEventListener('click', ev => {
            if (clickActive) {
                clickActive = false;
                this.dialogService
                    .open({viewModel: InitiateModal, lock: false})
                    .whenClosed(async response => {
                        if (!response.wasCancelled) {
                            const file: Dropzone.DropzoneFile = new File([new Blob([JSON.stringify(response.output.result, null, 2)], {type: 'application/json'})], `${response.output.result.transactionReference}.json`) as Dropzone.DropzoneFile;
                            this.documentUploader.documentDropZone.myDropZone.addFile(file);
                        }
                        clickActive = true;
                    });
            }
        });
    }
}

