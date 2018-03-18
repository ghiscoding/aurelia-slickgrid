import { inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { htmlEntityEncode } from './../services/utilities';
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

// using external non-typed js libraries
declare var $: any;

@inject(I18N)
export class CompoundInputFilter implements Filter {
  private $filterElm: any;
  private $filterInputElm: any;
  private $selectOperatorElm: any;
  grid: any;
  gridOptions: GridOption;
  operator: OperatorType | OperatorString | undefined;
  searchTerm: SearchTerm | undefined;
  columnDef: Column;
  callback: FilterCallback;
  filterType = FilterType.compoundInput;

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
    if (this.$filterElm && this.$selectOperatorElm) {
      this.$selectOperatorElm.val(0);
      this.$filterInputElm.val('');
      if (triggerFilterKeyup) {
        this.$filterElm.trigger('keyup');
      }
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
      this.$filterElm.val(values);
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
  private createDomElement() {
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

    const searchTerm = (typeof this.searchTerm === 'boolean') ? `${this.searchTerm}` : this.searchTerm;
    this.$filterInputElm.val(searchTerm);
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

  private onTriggerEvent(e: Event | undefined) {
    const selectedOperator = this.$selectOperatorElm.find('option:selected').text();
    const value = this.$filterInputElm.val();
    (value) ? this.$filterElm.addClass('filled') : this.$filterElm.removeClass('filled');
    this.callback(e, { columnDef: this.columnDef, searchTerm: value, operator: selectedOperator || '' });
  }
}
