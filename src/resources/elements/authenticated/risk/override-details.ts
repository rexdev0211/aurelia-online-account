import {bindable, observable} from 'aurelia-framework';
import {OnlineAccountApi} from "../../../../dtos/onlineaccount-api.dtos";
import Enumerable from "linq";
import RiskOverrideCompareSymbolType = OnlineAccountApi.RiskOverrideCompareSymbolType;
import RiskOverrideOperatorType = OnlineAccountApi.RiskOverrideOperatorType;

export class OverrideDetailsCustomElement {
    @bindable parentElement;
    @bindable parentGrid;
    @bindable dataItem;
    @bindable ern;
    @bindable overrideTerms;
    @bindable riskCategories;
    @bindable riskComponentsAll;
    @bindable riskFactorsAll;
    @bindable saveOverride;
    @bindable index;
    @bindable riskMatrix;

    @observable selectedRiskCategoryOverrideERN: string = '';
    @observable selectedRiskComponentOverrideERN: string = '';
    @observable selectedRiskFactorOverrideERN: string = '';
  
    private overrideTermsGrid;
    private datasource;
    private pageable = {
        refresh: true,
        pageSizes: true,
        buttonCount: 10
    };
    private operators = Object.entries(RiskOverrideOperatorType).map(([key, value]) => ({ key, value }));
    private symbolTypes = Object.entries({
        [RiskOverrideCompareSymbolType.Equal]: '==',
        [RiskOverrideCompareSymbolType.GreaterThan]: '>',
        [RiskOverrideCompareSymbolType.GreaterThanEqual]: '>=',
        [RiskOverrideCompareSymbolType.LessThan]: '<',
        [RiskOverrideCompareSymbolType.LessThanEqual]: '<=',
    }).map(([key, value]) => ({ key, value }));
    private categories;
    private components;

