import { I18N } from 'aurelia-i18n';
import { Column, FilterCallback, OperatorString, OperatorType, SearchTerm } from './../models/index';
export interface FilterArguments {
    grid: any;
    columnDef: Column;
    callback: FilterCallback;
    operator?: OperatorType | OperatorString;
    searchTerm?: SearchTerm;
    searchTerms?: SearchTerm[];
    i18n?: I18N;
    params?: any | any[];
}
