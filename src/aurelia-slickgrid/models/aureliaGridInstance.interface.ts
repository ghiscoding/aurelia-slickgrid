import {
  BackendService,
  ExtensionService,
  FilterService,
  GridEventService,
  GridService,
  GridStateService,
  GroupingAndColspanService,
  PaginationService,
  SortService,
  TreeDataService
} from '@slickgrid-universal/common';

import { ResizerService, } from '../services/index';

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

  /** Pagination Service (allows you to programmatically go to first/last page, etc...) */
  paginationService?: PaginationService;

  /** Resizer Service (including auto-resize) */
  resizerService: ResizerService;

  /** Sort Service */
  sortService: SortService;

  /** Tree Data View Service */
  treeDataService: TreeDataService;
}
