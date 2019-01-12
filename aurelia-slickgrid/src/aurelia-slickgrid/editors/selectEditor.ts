import { BindingEngine } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { Subscription } from 'aurelia-event-aggregator';
import {
  CollectionCustomStructure,
  CollectionOption,
  Editor,
  EditorValidator,
  EditorValidatorOutput,
  Column,
  GridOption,
  MultipleSelectOption,
  SelectOption,
} from './../models/index';
import { CollectionService, findOrDefault, disposeAllSubscriptions } from '../services/index';
import { arraysEqual, getDescendantProperty, htmlEncode } from '../services/utilities';
import * as DOMPurify from 'dompurify';
import * as $ from 'jquery';

/**
 * Slickgrid editor class for multiple select lists
 */
export class SelectEditor implements Editor {
  /** The JQuery DOM element */
  $editorElm: any;

  /** Editor Multiple-Select options */
  editorElmOptions: MultipleSelectOption;

  /** DOM Element Name, useful for auto-detecting positioning (dropup / dropdown) */
  elementName: string;

  /** The multiple-select options for a multiple select list */
  defaultOptions: MultipleSelectOption;

  /** The default item values that are set */
  defaultValue: any[];

  /** The property name for labels in the collection */
  labelName: string;

  /** The property name for a prefix that can be added to the labels in the collection */
  labelPrefixName: string;

  /** The property name for a suffix that can be added to the labels in the collection */
  labelSuffixName: string;

  /** A label that can be added to each option and can be used as an alternative to display selected options */
  optionLabel: string;

  /** The property name for values in the collection */
  valueName: string;

  /** Grid options */
  gridOptions: GridOption;

  /** Do we translate the label? */
  enableTranslateLabel: boolean;

  /** Event Subscriptions */
  subscriptions: Subscription[] = [];

  // flag to signal that the editor is destroying itself, helps prevent
  // commit changes from being called twice and erroring
  _destroying = false;

  constructor(protected bindingEngine: BindingEngine, protected collectionService: CollectionService, protected i18n: I18N, protected args: any, protected isMultipleSelect = true) {
    this.gridOptions = this.args.grid.getOptions() as GridOption;

    // provide the name attribute to the DOM element which will be needed to auto-adjust drop position (dropup / dropdown)
    const columnId = this.columnDef && this.columnDef.id;
    this.elementName = `editor-${columnId}`;

    const libOptions: MultipleSelectOption = {
      autoAdjustDropHeight: true,
      autoAdjustDropPosition: true,
      autoAdjustDropWidthByTextSize: true,
      container: 'body',
      filter: false,
      maxHeight: 275,
      name: this.elementName,
      single: true,
      textTemplate: ($elm) => {
        // render HTML code or not, by default it is sanitized and won't be rendered
        const isRenderHtmlEnabled = this.columnDef && this.columnDef.internalColumnEditor && this.columnDef.internalColumnEditor.enableRenderHtml || false;
        return isRenderHtmlEnabled ? $elm.text() : $elm.html();
      },
      onBlur: () => this.destroy(),
      onClose: () => {
        if (!this._destroying && args.grid.getOptions().autoCommitEdit) {
          // do not use args.commitChanges() as this sets the focus to the next
          // row. Also the select list will stay shown when clicking off the grid
          const validation = this.validate();
          if (validation && validation.valid) {
            args.grid.getEditorLock().commitCurrentEdit();
          }
        }
      }
    };

    if (isMultipleSelect) {
      libOptions.single = false;
      libOptions.addTitle = true;
      libOptions.okButton = true;
      libOptions.selectAllDelimiter = ['', ''];

      if (this.i18n && this.i18n.tr) {
        libOptions.countSelected = this.i18n.tr('X_OF_Y_SELECTED');
        libOptions.allSelected = this.i18n.tr('ALL_SELECTED');
        libOptions.selectAllText = this.i18n.tr('SELECT_ALL');
      }
    }

    // assign the multiple select lib options
    this.defaultOptions = libOptions;
    this.init();
  }

  /** Get the Collection */
  get collection(): SelectOption[] {
    return this.columnDef && this.columnDef && this.columnDef.internalColumnEditor.collection || [];
  }

  /** Getter for the Collection Options */
  get collectionOptions(): CollectionOption {
    return this.columnDef && this.columnDef.internalColumnEditor && this.columnDef.internalColumnEditor.collectionOptions;
  }

  /** Get Column Definition object */
  get columnDef(): Column {
    return this.args && this.args.column || {};
  }

  /** Get Column Editor object */
  get columnEditor(): any {
    return this.columnDef && this.columnDef.internalColumnEditor || {};
  }

  /** Getter for the Custom Structure if exist */
  protected get customStructure(): CollectionCustomStructure {
    return this.columnDef && this.columnDef.internalColumnEditor && this.columnDef.internalColumnEditor.customStructure;
  }

