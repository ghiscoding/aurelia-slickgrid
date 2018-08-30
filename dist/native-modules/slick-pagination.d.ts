import { EventAggregator } from 'aurelia-event-aggregator';
import { GridOption } from './models/index';
import { FilterService } from './services/index';
export declare class SlickPaginationCustomElement {
    private elm;
    private ea;
    private filterService;
    private _filterSubscriber;
    private _sorterSubscriber;
    grid: any;
    gridPaginationOptions: GridOption;
    private _gridPaginationOptions;
    private _isFirstRender;
    dataFrom: number;
    dataTo: number;
    itemsPerPage: number;
    pageCount: number;
    pageNumber: number;
    totalItems: number;
    paginationCallback: () => void;
    paginationPageSizes: number[];
    constructor(elm: Element, ea: EventAggregator, filterService: FilterService);
    bind(binding: any, contexts: any): void;
    gridPaginationOptionsChanged(newGridOptions: GridOption): void;
    detached(): void;
    ceil(number: number): number;
    changeToFirstPage(event: any): void;
    changeToLastPage(event: any): void;
    changeToNextPage(event: any): void;
    changeToPreviousPage(event: any): void;
    changeToCurrentPage(event: any): void;
    dispose(): void;
    onChangeItemPerPage(event: any): void;
    refreshPagination(isPageNumberReset?: boolean): void;
    onPageChanged(event: Event | undefined, pageNumber: number): Promise<void>;
    recalculateFromToIndexes(): void;
}
