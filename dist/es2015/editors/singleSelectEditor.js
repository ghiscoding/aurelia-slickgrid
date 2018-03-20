import { findOrDefault } from '../services/index';
import * as $ from 'jquery';
/**
 * Slickgrid editor class for single select lists
 */
export class SingleSelectEditor {
    constructor(args) {
        this.args = args;
        /**
         * The options label/value object to use in the select list
         */
        this.collection = [];
        const gridOptions = this.args.grid.getOptions();
        const params = gridOptions.params || this.args.column.params || {};
        this._i18n = params.i18n;
        this.defaultOptions = {
            container: 'body',
            filter: false,
            maxHeight: 200,
            width: 150,
            offsetLeft: 20,
            single: true
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
        const editorTemplate = this.buildTemplateHtmlString();
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
    buildTemplateHtmlString() {
        if (!this.columnDef || !this.columnDef.params || !this.columnDef.params.collection) {
            throw new Error('[Aurelia-SlickGrid] You need to pass a "collection" on the params property in the column definition for ' +
                'the SingleSelect Editor to work correctly. Also each option should include ' +
                'a value/label pair (or value/labelKey when using Locale). For example: { params: { ' +
                '{ collection: [{ value: true, label: \'True\' }, { value: false, label: \'False\'}] } } }');
        }
        this.collection = this.columnDef.params.collection || [];
        this.labelName = (this.columnDef.params.customStructure) ? this.columnDef.params.customStructure.label : 'label';
        this.valueName = (this.columnDef.params.customStructure) ? this.columnDef.params.customStructure.value : 'value';
        const isEnabledTranslate = (this.columnDef.params.enableTranslateLabel) ? this.columnDef.params.enableTranslateLabel : false;
        let options = '';
        this.collection.forEach((option) => {
            if (!option || (option[this.labelName] === undefined && option.labelKey === undefined)) {
                throw new Error('A collection with value/label (or value/labelKey when using ' +
                    'Locale) is required to populate the Select list, for example: { params: { ' +
                    '{ collection: [ { value: \'1\', label: \'One\' } ] } } }');
            }
            const labelKey = (option.labelKey || option[this.labelName]);
            const textLabel = ((option.labelKey || isEnabledTranslate) && this._i18n && typeof this._i18n.tr === 'function') ? this._i18n.tr(labelKey || ' ') : labelKey;
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
            const options = Object.assign({}, this.defaultOptions, elementOptions);
            this.$editorElm = this.$editorElm.multipleSelect(options);
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
}
//# sourceMappingURL=singleSelectEditor.js.map