import { inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import {
  Column,
  FieldType,
  Filter,
  FilterArguments,
  FilterCallback,
  GridOption,
  OperatorString,
  OperatorType,
  SearchTerm
} from './../models/index';

// using external non-typed js libraries
declare var $: any;

@inject(I18N)
export class CompoundInputFilter implements Filter {
  private $filterElm: any;
  private $filterInputElm: any;
  private $selectOperatorElm: any;
  private _operator: OperatorType | OperatorString;
  grid: any;
  searchTerms: SearchTerm[];
  columnDef: Column;
  callback: FilterCallback;

  constructor(private i18n: I18N) { }

  /** Getter for the Grid Options pulled through the Grid Object */
  private get gridOptions(): GridOption {
    return (this.grid && this.grid.getOptions) ? this.grid.getOptions() : {};
  }

  set operator(op: OperatorType | OperatorString) {
    this._operator = op;
  }
  get operator(): OperatorType | OperatorString {
    return this._operator || OperatorType.empty;
  }

  /**
   * Initialize the Filter
   */
  init(args: FilterArguments) {
    if (args) {
      this.grid = args.grid;
      this.callback = args.callback;
      this.columnDef = args.columnDef;
      this.operator = args.operator || '';
      this.searchTerms = args.searchTerms || [];

      // filter input can only have 1 search term, so we will use the 1st array index if it exist
      const searchTerm = (Array.isArray(this.searchTerms) && this.searchTerms[0]) || '';

      // step 1, create the DOM Element of the filter which contain the compound Operator+Input
      // and initialize it if searchTerm is filled
      this.$filterElm = this.createDomElement(searchTerm);

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
  clear() {
    if (this.$filterElm && this.$selectOperatorElm) {
      this.$selectOperatorElm.val(0);
      this.$filterInputElm.val('');
      this.onTriggerEvent(undefined, true);
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
  setValues(values: SearchTerm[]) {
    if (values && Array.isArray(values)) {
      this.$filterElm.val(values[0]);
    }
  }

  //
  // private functions
  // ------------------

  private buildInputHtmlString() {
    const placeholder = (this.gridOptions) ? (this.gridOptions.defaultFilterPlaceholder || '') : '';
    return `<input class="form-control" type="text" placeholder="${placeholder}" />`;
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
          { operator: '' as OperatorString, description: this.i18n.tr('CONTAINS') },
          { operator: '=' as OperatorString, description: this.i18n.tr('EQUALS') },
          { operator: 'a*' as OperatorString, description: this.i18n.tr('STARTS_WITH') },
          { operator: '*z' as OperatorString, description: this.i18n.tr('ENDS_WITH') },
          /*
          { operator:  as OperatorString'IN', description: this.i18n.tr('IN_COLLECTION_SEPERATED_BY_COMMA') },
          { operator:  as OperatorString'NIN', description: this.i18n.tr('NOT_IN_COLLECTION_SEPERATED_BY_COMMA') },
          */
        ];
        break;
      default:
        optionValues = [
          { operator: '' as OperatorString, description: this.i18n.tr('CONTAINS') },
          { operator: '=' as OperatorString, description: '' },
          { operator: '<' as OperatorString, description: '' },
          { operator: '<=' as OperatorString, description: '' },
          { operator: '>' as OperatorString, description: '' },
          { operator: '>=' as OperatorString, description: '' },
          { operator: '<>' as OperatorString, description: '' }];
        break;
    }

    return optionValues;
  }

  /**
   * Create the DOM element
   */
  private createDomElement(searchTerm?: SearchTerm) {
    const $headerElm = this.grid.getHeaderRowColumn(this.columnDef.id);
    $($headerElm).empty();

    // create the DOM Select dropdown for the Operator
    this.$selectOperatorElm = $(this.buildSelectOperatorHtmlString());
    this.$filterInputElm = $(this.buildInputHtmlString());
    const $filterContainerElm = $(`<div class="form-group search-filter"></div>`);
    const $containerInputGroup = $(`<div class="input-group"></div>`);
    const $operatorInputGroupAddon = $(`<div class="input-group-addon operator"></div>`);

    /* the DOM element final structure will be
      <div class="input-group">
        <div class="input-group-addon operator">
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
    $filterContainerElm.attr('id', `filter-${this.columnDef.id}`);

    this.$filterInputElm.val(searchTerm);
    this.$filterInputElm.data('columnId', this.columnDef.id);

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

  private onTriggerEvent(e: Event | undefined, clearFilterTriggered?: boolean) {
    if (clearFilterTriggered) {
      this.callback(e, { columnDef: this.columnDef, clearFilterTriggered: true });
    } else {
      const selectedOperator = this.$selectOperatorElm.find('option:selected').text();
      const value = this.$filterInputElm.val();
      (value) ? this.$filterElm.addClass('filled') : this.$filterElm.removeClass('filled');
      this.callback(e, { columnDef: this.columnDef, searchTerms: (value ? [value] : null), operator: selectedOperator || '' });
    }
  }
}
