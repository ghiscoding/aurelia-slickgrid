import { inject, Optional } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { Constants } from '../constants';
import {
  Column,
  ColumnFilter,
  FieldType,
  Filter,
  FilterArguments,
  FilterCallback,
  GridOption,
  Locale,
  OperatorString,
  OperatorType,
  SearchTerm,
} from './../models/index';
import * as $ from 'jquery';

@inject(Optional.of(I18N))
export class CompoundInputFilter implements Filter {
  private _clearFilterTriggered = false;
  private _shouldTriggerQuery = true;
  private _inputType = 'text';
  private _locales: Locale;
  private $filterElm: any;
  private $filterInputElm: any;
  private $selectOperatorElm: any;
  private _operator: OperatorType | OperatorString;
  grid: any;
  searchTerms: SearchTerm[];
  columnDef: Column;
  callback: FilterCallback;

  constructor(protected i18n: I18N) { }

  /** Getter for the Grid Options pulled through the Grid Object */
  private get gridOptions(): GridOption {
    return (this.grid && this.grid.getOptions) ? this.grid.getOptions() : {};
  }

  /** Getter for the Filter Operator */
  get columnFilter(): ColumnFilter {
    return this.columnDef && this.columnDef.filter || {};
  }

  /** Getter of input type (text, number, password) */
  get inputType() {
    return this._inputType;
  }

  /** Setter of input type (text, number, password) */
  set inputType(type: string) {
    this._inputType = type;
  }

  /** Getter of the Operator to use when doing the filter comparing */
  get operator(): OperatorType | OperatorString {
    return this._operator || OperatorType.empty;
  }

  /** Getter of the Operator to use when doing the filter comparing */
  set operator(op: OperatorType | OperatorString) {
    this._operator = op;
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
    this.operator = args.operator || '';
    this.searchTerms = args.searchTerms || [];

    // get locales provided by user in forRoot or else use default English locales via the Constants
    this._locales = this.gridOptions && this.gridOptions.locales || Constants.locales;

    // filter input can only have 1 search term, so we will use the 1st array index if it exist
    const searchTerm = (Array.isArray(this.searchTerms) && this.searchTerms[0]) || '';

    // step 1, create the DOM Element of the filter which contain the compound Operator+Input
    // and initialize it if searchTerm is filled
    this.$filterElm = this.createDomElement(searchTerm);

    // step 3, subscribe to the keyup event and run the callback when that happens
    // also add/remove "filled" class for styling purposes
    this.$filterInputElm.on('keyup input change', (e: any) => {
      this.onTriggerEvent(e);
    });
    this.$selectOperatorElm.on('change', (e: any) => {
      this.onTriggerEvent(e);
    });
  }

  /**
   * Clear the filter value
   */
  clear(shouldTriggerQuery = true) {
    if (this.$filterElm && this.$selectOperatorElm) {
      this._clearFilterTriggered = true;
      this._shouldTriggerQuery = shouldTriggerQuery;
      this.searchTerms = [];
      this.$selectOperatorElm.val(0);
      this.$filterInputElm.val('');
      this.onTriggerEvent(undefined);
    }
  }

  /**
   * destroy the filter
   */
  destroy() {
    if (this.$filterElm && this.$selectOperatorElm) {
      this.$filterElm.off('keyup input change').remove();
      this.$selectOperatorElm.off('change');
    }
  }

  /**
   * Set value(s) on the DOM element
   */
  setValues(values: SearchTerm[]) {
    if (values && Array.isArray(values)) {
      this.$filterInputElm.val(values[0]);
    }
  }

  //
  // private functions
  // ------------------

