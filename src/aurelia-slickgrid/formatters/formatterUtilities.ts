import { Column, FieldType, Formatter, GridOption } from '../models/index';
import { mapMomentDateFormatWithFieldType } from '../services/utilities';
import * as moment from 'moment';

/**
 * Find the option value from the following (in order of execution)
 * 1- Column Definition "params"
 * 2- Grid Options "formatterOptions"
 * 3- nothing found, return default value provided
 */
export function getValueFromParamsOrGridOptions(optionName: string, columnDef: Column, grid: any, defaultValue?: any) {
  const gridOptions = ((grid && typeof grid.getOptions === 'function') ? grid.getOptions() : {}) as GridOption;
  const params = columnDef && columnDef.params;

  if (params && params.hasOwnProperty(optionName)) {
    return params[optionName];
  } else if (gridOptions.formatterOptions && gridOptions.formatterOptions.hasOwnProperty(optionName)) {
    return gridOptions.formatterOptions[optionName];
  }
  return defaultValue;
}

/** From a FieldType, return the associated date Formatter */
export function getAssociatedDateFormatter(fieldType: FieldType): Formatter {
  const FORMAT = mapMomentDateFormatWithFieldType(fieldType);

  return (row: number, cell: number, value: any, columnDef: Column, dataContext: any) => {
    const isDateValid = moment(value, FORMAT, false).isValid();
    return (value && isDateValid) ? moment(value).format(FORMAT) : value;
  };
}
