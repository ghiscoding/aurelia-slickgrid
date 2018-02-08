import { Column, Formatter } from './../models/index';
import { I18N } from 'aurelia-i18n';

export const translateFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any) => {
  const params = columnDef.params || {};
  if (!params.i18n || !(params.i18n instanceof I18N)) {
    throw new Error(`The translate formatter requires the "i18n" to be provided as a column params.
    For example: this.columnDefinitions = [{ id: title, field: title, formatter: Formatters.translate, params: { i18n: this.i18n }`);
  }

  return value ? params.i18n.tr(value) : '';
};
