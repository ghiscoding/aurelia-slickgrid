import { BackendService } from './../models';
import { ControlAndPluginService, ExportService, FilterService, GridService, GridEventService, GridStateService, GroupingAndColspanService, ResizerService, SortService } from '../services';
export interface AureliaGridInstance {
    /** Slick DataView object */
    dataView: any;
    /** Slick Grid object */
    slickGrid: any;
    /** Dispose of the grid and optionally empty the DOM element grid container as well */
    dispose: (emptyDomElementContainer?: boolean) => void;
    /** Backend Service, when available */
    backendService?: BackendService;
    /** Plugin (and Control) Service */
    pluginService: ControlAndPluginService;
    /** Export Service */
    exportService: ExportService;
    /** Filter Service */
    filterService: FilterService;
    /** Grid Service (grid extra functionalities) */
    gridService: GridService;
    /** Grid Events Service */
    gridEventService: GridEventService;
    /** Grid State Service */
    gridStateService: GridStateService;
    /** Grouping (and colspan) Service */
    groupingService: GroupingAndColspanService;
    /** Resizer Service (including auto-resize) */
    resizerService: ResizerService;
    /** Sort Service */
    sortService: SortService;
}
