import { autoinject } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';
import { Store, connectTo } from 'aurelia-store';
import {
  ValidationControllerFactory,
  ValidationController,
  ValidationRules,
  validateTrigger,
  Validator
} from 'aurelia-validation';
import { CRAApi } from './common/dtos/cra-api.dtos';
import { State } from './store/state';

@autoinject()
@connectTo()
export class CraBuilder {
  public state: State;
  public controller: ValidationController;

  private showProfileRecordForm: boolean = true;
  private showModelForm: boolean = false;
  private showCategoriesForm: boolean = false;
  private showComponentsForm: boolean = false;

  private disableProfileRecordButtons: boolean = false;
  private disableModelButtons: boolean = false;

  private profileRecord = new CRAApi.CRAProfileRecord({
    ern: '',
    principalERN: '',
    name: '',
    model: {
      name: '',
      categories: []
    }
  });

  private category: CRAApi.RiskCategory = {
    name: '',
    calculatedScore: 0,
    components: []
  };

  private component: CRAApi.RiskComponent = {
    name: '',
    nonZeroFactorAnswers: 0,
    calcFactorOverrideCount: 0,
    calcFactorWeight: 0,
    calcRawScore: 0,
    calculatedScore: 0,
    riskFactors: []
  };

  categoryRules = ValidationRules
    .ensure('name').required()
    .ensure('weight').range(0, 100)
    .rules;

  constructor(
    controllerFactory: ValidationControllerFactory,
    private validator: Validator
  ) {
    this.controller = controllerFactory.createForCurrentScope();
    this.controller.validateTrigger = validateTrigger.blur;
    this.controller.subscribe(event => this.validateForm());

    ValidationRules
      .ensure('ern').required()
      .ensure('principalERN').required()
      .ensure('name').required()
      .on(this.profileRecord);
    
    ValidationRules
      .ensure('name').required()
      .on(this.profileRecord.model);

    // ValidationRules
    //   .satisfies(categories => Array.isArray(categories) && categories.every(category => !!category.name))
    //   .on(this.profileRecord.model.categories)
  }

  validateForm() {
    this.validator.validateObject(this.profileRecord)
      .then(results => this.disableProfileRecordButtons = results.every(result => result.valid));

    this.validator.validateObject(this.profileRecord.model)
      .then(results => this.disableModelButtons = results.every(result => result.valid));
  }

  async handleProfileRecord() {
    const result = await this.controller.validate();

    if (result.valid) {
      console.log('profile_valid');
      this.showProfileRecordForm = false;
      this.showModelForm = true;
    }
  }

  async handleModel() {
    const result = await this.controller.validate();

    if (result.valid) {
      console.log('model_valid');
      this.showModelForm = false;
      this.showCategoriesForm = true;
    }
  }

  addCategory() {
    this.profileRecord.model.categories.push({ 
      name: '',
      calculatedScore: 0,
      components: []
     });
    console.log('categories', this.profileRecord.model.categories);
  }

  removeCategory(index: number) {
    this.profileRecord.model.categories.splice(index, 1);
  }

  async handleCategories() {
    const result = await this.controller.validate();

    if (result.valid) {
      console.log('categories_valid');
      this.showCategoriesForm = false;
      this.showComponentsForm = true;
    }
  }

  addComponent(categoryIndex: number) {
    console.log('categoryIndex', categoryIndex);
    this.profileRecord.model.categories[categoryIndex].components.push({ 
      name: '',
      nonZeroFactorAnswers: 0,
      calcFactorOverrideCount: 0,
      calcFactorWeight: 0,
      calcRawScore: 0,
      calculatedScore: 0,
      riskFactors: []
    });
    console.log('components', this.profileRecord.model.categories);
  }
}
