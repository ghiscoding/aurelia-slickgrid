import { I18N } from 'aurelia-i18n';
import { inject } from 'aurelia-framework';
import {
  Column,
  Filter,
  FilterType,
  FilterArguments,
  FilterCallback,
  SearchTerm
} from './../models/index';
import * as $ from 'jquery';

@inject(I18N)
export class SelectFilter implements Filter {
  $filterElm: any;
  grid: any;
  searchTerm: SearchTerm;
  columnDef: Column;
  callback: FilterCallback;
  filterType = FilterType.select;

  constructor(private i18n: I18N) { }

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
    this.searchTerm = args.searchTerm || '';

    // step 1, create HTML string template
    const filterTemplate = this.buildTemplateHtmlString();

    // step 2, create the DOM Element of the filter & initialize it if searchTerm is filled
    this.$filterElm = this.createDomElement(filterTemplate);

    // step 3, subscribe to the change event and run the callback when that happens
    // also add/remove "filled" class for styling purposes
    this.$filterElm.change((e: any) => {
      (e && e.target && e.target.value) ? this.$filterElm.addClass('filled') : this.$filterElm.removeClass('filled');
      this.callback(e, { columnDef: this.columnDef, operator: 'EQ' });
    });
  }

  /**
   * Clear the filter values
   */
  clear(triggerFilterChange = true) {
    if (this.$filterElm) {
      this.$filterElm.val('');
      if (triggerFilterChange) {
        this.$filterElm.trigger('change');
      }
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

  private buildTemplateHtmlString() {
    if (!this.columnDef || !this.columnDef.filter || (!this.columnDef.filter.collection && !this.columnDef.filter.selectOptions)) {
      throw new Error(`[Aurelia-SlickGrid] You need to pass a "collection" for the Select Filter to work correctly. Also each option should include a value/label pair (or value/labelKey when using Locale). For example:: { filter: type: FilterType.select, collection: [{ value: true, label: 'True' }, { value: false, label: 'False'}] }`);
    }
    if (!this.columnDef.filter.collection && this.columnDef.filter.selectOptions) {
      console.warn(`[Aurelia-SlickGrid] The Select Filter "selectOptions" property will de deprecated in future version. Please use the new "collection" property which is more generic and can be used with other Filters (not just Select).`);
    }

    const optionCollection = this.columnDef.filter.collection || this.columnDef.filter.selectOptions || [];
    const labelName = (this.columnDef.filter.customStructure) ? this.columnDef.filter.customStructure.label : 'label';
    const valueName = (this.columnDef.filter.customStructure) ? this.columnDef.filter.customStructure.value : 'value';
    const isEnabledTranslate = (this.columnDef.filter.enableTranslateLabel) ? this.columnDef.filter.enableTranslateLabel : false;

    let options = '';
    optionCollection.forEach((option: any) => {
      if (!option || (option[labelName] === undefined && option.labelKey === undefined)) {
        throw new Error(`A collection with value/label (or value/labelKey when using Locale) is required to populate the Select list, for example:: { filter: type: FilterType.select, collection: [ { value: '1', label: 'One' } ]')`);
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
  private createDomElement(filterTemplate: string) {
    const $headerElm = this.grid.getHeaderRowColumn(this.columnDef.id);
    $($headerElm).empty();

    // create the DOM element & add an ID and filter class
    const $filterElm = $(filterTemplate);
    const searchTerm = (typeof this.searchTerm === 'boolean') ? `${this.searchTerm}` : this.searchTerm;
    $filterElm.val(searchTerm || '');
    $filterElm.attr('id', `filter-${this.columnDef.id}`);
    $filterElm.data('columnId', this.columnDef.id);

    // append the new DOM element to the header row
    if ($filterElm && typeof $filterElm.appendTo === 'function') {
      $filterElm.appendTo($headerElm);
    }

    return $filterElm;
  }
}
