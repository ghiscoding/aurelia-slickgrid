import { inject, Optional } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { mapFlatpickrDateFormatWithFieldType, mapMomentDateFormatWithFieldType } from '../services/utilities';
import {
  Column,
  ColumnFilter,
  FieldType,
  Filter,
  FilterArguments,
  FilterCallback,
  FlatpickrOption,
  GridOption,
  OperatorString,
  OperatorType,
  SearchTerm,
} from '../models/index';
import * as flatpickr from 'flatpickr';
import * as $ from 'jquery';
import * as moment from 'moment-mini';

declare function require(name: string): any;
declare function require(name: string[], loadedFile: any): any;

@inject(Optional.of(I18N))
export class DateRangeFilter implements Filter {
  private _clearFilterTriggered = false;
  private _currentValue: string;
  private _currentDates: Date[];
  private _currentDateStrings: string[];
  private _flatpickrOptions: FlatpickrOption;
  private _shouldTriggerQuery = true;
  private $filterElm: any;
  private $filterInputElm: any;
  flatInstance: any;
  grid: any;
  searchTerms: SearchTerm[];
  columnDef: Column;
  callback: FilterCallback;

  constructor(private i18n: I18N) { }

  /** Getter for the Grid Options pulled through the Grid Object */
  private get gridOptions(): GridOption {
    return (this.grid && this.grid.getOptions) ? this.grid.getOptions() : {};
  }

  /** Getter for the Column Filter */
  get columnFilter(): ColumnFilter {
    return this.columnDef && this.columnDef.filter || {};
  }

  /** Getter for the Current Dates selected */
  get currentDates(): Date[] {
    return this._currentDates;
  }

  /** Getter for the Flatpickr Options */
  get flatpickrOptions(): FlatpickrOption {
    return this._flatpickrOptions || {};
  }

  /** Getter of the Operator to use when doing the filter comparing */
  get operator(): OperatorType | OperatorString {
    return this.columnFilter.operator || this.gridOptions.defaultFilterRangeOperator || OperatorType.rangeExclusive;
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
    this.searchTerms = (args.hasOwnProperty('searchTerms') ? args.searchTerms : []) || [];

    // step 1, create the DOM Element of the filter which contain the compound Operator+Input
    this.$filterElm = this.createDomElement(this.searchTerms);

    // step 3, subscribe to the keyup event and run the callback when that happens
    // also add/remove "filled" class for styling purposes
    this.$filterInputElm.keyup((e: any) => {
      this.onTriggerEvent(e);
    });

  }

