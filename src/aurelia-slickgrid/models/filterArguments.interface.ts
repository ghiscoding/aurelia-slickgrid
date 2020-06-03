import { I18N } from 'aurelia-i18n';
import {
  Column,
  FilterCallback,
  OperatorString,
  OperatorType,
  SearchTerm,
  SlickGrid
} from './../models/index';

export interface FilterArguments {
  grid: SlickGrid;
  columnDef: Column;
  callback: FilterCallback;
  operator?: OperatorType | OperatorString;
  searchTerms?: SearchTerm[];
  i18n?: I18N;
  params?: any | any[];
}
