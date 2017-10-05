import * as moment from 'moment';
import { testFilterCondition } from './filterUtilities';
const DATE_FORMAT = 'YYYY-MM-DD';
export const dateIsoFilterCondition = (options) => {
    if (!moment(options.cellValue, DATE_FORMAT, true).isValid() || !moment(options.searchTerm, DATE_FORMAT, true).isValid()) {
        return true;
    }
    const dateCell = moment(options.cellValue, DATE_FORMAT, true);
    const dateSearch = moment(options.searchTerm, DATE_FORMAT, true);
    // run the filter condition with date in Unix Timestamp format
    return testFilterCondition(options.operator || '==', parseInt(dateCell.format('X'), 10), parseInt(dateSearch.format('X'), 10));
};
