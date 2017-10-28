import { FieldType } from './../models';
import { mapMomentDateFormatWithFieldType } from './../services/utilities';
import * as moment from 'moment';
const FORMAT = mapMomentDateFormatWithFieldType(FieldType.dateTimeIsoAmPm);
export const dateTimeIsoAmPmFormatter = (row, cell, value, columnDef, dataContext) => value ? moment(value).format(FORMAT) : '';
//# sourceMappingURL=dateTimeIsoAmPmFormatter.js.map