    bind() {
        this.overrideTerms = Enumerable.from(this.overrideTerms).toArray();
        this.overrideTerms = this.overrideTerms.map((item, i) => ({ 
            ...item, 
            id: i, 
            categoryERN: this.getRiskCategoryERNByFactorERN(item.factorERN),
            componentERN: this.getRiskComponentERNByFactorERN(item.factorERN)
        }));
        this.riskCategories = this.riskCategories.map(category => ({
            ...category,
            categoryERN: category.ern
        }));
        this.riskComponentsAll = this.riskComponentsAll.map(component => ({
            ...component,
            componentERN: component.ern,
            categoryERN: component.owners[2]
        }));
        this.riskFactorsAll = this.riskFactorsAll.map(factor => ({
            ...factor,
            factorERN: factor.ern,
            componentERN: factor.owners[3]
        }));
        console.log('parentGrid', this.parentGrid);
        console.log('dataItem', this.dataItem);
        console.log('overrideTerms', this.overrideTerms);
        console.log('riskCategories', this.riskCategories);
        console.log('riskComponentsAll', this.riskComponentsAll);
        console.log('riskFactorsAll', this.riskFactorsAll);
        console.log('index', this.index);

        const self = this;
        this.datasource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    e.success(self.overrideTerms);
                },
                create: async (e) => {
                    console.log('e.data', e.data);
                    if (!e.data.factorERN) {
                        await self.parentElement.notificationService.showMessage('warning', 'Validation Warning', 'Question is required.');
                        e.error('Question is required - Not Valid');
                    } else if (!e.data.compareSymbol) {
                        await self.parentElement.notificationService.showMessage('warning', 'Validation Warning', 'Compare Symbol is required.');
                        e.error('Compare Symbol is required - Not Valid');
                    } else {
                        const rowData = {
                            id: self.overrideTerms.length,
                            operator: typeof e.data.operator === 'object' ? e.data.operator.key : e.data.operator,
                            categoryERN: e.data.categoryERN?.ern,
                            componentERN: e.data.componentERN?.ern,
                            factorERN: e.data.factorERN.ern,
                            compareSymbol: e.data.compareSymbol.key,
                            riskValue: e.data.riskValue,
                            additionalTerms: []
                        };
                        if (!self.ern) {
                            // First Create Override & Override Terms
                            const result = await self.saveOverride(self.parentElement, self.ern, [rowData], self.index);
                            
                            if (result) {
                                self.overrideTerms.push(rowData);
                                self.overrideTermsGrid.dataSource.read(); 
                                e.success(rowData);
                            } else {
                                e.error('First Create Override & Override Terms - Not Valid');
                            }
                        } else {
                            // Add Override Terms to existing Override
                            self.overrideTerms.push(rowData);
                            const result = await self.saveOverride(self.parentElement, self.ern, self.overrideTerms, self.index);
                            if (result) {
                                self.overrideTermsGrid.dataSource.read();
                                e.success(rowData);
                            } else {
                                e.error('Add Override Terms to existing Override - Not Valid');
                            }
                        }
                    }
                },
                update: async (e) => {
                    const objIndex = self.overrideTerms.findIndex(obj => obj.id == e.data.id);
                    self.overrideTerms[objIndex] = e.data;
                    const result = await self.saveOverride(self.parentElement, self.ern, self.overrideTerms, self.index);
                    if (result)
                        e.success();
                    else 
                        e.error('Update Override Terms Error');
                },
                destroy: async (e) => {
                    const objIndex = self.overrideTerms.findIndex((obj => obj.id == e.data.id));
                    self.overrideTerms.splice(objIndex, 1);
                    const result = await self.saveOverride(self.parentElement, self.ern, self.overrideTerms, self.index);
                    if (result)
                        e.success();
                    else 
                        e.error('Delete Override Terms Error');
                }
            },
            error: function (e) {
                console.log('error', e);
            },
            pageSize: 10,
            batch: false,
            schema: {
                model: {
                    id: "id",
                    fields: {
                        id: { editable: false, nullable: true },
                        operator: { defaultValue: "AND" },
                        riskValue: { type: "number", validation: { required: true, min: 1, max: self.riskMatrix } },
                    }
                }
            },
            change: function (e) {
                console.log('change');
                self.parentGrid.bind('dataBinding', function (e) {
                    console.log('dataBinding', e);
                    if (e.action === 'itemchange') {
                        self.dataItem.dirty = true;
                        e.preventDefault();
                    }
                });
            }
        });
    }
    
    getRiskCategoryByFactorERN(factorERN) {
        if (factorERN) {
            const riskFactor = this.riskFactorsAll.find(item => item.ern === factorERN);
            return this.riskCategories.find(item => item.ern === riskFactor.owners[2])?.name; 
        } else {
            return null;
        }
    }

    getRiskCategoryERNByFactorERN(factorERN) {
        if (factorERN) {
            const riskFactor = this.riskFactorsAll.find(item => item.ern === factorERN);
            return this.riskCategories.find(item => item.ern === riskFactor.owners[2])?.ern; 
        } else {
            return null;
        }
    }

    getRiskComponentByFactorERN(factorERN) {
        if (factorERN) {
            const riskFactor = this.riskFactorsAll.find(item => item.ern === factorERN);
            return this.riskComponentsAll.find(item => item.ern === riskFactor.owners[3])?.name; 
        } else {
            return null;
        }
    }

    getRiskComponentERNByFactorERN(factorERN) {
        if (factorERN) {
            const riskFactor = this.riskFactorsAll.find(item => item.ern === factorERN);
            return this.riskComponentsAll.find(item => item.ern === riskFactor.owners[3])?.ern; 
        } else {
            return null;
        }
    }

    getRiskCategoryByCategoryERN(categoryERN) {
        return this.riskCategories.find(item => item.ern === categoryERN)?.name;
    }

    getRiskComponentByComponentERN(componentERN) {
        return this.riskComponentsAll.find(item => item.ern === componentERN)?.name;
    }

    getRiskFactorByFactorERN(factorERN) {
        return this.riskFactorsAll.find(item => item.ern === factorERN)?.question;
    }

    getCompareOperatorByCompareSymbol(compareSymbol) {
        return this.symbolTypes.find(item => item.key === compareSymbol)?.value;
    }

    categoriesDropDownEditor(container, options) {
        var input = $('<input id="categoryERN" name="categoryERN">');
        input.appendTo(container);

        input.kendoDropDownList({
            dataTextField: "name",
            dataValueField: "categoryERN",
            dataSource: this.riskCategories.sort((a, b) => a.sortOrder - b.sortOrder)
        }).appendTo(container);
    }

    componentsDropDownEditor(container, options) {
        var input = $('<input id="componentERN" name="componentERN">');
        input.appendTo(container);
        
        input.kendoDropDownList({
            dataTextField: "name",
            dataValueField: "componentERN",
            cascadeFrom: "categoryERN",
            dataSource: this.riskComponentsAll.sort((a, b) => a.sortOrder - b.sortOrder)
        }).appendTo(container);
    }

    factorsDropDownEditor(container, options) {
        var input = $('<input id="factorERN" name="factorERN">');
        input.appendTo(container);
        input.kendoDropDownList({
            dataTextField: "question",
            dataValueField: "factorERN",
            cascadeFrom: "componentERN",
            dataSource: this.riskFactorsAll.sort((a, b) => a.sortOrder - b.sortOrder)
        }).appendTo(container);
    }
    
    compareSymbolsDropDownEditor(container, options) {
        const self = this;
        (<any>$('<input required data-text-field="value" data-value-field="key" data-bind="value:' + options.field + '"/>')
        .appendTo(container))
        .kendoDropDownList({
            dataSource: {
                transport: {
                    read: function (e) {
                        e.success(self.symbolTypes);
                    }
                }
            }
        });
    }
    
    opeatorsDropDownEditor(container, options) {
        const self = this;
        (<any>$('<input required data-text-field="value" data-value-field="key" data-bind="value:' + options.field + '"/>')
        .appendTo(container))
        .kendoDropDownList({
            dataSource: {
                transport: {
                    read: function (e) {
                        e.success(self.operators);
                    }
                }
            }
        });
    }

    onReady(e) {
        this.overrideTermsGrid = e;
        if (this.overrideTerms.length === 0) {
            this.overrideTermsGrid.addRow();
        }
    }

    cancelRow(e) {
        console.log('cancelRow', e);
        if ("ern" in this.dataItem && !this.dataItem.ern) {
            this.parentElement.overridesGrid.collapseRow(".k-master-row:first");
            const self = this;
            setTimeout(function(){
                const oldConfirm = window.confirm;
                window.confirm = function() { return true; };
                self.parentElement.overridesGrid.removeRow("tr:eq(1)");
                window.confirm = oldConfirm;
            }, 100);
        }
    }
}