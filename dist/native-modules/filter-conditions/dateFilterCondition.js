import { FieldType } from '../models';
import { mapMomentDateFormatWithFieldType } from './../services/utilities';
import { testFilterCondition } from './filterUtilities';
import * as moment from 'moment';
export var dateFilterCondition = function (options) {
    var filterSearchType = options.filterSearchType || FieldType.dateIso;
    var searchDateFormat = mapMomentDateFormatWithFieldType(filterSearchType);
    if (!moment(options.cellValue, moment.ISO_8601).isValid() || !moment(options.searchTerm, searchDateFormat, true).isValid()) {
        return true;
    }
    var dateCell = moment(options.cellValue);
    var dateSearch = moment(options.searchTerm);
    // run the filter condition with date in Unix Timestamp format
    return testFilterCondition(options.operator || '==', parseInt(dateCell.format('X'), 10), parseInt(dateSearch.format('X'), 10));
};
//# sourceMappingURL=dateFilterCondition.js.map