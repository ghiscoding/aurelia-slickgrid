import * as moment from 'moment';
import { compareDates } from './sorterUtilities';
export const dateSorter = (value1, value2, sortDirection) => {
    return compareDates(sortDirection, value1, value2, moment.ISO_8601);
};
//# sourceMappingURL=dateSorter.js.map