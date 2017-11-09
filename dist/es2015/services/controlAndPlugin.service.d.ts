import { EventAggregator } from 'aurelia-event-aggregator';
import { Column, GridOption } from './../models/index';
import { FilterService } from './filter.service';
export declare class ControlAndPluginService {
    _dataView: any;
    _grid: any;
    _visibleColumns: Column[];
    ea: EventAggregator;
    filterService: FilterService;
    autoTooltipPlugin: any;
    columnPickerControl: any;
    headerButtonsPlugin: any;
    headerMenuPlugin: any;
    gridMenuControl: any;
    rowSelectionPlugin: any;
    constructor(ea: EventAggregator, filterService: FilterService);
    attachDifferentControlOrPlugins(grid: any, columnDefinitions: Column[], options: GridOption, dataView: any): void;
    hideColumn(column: Column): void;
    removeColumnByIndex(array: any[], index: number): any[];
    autoResizeColumns(): void;
    private addGridMenuCustomCommands(options);
    private prepareGridMenu(options);
}
