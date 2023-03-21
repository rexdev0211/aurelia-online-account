import { Router, RouterConfiguration } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';
import { Store, connectTo } from 'aurelia-store';

import { State } from './resources/custom-elements/cra/store/state';

import { GET_CRA_MODEL, GET_CRA_COUNTRIES, GET_CRA_INDUSTRIES, SET_CRA_MODEL, GET_CRA_PROFILE_RECORDS, SET_CRA_PROFILE_RECORDS } from './resources/custom-elements/cra/store/constants';
import { getCRAModel, getCRACountries, getCRAIndustries, setCRAModel, getCRAProfileRecords, setCRAProfileRecords } from './resources/custom-elements/cra/store/actions';
@connectTo()
export class App {
  public state: State;
  router: Router;

  constructor(private store: Store<State>,) {
    // Register store actions
    this.setupStore();
  }

  setupStore() {
    this.store.registerAction(GET_CRA_MODEL, getCRAModel);
    this.store.registerAction(GET_CRA_COUNTRIES, getCRACountries);
    this.store.registerAction(GET_CRA_INDUSTRIES, getCRAIndustries);
    this.store.registerAction(SET_CRA_MODEL, setCRAModel);
    this.store.registerAction(GET_CRA_PROFILE_RECORDS, getCRAProfileRecords);
    this.store.registerAction(SET_CRA_PROFILE_RECORDS, setCRAProfileRecords);
  }

  configureRouter(config: RouterConfiguration, router: Router){
    this.router = router;
    config.title = 'CRAPOC';
    config.options.pushState = true;
    config.options.root = '/';
    config.map([
      {
        route: '',
        name: 'live',
        moduleId: PLATFORM.moduleName('./routes/live'),
        nav: true,
        title: 'Live Mode'
      },
      {
        route: 'builder',
        name: 'builder',
        moduleId: PLATFORM.moduleName('./routes/builder'),
        nav: true, 
        title: 'Builder Mode'
      }
    ]);
  }
}
