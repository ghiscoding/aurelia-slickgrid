import { BackendService } from './../models/index';
import {
  ExportService,
  ExtensionService,
  FilterService,
  GridService,
  GridEventService,
  GridStateService,
  GroupingAndColspanService,
  ResizerService,
  SortService
} from '../services/index';

export interface AureliaGridInstance {
  /** Slick DataView object */
  dataView: any;

  /** Slick Grid object */
  slickGrid: any;

  // --
  // Methods
  /** Dispose of the grid and optionally empty the DOM element grid container as well */
  dispose: (emptyDomElementContainer?: boolean) => void;

  // --
  // Services

  /** Backend Service, when available */
  backendService?: BackendService;

  /** Extension (Plugins & Controls) Service */
  extensionService: ExtensionService;

  /** @deprecated, use `extensionService` instead. Plugin and Control Service */
  pluginService: ExtensionService;

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
