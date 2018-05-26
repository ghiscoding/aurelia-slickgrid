import { Column, Formatter } from './../models/index';

/** Takes a cell value and translates it (i18n). Requires an instance of the I18N Service:: `i18n: this.i18n` */
export const translateFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid: any) => {
  const gridOptions = (grid && typeof grid.getOptions === 'function') ? grid.getOptions() : {};
  const columnParams = columnDef.params || {};
  const i18n = gridOptions.i18n || columnParams.i18n;

  if (!i18n || typeof i18n.tr !== 'function') {
    throw new Error(`The translate formatter requires the "I18N" Service to be provided as a Grid Options or Column Definition "params".
    For example: this.gridOptions = { enableTranslate: true, i18n: this.i18n }`);
  }

  // make sure the value is a string (for example a boolean value would throw an error)
  if (value !== undefined && typeof value !== 'string') {
    value = value + '';
  }

  return value ? i18n.tr(value) : '';
};
