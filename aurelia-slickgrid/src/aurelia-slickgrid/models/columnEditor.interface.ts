import {
  CollectionFilterBy,
  CollectionSortBy,
  EditorValidator,
  MultipleSelectOption,
} from './../models/index';

export interface ColumnEditor {
  /** Any inline editor function that implements Editor for the cell */
  model?: any;

  collection?: any[];

  /** We could filter some items from the collection */
  collectionFilterBy?: CollectionFilterBy;

  /** We could sort the collection by their value, or by translated value when enableTranslateLabel is True */
  collectionSortBy?: CollectionSortBy;

  /** Options that could be provided to the Editor, example: { container: 'body', maxHeight: 250} */
  editorOptions?: MultipleSelectOption | any;

  /**
   * Defaults to false, when set it will render any HTML code instead of removing it (sanitized)
   * Only used so far in the MultipleSelect & SingleSelect Filters will support it
   */
  enableRenderHtml?: boolean;

  /** Do we want the Editor to handle translation (localization)? */
  enableTranslateLabel?: boolean;

  /** Error message to display when validation fails */
  errorMessage?: string;

  /** Maximum value of the filter, works only with Filters supporting it (text, number, float, slider) */
  maxValue?: number | string;

  /** Minimum value of the filter, works only with Filters supporting it (text, number, float, slider) */
  minValue?: number | string;

  /** Editor Validator */
  validator?: EditorValidator;

  /** Step value of the filter, works only with Filters supporting it (input text, number, float, range, slider) */
  valueStep?: number | string;

  /** A custom structure can be used instead of the default label/value pair. Commonly used with Select/Multi-Select Editor */
  customStructure?: {
    /** your custom property name to for the "label" (text displayed in the select dropdown UI) */
    label: string;

    /** your custom property name to use for the "value" (equals of the "option" in a select dropdown) */
    value: string;

    /** an optional prefix that will be prepended before the label text */
    labelPrefix?: string;

    /** an optional suffix that will be appended to the label text */
    labelSuffix?: string;

    /** defaults to false, when using label with prefix/suffix, do we want to add spaces between each? */
    addSpaceBetweenLabels?: boolean;
  };

  /**
   * Use "params" to pass any type of arguments to your Custom Editor
   * or regular Editor like the Editors.float
   * for example, to pass the option collection to a select Filter we can type this:
   * params: { decimalPlaces: 2 }
   */
  params?: any;
}
