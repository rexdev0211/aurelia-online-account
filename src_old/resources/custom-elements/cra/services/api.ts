import {autoinject} from 'aurelia-framework';

import { ApplicationService } from './application';

import modelJSON from "../common/data/CRA-EMPTY-MODEL.json";
import countriesJSON from "../common/data/CRA-COUNTRY.json";
import industriesJSON from "../common/data/CRA-INDUSTRY.json";
// import profileJSON from "../common/data/CRA-EMPTY-PROFILE.json";

@autoinject
export class Api {
    constructor(private appService: ApplicationService) {}

    getCRAModel() {
        this.appService.loading = true;

        return new Promise((resolve, reject) => {
            this.appService.loading = false;
            resolve(modelJSON);
        });
    }
    
    getCRACountries() {
        this.appService.loading = true;

        return new Promise((resolve, reject) => {
            this.appService.loading = false;
            resolve(countriesJSON);
        });
    }
    
    getCRAIndustries() {
        this.appService.loading = true;

        return new Promise((resolve, reject) => {
            this.appService.loading = false;
            resolve(industriesJSON);
        });
    }
    
    setCRAModel(model) {
        this.appService.loading = true;

        return new Promise((resolve, reject) => {
            console.log('FinalModel', model);
            this.appService.loading = false;
            resolve(true);
        });
    }
    
    getCRAProfileRecords() {
        this.appService.loading = true;

        return new Promise((resolve, reject) => {
            this.appService.loading = false;
            resolve([{
                name: 'Customer Risk Assessment #1',
                model: modelJSON
            }]);
        });
    }
    
    setCRAProfileRecords(profileRecords) {
        this.appService.loading = true;

        return new Promise((resolve, reject) => {
            console.log('Final-profileRecords', profileRecords);
            this.appService.loading = false;
            resolve(true);
        });
    }
}