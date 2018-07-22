import {
  CollectionFilterBy,
  CollectionSortBy,
  EditorValidator,
  MultipleSelectOption,
} from './../models/index';

export interface ColumnEditor {
  /** A collection of items/options that can be used by Select (dropdown) or any other type of Editors */
  collection?: any[];

  /** A collection of items/options that will be loaded asynchronously (commonly used with a Select/Multi-Select Editor) */
  collectionAsync?: Promise<any>;

  /** We could filter some items from the collection */
  collectionFilterBy?: CollectionFilterBy;

  /** We could sort the collection by their value, or by translated value when enableTranslateLabel is True */
  collectionSortBy?: CollectionSortBy;

  /** Options that could be provided to the Editor, example: { container: 'body', maxHeight: 250} */
  editorOptions?: MultipleSelectOption | any;

  /** Do we want the Editor to handle translation (localization)? */
  enableTranslateLabel?: boolean;

  /** Error message to display when validation fails */
  errorMessage?: string;

  /** Maximum value of the filter, works only with Filters supporting it (text, number, float, slider) */
  maxValue?: number | string;

  /** Minimum value of the filter, works only with Filters supporting it (text, number, float, slider) */
  minValue?: number | string;

  /** Any inline editor function that implements Editor for the cell */
  model?: any;

  /** Editor Validator */
  validator?: EditorValidator;

  /** Step value of the filter, works only with Filters supporting it (input text, number, float, range, slider) */
  valueStep?: number | string;

  /** A custom structure can be used instead of the default label/value pair. Commonly used with Select/Multi-Select Editor */
  customStructure?: {
    label: string;
    value: string;
  };

  /**
   * Use "params" to pass any type of arguments to your Custom Editor
   * or regular Editor like the Editors.float
   * for example, to pass the option collection to a select Filter we can type this:
   * params: { decimalPlaces: 2 }
   */
  params?: any;
}
