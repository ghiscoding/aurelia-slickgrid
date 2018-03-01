import { Column } from './column.interface';
import { I18N } from 'aurelia-i18n';
import { FilterCallback } from './filterCallback.interface';
import { SearchTerm } from './searchTerm.type';

export interface FilterArguments {
  grid: any;
  columnDef: Column;
  callback: FilterCallback;
  searchTerm?: SearchTerm;
  searchTerms?: SearchTerm[];
  i18n?: I18N;
  params?: any | any[];
}
