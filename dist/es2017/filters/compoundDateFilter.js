var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { mapFlatpickrDateFormatWithFieldType } from '../services/utilities';
import { FieldType, OperatorType } from './../models/index';
import * as flatpickr from 'flatpickr';
import * as $ from 'jquery';
let CompoundDateFilter = class CompoundDateFilter {
    constructor(i18n) {
        this.i18n = i18n;
    }
    /** Getter for the Grid Options pulled through the Grid Object */
    get gridOptions() {
        return (this.grid && this.grid.getOptions) ? this.grid.getOptions() : {};
    }
    set operator(op) {
        this._operator = op;
    }
    get operator() {
        return this._operator || OperatorType.empty;
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
            // date input can only have 1 search term, so we will use the 1st array index if it exist
            const searchTerm = (Array.isArray(this.searchTerms) && this.searchTerms[0]) || '';
            // step 1, create the DOM Element of the filter which contain the compound Operator+Input
            // and initialize it if searchTerm is filled
            this.$filterElm = this.createDomElement(searchTerm);
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
    clear() {
        if (this.flatInstance && this.$selectOperatorElm) {
            this.$selectOperatorElm.val(0);
            this.flatInstance.clear();
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
        if (values && Array.isArray(values)) {
            this.flatInstance.setDate(values[0]);
        }
    }
    //
    // private functions
    // ------------------
    buildDatePickerInput(searchTerm) {
        const inputFormat = mapFlatpickrDateFormatWithFieldType(this.columnDef.type || FieldType.dateIso);
        const outputFormat = mapFlatpickrDateFormatWithFieldType(this.columnDef.outputType || this.columnDef.type || FieldType.dateUtc);
        let currentLocale = this.i18n.getLocale() || 'en';
        if (currentLocale.length > 2) {
            currentLocale = currentLocale.substring(0, 2);
        }
        const pickerOptions = {
            defaultDate: searchTerm || '',
            altInput: true,
            altFormat: outputFormat,
            dateFormat: inputFormat,
            wrap: true,
            closeOnSelect: true,
            locale: (currentLocale !== 'en') ? this.loadFlatpickrLocale(currentLocale) : 'en',
            onChange: (selectedDates, dateStr, instance) => {
                this._currentValue = dateStr;
                // when using the time picker, we can simulate a keyup event to avoid multiple backend request
                // since backend request are only executed after user start typing, changing the time should be treated the same way
                if (pickerOptions.enableTime) {
                    this.onTriggerEvent(new CustomEvent('keyup'), dateStr === '');
                }
                else {
                    this.onTriggerEvent(undefined, dateStr === '');
                }
            }
        };
        // add the time picker when format is UTC (Z) or has the 'h' (meaning hours)
        if (outputFormat && (outputFormat === 'Z' || outputFormat.toLowerCase().indexOf('h') > -1)) {
            pickerOptions.enableTime = true;
        }
        const placeholder = (this.gridOptions) ? (this.gridOptions.defaultFilterPlaceholder || '') : '';
        const $filterInputElm = $(`<div class=flatpickr><input type="text" class="form-control" data-input placeholder="${placeholder}"></div>`);
        this.flatInstance = (flatpickr && $filterInputElm[0] && typeof $filterInputElm[0].flatpickr === 'function') ? $filterInputElm[0].flatpickr(pickerOptions) : null;
        return $filterInputElm;
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
        return [
            { operator: '', description: '' },
            { operator: '=', description: '' },
            { operator: '<', description: '' },
            { operator: '<=', description: '' },
            { operator: '>', description: '' },
            { operator: '>=', description: '' },
            { operator: '<>', description: '' }
        ];
    }
    /**
     * Create the DOM element
     */
    createDomElement(searchTerm) {
        const $headerElm = this.grid.getHeaderRowColumn(this.columnDef.id);
        $($headerElm).empty();
        // create the DOM Select dropdown for the Operator
        this.$selectOperatorElm = $(this.buildSelectOperatorHtmlString());
        this.$filterInputElm = this.buildDatePickerInput(searchTerm);
        const $filterContainerElm = $(`<div class="form-group search-filter"></div>`);
        const $containerInputGroup = $(`<div class="input-group flatpickr"></div>`);
        const $operatorInputGroupAddon = $(`<div class="input-group-addon operator"></div>`);
        /* the DOM element final structure will be
          <div class="input-group">
            <div class="input-group-addon operator">
              <select class="form-control"></select>
            </div>
            <div class=flatpickr>
              <input type="text" class="form-control" data-input>
            </div>
          </div>
        */
        $operatorInputGroupAddon.append(this.$selectOperatorElm);
        $containerInputGroup.append($operatorInputGroupAddon);
        $containerInputGroup.append(this.$filterInputElm);
        // create the DOM element & add an ID and filter class
        $filterContainerElm.append($containerInputGroup);
        $filterContainerElm.attr('id', `filter-${this.columnDef.id}`);
        this.$filterInputElm.data('columnId', this.columnDef.id);
        if (this.operator) {
            this.$selectOperatorElm.val(this.operator);
        }
        // if there's a search term, we will add the "filled" class for styling purposes
        if (searchTerm) {
            $filterContainerElm.addClass('filled');
            this._currentValue = searchTerm;
        }
        // append the new DOM element to the header row
        if ($filterContainerElm && typeof $filterContainerElm.appendTo === 'function') {
            $filterContainerElm.appendTo($headerElm);
        }
        return $filterContainerElm;
    }
    loadFlatpickrLocale(locale) {
        // change locale if needed, Flatpickr reference: https://chmln.github.io/flatpickr/localization/
        if (locale !== 'en') {
            const localeDefault = require(`flatpickr/dist/l10n/${locale}.js`).default;
            return (localeDefault && localeDefault[locale]) ? localeDefault[locale] : 'en';
        }
        return 'en';
    }
    onTriggerEvent(e, clearFilterTriggered) {
        if (clearFilterTriggered) {
            this.callback(e, { columnDef: this.columnDef, clearFilterTriggered: true });
        }
        else {
            const selectedOperator = this.$selectOperatorElm.find('option:selected').text();
            (this._currentValue) ? this.$filterElm.addClass('filled') : this.$filterElm.removeClass('filled');
            this.callback(e, { columnDef: this.columnDef, searchTerms: (this._currentValue ? [this._currentValue] : null), operator: selectedOperator || '' });
        }
    }
    hide() {
        if (this.flatInstance && typeof this.flatInstance.close === 'function') {
            this.flatInstance.close();
        }
    }
    show() {
        if (this.flatInstance && typeof this.flatInstance.open === 'function') {
            this.flatInstance.open();
        }
    }
};
CompoundDateFilter = __decorate([
    inject(I18N)
], CompoundDateFilter);
export { CompoundDateFilter };
//# sourceMappingURL=compoundDateFilter.js.map