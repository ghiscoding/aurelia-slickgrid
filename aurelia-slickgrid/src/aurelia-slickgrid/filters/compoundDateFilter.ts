import { inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { mapFlatpickrDateFormatWithFieldType } from '../services/utilities';
import {
  Column,
  FieldType,
  Filter,
  FilterArguments,
  FilterCallback,
  FilterType,
  GridOption,
  OperatorString,
  OperatorType,
  SearchTerm
} from './../models/index';
import * as flatpickr from 'flatpickr';
import * as $ from 'jquery';

@inject(I18N)
export class CompoundDateFilter implements Filter {
  private $filterElm: any;
  private $filterInputElm: any;
  private $selectOperatorElm: any;
  private _currentValue: string;
  flatInstance: any;
  grid: any;
  gridOptions: GridOption;
  operator: OperatorType | OperatorString | undefined;
  searchTerm: SearchTerm | undefined;
  columnDef: Column;
  callback: FilterCallback;
  filterType = FilterType.compoundDate;

  constructor(private i18n: I18N) { }

  /**
   * Initialize the Filter
   */
  init(args: FilterArguments) {
    if (args) {
      this.grid = args.grid;
      this.callback = args.callback;
      this.columnDef = args.columnDef;
      this.operator = args.operator || '';
      this.searchTerm = args.searchTerm;
      if (this.grid && typeof this.grid.getOptions === 'function') {
        this.gridOptions = this.grid.getOptions();
      }

      // step 1, create the DOM Element of the filter which contain the compound Operator+Input
      // and initialize it if searchTerm is filled
      this.$filterElm = this.createDomElement();

      // step 3, subscribe to the keyup event and run the callback when that happens
      // also add/remove "filled" class for styling purposes
      this.$filterInputElm.keyup((e: any) => {
        this.onTriggerEvent(e);
      });
      this.$selectOperatorElm.change((e: any) => {
        this.onTriggerEvent(e);
      });
    }
  }

  /**
   * Clear the filter value
   */
  clear(triggerFilterKeyup = true) {
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
  setValues(values: SearchTerm) {
    if (values) {
      this.flatInstance.setDate(values);
    }
  }

  //
  // private functions
  // ------------------

  private buildDatePickerInput(searchTerm: SearchTerm) {
    const inputFormat = mapFlatpickrDateFormatWithFieldType(this.columnDef.type || FieldType.dateIso);
    const outputFormat = mapFlatpickrDateFormatWithFieldType(this.columnDef.outputType || this.columnDef.type || FieldType.dateUtc);
    let currentLocale = this.i18n.getLocale() || 'en';
    if (currentLocale.length > 2) {
      currentLocale = currentLocale.substring(0, 2);
    }

    const pickerOptions: any = {
      defaultDate: searchTerm || '',
      altInput: true,
      altFormat: outputFormat,
      dateFormat: inputFormat,
      wrap: true,
      closeOnSelect: true,
      locale: (currentLocale !== 'en') ? this.loadFlatpickrLocale(currentLocale) : 'en',
      onChange: (selectedDates: any[] | any, dateStr: string, instance: any) => {
        this._currentValue = dateStr;

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

    const placeholder = (this.gridOptions) ? (this.gridOptions.defaultFilterPlaceholder || '') : '';
    const $filterInputElm: any = $(`<div class=flatpickr><input type="text" class="form-control" data-input placeholder="${placeholder}"></div>`);
    this.flatInstance = (flatpickr && $filterInputElm[0] && typeof $filterInputElm[0].flatpickr === 'function') ? $filterInputElm[0].flatpickr(pickerOptions) : null;
    return $filterInputElm;
  }

  private buildSelectOperatorHtmlString() {
    const optionValues = this.getOptionValues();
    let optionValueString = '';
    optionValues.forEach((option) => {
      optionValueString += `<option value="${option.operator}" title="${option.description}">${option.operator}</option>`;
    });

    return `<select class="form-control">${optionValueString}</select>`;
  }

  private getOptionValues(): { operator: OperatorString, description: string }[] {
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
  private createDomElement() {
    const $headerElm = this.grid.getHeaderRowColumn(this.columnDef.id);
    $($headerElm).empty();

    const searchTerm = (this.searchTerm || '') as string;
    if (searchTerm) {
      this._currentValue = searchTerm;
    }

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
    if (this.searchTerm) {
      $filterContainerElm.addClass('filled');
    }

    // append the new DOM element to the header row
    if ($filterContainerElm && typeof $filterContainerElm.appendTo === 'function') {
      $filterContainerElm.appendTo($headerElm);
    }

    return $filterContainerElm;
  }

  private loadFlatpickrLocale(locale: string) {
    // change locale if needed, Flatpickr reference: https://chmln.github.io/flatpickr/localization/
    if (locale !== 'en') {
      const localeDefault: any = require(`flatpickr/dist/l10n/${locale}.js`).default;
      return (localeDefault && localeDefault[locale]) ? localeDefault[locale] : 'en';
    }
    return 'en';
  }

  private onTriggerEvent(e: Event | undefined) {
    const selectedOperator = this.$selectOperatorElm.find('option:selected').text();
    (this._currentValue) ? this.$filterElm.addClass('filled') : this.$filterElm.removeClass('filled');
    this.callback(e, { columnDef: this.columnDef, searchTerm: this._currentValue, operator: selectedOperator || '=' });
  }

  private hide() {
    if (this.flatInstance && typeof this.flatInstance.close === 'function') {
      this.flatInstance.close();
    }
  }

  private show() {
    if (this.flatInstance && typeof this.flatInstance.open === 'function') {
      this.flatInstance.open();
    }
  }
}
