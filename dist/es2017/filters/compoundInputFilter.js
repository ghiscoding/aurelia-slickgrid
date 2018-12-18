var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { FieldType, OperatorType } from './../models/index';
import * as $ from 'jquery';
let CompoundInputFilter = class CompoundInputFilter {
    constructor(i18n) {
        this.i18n = i18n;
        this._clearFilterTriggered = false;
        this._inputType = 'text';
    }
    /** Getter for the Grid Options pulled through the Grid Object */
    get gridOptions() {
        return (this.grid && this.grid.getOptions) ? this.grid.getOptions() : {};
    }
    /** Getter of input type (text, number, password) */
    get inputType() {
        return this._inputType;
    }
    /** Setter of input type (text, number, password) */
    set inputType(type) {
        this._inputType = type;
    }
    /** Getter of the Operator to use when doing the filter comparing */
    get operator() {
        return this._operator || OperatorType.empty;
    }
    /** Getter of the Operator to use when doing the filter comparing */
    set operator(op) {
        this._operator = op;
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
            this.searchTerms = args.searchTerms || [];
            // filter input can only have 1 search term, so we will use the 1st array index if it exist
            const searchTerm = (Array.isArray(this.searchTerms) && this.searchTerms[0]) || '';
            // step 1, create the DOM Element of the filter which contain the compound Operator+Input
            // and initialize it if searchTerm is filled
            this.$filterElm = this.createDomElement(searchTerm);
            // step 3, subscribe to the keyup event and run the callback when that happens
            // also add/remove "filled" class for styling purposes
            this.$filterInputElm.on('keyup input change', (e) => {
                this.onTriggerEvent(e);
            });
            this.$selectOperatorElm.on('change', (e) => {
                this.onTriggerEvent(e);
            });
        }
    }
    /**
     * Clear the filter value
     */
    clear() {
        if (this.$filterElm && this.$selectOperatorElm) {
            this._clearFilterTriggered = true;
            this.searchTerms = [];
            this.$selectOperatorElm.val(0);
            this.$filterInputElm.val('');
            this.onTriggerEvent(undefined);
        }
    }
    /**
     * destroy the filter
     */
    destroy() {
        if (this.$filterElm && this.$selectOperatorElm) {
            this.$filterElm.off('keyup input change').remove();
            this.$selectOperatorElm.off('change');
        }
    }
    /**
     * Set value(s) on the DOM element
     */
    setValues(values) {
        if (values && Array.isArray(values)) {
            this.$filterElm.val(values[0]);
        }
    }
    //
    // private functions
    // ------------------
    buildInputHtmlString() {
        const placeholder = (this.gridOptions) ? (this.gridOptions.defaultFilterPlaceholder || '') : '';
        return `<input class="form-control" type="${this._inputType || 'text'}" placeholder="${placeholder}" />`;
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
    createDomElement(searchTerm) {
        const columnId = this.columnDef && this.columnDef.id;
        const $headerElm = this.grid.getHeaderRowColumn(columnId);
        $($headerElm).empty();
        // create the DOM Select dropdown for the Operator
        this.$selectOperatorElm = $(this.buildSelectOperatorHtmlString());
        this.$filterInputElm = $(this.buildInputHtmlString());
        const $filterContainerElm = $(`<div class="form-group search-filter filter-${columnId}"></div>`);
        const $containerInputGroup = $(`<div class="input-group"></div>`);
        const $operatorInputGroupAddon = $(`<div class="input-group-addon input-group-prepend operator"></div>`);
        /* the DOM element final structure will be
          <div class="input-group">
            <div class="input-group-addon input-group-prepend operator">
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
        $filterContainerElm.attr('id', `filter-${columnId}`);
        this.$filterInputElm.val(searchTerm);
        this.$filterInputElm.data('columnId', columnId);
        if (this.operator) {
            this.$selectOperatorElm.val(this.operator);
        }
        // if there's a search term, we will add the "filled" class for styling purposes
        if (searchTerm) {
            $filterContainerElm.addClass('filled');
        }
        // append the new DOM element to the header row
        if ($filterContainerElm && typeof $filterContainerElm.appendTo === 'function') {
            $filterContainerElm.appendTo($headerElm);
        }
        return $filterContainerElm;
    }
    /** Event trigger, could be called by the Operator dropdown or the input itself */
    onTriggerEvent(e) {
        if (this._clearFilterTriggered) {
            this.callback(e, { columnDef: this.columnDef, clearFilterTriggered: this._clearFilterTriggered });
            this._clearFilterTriggered = false; // reset flag for next use
        }
        else {
            const selectedOperator = this.$selectOperatorElm.find('option:selected').text();
            const value = this.$filterInputElm.val();
            (value !== null && value !== undefined && value !== '') ? this.$filterElm.addClass('filled') : this.$filterElm.removeClass('filled');
            this.callback(e, { columnDef: this.columnDef, searchTerms: (value ? [value] : null), operator: selectedOperator || '' });
        }
    }
};
CompoundInputFilter = __decorate([
    inject(I18N)
], CompoundInputFilter);
export { CompoundInputFilter };
//# sourceMappingURL=compoundInputFilter.js.map