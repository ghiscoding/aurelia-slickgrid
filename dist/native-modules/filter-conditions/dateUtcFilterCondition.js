import * as moment from 'moment';
import { mapDateFormatByFieldType, testFilterCondition } from './filterUtilities';
export var dateUtcFilterCondition = function (options) {
    if (!options.filterSearchType) {
        throw new Error('Date UTC filter is a special case and requires a filterSearchType to be provided in the column option, for example: { filterable: true, type: FieldType.dateUtc, filterSearchType: FieldType.dateIso }');
    }
    var searchDateFormat = mapDateFormatByFieldType(options.filterSearchType);
    if (!moment(options.cellValue, moment.ISO_8601).isValid() || !moment(options.searchTerm, searchDateFormat, true).isValid()) {
        return true;
    }
    var dateCell = moment(options.cellValue, moment.ISO_8601, true);
    var dateSearch = moment(options.searchTerm, searchDateFormat, true);
    // run the filter condition with date in Unix Timestamp format
    return testFilterCondition(options.operator || '==', parseInt(dateCell.format('X'), 10), parseInt(dateSearch.format('X'), 10));
};
