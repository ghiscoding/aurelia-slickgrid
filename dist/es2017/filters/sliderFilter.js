import { OperatorType, } from './../models/index';
import * as $ from 'jquery';
const DEFAULT_MIN_VALUE = 0;
const DEFAULT_MAX_VALUE = 100;
const DEFAULT_STEP = 1;
export class SliderFilter {
    constructor() {
        this._clearFilterTriggered = false;
        this._elementRangeInputId = '';
        this._elementRangeOutputId = '';
    }
    /** Getter for the Filter Generic Params */
    get filterParams() {
        return this.columnDef && this.columnDef.filter && this.columnDef.filter.params || {};
    }
    /** Getter for the `filter` properties */
    get filterProperties() {
        return this.columnDef && this.columnDef.filter || {};
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
        // define the input & slider number IDs
        this._elementRangeInputId = `rangeInput_${this.columnDef.field}`;
        this._elementRangeOutputId = `rangeOutput_${this.columnDef.field}`;
        // filter input can only have 1 search term, so we will use the 1st array index if it exist
        const searchTerm = (Array.isArray(this.searchTerms) && this.searchTerms[0]) || '';
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
        // if user chose to display the slider number on the right side, then update it every time it changes
        // we need to use both "input" and "change" event to be all cross-browser
        if (!this.filterParams.hideSliderNumber) {
            this.$filterElm.on('input change', (e) => {
                const value = e && e.target && e.target.value || '';
                if (value && document) {
                    const elm = document.getElementById(this._elementRangeOutputId || '');
                    if (elm && elm.innerHTML) {
                        elm.innerHTML = value;
                    }
                }
            });
        }
    }
    /**
     * Clear the filter value
     */
    clear() {
        if (this.$filterElm) {
            this._clearFilterTriggered = true;
            this.searchTerms = [];
            const clearedValue = this.filterParams.hasOwnProperty('sliderStartValue') ? this.filterParams.sliderStartValue : DEFAULT_MIN_VALUE;
            this.$filterElm.children('input').val(clearedValue);
            this.$filterElm.children('div.input-group-addon.input-group-append').children().html(clearedValue);
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
    /**
     * Create the HTML template as a string
     */
    buildTemplateHtmlString() {
        const columnId = this.columnDef && this.columnDef.id;
        const minValue = this.filterProperties.hasOwnProperty('minValue') ? this.filterProperties.minValue : DEFAULT_MIN_VALUE;
        const maxValue = this.filterProperties.hasOwnProperty('maxValue') ? this.filterProperties.maxValue : DEFAULT_MAX_VALUE;
        const defaultValue = this.filterParams.hasOwnProperty('sliderStartValue') ? this.filterParams.sliderStartValue : minValue;
        const step = this.filterProperties.hasOwnProperty('valueStep') ? this.filterProperties.valueStep : DEFAULT_STEP;
        if (this.filterParams.hideSliderNumber) {
            return `
      <div class="search-filter filter-${columnId}">
        <input type="range" id="${this._elementRangeInputId}"
          name="${this._elementRangeInputId}"
          defaultValue="${defaultValue}" min="${minValue}" max="${maxValue}" step="${step}"
          class="form-control slider-filter-input range" />
      </div>`;
        }
        return `
      <div class="input-group search-filter filter-${columnId}">
        <input type="range" id="${this._elementRangeInputId}"
          name="${this._elementRangeInputId}"
          defaultValue="${defaultValue}" min="${minValue}" max="${maxValue}" step="${step}"
          class="form-control slider-filter-input range" />
        <div class="input-group-addon input-group-append slider-value">
          <span class="input-group-text" id="${this._elementRangeOutputId}">${defaultValue}</span>
        </div>
      </div>`;
    }
    /**
     * From the html template string, create a DOM element
     * @param filterTemplate
     */
    createDomElement(filterTemplate, searchTerm) {
        const columnId = this.columnDef && this.columnDef.id;
        const $headerElm = this.grid.getHeaderRowColumn(columnId);
        $($headerElm).empty();
        // create the DOM element & add an ID and filter class
        const $filterElm = $(filterTemplate);
        const searchTermInput = (searchTerm || '0');
        $filterElm.children('input').val(searchTermInput);
        $filterElm.children('div.input-group-addon.input-group-append').children().html(searchTermInput);
        $filterElm.attr('id', `filter-${columnId}`);
        $filterElm.data('columnId', columnId);
        // if there's a search term, we will add the "filled" class for styling purposes
        if (searchTerm) {
            $filterElm.addClass('filled');
        }
        // append the new DOM element to the header row
        if ($filterElm && typeof $filterElm.appendTo === 'function') {
            $filterElm.appendTo($headerElm);
        }
        return $filterElm;
    }
}
//# sourceMappingURL=sliderFilter.js.map