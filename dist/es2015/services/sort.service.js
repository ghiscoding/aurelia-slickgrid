var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EventAggregator } from 'aurelia-event-aggregator';
import { FieldType } from './../models/index';
import { Sorters } from './../sorters/index';
export class SortService {
    constructor() {
        this.onSortChanged = new EventAggregator();
    }
    /**
     * Attach a backend sort (single/multi) hook to the grid
     * @param grid SlickGrid Grid object
     * @param gridOptions Grid Options object
     */
    attachBackendOnSort(grid, gridOptions) {
        this.subscriber = grid.onSort;
        this.emitSortChangedBy('remote');
        this.subscriber.subscribe(this.attachBackendOnSortSubscribe);
    }
    attachBackendOnSortSubscribe(event, args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!args || !args.grid) {
                throw new Error('Something went wrong when trying to attach the "attachBackendOnSortSubscribe(event, args)" function, it seems that "args" is not populated correctly');
            }
            const serviceOptions = args.grid.getOptions();
            if (serviceOptions === undefined || serviceOptions.onBackendEventApi === undefined || serviceOptions.onBackendEventApi.process === undefined || !serviceOptions.onBackendEventApi.service === undefined) {
                throw new Error(`onBackendEventApi requires at least a "process" function and a "service" defined`);
            }
            if (serviceOptions.onBackendEventApi !== undefined && serviceOptions.onBackendEventApi.preProcess) {
                serviceOptions.onBackendEventApi.preProcess();
            }
            const query = serviceOptions.onBackendEventApi.service.onSortChanged(event, args);
            // await for the Promise to resolve the data
            const responseProcess = yield serviceOptions.onBackendEventApi.process(query);
            // send the response process to the postProcess callback
            if (serviceOptions.onBackendEventApi.postProcess) {
                serviceOptions.onBackendEventApi.postProcess(responseProcess);
            }
        });
    }
    /**
     * Attach a local sort (single/multi) hook to the grid
     * @param grid SlickGrid Grid object
     * @param gridOptions Grid Options object
     * @param dataView
     */
    attachLocalOnSort(grid, gridOptions, dataView) {
        this.subscriber = grid.onSort;
        this.emitSortChangedBy('local');
        this.subscriber.subscribe((e, args) => {
            // multiSort and singleSort are not exactly the same, but we want to structure it the same for the (for loop) after
            // also to avoid having to rewrite the for loop in the sort, we will make the singleSort an array of 1 object
            const sortColumns = (args.multiColumnSort) ? args.sortCols : new Array({ sortAsc: args.sortAsc, sortCol: args.sortCol });
            dataView.sort((dataRow1, dataRow2) => {
                for (let i = 0, l = sortColumns.length; i < l; i++) {
                    const sortDirection = sortColumns[i].sortAsc ? 1 : -1;
                    const sortField = sortColumns[i].sortCol.field;
                    const fieldType = sortColumns[i].sortCol.type || 'string';
                    const value1 = dataRow1[sortField];
                    const value2 = dataRow2[sortField];
                    let result = 0;
                    switch (fieldType) {
                        case FieldType.number:
                            result = Sorters.numeric(value1, value2, sortDirection);
                            break;
                        case FieldType.date:
                            result = Sorters.date(value1, value2, sortDirection);
                            break;
                        case FieldType.dateIso:
                            result = Sorters.dateIso(value1, value2, sortDirection);
                            break;
                        case FieldType.dateUs:
                            result = Sorters.dateUs(value1, value2, sortDirection);
                            break;
                        case FieldType.dateUsShort:
                            result = Sorters.dateUsShort(value1, value2, sortDirection);
                            break;
                        default:
                            result = Sorters.string(value1, value2, sortDirection);
                            break;
                    }
                    if (result !== 0) {
                        return result;
                    }
                }
                return 0;
            });
            grid.invalidate();
            grid.render();
        });
    }
    destroy() {
        if (this.subscriber && typeof this.subscriber.unsubscribe === 'function') {
            this.subscriber.unsubscribe();
        }
    }
    /**
     * A simple function that is attached to the subscriber and emit a change when the sort is called.
     * Other services, like Pagination, can then subscribe to it.
     * @param {string} sender
     */
    emitSortChangedBy(sender) {
        this.subscriber.subscribe(() => this.onSortChanged.publish('sortService:changed', `onSortChanged by ${sender}`));
    }
}
//# sourceMappingURL=sort.service.js.map