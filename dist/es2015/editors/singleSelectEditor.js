var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { findOrDefault, CollectionService } from '../services/index';
import * as $ from 'jquery';
// height in pixel of the multiple-select DOM element
const SELECT_ELEMENT_HEIGHT = 26;
/**
 * Slickgrid editor class for single select lists
 */
let SingleSelectEditor = class SingleSelectEditor {
    constructor(collectionService, i18n, args) {
        this.collectionService = collectionService;
        this.i18n = i18n;
        this.args = args;
        /** The options label/value object to use in the select list */
        this.collection = [];
        this.gridOptions = this.args.grid.getOptions();
        const params = this.gridOptions.params || this.args.column.params || {};
        this.defaultOptions = {
            container: 'body',
            filter: false,
            maxHeight: 200,
            width: 150,
            offsetLeft: 20,
            single: true,
            onOpen: () => this.autoAdjustDropPosition(this.$editorElm, this.editorElmOptions),
        };
        this.init();
    }
    /**
     * The current selected value from the collection
     */
    get currentValue() {
        return findOrDefault(this.collection, (c) => c[this.valueName].toString() === this.$editorElm.val())[this.valueName];
    }
    init() {
        if (!this.args) {
            throw new Error('[Aurelia-SlickGrid] An editor must always have an "init()" with valid arguments.');
        }
        this.columnDef = this.args.column;
        if (!this.columnDef || !this.columnDef.params || !this.columnDef.params.collection) {
            throw new Error(`[Aurelia-SlickGrid] You need to pass a "collection" on the params property in the column definition for the MultipleSelect Editor to work correctly.
      Also each option should include a value/label pair (or value/labelKey when using Locale).
      For example: { params: { { collection: [{ value: true, label: 'True' },{ value: false, label: 'False'}] } } }`);
        }
        this.enableTranslateLabel = (this.columnDef.params.enableTranslateLabel) ? this.columnDef.params.enableTranslateLabel : false;
        let newCollection = this.columnDef.params.collection || [];
        this.labelName = (this.columnDef.params.customStructure) ? this.columnDef.params.customStructure.label : 'label';
        this.valueName = (this.columnDef.params.customStructure) ? this.columnDef.params.customStructure.value : 'value';
        // user might want to filter certain items of the collection
        if (this.gridOptions.params && this.columnDef.params.collectionFilterBy) {
            const filterBy = this.columnDef.params.collectionFilterBy;
            newCollection = this.collectionService.filterCollection(newCollection, filterBy);
        }
        // user might want to sort the collection
        if (this.gridOptions.params && this.columnDef.params.collectionSortBy) {
            const sortBy = this.columnDef.params.collectionSortBy;
            newCollection = this.collectionService.sortCollection(newCollection, sortBy, this.enableTranslateLabel);
        }
        this.collection = newCollection;
        const editorTemplate = this.buildTemplateHtmlString(newCollection);
        this.createDomElement(editorTemplate);
    }
    applyValue(item, state) {
        item[this.args.column.field] = state;
    }
    destroy() {
        this.$editorElm.remove();
    }
    loadValue(item) {
        // convert to string because that is how the DOM will return these values
        this.defaultValue = item[this.columnDef.field].toString();
        this.$editorElm.find('option').each((i, $e) => {
            if (this.defaultValue.indexOf($e.value) !== -1) {
                $e.selected = true;
            }
            else {
                $e.selected = false;
            }
        });
        this.refresh();
    }
    serializeValue() {
        return this.currentValue;
    }
    focus() {
        this.$editorElm.focus();
    }
    isValueChanged() {
        return this.$editorElm.val() !== this.defaultValue;
    }
    validate() {
        if (this.args.column.validator) {
            const validationResults = this.args.column.validator(this.currentValue, this.args);
            if (!validationResults.valid) {
                return validationResults;
            }
        }
        return {
            valid: true,
            msg: null
        };
    }
    /**
     * Automatically adjust the multiple-select dropup or dropdown by available space
     */
    autoAdjustDropPosition(multipleSelectDomElement, multipleSelectOptions) {
        // height in pixel of the multiple-select element
        const selectElmHeight = SELECT_ELEMENT_HEIGHT;
        const windowHeight = $(window).innerHeight() || 300;
        const pageScroll = $('body').scrollTop() || 0;
        const $msDropContainer = multipleSelectOptions.container ? $(multipleSelectOptions.container) : multipleSelectDomElement;
        const $msDrop = $msDropContainer.find('.ms-drop');
        const msDropHeight = $msDrop.height() || 0;
        const msDropOffsetTop = $msDrop.offset().top;
        const space = windowHeight - (msDropOffsetTop - pageScroll);
        if (space < msDropHeight) {
            if (multipleSelectOptions.container) {
                // when using a container, we need to offset the drop ourself
                // and also make sure there's space available on top before doing so
                const newOffsetTop = (msDropOffsetTop - msDropHeight - selectElmHeight);
                if (newOffsetTop > 0) {
                    $msDrop.offset({ top: newOffsetTop < 0 ? 0 : newOffsetTop });
                }
            }
            else {
                // without container, we simply need to add the "top" class to the drop
                $msDrop.addClass('top');
            }
            $msDrop.removeClass('bottom');
        }
        else {
            $msDrop.addClass('bottom');
            $msDrop.removeClass('top');
        }
    }
    /** Build the template HTML string */
    buildTemplateHtmlString(collection) {
        let options = '';
        collection.forEach((option) => {
            if (!option || (option[this.labelName] === undefined && option.labelKey === undefined)) {
                throw new Error('A collection with value/label (or value/labelKey when using ' +
                    'Locale) is required to populate the Select list, for example: { params: { ' +
                    '{ collection: [ { value: \'1\', label: \'One\' } ] } } }');
            }
            const labelKey = (option.labelKey || option[this.labelName]);
            const textLabel = (option.labelKey || this.enableTranslateLabel) ? this.i18n.tr(labelKey || ' ') : labelKey;
            options += `<option value="${option[this.valueName]}">${textLabel}</option>`;
        });
        return `<select class="ms-filter search-filter">${options}</select>`;
    }
    createDomElement(editorTemplate) {
        this.$editorElm = $(editorTemplate);
        if (this.$editorElm && typeof this.$editorElm.appendTo === 'function') {
            this.$editorElm.appendTo(this.args.container);
        }
        if (typeof this.$editorElm.multipleSelect !== 'function') {
            // fallback to bootstrap
            this.$editorElm.addClass('form-control');
        }
        else {
            const elementOptions = (this.columnDef.params) ? this.columnDef.params.elementOptions : {};
            this.editorElmOptions = Object.assign({}, this.defaultOptions, elementOptions);
            this.$editorElm = this.$editorElm.multipleSelect(this.editorElmOptions);
            setTimeout(() => this.$editorElm.multipleSelect('open'));
        }
    }
    // refresh the jquery object because the selected checkboxes were already set
    // prior to this method being called
    refresh() {
        if (typeof this.$editorElm.multipleSelect === 'function') {
            this.$editorElm.multipleSelect('refresh');
        }
    }
};
SingleSelectEditor = __decorate([
    inject(CollectionService, I18N)
], SingleSelectEditor);
export { SingleSelectEditor };
//# sourceMappingURL=singleSelectEditor.js.map