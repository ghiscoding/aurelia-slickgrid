import { FieldType } from './../models/index';
import { mapMomentDateFormatWithFieldType } from './../services/utilities';
import * as moment from 'moment';
const FORMAT = mapMomentDateFormatWithFieldType(FieldType.dateTimeIso);
export const dateTimeIsoFormatter = (row, cell, value, columnDef, dataContext) => value ? moment(value).format(FORMAT) : '';
//# sourceMappingURL=dateTimeIsoFormatter.js.map