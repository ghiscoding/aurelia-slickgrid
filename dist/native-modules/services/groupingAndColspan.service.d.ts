import { EventAggregator } from 'aurelia-event-aggregator';
export declare class GroupingAndColspanService {
    private ea;
    private _eventHandler;
    private _dataView;
    private _grid;
    aureliaEventPrefix: string;
    constructor(ea: EventAggregator);
    /** Getter for the Grid Options pulled through the Grid Object */
    private readonly _gridOptions;
    /** Getter for the Column Definitions pulled through the Grid Object */
    private readonly _columnDefinitions;
    /**
     * Initialize the Service
     * @param grid
     * @param dataView
     */
    init(grid: any, dataView: any): void;
    dispose(): void;
    createPreHeaderRowGroupingTitle(): void;
}
