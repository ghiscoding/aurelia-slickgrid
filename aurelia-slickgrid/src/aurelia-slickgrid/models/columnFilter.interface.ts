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
  searchTerms?: SearchTerm[];

  /** Operator to use when filtering (>, >=, EQ, IN, ...) */
  operator?: OperatorType | OperatorString;

  /** Filter to use (input, multipleSelect, singleSelect, select, custom) */
  model?: any;

  /** A collection of items/options (commonly used with a Select/Multi-Select Filter) */
  collection?: any[];

  /** We could filter some items from the collection */
  collectionFilterBy?: CollectionFilterBy;

  /** We could sort the collection by their value, or by translated value when enableTranslateLabel is True */
  collectionSortBy?: CollectionSortBy;

  /** Options that could be provided to the Filter, example: { container: 'body', maxHeight: 250} */
  filterOptions?: MultipleSelectOption | any;

  /** Do we want the Filter to handle translation (localization)? */
  enableTranslateLabel?: boolean;

  /** A custom structure can be used instead of the default label/value pair. Commonly used with Select/Multi-Select Filter */
  customStructure?: {
    label: string;
    value: string;
  };

  /**
   * Use "params" to pass any type of arguments to your Custom Filter
   * for example, to pass a second collection to a select Filter we can type this:
   * params: { options: [{ value: true, label: 'True' }, { value: true, label: 'True'} ]}
   */
  params?: any;
}
