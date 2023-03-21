//import {
//  bindable
//} from 'aurelia-framework';
import {
  BasePage
} from './../../bases/base-page';

export class JobViewerPage extends BasePage {

  constructor(...args) {
    super(...args);
  }

  canActivate() {
    return (this.utils.propExists(this.dataStore, 'state.currentJob'));
  }
}

