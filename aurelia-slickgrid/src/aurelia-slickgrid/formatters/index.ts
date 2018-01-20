import { Column } from './../models/index';
// import { Group, GroupTotals } from '../core'
// import { Item } from '../dataview'
import { arrayToCsvFormatter } from './arrayToCsvFormatter';
import { checkboxFormatter } from './checkboxFormatter';
import { checkmarkFormatter } from './checkmarkFormatter';
import { complexObjectFormatter } from './complexObjectFormatter';
import { dateIsoFormatter } from './dateIsoFormatter';
import { dateTimeIsoAmPmFormatter } from './dateTimeIsoAmPmFormatter';
import { dateTimeUsAmPmFormatter } from './dateTimeUsAmPmFormatter';
import { dateTimeUsFormatter } from './dateTimeUsFormatter';
import { dateUsFormatter } from './dateUsFormatter';
import { deleteIconFormatter } from './deleteIconFormatter';
import { editIconFormatter } from './editIconFormatter';
import { hyperlinkFormatter } from './hyperlinkFormatter';
import { infoIconFormatter } from './infoIconFormatter';
import { lowercaseFormatter } from './lowercaseFormatter';
import { multipleFormatter } from './multipleFormatter';
import { percentCompleteFormatter } from './percentCompleteFormatter';
import { percentCompleteBarFormatter } from './percentCompleteBarFormatter';
import { progressBarFormatter } from './progressBarFormatter';
import { translateFormatter } from './translateFormatter';
import { uppercaseFormatter } from './uppercaseFormatter';
import { yesNoFormatter } from './yesNoFormatter';

/*
export interface GroupFormatter {
  (row: number, cell: number, value: any, columnDef: Column, dataContext: Group): string
}

export interface GroupTotalsFormatter {
  (row: number, cell: number, value: any, columnDef: Column, dataContext: GroupTotals): string
}
*/
export const Formatters = {
  arrayToCsv: arrayToCsvFormatter,
  checkbox: checkboxFormatter,
  checkmark: checkmarkFormatter,
  complexObject: complexObjectFormatter,
  dateIso: dateIsoFormatter,
  dateTimeIso: dateIsoFormatter,
  dateTimeIsoAmPm: dateTimeIsoAmPmFormatter,
  dateUs: dateUsFormatter,
  dateTimeUs: dateTimeUsFormatter,
  dateTimeUsAmPm: dateTimeUsAmPmFormatter,
  deleteIcon: deleteIconFormatter,
  editIcon: editIconFormatter,
  hyperlink: hyperlinkFormatter,
  infoIcon: infoIconFormatter,
  lowercase: lowercaseFormatter,
  multiple: multipleFormatter,
  percentComplete: percentCompleteFormatter,
  percentCompleteBar: percentCompleteBarFormatter,
  progressBar: progressBarFormatter,
  translate: translateFormatter,
  uppercase: uppercaseFormatter,
  yesNo: yesNoFormatter
};
