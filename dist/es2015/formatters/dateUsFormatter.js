import { FieldType } from './../models/index';
import { mapMomentDateFormatWithFieldType } from './../services/utilities';
import * as moment from 'moment';
const FORMAT = mapMomentDateFormatWithFieldType(FieldType.dateUs);
export const dateUsFormatter = (row, cell, value, columnDef, dataContext) => value ? moment(value).format(FORMAT) : '';
//# sourceMappingURL=dateUsFormatter.js.map