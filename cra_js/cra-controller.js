import {autoinject} from 'aurelia-framework';
import {connectTo} from 'aurelia-store';
import {CRAApi} from './common/dtos/cra-api.dtos';
import {State} from './store/state';

@connectTo()
@autoinject()
export class CraController {
   state;
   countries = [];
   industries = [];
   pageSize= 5;
   pageable = {
    refresh: true,
    pageSizes: true,
    buttonCount: 10
  };
   currentPage = 1;
   modes = ['consumer', 'admin'];
   mode= 'consumer';
   debugMode= false;
   levels = ['Models', 'Categories', 'Components', 'RiskFactors', 'Answers'];

  constructor() {
  }

  setPageSize(pageSize) {
    this.pageSize = pageSize;
  }

  getPageSize() {
    return this.pageSize;
  }

  setCurrentPage(currentPage) {
    this.currentPage = currentPage;
  }

  getPageCount(totalCount, pageSize) {
    return Math.ceil(totalCount / (pageSize ? pageSize : 1));
  }

  goToPage(page) {
    this.currentPage = page;
  }

  setMode(mode) {
    this.mode = mode;
  }

  getMode() {
    return this.mode;
  }

  setDebugMode(debugMode) {
    this.debugMode = debugMode;
  }

  getDebugMode() {
    return this.debugMode;
  }

  getLevels() {
    return this.levels;
  }

  getDate(time) {
    return new Date(time).toLocaleDateString();
  }
}
