import { I18N } from 'aurelia-i18n';
import { FilterType } from './filterType.enum';
import { FilterCallback } from './filterCallback.interface';
import { Column } from './column.interface';
import { FilterArguments } from './filterArguments.interface';

// export type Filter = (searchTerms: string | number | string[] | number[], columnDef: Column, params?: any) => string;
export interface Filter {
  // Properties which must be Public

  /** Column definition */
  columnDef: Column;

  /** Callback that will be run after the filter triggers */
  callback: FilterCallback;

  /** the type of filter used */
  filterType?: FilterType | string;

  /** SlickGrid grid object */
  grid: any;

  /** Defined search term to pre-load */
  searchTerm?: string | number | boolean;

  /** Array of defined search terms to pre-load */
  searchTerms?: string[] | number[] | boolean[];

  /** You can use "params" to pass any types of arguments to your Filter */
  params?: any | any[];

  /** Funtion to initialize the Filter class */
  init: (args: FilterArguments) => void;

  /** Clear filter function */
  clear: () => void;

  /** Destroy filter function */
  destroy: () => void;
}
