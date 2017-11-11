import { FieldType } from '../models/index';
import { testFilterCondition } from './filterUtilities';
import * as moment from 'moment';
import { mapMomentDateFormatWithFieldType } from './../services/utilities';
const FORMAT = mapMomentDateFormatWithFieldType(FieldType.dateUsShort);
export const dateUsShortFilterCondition = (options) => {
    if (!moment(options.cellValue, FORMAT, true).isValid() || !moment(options.searchTerm, FORMAT, true).isValid()) {
        return true;
    }
    const dateCell = moment(options.cellValue, FORMAT, true);
    const dateSearch = moment(options.searchTerm, FORMAT, true);
    // run the filter condition with date in Unix Timestamp format
    return testFilterCondition(options.operator || '==', parseInt(dateCell.format('X'), 10), parseInt(dateSearch.format('X'), 10));
};
//# sourceMappingURL=dateUsShortFilterCondition.js.map