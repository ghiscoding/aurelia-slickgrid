var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { I18N } from 'aurelia-i18n';
import { inject } from 'aurelia-framework';
import { OperatorType } from './../models/index';
import { CollectionService } from '../services/collection.service';
import { htmlEncode } from '../services/utilities';
import * as sanitizeHtml from 'sanitize-html';
import * as $ from 'jquery';
let SingleSelectFilter = class SingleSelectFilter {
    constructor(collectionService, i18n) {
        this.collectionService = collectionService;
        this.i18n = i18n;
        this.isFilled = false;
        this.enableTranslateLabel = false;
        // default options used by this Filter, user can overwrite any of these by passing "otions"
        this.defaultOptions = {
            container: 'body',
            filter: false,
            maxHeight: 200,
            single: true,
            textTemplate: ($elm) => {
                // render HTML code or not, by default it is sanitized and won't be rendered
                const isRenderHtmlEnabled = this.columnDef && this.columnDef.filter && this.columnDef.filter.enableRenderHtml || false;
                return isRenderHtmlEnabled ? $elm.text() : $elm.html();
            },
            onClose: () => {
                const selectedItems = this.$filterElm.multipleSelect('getSelects');
                let selectedItem = '';
                if (Array.isArray(selectedItems) && selectedItems.length > 0) {
                    selectedItem = selectedItems[0] || null;
                    this.isFilled = true;
                    this.$filterElm.addClass('filled').siblings('div .search-filter').addClass('filled');
                }
                else {
                    this.isFilled = false;
                    this.$filterElm.removeClass('filled').siblings('div .search-filter').removeClass('filled');
                }
                this.callback(undefined, { columnDef: this.columnDef, operator: this.operator, searchTerms: (selectedItem ? [selectedItem] : null) });
            }
        };
    }
    get operator() {
        return (this.columnDef && this.columnDef.filter && this.columnDef.filter.operator) || OperatorType.equal;
    }
    /** Getter for the Grid Options pulled through the Grid Object */
    get gridOptions() {
        return (this.grid && this.grid.getOptions) ? this.grid.getOptions() : {};
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
        if (!this.grid || !this.columnDef || !this.columnDef.filter || !this.columnDef.filter.collection) {
            throw new Error(`[Aurelia-SlickGrid] You need to pass a "collection" for the MultipleSelect Filter to work correctly. Also each option should include a value/label pair (or value/labelKey when using Locale). For example: { filter: { model: Filters.singleSelect, collection: [{ value: true, label: 'True' }, { value: false, label: 'False'}] } }`);
        }
        this.enableTranslateLabel = this.columnDef.filter.enableTranslateLabel || false;
        this.labelName = this.columnDef && this.columnDef.filter && this.columnDef.filter.customStructure && this.columnDef.filter.customStructure.label || 'label';
        this.labelPrefixName = this.columnDef && this.columnDef.filter && this.columnDef.filter.customStructure && this.columnDef.filter.customStructure.labelPrefix || 'labelPrefix';
        this.labelSuffixName = this.columnDef && this.columnDef.filter && this.columnDef.filter.customStructure && this.columnDef.filter.customStructure.labelSuffix || 'labelSuffix';
        this.valueName = this.columnDef && this.columnDef.filter && this.columnDef.filter.customStructure && this.columnDef.filter.customStructure.value || 'value';
        let newCollection = this.columnDef && this.columnDef.filter && this.columnDef.filter.collection || [];
        // user might want to filter certain items of the collection
        if (this.gridOptions.params && this.columnDef.filter.collectionFilterBy) {
            const filterBy = this.columnDef.filter.collectionFilterBy;
            newCollection = this.collectionService.filterCollection(newCollection, filterBy);
        }
        // user might want to sort the collection
        if (this.columnDef.filter && this.columnDef.filter.collectionSortBy) {
            const sortBy = this.columnDef.filter.collectionSortBy;
            newCollection = this.collectionService.sortCollection(newCollection, sortBy, this.enableTranslateLabel);
        }
        let searchTerm = (Array.isArray(this.searchTerms) && this.searchTerms[0]) || '';
        if (typeof searchTerm === 'boolean' || typeof searchTerm === 'number') {
            searchTerm = `${searchTerm}`;
        }
        // step 1, create HTML string template
        const filterTemplate = this.buildTemplateHtmlString(newCollection || [], searchTerm);
        // step 2, create the DOM Element of the filter & pre-load search term
        this.createDomElement(filterTemplate);
    }
    /**
     * Clear the filter values
     */
    clear() {
        if (this.$filterElm && this.$filterElm.multipleSelect) {
            // reload the filter element by it's id, to make sure it's still a valid element (because of some issue in the GraphQL example)
            this.$filterElm.multipleSelect('setSelects', []);
            this.$filterElm.removeClass('filled');
            this.searchTerms = [];
            this.callback(undefined, { columnDef: this.columnDef, clearFilterTriggered: true });
        }
    }
    /**
     * destroy the filter
     */
    destroy() {
        if (this.$filterElm) {
            this.$filterElm.off().remove();
        }
    }
    /**
     * Set value(s) on the DOM element
     */
    setValues(values) {
        if (values) {
            values = Array.isArray(values) ? values : [values];
            this.$filterElm.multipleSelect('setSelects', values);
        }
    }
    //
    // private functions
    // ------------------
    /**
     * Create the HTML template as a string
     */
    buildTemplateHtmlString(optionCollection, searchTerm) {
        let options = '';
        const isAddingSpaceBetweenLabels = this.columnDef && this.columnDef.filter && this.columnDef.filter.customStructure && this.columnDef.filter.customStructure.addSpaceBetweenLabels || false;
        const isRenderHtmlEnabled = this.columnDef && this.columnDef.filter && this.columnDef.filter.enableRenderHtml || false;
        const sanitizedOptions = this.gridOptions && this.gridOptions.sanitizeHtmlOptions || {};
        optionCollection.forEach((option) => {
            if (!option || (option[this.labelName] === undefined && option.labelKey === undefined)) {
                throw new Error(`A collection with value/label (or value/labelKey when using Locale) is required to populate the Select list, for example: { filter: { model: Filter.singleSelect, collection: [ { value: '1', label: 'One' } ] } }`);
            }
            const labelKey = (option.labelKey || option[this.labelName]);
            const selected = (option[this.valueName] === searchTerm) ? 'selected' : '';
            const labelText = ((option.labelKey || this.enableTranslateLabel) && this.i18n && typeof this.i18n.tr === 'function') ? this.i18n.tr(labelKey || ' ') : labelKey;
            const prefixText = option[this.labelPrefixName] || '';
            const suffixText = option[this.labelSuffixName] || '';
            let optionText = isAddingSpaceBetweenLabels ? `${prefixText} ${labelText} ${suffixText}` : (prefixText + labelText + suffixText);
            // if user specifically wants to render html text, he needs to opt-in else it will stripped out by default
            // also, the 3rd party lib will saninitze any html code unless it's encoded, so we'll do that
            if (isRenderHtmlEnabled) {
                // sanitize any unauthorized html tags like script and others
                // for the remaining allowed tags we'll permit all attributes
                const sanitizeText = sanitizeHtml(optionText, sanitizedOptions);
                optionText = htmlEncode(sanitizeText);
            }
            // html text of each select option
            options += `<option value="${option[this.valueName]}" ${selected}>${optionText}</option>`;
            // if there's a search term, we will add the "filled" class for styling purposes
            if (selected) {
                this.isFilled = true;
            }
        });
        return `<select class="ms-filter search-filter">${options}</select>`;
    }
    /**
     * From the html template string, create a DOM element
     * Subscribe to the onClose event and run the callback when that happens
     * @param filterTemplate
     */
    createDomElement(filterTemplate) {
        const $headerElm = this.grid.getHeaderRowColumn(this.columnDef.id);
        $($headerElm).empty();
        // create the DOM element & add an ID and filter class
        this.$filterElm = $(filterTemplate);
        if (typeof this.$filterElm.multipleSelect !== 'function') {
            throw new Error(`multiple-select.js was not found, make sure to read the HOWTO Wiki on how to install it`);
        }
        this.$filterElm.attr('id', `filter-${this.columnDef.id}`);
        this.$filterElm.data('columnId', this.columnDef.id);
        // append the new DOM element to the header row
        if (this.$filterElm && typeof this.$filterElm.appendTo === 'function') {
            this.$filterElm.appendTo($headerElm);
        }
        // merge options & attach multiSelect
        const filterOptions = (this.columnDef.filter) ? this.columnDef.filter.filterOptions : {};
        const options = Object.assign({}, this.defaultOptions, filterOptions);
        this.$filterElm = this.$filterElm.multipleSelect(options);
    }
};
SingleSelectFilter = __decorate([
    inject(CollectionService, I18N)
], SingleSelectFilter);
export { SingleSelectFilter };
//# sourceMappingURL=singleSelectFilter.js.map