import { Column, Formatter } from './../models/index';
import { formatNumber } from './../services/utilities';
import { getValueFromParamsOrFormatterOptions } from './formatterUtilities';

export const decimalFormatter: Formatter = (_row: number, _cell: number, value: any, columnDef: Column, _dataContext: any, grid: any) => {
  const isNumber = (value === null || value === undefined || value === '') ? false : !isNaN(+value);
  const params = columnDef.params || {};
  let minDecimal = getValueFromParamsOrFormatterOptions('minDecimal', columnDef, grid, 2);
  let maxDecimal = getValueFromParamsOrFormatterOptions('maxDecimal', columnDef, grid, 2);
  const decimalSeparator = getValueFromParamsOrFormatterOptions('decimalSeparator', columnDef, grid, '.');
  const thousandSeparator = getValueFromParamsOrFormatterOptions('thousandSeparator', columnDef, grid, '');
  const displayNegativeNumberWithParentheses = getValueFromParamsOrFormatterOptions('displayNegativeNumberWithParentheses', columnDef, grid, false);

  // @deprecated: decimalPlaces, minDecimalPlaces, maxDecimalPlaces
  // add these extra checks to support previous way of passing the decimal count
  if ((params.minDecimalPlaces !== null && params.minDecimalPlaces) || (params.decimalPlaces !== null && params.decimalPlaces)) {
    console.warn('[Aurelia-Slickgrid] please consider using "minDecimal" (instead of "minDecimalPlaces" or "decimalPlaces").');
    minDecimal = (params.minDecimalPlaces !== null && params.minDecimalPlaces) || (params.decimalPlaces !== null && params.decimalPlaces);
  }
  if (params.maxDecimalPlaces !== null && params.maxDecimalPlaces) {
    console.warn('[Aurelia-Slickgrid] please consider using "maxDecimal" (instead of "maxDecimalPlaces").');
    maxDecimal = (params.maxDecimalPlaces !== null && params.maxDecimalPlaces);
  }

  if (isNumber) {
    return formatNumber(value, minDecimal, maxDecimal, displayNegativeNumberWithParentheses, '', '', decimalSeparator, thousandSeparator);
  }
  return value;
};