  private buildInputHtmlString() {
    let placeholder = (this.gridOptions) ? (this.gridOptions.defaultFilterPlaceholder || '') : '';
    if (this.columnFilter && this.columnFilter.placeholder) {
      placeholder = this.columnFilter.placeholder;
    }
    return `<input type="${this._inputType || 'text'}" class="form-control" role="presentation" autocomplete="off" placeholder="${placeholder}" /><span></span>`;
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
    const type = (this.columnDef.type && this.columnDef.type) ? this.columnDef.type : FieldType.string;
    let optionValues = [];

    switch (type) {
      case FieldType.string:
        optionValues = [
          { operator: '' as OperatorString, description: this.i18n && this.i18n.tr && this.i18n.tr('CONTAINS') || this._locales && this._locales.TEXT_CONTAINS },
          { operator: '=' as OperatorString, description: this.i18n && this.i18n.tr && this.i18n.tr('EQUALS') || this._locales && this._locales.TEXT_EQUALS },
          { operator: 'a*' as OperatorString, description: this.i18n && this.i18n.tr && this.i18n.tr('STARTS_WITH') || this._locales && this._locales.TEXT_STARTS_WITH },
          { operator: '*z' as OperatorString, description: this.i18n && this.i18n.tr && this.i18n.tr('ENDS_WITH') || this._locales && this._locales.TEXT_ENDS_WITH },
          /*
          { operator:  as OperatorString'IN', description: this.i18n && this.i18n.tr && this.i18n.tr('IN_COLLECTION_SEPERATED_BY_COMMA') || this._locales && this._locales.TEXT_ALL_SELECTED },
          { operator:  as OperatorString'NIN', description: this.i18n && this.i18n.tr && this.i18n.tr('NOT_IN_COLLECTION_SEPERATED_BY_COMMA') || this._locales && this._locales.TEXT_ALL_SELECTED },
          */
        ];
        break;
      default:
        optionValues = [
          { operator: '' as OperatorString, description: '' },
          { operator: '=' as OperatorString, description: '=' },
          { operator: '<' as OperatorString, description: '<' },
          { operator: '<=' as OperatorString, description: '<=' },
          { operator: '>' as OperatorString, description: '>' },
          { operator: '>=' as OperatorString, description: '>=' },
          { operator: '<>' as OperatorString, description: '<>' }];
        break;
    }

    return optionValues;
  }

  /**
   * Create the DOM element
   */
  private createDomElement(searchTerm?: SearchTerm) {
    const columnId = this.columnDef && this.columnDef.id;
    const $headerElm = this.grid.getHeaderRowColumn(columnId);
    $($headerElm).empty();

    // create the DOM Select dropdown for the Operator
    this.$selectOperatorElm = $(this.buildSelectOperatorHtmlString());
    this.$filterInputElm = $(this.buildInputHtmlString());
    const $filterContainerElm = $(`<div class="form-group search-filter filter-${columnId}"></div>`);
    const $containerInputGroup = $(`<div class="input-group"></div>`);
    const $operatorInputGroupAddon = $(`<div class="input-group-addon input-group-prepend operator"></div>`);

    /* the DOM element final structure will be
      <div class="input-group">
        <div class="input-group-addon input-group-prepend operator">
          <select class="form-control"></select>
        </div>
        <input class="form-control" type="text" />
      </div>
    */
    $operatorInputGroupAddon.append(this.$selectOperatorElm);
    $containerInputGroup.append($operatorInputGroupAddon);
    $containerInputGroup.append(this.$filterInputElm);

    // create the DOM element & add an ID and filter class
    $filterContainerElm.append($containerInputGroup);
    $filterContainerElm.attr('id', `filter-${columnId}`);

    this.$filterInputElm.val(searchTerm);
    this.$filterInputElm.data('columnId', columnId);

    if (this.operator) {
      this.$selectOperatorElm.val(this.operator);
    }

    // if there's a search term, we will add the "filled" class for styling purposes
    if (searchTerm) {
      $filterContainerElm.addClass('filled');
    }

    // append the new DOM element to the header row
    if ($filterContainerElm && typeof $filterContainerElm.appendTo === 'function') {
      $filterContainerElm.appendTo($headerElm);
    }

    return $filterContainerElm;
  }

  /** Event trigger, could be called by the Operator dropdown or the input itself */
  private onTriggerEvent(e: Event | undefined) {
    if (this._clearFilterTriggered) {
      this.callback(e, { columnDef: this.columnDef, clearFilterTriggered: this._clearFilterTriggered, shouldTriggerQuery: this._shouldTriggerQuery });
      this.$filterElm.removeClass('filled');
    } else {
      const selectedOperator = this.$selectOperatorElm.find('option:selected').text();
      let value = this.$filterInputElm.val() as string;
      const enableWhiteSpaceTrim = this.gridOptions.enableFilterTrimWhiteSpace || this.columnFilter.enableTrimWhiteSpace;
      if (typeof value === 'string' && enableWhiteSpaceTrim) {
        value = value.trim();
      }

      (value !== null && value !== undefined && value !== '') ? this.$filterElm.addClass('filled') : this.$filterElm.removeClass('filled');
      this.callback(e, { columnDef: this.columnDef, searchTerms: (value ? [value] : null), operator: selectedOperator || '', shouldTriggerQuery: this._shouldTriggerQuery });
    }
    // reset both flags for next use
    this._clearFilterTriggered = false;
    this._shouldTriggerQuery = true;
  }
}
