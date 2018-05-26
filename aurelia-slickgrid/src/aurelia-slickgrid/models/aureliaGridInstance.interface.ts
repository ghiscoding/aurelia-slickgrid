import { BackendService } from './../models';
import {
  ControlAndPluginService,
  ExportService,
  FilterService,
  GridExtraService,
  GridEventService,
  GridStateService,
  GroupingAndColspanService,
  ResizerService,
  SortService
} from '../services';

export interface AureliaGridInstance {
  backendService?: BackendService;
  pluginService: ControlAndPluginService;
  exportService: ExportService;
  filterService: FilterService;
  gridService: GridExtraService;
  gridEventService: GridEventService;
  gridStateService: GridStateService;
  groupingService: GroupingAndColspanService;
  resizerService: ResizerService;
  sortService: SortService;
}
