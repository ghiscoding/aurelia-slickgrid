import { Column } from './../models/column.interface';
import { GridOption } from './../models/gridOption.interface';
export declare class FilterService {
    private _columnDefinitions;
    private _columnFilters;
    private _dataView;
    private _grid;
    private _gridOptions;
    private subscriber;
    init(grid: any, gridOptions: GridOption, columnDefinitions: Column[], columnFilters: any): void;
    /**
     * Attach a backend filter hook to the grid
     * @param grid SlickGrid Grid object
     * @param gridOptions Grid Options object
     */
    attachBackendOnFilter(): void;
    testFilterCondition(operator: string, value1: any, value2: any): boolean;
    /**
     * Attach a local filter hook to the grid
     * @param grid SlickGrid Grid object
     * @param gridOptions Grid Options object
     * @param dataView
     */
    attachLocalOnFilter(dataView: any): void;
    customFilter(item: any, args: any): boolean;
    destroy(): void;
    callbackSearchEvent(e: any, args: any): void;
    addFilterTemplateToHeaderRow(): void;
    private keepColumnFilters(searchTerm, listTerm, columnDef);
    private triggerEvent(evt, args, e);
}
