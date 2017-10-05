import { EventAggregator } from 'aurelia-event-aggregator';
import { GridOption } from './../models/gridOption.interface';
export declare class ResizerService {
    private ea;
    constructor(ea: EventAggregator);
    /** Attach an auto resize trigger on the datagrid, if that is enable then it will resize itself to the available space
     * Options: we could also provide a % factor to resize on each height/width independently
     */
    attachAutoResizeDataGrid(grid: any, gridOptions: GridOption): void;
    /**
     * Calculate the datagrid new height/width from the available space, also consider that a % factor might be applied to calculation
     * object gridOptions
     */
    calculateGridNewDimensions(gridOptions: GridOption): {
        height: number;
        width: any;
    } | undefined;
    /** Resize the datagrid to fit the browser height & width */
    resizeGrid(grid: any, gridOptions: GridOption, newSizes?: {
        height: number;
        width: number;
    }): void;
}
