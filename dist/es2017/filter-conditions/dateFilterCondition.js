import { FieldType } from '../models';
import { mapMomentDateFormatWithFieldType } from './../services/utilities';
import { testFilterCondition } from './filterUtilities';
import * as moment from 'moment';
export const dateFilterCondition = (options) => {
    const filterSearchType = options.filterSearchType || FieldType.dateIso;
    const searchDateFormat = mapMomentDateFormatWithFieldType(filterSearchType);
    if (!moment(options.cellValue, moment.ISO_8601).isValid() || !moment(options.searchTerm, searchDateFormat, true).isValid()) {
        return true;
    }
    const dateCell = moment(options.cellValue);
    const dateSearch = moment(options.searchTerm);
    // run the filter condition with date in Unix Timestamp format
    return testFilterCondition(options.operator || '==', parseInt(dateCell.format('X'), 10), parseInt(dateSearch.format('X'), 10));
};
//# sourceMappingURL=dateFilterCondition.js.map