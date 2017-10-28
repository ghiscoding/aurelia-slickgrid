import { FieldType } from './../models';
import { mapMomentDateFormatWithFieldType } from './../services/utilities';
import * as moment from 'moment';
const FORMAT = mapMomentDateFormatWithFieldType(FieldType.dateTimeUs);
export const dateTimeUsFormatter = (row, cell, value, columnDef, dataContext) => value ? moment(value).format(FORMAT) : '';
//# sourceMappingURL=dateTimeUsFormatter.js.map