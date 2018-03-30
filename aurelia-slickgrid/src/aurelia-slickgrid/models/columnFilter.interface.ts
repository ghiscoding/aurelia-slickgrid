import {
  CollectionFilterBy,
  CollectionSortBy,
  Column,
  Filter,
  FilterType,
  FormElementType,
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

  /** Custom Filter */
  customFilter?: Filter;

  /** Search term (singular) */
  searchTerm?: SearchTerm;

  /** Search terms (collection) */
  searchTerms?: SearchTerm[];

  /** Operator to use when filtering (>, >=, EQ, IN, ...) */
  operator?: OperatorType | OperatorString;

  /** Filter Type to use (input, multipleSelect, singleSelect, select, custom) */
  type?: FilterType | FormElementType | string;

  /** A collection of items/options (commonly used with a Select/Multi-Select Filter) */
  collection?: any[];

  /** We could filter some items from the collection */
  collectionFilterBy?: CollectionFilterBy;

  /** We could sort the collection by their value, or by translated value when enableTranslateLabel is True */
  collectionSortBy?: CollectionSortBy;

  /** Options that could be provided to the Filter, example: { container: 'body', maxHeight: 250} */
  filterOptions?: MultipleSelectOption | any;

  /** DEPRECATED, please use "collection" instead which is more generic and not specific to a Select Filter. Refer to the Select Filter Wiki page for more info  */
  selectOptions?: any[];

  /** Do we want the Filter to handle translation (localization)? */
  enableTranslateLabel?: boolean;

  /** A custom structure can be used instead of the default label/value pair. Commonly used with Select/Multi-Select Filter */
  customStructure?: {
    label: string;
    value: string;
  };

  /**
   * Use "params" to pass any type of arguments to your Custom Filter (type: FilterType.custom)
   * for example, to pass the option collection to a select Filter we can type this:
   * params: { options: [{ value: true, label: 'True' }, { value: true, label: 'True'} ]}
   */
  params?: any;
}