  /**
   * The current selected values (multiple select) from the collection
   */
  get currentValues(): any[] {
    // collection of strings, just return the filtered string that are equals
    if (this.collection.every(x => typeof x === 'string')) {
      return this.collection.filter(c => this.$editorElm.val().indexOf(c.toString()) !== -1);
    }

    // collection of label/value pair
    const separatorBetweenLabels = this.collectionOptions && this.collectionOptions.separatorBetweenTextLabels || '';
    const isIncludingPrefixSuffix = this.collectionOptions && this.collectionOptions.includePrefixSuffixToSelectedValues || false;

    return this.collection
      .filter(c => this.$editorElm.val().indexOf(c[this.valueName].toString()) !== -1)
      .map(c => {
        const labelText = c[this.valueName];
        let prefixText = c[this.labelPrefixName] || '';
        let suffixText = c[this.labelSuffixName] || '';

        // also translate prefix/suffix if enableTranslateLabel is true and text is a string
        prefixText = (this.enableTranslateLabel && prefixText && typeof prefixText === 'string') ? this.i18n.tr(prefixText || ' ') : prefixText;
        suffixText = (this.enableTranslateLabel && suffixText && typeof suffixText === 'string') ? this.i18n.tr(suffixText || ' ') : suffixText;

        if (isIncludingPrefixSuffix) {
          const tmpOptionArray = [prefixText, labelText, suffixText].filter((text) => text); // add to a temp array for joining purpose and filter out empty text
          return tmpOptionArray.join(separatorBetweenLabels);
        }
        return labelText;
      });
  }

  /**
   * The current selected values (single select) from the collection
   */
  get currentValue(): number | string {
    // collection of strings, just return the filtered string that are equals
    if (this.collection.every(x => typeof x === 'string')) {
      return findOrDefault(this.collection, (c: any) => c.toString() === this.$editorElm.val());
    }

    // collection of label/value pair
    const separatorBetweenLabels = this.collectionOptions && this.collectionOptions.separatorBetweenTextLabels || '';
    const isIncludingPrefixSuffix = this.collectionOptions && this.collectionOptions.includePrefixSuffixToSelectedValues || false;
    const itemFound = findOrDefault(this.collection, (c: any) => c[this.valueName].toString() === this.$editorElm.val());

    if (itemFound) {
      const labelText = itemFound[this.valueName];
      if (isIncludingPrefixSuffix) {
        let prefixText = itemFound[this.labelPrefixName] || '';
        let suffixText = itemFound[this.labelSuffixName] || '';

        // also translate prefix/suffix if enableTranslateLabel is true and text is a string
        prefixText = (this.enableTranslateLabel && prefixText && typeof prefixText === 'string') ? this.i18n.tr(prefixText || ' ') : prefixText;
        suffixText = (this.enableTranslateLabel && suffixText && typeof suffixText === 'string') ? this.i18n.tr(suffixText || ' ') : suffixText;
        // add to a temp array for joining purpose and filter out empty text
        const tmpOptionArray = [prefixText, labelText, suffixText].filter((text) => text);
        return tmpOptionArray.join(separatorBetweenLabels);
      }
      return labelText;
    }
    return '';
  }

  /** Get the Validator function, can be passed in Editor property or Column Definition */
  get validator(): EditorValidator {
    return this.columnEditor.validator || this.columnDef.validator;
  }

  init() {
    if (!this.args) {
      throw new Error('[Aurelia-SlickGrid] An editor must always have an "init()" with valid arguments.');
    }

    if (!this.columnDef || !this.columnEditor || (!this.columnEditor.collection && !this.columnEditor.collectionAsync)) {
      throw new Error(`[Aurelia-SlickGrid] You need to pass a "collection" (or "collectionAsync") inside Column Definition Editor for the MultipleSelect/SingleSelect Editor to work correctly.
      Also each option should include a value/label pair (or value/labelKey when using Locale).
      For example: { editor: { collection: [{ value: true, label: 'True' },{ value: false, label: 'False'}] } }`);
    }

    this.enableTranslateLabel = this.columnEditor && this.columnEditor.enableTranslateLabel || false;
    this.labelName = this.customStructure && this.customStructure.label || 'label';
    this.labelPrefixName = this.customStructure && this.customStructure.labelPrefix || 'labelPrefix';
    this.labelSuffixName = this.customStructure && this.customStructure.labelSuffix || 'labelSuffix';
    this.optionLabel = this.customStructure && this.customStructure.optionLabel || 'value';
    this.valueName = this.customStructure && this.customStructure.value || 'value';

    if (this.enableTranslateLabel && (!this.i18n || typeof this.i18n.tr !== 'function')) {
      throw new Error(`[select-editor] The i18n Service is required for the Select Editor to work correctly`);
    }

    // always render the Select (dropdown) DOM element, even if user passed a "collectionAsync",
    // if that is the case, the Select will simply be without any options but we still have to render it (else SlickGrid would throw an error)
    this.renderDomElement(this.collection);
  }

