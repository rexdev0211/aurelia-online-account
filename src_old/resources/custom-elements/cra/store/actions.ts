import { Api } from '../services/api';

import { Container } from 'aurelia-dependency-injection';

const API: Api = Container.instance.get(Api);

export async function getCRAModel(state) {
    const newState = {...state};
    
    const modelSavedInSessionStorage = sessionStorage.getItem('model');

    if (!modelSavedInSessionStorage) {
        // Not saved in sessionStorage
        const fetchedModel = await API.getCRAModel();
        console.log('fetchedModel', fetchedModel);
        newState.model = fetchedModel;
    }
    else {
        // Saved in sessionStorage
        newState.model = JSON.parse(modelSavedInSessionStorage);
    }

    return newState;
}

export async function getCRACountries(state) {
    const newState = {...state};
    const countries = await API.getCRACountries();
    newState.countries = countries;

    return newState;
}

export async function getCRAIndustries(state) {
    const newState = {...state};
    const industries = await API.getCRAIndustries();
    newState.industries = industries;

    return newState;
}

export async function setCRAModel(state, model) {
    const newState = {...state};
    const response = await API.setCRAModel(model);
    const profileRecords = newState.profileRecords;
    const index = profileRecords.findIndex(item => item.name === model.name);
    profileRecords[index].model = model;
    sessionStorage.setItem('profileRecords', JSON.stringify(profileRecords));
    // newState.model = model;
    newState.profileRecords = profileRecords;
    return newState;
}

export async function getCRAProfileRecords(state) {
    const newState = {...state};
    
    const profileRecordsSavedInSessionStorage = sessionStorage.getItem('profileRecords');

    if (!profileRecordsSavedInSessionStorage) {
        // Not saved in sessionStorage
        const fetchedProfileRecords = await API.getCRAProfileRecords();
        newState.profileRecords = fetchedProfileRecords;
    }
    else {
        // Saved in sessionStorage
        newState.profileRecords = JSON.parse(profileRecordsSavedInSessionStorage);
    }

    return newState;
}

export async function setCRAProfileRecords(state, profileRecords) {
    const newState = {...state};
    const response = await API.setCRAProfileRecords(profileRecords);
    sessionStorage.setItem('profileRecords', JSON.stringify(profileRecords));
    newState.profileRecords = profileRecords;
    return newState;
}
