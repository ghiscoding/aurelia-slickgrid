var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { FieldType, FilterType } from './../models/index';
let CompoundInputFilter = class CompoundInputFilter {
    constructor(i18n) {
        this.i18n = i18n;
        this.filterType = FilterType.compoundInput;
    }
    /**
     * Initialize the Filter
     */
    init(args) {
        if (args) {
            this.grid = args.grid;
            this.callback = args.callback;
            this.columnDef = args.columnDef;
            this.operator = args.operator || '';
            this.searchTerm = args.searchTerm;
            if (this.grid && typeof this.grid.getOptions === 'function') {
                this.gridOptions = this.grid.getOptions();
            }
            // step 1, create the DOM Element of the filter which contain the compound Operator+Input
            // and initialize it if searchTerm is filled
            this.$filterElm = this.createDomElement();
            // step 3, subscribe to the keyup event and run the callback when that happens
            // also add/remove "filled" class for styling purposes
            this.$filterInputElm.keyup((e) => {
                this.onTriggerEvent(e);
            });
            this.$selectOperatorElm.change((e) => {
                this.onTriggerEvent(e);
            });
        }
    }
    /**
     * Clear the filter value
     */
    clear(triggerFilterKeyup = true) {
        if (this.$filterElm && this.$selectOperatorElm) {
            this.$selectOperatorElm.val(0);
            this.$filterInputElm.val('');
            if (triggerFilterKeyup) {
                this.$filterElm.trigger('keyup');
            }
        }
    }
    /**
     * destroy the filter
     */
    destroy() {
        if (this.$filterElm) {
            this.$filterElm.off('keyup').remove();
        }
    }
    /**
     * Set value(s) on the DOM element
     */
    setValues(values) {
        if (values) {
            this.$filterElm.val(values);
        }
    }
    //
    // private functions
    // ------------------
    buildInputHtmlString() {
        const placeholder = (this.gridOptions) ? (this.gridOptions.defaultFilterPlaceholder || '') : '';
        return `<input class="form-control" type="text" placeholder="${placeholder}" />`;
    }
    buildSelectOperatorHtmlString() {
        const optionValues = this.getOptionValues();
        let optionValueString = '';
        optionValues.forEach((option) => {
            optionValueString += `<option value="${option.operator}" title="${option.description}">${option.operator}</option>`;
        });
        return `<select class="form-control">${optionValueString}</select>`;
    }
    getOptionValues() {
        const type = (this.columnDef.type && this.columnDef.type) ? this.columnDef.type : FieldType.string;
        let optionValues = [];
        switch (type) {
            case FieldType.string:
                optionValues = [
                    { operator: '', description: this.i18n.tr('CONTAINS') },
                    { operator: '=', description: this.i18n.tr('EQUALS') },
                    { operator: 'a*', description: this.i18n.tr('STARTS_WITH') },
                    { operator: '*z', description: this.i18n.tr('ENDS_WITH') },
                ];
                break;
            default:
                optionValues = [
                    { operator: '', description: this.i18n.tr('CONTAINS') },
                    { operator: '=', description: '' },
                    { operator: '<', description: '' },
                    { operator: '<=', description: '' },
                    { operator: '>', description: '' },
                    { operator: '>=', description: '' },
                    { operator: '<>', description: '' }
                ];
                break;
        }
        return optionValues;
    }
    /**
     * Create the DOM element
     */
    createDomElement() {
        const $headerElm = this.grid.getHeaderRowColumn(this.columnDef.id);
        $($headerElm).empty();
        // create the DOM Select dropdown for the Operator
        this.$selectOperatorElm = $(this.buildSelectOperatorHtmlString());
        this.$filterInputElm = $(this.buildInputHtmlString());
        const $filterContainerElm = $(`<div class="form-group search-filter"></div>`);
        const $containerInputGroup = $(`<div class="input-group"></div>`);
        const $operatorInputGroupAddon = $(`<div class="input-group-addon operator"></div>`);
        /* the DOM element final structure will be
          <div class="input-group">
            <div class="input-group-addon operator">
              <select class="form-control"></select>
            </div>
            <input class="form-control" type="text" />
          </div>
        */
        $operatorInputGroupAddon.append(this.$selectOperatorElm);
        $containerInputGroup.append($operatorInputGroupAddon);
        $containerInputGroup.append(this.$filterInputElm);
        // create the DOM element & add an ID and filter class
        $filterContainerElm.append($containerInputGroup);
        $filterContainerElm.attr('id', `filter-${this.columnDef.id}`);
        const searchTerm = (typeof this.searchTerm === 'boolean') ? `${this.searchTerm}` : this.searchTerm;
        this.$filterInputElm.val(searchTerm);
        this.$filterInputElm.data('columnId', this.columnDef.id);
        if (this.operator) {
            this.$selectOperatorElm.val(this.operator);
        }
        // if there's a search term, we will add the "filled" class for styling purposes
        if (this.searchTerm) {
            $filterContainerElm.addClass('filled');
        }
        // append the new DOM element to the header row
        if ($filterContainerElm && typeof $filterContainerElm.appendTo === 'function') {
            $filterContainerElm.appendTo($headerElm);
        }
        return $filterContainerElm;
    }
    onTriggerEvent(e) {
        const selectedOperator = this.$selectOperatorElm.find('option:selected').text();
        const value = this.$filterInputElm.val();
        (value) ? this.$filterElm.addClass('filled') : this.$filterElm.removeClass('filled');
        this.callback(e, { columnDef: this.columnDef, searchTerm: value, operator: selectedOperator || '' });
    }
};
CompoundInputFilter = __decorate([
    inject(I18N)
], CompoundInputFilter);
export { CompoundInputFilter };
//# sourceMappingURL=compoundInputFilter.js.map