  applyValue(item: any, state: any): void {
    item[this.columnDef.field] = state;
  }

  destroy() {
    this._destroying = true;
    if (this.$editorElm && this.$editorElm.multipleSelect) {
      this.$editorElm.multipleSelect('close');
      this.$editorElm.remove();
    }
    this.subscriptions = disposeAllSubscriptions(this.subscriptions);
  }

  loadValue(item: any): void {
    if (this.isMultipleSelect) {
      this.loadMultipleValues(item);
    } else {
      this.loadSingleValue(item);
    }
    this.refresh();
  }

  loadMultipleValues(items: any[]) {
    // convert to string because that is how the DOM will return these values
    this.defaultValue = items[this.columnDef.field].map((i: any) => i.toString());
    this.$editorElm.find('option').each((i: number, $e: any) => {
      $e.selected = (this.defaultValue.indexOf($e.value) !== -1);
    });
  }

  loadSingleValue(item: any) {
    // convert to string because that is how the DOM will return these values
    // make sure the prop exists first
    this.defaultValue = item[this.columnDef.field] && item[this.columnDef.field].toString();
    this.$editorElm.find('option').each((i: number, $e: any) => {
      $e.selected = (this.defaultValue === $e.value);
    });
  }

  serializeValue(): any {
    return (this.isMultipleSelect) ? this.currentValues : this.currentValue;
  }

  focus() {
    if (this.$editorElm && this.$editorElm.multipleSelect) {
      this.$editorElm.multipleSelect('focus');
    }
  }

  isValueChanged(): boolean {
    if (this.isMultipleSelect) {
      return !arraysEqual(this.$editorElm.val(), this.defaultValue);
    }
    return this.$editorElm.val() !== this.defaultValue;
  }

  validate(): EditorValidatorOutput {
    if (this.validator) {
      const value = this.isMultipleSelect ? this.currentValues : this.currentValue;
      const validationResults = this.validator(value, this.args);
      if (!validationResults.valid) {
        return validationResults;
      }
    }

    // by default the editor is always valid
    // if user want it to be a required checkbox, he would have to provide his own validator
    return {
      valid: true,
      msg: null
    };
  }

  //
  // protected functions
  // ------------------

  /**
   * user might want to filter certain items of the collection
   * @param inputCollection
   * @return outputCollection filtered and/or sorted collection
   */
  protected filterCollection(inputCollection: any[]): any[] {
    let outputCollection = inputCollection;

    // user might want to filter certain items of the collection
    if (this.columnEditor && this.columnEditor.collectionFilterBy) {
      const filterBy = this.columnEditor.collectionFilterBy;
      const filterCollectionBy = this.columnEditor.collectionOptions && this.columnEditor.collectionOptions.filterAfterEachPass || null;
      outputCollection = this.collectionService.filterCollection(outputCollection, filterBy, filterCollectionBy);
    }

    return outputCollection;
  }

  /**
   * user might want to sort the collection in a certain way
   * @param inputCollection
   * @return outputCollection filtered and/or sorted collection
   */
  protected sortCollection(inputCollection: any[]): any[] {
    let outputCollection = inputCollection;

    // user might want to sort the collection
    if (this.columnEditor && this.columnEditor.collectionSortBy) {
      const sortBy = this.columnEditor.collectionSortBy;
      outputCollection = this.collectionService.sortCollection(this.columnDef, outputCollection, sortBy, this.enableTranslateLabel);
    }

    return outputCollection;
  }

  protected renderDomElement(collection: any[]) {
    if (!Array.isArray(collection) && this.collectionOptions && this.collectionOptions.collectionInObjectProperty) {
      collection = getDescendantProperty(collection, this.collectionOptions.collectionInObjectProperty);
    }
    if (!Array.isArray(collection)) {
      throw new Error('The "collection" passed to the Select Editor is not a valid array');
    }

    // user can optionally add a blank entry at the beginning of the collection
    if (this.collectionOptions && this.collectionOptions.addBlankEntry) {
      collection.unshift(this.createBlankEntry());
    }

    // assign the collection to a temp variable before filtering/sorting the collection
    let newCollection = collection;

    // user might want to filter and/or sort certain items of the collection
    newCollection = this.filterCollection(newCollection);
    newCollection = this.sortCollection(newCollection);

    // step 1, create HTML string template
    const editorTemplate = this.buildTemplateHtmlString(newCollection);
    // step 2, create the DOM Element of the editor
    // also subscribe to the onClose event
    this.createDomElement(editorTemplate);
  }

