import { I18N } from 'aurelia-i18n';
import {
  Editor,
  Column,
  GridOption,
  MultipleSelectOption,
  SelectOption
} from '../models/index';
import { findOrDefault } from '../services/index';
import * as $ from 'jquery';

// height in pixel of the multiple-select DOM element
const SELECT_ELEMENT_HEIGHT = 26;

/**
 * Slickgrid editor class for single select lists
 */
export class SingleSelectEditor implements Editor {
  /** The JQuery DOM element */
  $editorElm: any;

  /** Editor Multiple-Select options */
  editorElmOptions: MultipleSelectOption;

  /** The slick grid column being edited */
  columnDef: Column;

  /** The multiple-select options for a single select */
  defaultOptions: any;

  /** The default item value that is set */
  defaultValue: any;

  /** The options label/value object to use in the select list */
  collection: SelectOption[] = [];

  /** The property name for values in the collection */
  valueName: string;

  /** The property name for labels in the collection */
  labelName: string;

  /** The i18n aurelia library */
  private _i18n: I18N;

  constructor(private args: any) {
    const gridOptions = this.args.grid.getOptions() as GridOption;
    const params = gridOptions.params || this.args.column.params || {};
    this._i18n = params.i18n;

    this.defaultOptions = {
      container: 'body',
      filter: false,
      maxHeight: 200,
      width: 150,
      offsetLeft: 20,
      single: true,
      onOpen: () => this.autoAdjustDropPosition(this.$editorElm, this.editorElmOptions),
    };

    this.init();
  }

  /**
   * The current selected value from the collection
   */
  get currentValue() {
    return findOrDefault(this.collection, (c: any) =>
      c[this.valueName].toString() === this.$editorElm.val())[this.valueName];
  }

  init() {
    if (!this.args) {
      throw new Error('[Aurelia-SlickGrid] An editor must always have an "init()" with valid arguments.');
    }

    this.columnDef = this.args.column;

    const editorTemplate = this.buildTemplateHtmlString();

    this.createDomElement(editorTemplate);
  }

  applyValue(item: any, state: any): void {
    item[this.args.column.field] = state;
  }

  destroy() {
    this.$editorElm.remove();
  }

  loadValue(item: any): void {
    // convert to string because that is how the DOM will return these values
    this.defaultValue = item[this.columnDef.field].toString();

    this.$editorElm.find('option').each((i: number, $e: any) => {
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
    this.$editorElm.focus();
  }

  isValueChanged(): boolean {
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

  /**
   * Automatically adjust the multiple-select dropup or dropdown by available space
   */
  private autoAdjustDropPosition(multipleSelectDomElement: any, multipleSelectOptions: MultipleSelectOption) {
    // height in pixel of the multiple-select element
    const selectElmHeight = SELECT_ELEMENT_HEIGHT;

    const windowHeight = $(window).innerHeight() || 300;
    const pageScroll = $('body').scrollTop() || 0;
    const $msDropContainer = multipleSelectOptions.container ? $(multipleSelectOptions.container) : multipleSelectDomElement;
    const $msDrop = $msDropContainer.find('.ms-drop');
    const msDropHeight = $msDrop.height() || 0;
    const msDropOffsetTop = $msDrop.offset().top;
    const space = windowHeight - (msDropOffsetTop - pageScroll);

    if (space < msDropHeight) {
      if (multipleSelectOptions.container) {
        // when using a container, we need to offset the drop ourself
        // and also make sure there's space available on top before doing so
        const newOffsetTop = (msDropOffsetTop - msDropHeight - selectElmHeight);
        if (newOffsetTop > 0) {
          $msDrop.offset({ top: newOffsetTop < 0 ? 0 : newOffsetTop });
        }
      } else {
        // without container, we simply need to add the "top" class to the drop
        $msDrop.addClass('top');
      }
      $msDrop.removeClass('bottom');
    } else {
      $msDrop.addClass('bottom');
      $msDrop.removeClass('top');
    }
  }

  /** Build the template HTML string */
  private buildTemplateHtmlString() {
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
    this.collection.forEach((option: SelectOption) => {
      if (!option || (option[this.labelName] === undefined && option.labelKey === undefined)) {
        throw new Error('A collection with value/label (or value/labelKey when using ' +
          'Locale) is required to populate the Select list, for example: { params: { ' +
          '{ collection: [ { value: \'1\', label: \'One\' } ] } } }');
      }
      const labelKey = (option.labelKey || option[this.labelName]) as string;
      const textLabel = ((option.labelKey || isEnabledTranslate) && this._i18n && typeof this._i18n.tr === 'function') ? this._i18n.tr(labelKey || ' ') : labelKey;

      options += `<option value="${option[this.valueName]}">${textLabel}</option>`;
    });

    return `<select class="ms-filter search-filter">${options}</select>`;
  }

  private createDomElement(editorTemplate: string) {
    this.$editorElm = $(editorTemplate);

    if (this.$editorElm && typeof this.$editorElm.appendTo === 'function') {
      this.$editorElm.appendTo(this.args.container);
    }

    if (typeof this.$editorElm.multipleSelect !== 'function') {
      // fallback to bootstrap
      this.$editorElm.addClass('form-control');
    } else {
      const elementOptions = (this.columnDef.params) ? this.columnDef.params.elementOptions : {};
      this.editorElmOptions = { ...this.defaultOptions, ...elementOptions };
      this.$editorElm = this.$editorElm.multipleSelect(this.editorElmOptions);
      setTimeout(() => this.$editorElm.multipleSelect('open'));
    }
  }

  // refresh the jquery object because the selected checkboxes were already set
  // prior to this method being called
  private refresh() {
    if (typeof this.$editorElm.multipleSelect === 'function') {
      this.$editorElm.multipleSelect('refresh');
    }
  }
}
