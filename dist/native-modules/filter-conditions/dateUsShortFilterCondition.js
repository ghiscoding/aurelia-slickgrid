import { FieldType } from '../models/index';
import { testFilterCondition } from './filterUtilities';
import * as moment from 'moment';
import { mapMomentDateFormatWithFieldType } from './../services/utilities';
var FORMAT = mapMomentDateFormatWithFieldType(FieldType.dateUsShort);
export var dateUsShortFilterCondition = function (options) {
    var searchTerm = Array.isArray(options.searchTerms) && options.searchTerms[0] || '';
    if (searchTerm === null || searchTerm === '' || !moment(options.cellValue, FORMAT, true).isValid() || !moment(searchTerm, FORMAT, true).isValid()) {
        return false;
    }
    var dateCell = moment(options.cellValue, FORMAT, true);
    var dateSearch = moment(searchTerm, FORMAT, true);
    // run the filter condition with date in Unix Timestamp format
    return testFilterCondition(options.operator || '==', parseInt(dateCell.format('X'), 10), parseInt(dateSearch.format('X'), 10));
};
//# sourceMappingURL=dateUsShortFilterCondition.js.map