  /** Build the template HTML string */
  protected buildTemplateHtmlString(collection: any[]): string {
    let options = '';
    const columnId = this.columnDef && this.columnDef.id;
    const separatorBetweenLabels = this.collectionOptions && this.collectionOptions.separatorBetweenTextLabels || '';
    const isRenderHtmlEnabled = this.columnEditor.enableRenderHtml || false;
    const sanitizedOptions = this.gridOptions && this.gridOptions.sanitizeHtmlOptions || {};

    // collection could be an Array of Strings OR Objects
    if (collection.every((x: any) => typeof x === 'string')) {
      collection.forEach((option: string) => {
        options += `<option value="${option}" label="${option}">${option}</option>`;
      });
    } else {
      // array of objects will require a label/value pair unless a customStructure is passed
      collection.forEach((option: SelectOption) => {
        if (!option || (option[this.labelName] === undefined && option.labelKey === undefined)) {
          throw new Error('[select-editor] A collection with value/label (or value/labelKey when using ' +
            'Locale) is required to populate the Select list, for example: ' +
            '{ collection: [ { value: \'1\', label: \'One\' } ])');
        }
        const labelKey = (option.labelKey || option[this.labelName]) as string;
        const labelText = ((option.labelKey || this.enableTranslateLabel) && labelKey) ? this.i18n.tr(labelKey || ' ') : labelKey;
        let prefixText = option[this.labelPrefixName] || '';
        let suffixText = option[this.labelSuffixName] || '';
        let optionLabel = option[this.optionLabel] || '';
        optionLabel = optionLabel.toString().replace(/\"/g, '\''); // replace double quotes by single quotes to avoid interfering with regular html

        // also translate prefix/suffix if enableTranslateLabel is true and text is a string
        prefixText = (this.enableTranslateLabel && prefixText && typeof prefixText === 'string') ? this.i18n.tr(prefixText || ' ') : prefixText;
        suffixText = (this.enableTranslateLabel && suffixText && typeof suffixText === 'string') ? this.i18n.tr(suffixText || ' ') : suffixText;
        optionLabel = (this.enableTranslateLabel && optionLabel && typeof optionLabel === 'string') ? this.i18n.tr(optionLabel || ' ') : optionLabel;
        // add to a temp array for joining purpose and filter out empty text
        const tmpOptionArray = [prefixText, labelText, suffixText].filter((text) => text);
        let optionText = tmpOptionArray.join(separatorBetweenLabels);

        // if user specifically wants to render html text, he needs to opt-in else it will stripped out by default
        // also, the 3rd party lib will saninitze any html code unless it's encoded, so we'll do that
        if (isRenderHtmlEnabled) {
          // sanitize any unauthorized html tags like script and others
          // for the remaining allowed tags we'll permit all attributes
          const sanitizedText = DOMPurify.sanitize(optionText, sanitizedOptions);
          optionText = htmlEncode(sanitizedText);
        }

        options += `<option value="${option[this.valueName]}" label="${optionLabel}">${optionText}</option>`;
      });
    }

    return `<select id="${this.elementName}" class="ms-filter search-filter editor-${columnId}" ${this.isMultipleSelect ? 'multiple="multiple"' : ''}>${options}</select>`;
  }

  /** Create a blank entry that can be added to the collection. It will also reuse the same collection structure provided by the user */
  protected createBlankEntry(): any {
    const blankEntry = {
      [this.labelName]: '',
      [this.valueName]: ''
    };
    if (this.labelPrefixName) {
      blankEntry[this.labelPrefixName] = '';
    }
    if (this.labelSuffixName) {
      blankEntry[this.labelSuffixName] = '';
    }
    return blankEntry;
  }

  /** From the html template string, create the DOM element of the Multiple/Single Select Editor */
  protected createDomElement(editorTemplate: string) {
    this.$editorElm = $(editorTemplate);

    if (this.$editorElm && typeof this.$editorElm.appendTo === 'function') {
      this.$editorElm.appendTo(this.args.container);
    }

    if (typeof this.$editorElm.multipleSelect !== 'function') {
      // fallback to bootstrap
      this.$editorElm.addClass('form-control');
    } else {
      const elementOptions = (this.columnEditor) ? this.columnEditor.elementOptions : {};
      this.editorElmOptions = { ...this.defaultOptions, ...elementOptions };
      this.$editorElm = this.$editorElm.multipleSelect(this.editorElmOptions);
      setTimeout(() => this.$editorElm.multipleSelect('open'));
    }
  }

  // refresh the jquery object because the selected checkboxes were already set
  // prior to this method being called
  protected refresh() {
    if (typeof this.$editorElm.multipleSelect === 'function') {
      this.$editorElm.multipleSelect('refresh');
    }
  }
}
