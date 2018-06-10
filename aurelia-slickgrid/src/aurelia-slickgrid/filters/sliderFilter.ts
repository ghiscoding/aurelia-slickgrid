import {
  Column,
  Filter,
  FilterArguments,
  FilterCallback,
  GridOption,
  OperatorType,
  OperatorString,
  SearchTerm
} from './../models/index';
import * as $ from 'jquery';

const DEFAULT_VALUE = '0';

export class SliderFilter implements Filter {
  private $filterElm: any;
  grid: any;
  searchTerms: SearchTerm[];
  columnDef: Column;
  callback: FilterCallback;

  /** Getter for the Filter Generic Params */
  private get filterParams(): any {
    return this.columnDef && this.columnDef.filter && this.columnDef.filter.params || {};
  }

  get operator(): OperatorType | OperatorString {
    return OperatorType.equal;
  }

  /**
   * Initialize the Filter
   */
  init(args: FilterArguments) {
    if (!args) {
      throw new Error('[Aurelia-SlickGrid] A filter must always have an "init()" with valid arguments.');
    }
    this.grid = args.grid;
    this.callback = args.callback;
    this.columnDef = args.columnDef;
    this.searchTerms = args.searchTerms || [];

    // filter input can only have 1 search term, so we will use the 1st array index if it exist
    const searchTerm = (Array.isArray(this.searchTerms) && this.searchTerms[0]) || '';

    // step 1, create HTML string template
    const filterTemplate = this.buildTemplateHtmlString();

    // step 2, create the DOM Element of the filter & initialize it if searchTerm is filled
    this.$filterElm = this.createDomElement(filterTemplate, searchTerm);

    // step 3, subscribe to the change event and run the callback when that happens
    // also add/remove "filled" class for styling purposes
    this.$filterElm.change((e: any) => {
      const value = e && e.target && e.target.value || '';
      if (!value || value === '') {
        this.callback(e, { columnDef: this.columnDef, clearFilterTriggered: true });
        this.$filterElm.removeClass('filled');
      } else {
        this.$filterElm.addClass('filled');
        this.callback(e, { columnDef: this.columnDef, searchTerms: [value] });
      }
    });
  }

  /**
   * Clear the filter value
   */
  clear() {
    if (this.$filterElm) {
      const clearedValue = this.filterParams.sliderDefaultValue || DEFAULT_VALUE;
      this.$filterElm.children('input').val(clearedValue);
      this.$filterElm.children('span.input-group-addon').html(clearedValue);
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
  setValues(values: SearchTerm) {
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
  private buildTemplateHtmlString() {
    const maxValue = this.filterParams.sliderMaxValue || 100;
    return `
    <div class="input-group">
      <input type="range" id="rangeInput_${this.columnDef.field}"
        name="rangeInput_${this.columnDef.field}"
        defaultValue="0" max="${maxValue}"
        class="form-control search-filter range"
        oninput="$('#rangeOuput_${this.columnDef.field}').html(rangeInput_${this.columnDef.field}.value)"
      >
      <span class="input-group-addon" id="rangeOuput_${this.columnDef.field}">0</span>
    </div>
    `;
  }

  /**
   * From the html template string, create a DOM element
   * @param filterTemplate
   */
  private createDomElement(filterTemplate: string, searchTerm?: SearchTerm) {
    const $headerElm = this.grid.getHeaderRowColumn(this.columnDef.id);
    $($headerElm).empty();

    // create the DOM element & add an ID and filter class
    const $filterElm = $(filterTemplate);
    const searchTermInput = (searchTerm || '0') as string;

    $filterElm.children('input').val(searchTermInput);
    $filterElm.children('span.input-group-addon').html(searchTermInput);
    $filterElm.attr('id', `filter-${this.columnDef.id}`);
    $filterElm.data('columnId', this.columnDef.id);

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
