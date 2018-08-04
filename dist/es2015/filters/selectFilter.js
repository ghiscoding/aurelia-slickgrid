var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { I18N } from 'aurelia-i18n';
import { inject } from 'aurelia-framework';
import { OperatorType } from './../models/index';
import * as $ from 'jquery';
let SelectFilter = class SelectFilter {
    constructor(i18n) {
        this.i18n = i18n;
        this._clearFilterTriggered = false;
    }
    get operator() {
        return (this.columnDef && this.columnDef.filter && this.columnDef.filter.operator) || OperatorType.equal;
    }
    /**
     * Initialize the Filter
     */
    init(args) {
        if (!args) {
            throw new Error('[Aurelia-SlickGrid] A filter must always have an "init()" with valid arguments.');
        }
        this.grid = args.grid;
        this.callback = args.callback;
        this.columnDef = args.columnDef;
        this.searchTerms = args.searchTerms || [];
        // filter input can only have 1 search term, so we will use the 1st array index if it exist
        let searchTerm = (Array.isArray(this.searchTerms) && this.searchTerms[0]) || '';
        if (typeof searchTerm === 'boolean' || typeof searchTerm === 'number') {
            searchTerm = `${searchTerm}`;
        }
        // step 1, create HTML string template
        const filterTemplate = this.buildTemplateHtmlString();
        // step 2, create the DOM Element of the filter & initialize it if searchTerm is filled
        this.$filterElm = this.createDomElement(filterTemplate, searchTerm);
        // step 3, subscribe to the change event and run the callback when that happens
        // also add/remove "filled" class for styling purposes
        this.$filterElm.change((e) => {
            const value = e && e.target && e.target.value || '';
            if (this._clearFilterTriggered) {
                this.callback(e, { columnDef: this.columnDef, clearFilterTriggered: this._clearFilterTriggered });
                this._clearFilterTriggered = false; // reset flag for next use
                this.$filterElm.removeClass('filled');
            }
            else {
                this.$filterElm.addClass('filled');
                this.callback(e, { columnDef: this.columnDef, operator: this.operator, searchTerms: [value] });
            }
        });
    }
    /**
     * Clear the filter values
     */
    clear() {
        if (this.$filterElm) {
            this._clearFilterTriggered = true;
            this.searchTerms = [];
            this.$filterElm.val('');
            this.$filterElm.trigger('change');
        }
    }
    /**
     * destroy the filter
     */
    destroy() {
        if (this.$filterElm) {
            this.$filterElm.off('change').remove();
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
    buildTemplateHtmlString() {
        if (!this.columnDef || !this.columnDef.filter || !this.columnDef.filter.collection) {
            throw new Error(`[Aurelia-SlickGrid] You need to pass a "collection" for the Select Filter to work correctly. Also each option should include a value/label pair (or value/labelKey when using Locale). For example: { filter: { model: Filters.select, collection: [{ value: true, label: 'True' }, { value: false, label: 'False'}] } }`);
        }
        const optionCollection = this.columnDef.filter.collection || [];
        const labelName = (this.columnDef.filter.customStructure) ? this.columnDef.filter.customStructure.label : 'label';
        const valueName = (this.columnDef.filter.customStructure) ? this.columnDef.filter.customStructure.value : 'value';
        const isEnabledTranslate = (this.columnDef.filter.enableTranslateLabel) ? this.columnDef.filter.enableTranslateLabel : false;
        let options = '';
        optionCollection.forEach((option) => {
            if (!option || (option[labelName] === undefined && option.labelKey === undefined)) {
                throw new Error(`A collection with value/label (or value/labelKey when using Locale) is required to populate the Select list, for example: { filter: { model: Filters.select, collection: [ { value: '1', label: 'One' } ] } }`);
            }
            const labelKey = option.labelKey || option[labelName];
            const textLabel = ((option.labelKey || isEnabledTranslate) && this.i18n && typeof this.i18n.tr === 'function') ? this.i18n.tr(labelKey || ' ') : labelKey;
            options += `<option value="${option[valueName]}">${textLabel}</option>`;
        });
        return `<select class="form-control search-filter">${options}</select>`;
    }
    /**
     * From the html template string, create a DOM element
     * @param filterTemplate
     */
    createDomElement(filterTemplate, searchTerm) {
        const $headerElm = this.grid.getHeaderRowColumn(this.columnDef.id);
        $($headerElm).empty();
        // create the DOM element & add an ID and filter class
        const $filterElm = $(filterTemplate);
        const searchTermInput = (searchTerm || '');
        $filterElm.val(searchTermInput);
        $filterElm.attr('id', `filter-${this.columnDef.id}`);
        $filterElm.data('columnId', this.columnDef.id);
        // append the new DOM element to the header row
        if ($filterElm && typeof $filterElm.appendTo === 'function') {
            $filterElm.appendTo($headerElm);
        }
        return $filterElm;
    }
};
SelectFilter = __decorate([
    inject(I18N)
], SelectFilter);
export { SelectFilter };
//# sourceMappingURL=selectFilter.js.map