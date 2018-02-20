import { Column } from './column.interface';
import { I18N } from 'aurelia-i18n';
import { FilterCallback } from './filterCallback.interface';
export interface FilterArguments {
    grid: any;
    columnDef: Column;
    callback: FilterCallback;
    searchTerm?: string | number | boolean;
    searchTerms?: string[] | number[] | boolean[];
    i18n?: I18N;
    params?: any | any[];
}