  /**
   * Clear the filter value
   */
  clear(shouldTriggerQuery = true) {
    if (this.flatInstance) {
      this._clearFilterTriggered = true;
      this._shouldTriggerQuery = shouldTriggerQuery;
      this.searchTerms = [];
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
    if (this.flatInstance && typeof this.flatInstance.destroy === 'function') {
      this.flatInstance.destroy();
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

  /**
   * Set value(s) on the DOM element
   * @params searchTerms
   */
  setValues(searchTerms: SearchTerm[]) {
    let pickerValues: any[] = [];

    // get the picker values, if it's a string with the "..", we'll do the split else we'll use the array of search terms
    if (typeof searchTerms === 'string' || (Array.isArray(searchTerms) && typeof searchTerms[0] === 'string') && (searchTerms[0] as string).indexOf('..') > 0) {
      pickerValues = (typeof searchTerms === 'string') ? [(searchTerms as string)] : (searchTerms[0] as string).split('..');
    } else if (Array.isArray(searchTerms)) {
      pickerValues = searchTerms;
    }

    if (this.flatInstance && searchTerms) {
      this._currentDates = pickerValues;
      this.flatInstance.setDate(pickerValues);
    }
  }

  //
  // private functions
  // ------------------
  private buildDatePickerInput(searchTerms?: SearchTerm | SearchTerm[]) {
    const columnId = this.columnDef && this.columnDef.id;
    const inputFormat = mapFlatpickrDateFormatWithFieldType(this.columnDef.type || FieldType.dateIso);
    const outputFormat = mapFlatpickrDateFormatWithFieldType(this.columnDef.outputType || this.columnDef.type || FieldType.dateUtc);
    let currentLocale = this.i18n && this.i18n.getLocale && this.i18n.getLocale() || 'en';
    if (currentLocale.length > 2) {
      currentLocale = currentLocale.substring(0, 2);
    }

    let pickerValues: any[] = [];

    // get the picker values, if it's a string with the "..", we'll do the split else we'll use the array of search terms
    if (typeof searchTerms === 'string' || (Array.isArray(searchTerms) && typeof searchTerms[0] === 'string') && (searchTerms[0] as string).indexOf('..') > 0) {
      pickerValues = (typeof searchTerms === 'string') ? [(searchTerms as string)] : (searchTerms[0] as string).split('..');
    } else if (Array.isArray(searchTerms)) {
      pickerValues = searchTerms;
    }

    // if we are preloading searchTerms, we'll keep them for reference
    if (pickerValues) {
      this._currentDates = pickerValues as Date[];
      const outFormat = mapMomentDateFormatWithFieldType(this.columnDef.type || FieldType.dateIso);
      this._currentDateStrings = pickerValues.map(date => moment(date).format(outFormat));
    }

    const pickerOptions: FlatpickrOption = {
      defaultDate: (pickerValues || '') as string | string[],
      altInput: true,
      altFormat: outputFormat,
      dateFormat: inputFormat,
      mode: 'range',
      wrap: true,
      closeOnSelect: true,
      locale: (currentLocale !== 'en') ? this.loadFlatpickrLocale(currentLocale) : 'en',
      onChange: (selectedDates: Date[] | Date, dateStr: string, instance: any) => {
        if (Array.isArray(selectedDates)) {
          this._currentDates = selectedDates;
          const outFormat = mapMomentDateFormatWithFieldType(this.columnDef.outputType || this.columnDef.type || FieldType.dateIso);
          this._currentDateStrings = selectedDates.map(date => moment(date).format(outFormat));
          this._currentValue = this._currentDateStrings.join('..');
        }

        // when using the time picker, we can simulate a keyup event to avoid multiple backend request
        // since backend request are only executed after user start typing, changing the time should be treated the same way
        if (pickerOptions.enableTime) {
          this.onTriggerEvent(new CustomEvent('keyup'));
        } else {
          this.onTriggerEvent(undefined);
        }
      }
    };

    // add the time picker when format is UTC (Z) or has the 'h' (meaning hours)
    if (outputFormat && (outputFormat === 'Z' || outputFormat.toLowerCase().includes('h'))) {
      pickerOptions.enableTime = true;
    }

    // merge options with optional user's custom options
    this._flatpickrOptions = { ...pickerOptions, ...(this.columnFilter.filterOptions as FlatpickrOption) };

    let placeholder = (this.gridOptions) ? (this.gridOptions.defaultFilterPlaceholder || '') : '';
    if (this.columnFilter && this.columnFilter.placeholder) {
      placeholder = this.columnFilter.placeholder;
    }
    const $filterInputElm: any = $(`<div class="flatpickr search-filter filter-${columnId}"><input type="text" class="form-control" data-input placeholder="${placeholder}"></div>`);
    this.flatInstance = (flatpickr && $filterInputElm[0] && typeof $filterInputElm[0].flatpickr === 'function') ? $filterInputElm[0].flatpickr(this._flatpickrOptions) : null;
    return $filterInputElm;
  }

  /**
   * Create the DOM element
   * @params searchTerms
   */
  private createDomElement(searchTerms?: SearchTerm[]) {
    const columnId = this.columnDef && this.columnDef.id;
    const $headerElm = this.grid.getHeaderRowColumn(columnId);
    $($headerElm).empty();

    // create the DOM Select dropdown for the Operator
    this.$filterInputElm = this.buildDatePickerInput(searchTerms);

    /* the DOM element final structure will be
      <div class=flatpickr>
        <input type="text" class="form-control" data-input>
      </div>
    */

    // create the DOM element & add an ID and filter class
    this.$filterInputElm.attr('id', `filter-${columnId}`);
    this.$filterInputElm.data('columnId', columnId);

    // if there's a search term, we will add the "filled" class for styling purposes
    if (Array.isArray(searchTerms) && searchTerms.length > 0 && searchTerms[0] !== '') {
      this.$filterInputElm.addClass('filled');
      this._currentDates = searchTerms as Date[];
      this._currentValue = searchTerms[0] as string;
    }

    // append the new DOM element to the header row
    if (this.$filterInputElm && typeof this.$filterInputElm.appendTo === 'function') {
      this.$filterInputElm.appendTo($headerElm);
    }

    return this.$filterInputElm;
  }

  /** Load a different set of locales for Flatpickr to be localized */
  private loadFlatpickrLocale(language: string) {
    let locales = 'en';

    if (language !== 'en') {
      // change locale if needed, Flatpickr reference: https://chmln.github.io/flatpickr/localization/
      const localeDefault: any = require(`flatpickr/dist/l10n/${language}.js`).default;
      locales = (localeDefault && localeDefault[language]) ? localeDefault[language] : 'en';
    }
    return locales;
  }

  private onTriggerEvent(e: Event | undefined) {
    if (this._clearFilterTriggered) {
      this.callback(e, { columnDef: this.columnDef, clearFilterTriggered: this._clearFilterTriggered, shouldTriggerQuery: this._shouldTriggerQuery });
      this.$filterElm.removeClass('filled');
    } else {
      (this._currentDateStrings) ? this.$filterElm.addClass('filled') : this.$filterElm.removeClass('filled');
      this.callback(e, { columnDef: this.columnDef, searchTerms: (this._currentDateStrings ? this._currentDateStrings : [this._currentValue]), operator: this.operator || '', shouldTriggerQuery: this._shouldTriggerQuery });
    }
    // reset both flags for next use
    this._clearFilterTriggered = false;
    this._shouldTriggerQuery = true;
  }
}
