import {
  CollectionFilterBy,
  CollectionSortBy,
  Column,
  MultipleSelectOption,
  OperatorString,
  OperatorType,
  SearchTerm
} from './../models/index';

export interface ColumnFilter {
  /** Do we want to bypass the Backend Query? Commonly used with an OData Backend Service, if we want to filter without calling the regular OData query. */
  bypassBackendQuery?: boolean;

  /** Column ID */
  columnId?: string;

  /** Column Definition */
  columnDef?: Column;

  /** Search terms (collection) */
  searchTerms?: SearchTerm[] | undefined;

  /** Operator to use when filtering (>, >=, EQ, IN, ...) */
  operator?: OperatorType | OperatorString;

  /** Maximum value of the filter, works only with Filters supporting it (text, number, float, slider) */
  maxValue?: number | string;

  /** Minimum value of the filter, works only with Filters supporting it (text, number, float, slider) */
  minValue?: number | string;

  /** Filter to use (input, multipleSelect, singleSelect, select, custom) */
  model?: any;

  /** A collection of items/options (commonly used with a Select/Multi-Select Filter) */
  collection?: any[];

  /** A collection of items/options that will be loaded asynchronously (commonly used with a Select/Multi-Select Editor) */
  collectionAsync?: Promise<any>;

  /** We could filter some items from the collection */
  collectionFilterBy?: CollectionFilterBy;

  /** We could sort the collection by their value, or by translated value when enableTranslateLabel is True */
  collectionSortBy?: CollectionSortBy;

  /**
   * Defaults to false, when enable it will add collection observers and re-render the Filter DOM element
   * with the new collection when changes are detected. Also note that using "collectionAsync" automatically watch for changes,
   * in consequence, there's no need to enable this flag in that particular case.
   */
  enableCollectionWatch?: boolean;

  /**
   * Defaults to false, when set it will render any HTML code instead of removing it (sanitized)
   * Only used so far in the MultipleSelect & SingleSelect Filters will support it
   */
  enableRenderHtml?: boolean;

  /** Do we want the Filter to handle translation (localization)? */
  enableTranslateLabel?: boolean;

  /** Options that could be provided to the Filter, example: { container: 'body', maxHeight: 250} */
  filterOptions?: MultipleSelectOption | any;

  /** A custom structure can be used instead of the default label/value pair. Commonly used with Select/Multi-Select Filter */
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
   * Use "params" to pass any type of arguments to your Custom Filter
   * for example, to pass a second collection to a select Filter we can type this:
   * params: { options: [{ value: true, label: 'True' }, { value: true, label: 'True'} ]}
   */
  params?: any;

  /** Step value of the filter, works only with Filters supporting it (input text, number, float, range, slider) */
  valueStep?: number | string;
}
