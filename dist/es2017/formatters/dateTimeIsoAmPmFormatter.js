import { FieldType } from './../models/index';
import { mapMomentDateFormatWithFieldType } from './../services/utilities';
import * as moment from 'moment';
const FORMAT = mapMomentDateFormatWithFieldType(FieldType.dateTimeIsoAmPm);
export const dateTimeIsoAmPmFormatter = (row, cell, value, columnDef, dataContext) => {
    const isDateValid = moment(value, FORMAT, false).isValid();
    return (value && isDateValid) ? moment(value).format(FORMAT) : value;
};
//# sourceMappingURL=dateTimeIsoAmPmFormatter.js.map