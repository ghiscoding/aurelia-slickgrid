import { BindingEngine } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { Subscription } from 'aurelia-event-aggregator';
import * as DOMPurify from 'dompurify';
import * as $ from 'jquery';

import { Constants } from '../constants';
import {
  CollectionCustomStructure,
  CollectionOption,
  Column,
  ColumnEditor,
  Editor,
  EditorArguments,
  EditorValidator,
  EditorValidatorOutput,
  FieldType,
  GridOption,
  Locale,
  MultipleSelectOption,
  SelectOption,
} from './../models/index';
import { CollectionService, findOrDefault, disposeAllSubscriptions } from '../services/index';
import { charArraysEqual, getDescendantProperty, getTranslationPrefix, htmlEncode, setDeepValue } from '../services/utilities';

/**
 * Slickgrid editor class for multiple/single select lists
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

  /** The original item values that are set at the beginning */
  originalValue: any[];

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

  /** Locales */
  protected _locales: Locale;

  /** Event Subscriptions */
  protected _subscriptions: Subscription[] = [];

  // flag to signal that the editor is destroying itself, helps prevent
  // commit changes from being called twice and erroring
  protected _destroying = false;

  /** SlickGrid Grid object */
  grid: any;

  constructor(protected bindingEngine: BindingEngine, protected collectionService: CollectionService, protected i18n: I18N, protected args: EditorArguments, protected isMultipleSelect = true) {
    if (!args) {
      throw new Error('[Aurelia-Slickgrid] Something is wrong with this grid, an Editor must always have valid arguments.');
    }
    this.grid = args.grid;
    this.gridOptions = (this.grid.getOptions() || {}) as GridOption;

    // get locales provided by user in main file or else use default English locales via the Constants
    this._locales = this.gridOptions.locales || Constants.locales;

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
        const isRenderHtmlEnabled = this.columnEditor && this.columnEditor.enableRenderHtml || false;
        return isRenderHtmlEnabled ? $elm.text() : $elm.html();
      },
      onClose: () => this.save(),
    };

    if (isMultipleSelect) {
      libOptions.single = false;
      libOptions.addTitle = true;
      libOptions.okButton = true;
      libOptions.selectAllDelimiter = ['', ''];

      if (this.i18n && this.i18n.tr && this.i18n.getLocale && this.i18n.getLocale()) {
        const translationPrefix = getTranslationPrefix(this.gridOptions);
        libOptions.countSelected = this.i18n.tr(`${translationPrefix}X_OF_Y_SELECTED`);
        libOptions.allSelected = this.i18n.tr(`${translationPrefix}ALL_SELECTED`);
        libOptions.selectAllText = this.i18n.tr(`${translationPrefix}SELECT_ALL`);
        libOptions.okButtonText = this.i18n.tr(`${translationPrefix}OK`);
      } else {
        libOptions.countSelected = this._locales && this._locales.TEXT_X_OF_Y_SELECTED;
        libOptions.allSelected = this._locales && this._locales.TEXT_ALL_SELECTED;
        libOptions.selectAllText = this._locales && this._locales.TEXT_SELECT_ALL;
        libOptions.okButtonText = this._locales && this._locales.TEXT_OK;
      }
    }

    // assign the multiple select lib options
    this.defaultOptions = libOptions;
    this.init();
  }

  /** Get the Collection */
  get collection(): SelectOption[] {
    return this.columnEditor && this.columnEditor.collection || [];
  }

  /** Getter for the Collection Options */
  get collectionOptions(): CollectionOption | undefined {
    return this.columnEditor && this.columnEditor.collectionOptions;
  }

  /** Get Column Definition object */
  get columnDef(): Column | undefined {
    return this.args && this.args.column;
  }

  /** Get Column Editor object */
  get columnEditor(): ColumnEditor | undefined {
    return this.columnDef && this.columnDef.internalColumnEditor || {};
  }

  /** Get the Editor DOM Element */
  get editorDomElement(): any {
    return this.$editorElm;
  }

  /** Getter for the Custom Structure if exist */
  protected get customStructure(): CollectionCustomStructure | undefined {
    return this.columnDef && this.columnDef.internalColumnEditor && this.columnDef.internalColumnEditor.customStructure;
  }

  get hasAutoCommitEdit() {
    return this.grid.getOptions().autoCommitEdit;
  }

  /**
   * The current selected values (multiple select) from the collection
   */
  get currentValues(): any[] | null {
    const elmValue = this.$editorElm.val();

    // collection of strings, just return the filtered string that are equals
    if (this.collection.every(x => typeof x === 'string')) {
      return this.collection.filter(c => elmValue.indexOf(c.toString()) !== -1);
    }

    // collection of label/value pair
    const separatorBetweenLabels = this.collectionOptions && this.collectionOptions.separatorBetweenTextLabels || '';
    const isIncludingPrefixSuffix = this.collectionOptions && this.collectionOptions.includePrefixSuffixToSelectedValues || false;

    return this.collection
      .filter(c => elmValue.indexOf(c.hasOwnProperty(this.valueName) && c[this.valueName] !== null && c[this.valueName].toString()) !== -1)
      .map(c => {
        const labelText = c[this.valueName];
        let prefixText = c[this.labelPrefixName] || '';
        let suffixText = c[this.labelSuffixName] || '';

        // when it's a complex object, then pull the object name only, e.g.: "user.firstName" => "user"
        const fieldName = this.columnDef && this.columnDef.field || '';

        // is the field a complex object, "address.streetNumber"
        const isComplexObject = fieldName && fieldName.indexOf('.') > 0;
        if (isComplexObject && typeof c === 'object') {
          return c;
        }

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
    const elmValue = this.$editorElm.val();
    const fieldName = this.columnDef && this.columnDef.field;

    if (fieldName !== undefined) {
      // collection of strings, just return the filtered string that are equals
      if (this.collection.every(x => typeof x === 'string')) {
        return findOrDefault(this.collection, (c: any) => c.toString() === elmValue);
      }

      // collection of label/value pair
      const separatorBetweenLabels = this.collectionOptions && this.collectionOptions.separatorBetweenTextLabels || '';
      const isIncludingPrefixSuffix = this.collectionOptions && this.collectionOptions.includePrefixSuffixToSelectedValues || false;
      const itemFound = findOrDefault(this.collection, (c: any) => c.hasOwnProperty(this.valueName) && c[this.valueName] !== null && c[this.valueName].toString() === elmValue);

      // is the field a complex object, "address.streetNumber"
      const isComplexObject = fieldName && fieldName.indexOf('.') > 0;

      if (isComplexObject && typeof itemFound === 'object') {
        return itemFound;
      } else if (itemFound && itemFound.hasOwnProperty(this.valueName)) {
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
    }
    return '';
  }

  /** Get the Validator function, can be passed in Editor property or Column Definition */
  get validator(): EditorValidator | undefined {
    return (this.columnEditor && this.columnEditor.validator) || (this.columnDef && this.columnDef.validator);
  }

  init() {
    if (!this.columnDef || !this.columnDef.internalColumnEditor || (!this.columnDef.internalColumnEditor.collection && !this.columnDef.internalColumnEditor.collectionAsync)) {
      throw new Error(`[Aurelia-Slickgrid] You need to pass a "collection" (or "collectionAsync") inside Column Definition Editor for the MultipleSelect/SingleSelect Editor to work correctly.
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
      throw new Error('[Aurelia-Slickgrid] requires "I18N" to be installed and configured when the grid option "enableTranslate" is enabled.');
    }

    // always render the Select (dropdown) DOM element, even if user passed a "collectionAsync",
    // if that is the case, the Select will simply be without any options but we still have to render it (else SlickGrid would throw an error)
    this.renderDomElement(this.collection);
  }

  getValue(): any | any[] {
    return (this.isMultipleSelect) ? this.currentValues : this.currentValue;
  }

  setValue(value: any | any[]) {
    if (this.isMultipleSelect && Array.isArray(value)) {
      this.loadMultipleValues(value);
    } else {
      this.loadSingleValue(value);
    }
  }

  hide() {
    if (this.$editorElm && typeof this.$editorElm.multipleSelect === 'function') {
      this.$editorElm.multipleSelect('close');
    }
  }

  show() {
    if (this.$editorElm && typeof this.$editorElm.multipleSelect === 'function') {
      this.$editorElm.multipleSelect('open');
    }
  }

  applyValue(item: any, state: any): void {
    const fieldName = this.columnDef && this.columnDef.field;
    const fieldType = this.columnDef && this.columnDef.type;
    let newValue = state;

    if (fieldName !== undefined) {
      // when the provided user defined the column field type as a possible number then try parsing the state value as that
      if (fieldType === FieldType.number || fieldType === FieldType.integer || fieldType === FieldType.boolean) {
        newValue = parseFloat(state);
      }

      // when set as a multiple selection, we can assume that the 3rd party lib multiple-select will return a CSV string
      // we need to re-split that into an array to be the same as the original column
      if (this.isMultipleSelect && typeof state === 'string' && state.indexOf(',') >= 0) {
        newValue = state.split(',');
      }

      // is the field a complex object, "user.address.streetNumber"
      const isComplexObject = fieldName !== undefined && fieldName.indexOf('.') > 0;

      // validate the value before applying it (if not valid we'll set an empty string)
      const validation = this.validate(newValue);
      newValue = (validation && validation.valid) ? newValue : '';

      // set the new value to the item datacontext
      if (isComplexObject) {
        // when it's a complex object, user could override the object path (where the editable object is located)
        // else we use the path provided in the Field Column Definition
        const objectPath = this.columnEditor && this.columnEditor.complexObjectPath || fieldName || '';
        setDeepValue(item, objectPath, newValue);
      } else if (fieldName !== undefined) {
        item[fieldName] = newValue;
      }
    }
  }

  destroy() {
    this._destroying = true;
    if (this.$editorElm && typeof this.$editorElm.multipleSelect === 'function') {
      this.$editorElm.multipleSelect('destroy');
      const elementClassName = this.elementName.toString().replace('.', '\\.'); // make sure to escape any dot "." from CSS class to avoid console error
      $(`[name=${elementClassName}].ms-drop`).remove();
    }
    if (this.$editorElm && typeof this.$editorElm.remove === 'function') {
      this.$editorElm.remove();
    }
    this._subscriptions = disposeAllSubscriptions(this._subscriptions);
  }

  loadValue(item: any): void {
    const fieldName = this.columnDef && this.columnDef.field;

    if (item && fieldName !== undefined) {
      // is the field a complex object, "address.streetNumber"
      const isComplexObject = fieldName && fieldName.indexOf('.') > 0;

      // when it's a complex object, user could override the object path (where the editable object is located)
      // else we use the path provided in the Field Column Definition
      const objectPath = this.columnEditor && this.columnEditor.complexObjectPath || fieldName;
      const currentValue = (isComplexObject) ? getDescendantProperty(item, objectPath as string) : (item.hasOwnProperty(fieldName) && item[fieldName]);
      const value = (isComplexObject && currentValue.hasOwnProperty(this.valueName)) ? currentValue[this.valueName] : currentValue;

      if (this.isMultipleSelect && Array.isArray(value)) {
        this.loadMultipleValues(value);
      } else {
        this.loadSingleValue(value);
      }
      this.refresh();
    }
  }

  loadMultipleValues(currentValues: any[]) {
    // convert to string because that is how the DOM will return these values
    if (Array.isArray(currentValues)) {
      // keep the default values in memory for references
      this.originalValue = currentValues.map((i: any) => i);

      // compare all the array values but as string type since multiple-select always return string
      const currentStringValues = currentValues.map((i: any) => i.toString());
      this.$editorElm.find('option').each((_i: number, $e: any) => {
        $e.selected = (currentStringValues.indexOf($e.value) !== -1);
      });
    }
  }

  loadSingleValue(currentValue: any) {
    // keep the default value in memory for references
    this.originalValue = typeof currentValue === 'number' ? `${currentValue}` : currentValue;
    this.$editorElm.val(currentValue);

    // make sure the prop exists first
    this.$editorElm.find('option').each((_i: number, $e: any) => {
      // check equality after converting originalValue to string since the DOM value will always be of type string
      $e.selected = (`${currentValue}` === $e.value);
    });
  }

  save() {
    const validation = this.validate();
    const isValid = (validation && validation.valid) || false;

    if (!this._destroying && this.hasAutoCommitEdit && isValid) {
      // do not use args.commitChanges() as this sets the focus to the next row.
      // also the select list will stay shown when clicking off the grid
      this.grid.getEditorLock().commitCurrentEdit();
    } else {
      this.args.commitChanges();
    }
  }

  serializeValue(): any | any[] {
    return (this.isMultipleSelect) ? this.currentValues : this.currentValue;
  }

  focus() {
    if (this.$editorElm && this.$editorElm.multipleSelect) {
      this.$editorElm.multipleSelect('focus');
    }
  }

  isValueChanged(): boolean {
    if (this.isMultipleSelect) {
      return !charArraysEqual(this.$editorElm.val(), this.originalValue);
    }
    return this.$editorElm.val() !== this.originalValue;
  }

  validate(inputValue?: any): EditorValidatorOutput {
    const isRequired = this.columnEditor && this.columnEditor.required;
    const elmValue = (inputValue !== undefined) ? inputValue : this.$editorElm && this.$editorElm.val && this.$editorElm.val();
    const errorMsg = this.columnEditor && this.columnEditor.errorMessage;

    if (this.validator) {
      const value = (inputValue !== undefined) ? inputValue : (this.isMultipleSelect ? this.currentValues : this.currentValue);
      return this.validator(value, this.args);
    }

    // by default the editor is almost always valid (except when it's required but not provided)
    if (isRequired && (elmValue === '' || (Array.isArray(elmValue) && elmValue.length === 0))) {
      return {
        valid: false,
        msg: errorMsg || Constants.VALIDATION_REQUIRED_FIELD
      };
    }

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
      const filterCollectionBy = this.columnEditor.collectionOptions && this.columnEditor.collectionOptions.filterResultAfterEachPass || null;
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
    if (this.columnDef && this.columnEditor && this.columnEditor.collectionSortBy) {
      const sortBy = this.columnEditor.collectionSortBy;
      outputCollection = this.collectionService.sortCollection(this.columnDef, outputCollection, sortBy, this.enableTranslateLabel);
    }

    return outputCollection;
  }

  protected renderDomElement(inputCollection: any[]) {
    if (!Array.isArray(inputCollection) && this.collectionOptions && (this.collectionOptions.collectionInsideObjectProperty || this.collectionOptions.collectionInObjectProperty)) {
      const collectionInsideObjectProperty = this.collectionOptions.collectionInsideObjectProperty || this.collectionOptions.collectionInObjectProperty;
      inputCollection = getDescendantProperty(inputCollection, collectionInsideObjectProperty);
    }
    if (!Array.isArray(inputCollection)) {
      throw new Error('The "collection" passed to the Select Editor is not a valid array.');
    }

    // make a copy of the collection so that we don't impact SelectFilter, this could happen when calling "addBlankEntry" or "addCustomFirstEntry"
    let collection: any[] = [];
    if (inputCollection.length > 0) {
      collection = [...inputCollection];
    }

    // user can optionally add a blank entry at the beginning of the collection
    // make sure however that it wasn't added more than once
    if (this.collectionOptions && this.collectionOptions.addBlankEntry && Array.isArray(collection) && collection.length > 0 && collection[0][this.valueName] !== '') {
      collection.unshift(this.createBlankEntry());
    }

    // user can optionally add his own custom entry at the beginning of the collection
    if (this.collectionOptions && this.collectionOptions.addCustomFirstEntry && Array.isArray(collection) && collection.length > 0 && collection[0][this.valueName] !== this.collectionOptions.addCustomFirstEntry[this.valueName]) {
      collection.unshift(this.collectionOptions && this.collectionOptions.addCustomFirstEntry);
    }

    // user can optionally add his own custom entry at the end of the collection
    if (this.collectionOptions && this.collectionOptions.addCustomLastEntry && Array.isArray(collection) && collection.length > 0) {
      const lastCollectionIndex = collection.length - 1;
      if (collection[lastCollectionIndex][this.valueName] !== this.collectionOptions.addCustomLastEntry[this.valueName]) {
        collection.push(this.collectionOptions && this.collectionOptions.addCustomLastEntry);
      }
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
    const columnId = this.columnDef && this.columnDef.id || '';
    const separatorBetweenLabels = this.collectionOptions && this.collectionOptions.separatorBetweenTextLabels || '';
    const isRenderHtmlEnabled = this.columnEditor && this.columnEditor.enableRenderHtml || false;
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
        if (optionLabel && optionLabel.toString) {
          optionLabel = optionLabel.toString().replace(/\"/g, '\''); // replace double quotes by single quotes to avoid interfering with regular html
        }

        // also translate prefix/suffix if enableTranslateLabel is true and text is a string
        prefixText = (this.enableTranslateLabel && prefixText && typeof prefixText === 'string') ? this.i18n.tr(prefixText || ' ') : prefixText;
        suffixText = (this.enableTranslateLabel && suffixText && typeof suffixText === 'string') ? this.i18n.tr(suffixText || ' ') : suffixText;
        optionLabel = (this.enableTranslateLabel && optionLabel && typeof optionLabel === 'string') ? this.i18n.tr(optionLabel || ' ') : optionLabel;

        // add to a temp array for joining purpose and filter out empty text
        const tmpOptionArray = [prefixText, labelText, suffixText].filter(text => (text !== undefined && text !== ''));
        let optionText = tmpOptionArray.join(separatorBetweenLabels);

        // if user specifically wants to render html text, he needs to opt-in else it will stripped out by default
        // also, the 3rd party lib will saninitze any html code unless it's encoded, so we'll do that
        if (isRenderHtmlEnabled) {
          // sanitize any unauthorized html tags like script and others
          // for the remaining allowed tags we'll permit all attributes
          const sanitizedText = (DOMPurify.sanitize(optionText, sanitizedOptions) || '').toString();
          optionText = htmlEncode(sanitizedText);
        }

        // html text of each select option
        let optionValue = option[this.valueName];
        if (optionValue === undefined || optionValue === null) {
          optionValue = '';
        }
        options += `<option value="${optionValue}" label="${optionLabel}">${optionText}</option>`;
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

    // add placeholder when found
    const placeholder = this.columnEditor && this.columnEditor.placeholder || '';
    this.defaultOptions.placeholder = placeholder || '';

    if (typeof this.$editorElm.multipleSelect === 'function') {
      const elementOptions = (this.columnEditor) ? this.columnEditor.elementOptions : {};
      const editorOptions = (this.columnDef && this.columnDef.internalColumnEditor) ? this.columnDef.internalColumnEditor.editorOptions : {};
      this.editorElmOptions = { ...this.defaultOptions, ...elementOptions, ...editorOptions };
      this.$editorElm = this.$editorElm.multipleSelect(this.editorElmOptions);
      setTimeout(() => this.show());
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
