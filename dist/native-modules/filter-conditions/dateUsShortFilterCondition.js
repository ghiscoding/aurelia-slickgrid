import { FieldType } from '../models';
import { testFilterCondition } from './filterUtilities';
import * as moment from 'moment';
import { mapMomentDateFormatWithFieldType } from './../services/utilities';
var FORMAT = mapMomentDateFormatWithFieldType(FieldType.dateUsShort);
export var dateUsShortFilterCondition = function (options) {
    if (!moment(options.cellValue, FORMAT, true).isValid() || !moment(options.searchTerm, FORMAT, true).isValid()) {
        return true;
    }
    var dateCell = moment(options.cellValue, FORMAT, true);
    var dateSearch = moment(options.searchTerm, FORMAT, true);
    // run the filter condition with date in Unix Timestamp format
    return testFilterCondition(options.operator || '==', parseInt(dateCell.format('X'), 10), parseInt(dateSearch.format('X'), 10));
};
//# sourceMappingURL=dateUsShortFilterCondition.js.map