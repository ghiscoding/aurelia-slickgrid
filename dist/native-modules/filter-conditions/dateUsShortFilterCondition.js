import { testFilterCondition } from './filterUtilities';
import * as moment from 'moment';
var DATE_FORMAT = 'M/D/YY';
export var dateUsShortFilterCondition = function (options) {
    if (!moment(options.cellValue, DATE_FORMAT, true).isValid() || !moment(options.searchTerm, DATE_FORMAT, true).isValid()) {
        return true;
    }
    var dateCell = moment(options.cellValue, DATE_FORMAT, true);
    var dateSearch = moment(options.searchTerm, DATE_FORMAT, true);
    // run the filter condition with date in Unix Timestamp format
    return testFilterCondition(options.operator || '==', parseInt(dateCell.format('X'), 10), parseInt(dateSearch.format('X'), 10));
};
//# sourceMappingURL=dateUsShortFilterCondition.js.map