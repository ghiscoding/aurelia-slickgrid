import 'slickgrid/lib/jquery-ui-1.11.3';
import 'slickgrid/lib/jquery.event.drag-2.3.0';
import 'slickgrid/slick.core';
import 'slickgrid/slick.dataview';
import 'slickgrid/slick.grid';
import 'slickgrid/controls/slick.columnpicker';
import 'slickgrid/controls/slick.pager';
import 'slickgrid/plugins/slick.autotooltips';
import 'slickgrid/plugins/slick.cellcopymanager';
import 'slickgrid/plugins/slick.cellexternalcopymanager';
import 'slickgrid/plugins/slick.cellrangedecorator';
import 'slickgrid/plugins/slick.cellrangeselector';
import 'slickgrid/plugins/slick.cellselectionmodel';
import 'slickgrid/plugins/slick.checkboxselectcolumn';
import 'slickgrid/plugins/slick.headerbuttons';
import 'slickgrid/plugins/slick.headermenu';
import 'slickgrid/plugins/slick.rowmovemanager';
import 'slickgrid/plugins/slick.rowselectionmodel';
import { Column } from './models/column.interface';
import { GridOption } from './models/gridOption.interface';
import { FilterService } from './services/filter.service';
import { MouseService } from './services/mouse.service';
import { ResizerService } from './services/resizer.service';
import { SortService } from './services/sort.service';
export declare class AuSlickgridCustomElement {
    private elm;
    private resizer;
    private mouseService;
    private filterService;
    private sortService;
    private _domElm;
    private _dataset;
    private _dataView;
    private _gridOptions;
    private _columnFilters;
    grid: any;
    gridPaginationOptions: GridOption;
    gridHeightString: string;
    gridWidthString: string;
    showPagination: boolean;
    onFilter: any;
    style: any;
    element: Element;
    gridId: string;
    columnDefinitions: Column[];
    gridOptions: GridOption;
    gridHeight: number;
    gridWidth: number;
    pickerOptions: any;
    dataset: any[];
    constructor(elm: HTMLElement, resizer: ResizerService, mouseService: MouseService, filterService: FilterService, sortService: SortService);
    attached(): void;
    /**
     * Keep original value(s) that could be passed by the user ViewModel.
     * If nothing was passed, it will default to first option of select
     */
    bind(binding: any, contexts: any): void;
    unbind(binding: any, scope: any): void;
    datasetChanged(newValue: any[], oldValue: any[]): void;
    attachDifferentHooks(grid: any, options: GridOption, dataView: any): void;
    attachResizeHook(grid: any, options: GridOption): void;
    mergeGridOptions(): GridOption;
    /** Toggle the filter row displayed on first row */
    showHeaderRow(isShowing: boolean): boolean;
    /** Toggle the filter row displayed on first row */
    toggleHeaderRow(): boolean;
    refreshGridData(dataset: any[]): void;
}
