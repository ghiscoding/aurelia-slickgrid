import {
  FilterCallback,
  Column,
  FilterArguments,
  OperatorType,
  OperatorString,
  SearchTerm
} from './../models/index';

// export type Filter = (searchTerms: string | number | string[] | number[], columnDef: Column, params?: any) => string;
export interface Filter {
  // Properties which must be Public

  /** Column definition */
  columnDef: Column;

  /** Callback that will be run after the filter triggers */
  callback: FilterCallback;

  /** SlickGrid grid object */
  grid: any;

  /** Array of defined search terms to pre-load */
  searchTerms?: SearchTerm[];

  /** The search operator for the filter */
  operator: OperatorType | OperatorString;

  /** You can use "params" to pass any types of arguments to your Filter */
  params?: any | any[];

  /** Funtion to initialize the Filter class */
  init: (args: FilterArguments) => void;

  /** Clear filter function */
  clear: () => void;

  /** Destroy filter function */
  destroy: () => void;

  /** Set value(s) on the DOM element */
  setValues: (values: SearchTerm | SearchTerm[] | undefined) => void;
}
