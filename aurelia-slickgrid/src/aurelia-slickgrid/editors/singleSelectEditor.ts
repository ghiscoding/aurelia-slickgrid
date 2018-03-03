import {
  Editor,
  Column,
  MultipleSelectOption,
  SelectOption
} from './../models/index';
import * as $ from 'jquery';

/**
 * Slickgrid editor class for single select lists
 */
export class SingleSelectEditor implements Editor {
  /**
   * The JQuery DOM element
   */
  $filterElm: any;
  /**
   * The slick grid column being edited
   */
  columnDef: Column;
  /**
   * The multiple-select options for a single select
   */
  defaultOptions: any;
  /**
   * The default item value that is set
   */
  defaultValue: any;
  /**
   * The options label/value object to use in the select list
   */
  optionCollection: SelectOption[] = [];
  /**
   * The property name for values in the optionCollection
   */
  valueName: string;
  /**
   * The property name for labels in the optionCollection
   */
  labelName: string;

  constructor(private args: any) {
    this.defaultOptions = {
      container: 'body',
      filter: false,
      maxHeight: 200,
      width: '100%',
      single: true
    };

    this.init();
  }

  /**
   * The current selected value from the optionCollection
   */
  get currentValue() {
    return this.optionCollection.findOrDefault(c =>
      c[this.valueName].toString() === this.$filterElm.val())[this.valueName];
  }

  init() {
    if (!this.args) {
      throw new Error('[Aurelia-SlickGrid] A filter must always have an "init()" ' +
        'with valid arguments.');
    }

    this.columnDef = this.args.column;

    const filterTemplate = this.buildTemplateHtmlString();

    this.createDomElement(filterTemplate);
  }

  applyValue(item: any, state: any): void {
    item[this.args.column.field] = state;
  }

  destroy() {
    this.$filterElm.remove();
  }

  loadValue(item: any): void {
    // convert to string because that is how the DOM will return these values
    this.defaultValue = item[this.columnDef.field].toString();

    this.$filterElm.find('option').each((i: number, $e: any) => {
      if (this.defaultValue.indexOf($e.value) !== -1) {
        $e.selected = true;
      } else {
        $e.selected = false;
      }
    });

    this.refresh();
  }

  serializeValue(): any {
    return this.currentValue;
  }

  focus() {
    this.$filterElm.focus();
  }

  isValueChanged(): boolean {
    return this.$filterElm.val() !== this.defaultValue;
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

  private buildTemplateHtmlString() {
    if (!this.columnDef || !this.columnDef.filter || !this.columnDef.filter.collection) {
      throw new Error('[Aurelia-SlickGrid] You need to pass a "collection" for ' +
        'the MultipleSelect Filter to work correctly. Also each option should include ' +
        'a value/label pair (or value/labelKey when using Locale). For example:: ' +
        '{ filter: type: FilterType.multipleSelect, collection: [{ value: true, label: \'True\' }, ' +
        '{ value: false, label: \'False\'}] }');
    }
    this.optionCollection = this.columnDef.filter.collection || [];
    this.labelName = (this.columnDef.filter.customStructure) ? this.columnDef.filter.customStructure.label : 'label';
    this.valueName = (this.columnDef.filter.customStructure) ? this.columnDef.filter.customStructure.value : 'value';

    let options = '';
    this.optionCollection.forEach((option: SelectOption) => {
      if (!option || (option[this.labelName] === undefined && option.labelKey === undefined)) {
        throw new Error('A collection with value/label (or value/labelKey when using ' +
          'Locale) is required to populate the Select list, for example:: { filter: ' +
          'type: FilterType.multipleSelect, collection: [ { value: \'1\', label: \'One\' } ])');
      }
      const labelKey = (option.labelKey || option[this.labelName]) as string;
      const textLabel = labelKey;

      options += `<option value="${option[this.valueName]}">${textLabel}</option>`;
    });

    return `<select class="ms-filter search-filter">${options}</select>`;
  }

  private createDomElement(filterTemplate: string) {
    this.$filterElm = $(filterTemplate);

    if (this.$filterElm && typeof this.$filterElm.appendTo === 'function') {
      this.$filterElm.appendTo(this.args.container);
    }

    if (typeof this.$filterElm.multipleSelect !== 'function') {
      // fallback to bootstrap
      this.$filterElm.addClass('form-control');
    } else {
      const filterOptions = (this.columnDef.filter) ? this.columnDef.filter.filterOptions : {};
      const options: MultipleSelectOption = { ...this.defaultOptions, ...filterOptions };
      this.$filterElm = this.$filterElm.multipleSelect(options);
    }
  }

  // refresh the jquery object because the selected checkboxes were already set
  // prior to this method being called
  private refresh() {
    if (typeof this.$filterElm.multipleSelect === 'function') {
      this.$filterElm.data('multipleSelect').refresh();
    }
  }
}
