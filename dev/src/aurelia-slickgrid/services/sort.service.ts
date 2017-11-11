import { BackendServiceOption, FieldType, GridOption, Sorter } from './../models/index';
import { Sorters } from './../sorters/index';

export class SortService {
  subscriber: any;

  /**
   * Attach a backend sort (single/multi) hook to the grid
   * @param grid SlickGrid Grid object
   * @param gridOptions Grid Options object
   */
  attachBackendOnSort(grid: any, gridOptions: GridOption) {
    this.subscriber = grid.onSort;
    this.subscriber.subscribe(this.attachBackendOnSortSubscribe);
  }

  async attachBackendOnSortSubscribe(event: Event, args: any) {
    if (!args || !args.grid) {
      throw new Error('Something went wrong when trying to attach the "attachBackendOnSortSubscribe(event, args)" function, it seems that "args" is not populated correctly');
    }
    const serviceOptions: BackendServiceOption = args.grid.getOptions();

    if (serviceOptions === undefined || serviceOptions.onBackendEventApi === undefined || serviceOptions.onBackendEventApi.process === undefined || !serviceOptions.onBackendEventApi.service === undefined) {
      throw new Error(`onBackendEventApi requires at least a "process" function and a "service" defined`);
    }
    if (serviceOptions.onBackendEventApi !== undefined && serviceOptions.onBackendEventApi.preProcess) {
      serviceOptions.onBackendEventApi.preProcess();
    }
    const query = serviceOptions.onBackendEventApi.service.onSortChanged(event, args);

    // await for the Promise to resolve the data
    const responseProcess = await serviceOptions.onBackendEventApi.process(query);

    // send the response process to the postProcess callback
    if (serviceOptions.onBackendEventApi.postProcess) {
      serviceOptions.onBackendEventApi.postProcess(responseProcess);
    }
  }

  /**
   * Attach a local sort (single/multi) hook to the grid
   * @param grid SlickGrid Grid object
   * @param gridOptions Grid Options object
   * @param dataView
   */
  attachLocalOnSort(grid: any, gridOptions: GridOption, dataView: any) {
    this.subscriber = grid.onSort;
    this.subscriber.subscribe((e: any, args: any) => {
      // multiSort and singleSort are not exactly the same, but we want to structure it the same for the (for loop) after
      // also to avoid having to rewrite the for loop in the sort, we will make the singleSort an array of 1 object
      const sortColumns = (args.multiColumnSort) ? args.sortCols : new Array({ sortAsc: args.sortAsc, sortCol: args.sortCol });

      dataView.sort((dataRow1: any, dataRow2: any) => {
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
    this.subscriber.unsubscribe();
  }
}
