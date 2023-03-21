import {Aurelia} from 'aurelia-framework';
import environment from '../config/environment.json';
import {PLATFORM} from 'aurelia-pal';
import { initialState } from './resources/custom-elements/cra/store/state';

// Import bootstrap 5 and font-awesome
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import 'jquery/dist/jquery.min.js';
import 'bootstrap/dist/js/bootstrap';

// Import Kendo UI js & css
import '@progress/kendo-ui/js/kendo.all'
import '@progress/kendo-ui/css/web/kendo.common.min.css'
import '@progress/kendo-ui/css/web/kendo.bootstrap.min.css'

export function configure(aurelia: Aurelia): void {
  aurelia.use
    .standardConfiguration()
    .feature(PLATFORM.moduleName('resources/index'));

  aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');

  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  }

  aurelia.use.plugin(PLATFORM.moduleName('aurelia-store'), { initialState });  // REGISTER Aurelia Store plugin
  
  aurelia.use.plugin(PLATFORM.moduleName('aurelia-kendoui-bridge'));  // REGISTER Aurelia Kendo UI Bridge
  
  aurelia.use.plugin(PLATFORM.moduleName('aurelia-validation')); // REGISTER Aurelia Validation plugin

  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
}
