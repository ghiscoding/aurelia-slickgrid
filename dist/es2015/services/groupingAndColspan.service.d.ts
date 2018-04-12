import { EventAggregator } from 'aurelia-event-aggregator';
export declare class GroupingAndColspanService {
    private ea;
    private _eventHandler;
    private _dataView;
    private _grid;
    private _gridOptions;
    private _columnDefinitions;
    aureliaEventPrefix: string;
    constructor(ea: EventAggregator);
    init(grid: any, dataView: any): void;
    dispose(): void;
    createPreHeaderRowGroupingTitle(): void;
}
