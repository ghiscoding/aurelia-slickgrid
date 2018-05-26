import * as moment from 'moment';
import { compareDates } from './sorterUtilities';
export var dateSorter = function (value1, value2, sortDirection) {
    return compareDates(sortDirection, value1, value2, moment.ISO_8601);
};
//# sourceMappingURL=dateSorter.js.map