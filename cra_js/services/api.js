import {ProgressService} from '../../../../services/progress-service.js'
import {inject} from 'aurelia-framework';

import modelJSON from "../common/data/CRA-EMPTY-MODEL.json";
import countriesJSON from "../common/data/CRA-COUNTRY.json";
import industriesJSON from "../common/data/CRA-INDUSTRY.json";
import profileJSON from "../common/data/CRA-EMPTY-PROFILE.json";

@inject(ProgressService)
export class Api {

    constructor(ProgressService) {
        this.progressService = ProgressService;
    }

    getCRAModel() {
        this.progressService.startProgress();

        return new Promise((resolve, reject) => {
            this.progressService.stopProgress();
            resolve(modelJSON);
        });
    }

    getCRACountries() {
        this.progressService.startProgress();

        return new Promise((resolve, reject) => {
            this.progressService.stopProgress();
            resolve(countriesJSON);
        });
    }

    getCRAIndustries() {
        this.progressService.startProgress();

        return new Promise((resolve, reject) => {
            this.progressService.stopProgress();
            resolve(industriesJSON);
        });
    }

    setCRAModel(model) {
        this.progressService.startProgress();

        return new Promise((resolve, reject) => {
            console.log('FinalModel', model);
            this.progressService.stopProgress();
            resolve(true);
        });
    }

    getCRAProfileRecords() {
        this.progressService.startProgress();

        return new Promise((resolve, reject) => {
            this.progressService.stopProgress();
            resolve([{
                name: 'Customer Risk Assessment #1',
                model: profileJSON
            }]);
        });
    }

    setCRAProfileRecords(profileRecords) {
        this.progressService.startProgress();

        return new Promise((resolve, reject) => {
            console.log('Final-profileRecords', profileRecords);
            this.progressService.stopProgress();
            resolve(true);
        });
    }
}
