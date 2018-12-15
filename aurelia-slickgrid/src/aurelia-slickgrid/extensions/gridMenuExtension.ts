import { singleton, inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { Constants } from '../constants';
import {
  CellArgs,
  Column,
  ColumnSort,
  DelimiterType,
  ExtensionName,
  Extension,
  FileType,
  GraphqlResult,
  GridMenu,
  GridMenuItem,
  GridOption,
  HeaderMenuOnCommandArgs,
} from '../models/index';
import { ExportService } from '../services/export.service';
import { ExtensionUtility } from './extensionUtility';
import { FilterService } from '../services/filter.service';
import { SortService } from '../services/sort.service';
import { SharedService } from '../services/shared.service';
import * as $ from 'jquery';

// using external non-typed js libraries
declare var Slick: any;

@singleton(true)
@inject(
  ExportService,
  ExtensionUtility,
  FilterService,
  I18N,
  SharedService,
  SortService,
)
export class GridMenuExtension implements Extension {
  private _eventHandler: any = new Slick.EventHandler();
  private _extension: any;
  areVisibleColumnDifferent = false;
  userOriginalGridMenu: GridMenu;

  constructor(
    private exportService: ExportService,
    private extensionUtility: ExtensionUtility,
    private filterService: FilterService,
    private i18n: I18N,
    private sharedService: SharedService,
    private sortService: SortService,
  ) { }

  dispose() {
    // unsubscribe all SlickGrid events
    this._eventHandler.unsubscribeAll();

    if (this._extension && this._extension.destroy) {
      this._extension.destroy();
    }
  }

  /** Create the Header Menu and expose all the available hooks that user can subscribe (onCommand, onBeforeMenuShow, ...) */
  register(): any {
    // keep original user grid menu, useful when switching locale to translate
    this.userOriginalGridMenu = { ...this.sharedService.gridOptions.gridMenu };

    if (this.sharedService.gridOptions && this.sharedService.gridOptions.gridMenu) {
      // dynamically import the SlickGrid plugin with requireJS
      this.extensionUtility.loadExtensionDynamically(ExtensionName.gridMenu);

      this.sharedService.gridOptions.gridMenu = { ...this.getDefaultGridMenuOptions(), ...this.sharedService.gridOptions.gridMenu };

      // merge original user grid menu items with internal items
      // then sort all Grid Menu Custom Items (sorted by pointer, no need to use the return)
      this.sharedService.gridOptions.gridMenu.customItems = [...this.userOriginalGridMenu.customItems || [], ...this.addGridMenuCustomCommands()];
      this.extensionUtility.translateItems(this.sharedService.gridOptions.gridMenu.customItems, 'titleKey', 'title');
      this.extensionUtility.sortItems(this.sharedService.gridOptions.gridMenu.customItems, 'positionOrder');

      this._extension = new Slick.Controls.GridMenu(this.sharedService.columnDefinitions, this.sharedService.grid, this.sharedService.gridOptions);

      // hook all events
      if (this.sharedService.grid && this.sharedService.gridOptions.gridMenu) {
        if (this.sharedService.gridOptions.gridMenu.onExtensionRegistered) {
          this.sharedService.gridOptions.gridMenu.onExtensionRegistered(this._extension);
        }
        this._eventHandler.subscribe(this._extension.onBeforeMenuShow, (e: any, args: CellArgs) => {
          if (this.sharedService.gridOptions.gridMenu && typeof this.sharedService.gridOptions.gridMenu.onBeforeMenuShow === 'function') {
            this.sharedService.gridOptions.gridMenu.onBeforeMenuShow(e, args);
          }
        });
        this._eventHandler.subscribe(this._extension.onColumnsChanged, (e: any, args: CellArgs) => {
          this.areVisibleColumnDifferent = true;
          if (this.sharedService.gridOptions.gridMenu && typeof this.sharedService.gridOptions.gridMenu.onColumnsChanged === 'function') {
            this.sharedService.gridOptions.gridMenu.onColumnsChanged(e, args);
          }
        });
        this._eventHandler.subscribe(this._extension.onCommand, (e: any, args: any) => {
          this.executeGridMenuInternalCustomCommands(e, args);
          if (this.sharedService.gridOptions.gridMenu && typeof this.sharedService.gridOptions.gridMenu.onCommand === 'function') {
            this.sharedService.gridOptions.gridMenu.onCommand(e, args);
          }
        });
        this._eventHandler.subscribe(this._extension.onMenuClose, (e: any, args: CellArgs) => {
          if (this.sharedService.gridOptions.gridMenu && typeof this.sharedService.gridOptions.gridMenu.onMenuClose === 'function') {
            this.sharedService.gridOptions.gridMenu.onMenuClose(e, args);
          }

          // we also want to resize the columns if the user decided to hide certain column(s)
          if (this.sharedService.grid && typeof this.sharedService.grid.autosizeColumns === 'function') {
            // make sure that the grid still exist (by looking if the Grid UID is found in the DOM tree)
            const gridUid = this.sharedService.grid.getUID();
            if (this.areVisibleColumnDifferent && gridUid && $(`.${gridUid}`).length > 0) {
              if (this.sharedService.gridOptions && this.sharedService.gridOptions.enableAutoSizeColumns) {
                this.sharedService.grid.autosizeColumns();
              }
              this.areVisibleColumnDifferent = false;
            }
          }
        });
      }
      return this._extension;
    }
    return null;
  }

  /**
   * Execute the Grid Menu Custom command callback that was triggered by the onCommand subscribe
   * These are the default internal custom commands
   * @param event
   * @param GridMenuItem args
   */
  executeGridMenuInternalCustomCommands(e: Event, args: GridMenuItem) {
    if (args && args.command) {
      switch (args.command) {
        case 'clear-filter':
          this.filterService.clearFilters();
          this.sharedService.dataView.refresh();
          break;
        case 'clear-sorting':
          this.sortService.clearSorting();
          this.sharedService.dataView.refresh();
          break;
        case 'export-csv':
          this.exportService.exportToFile({
            delimiter: DelimiterType.comma,
            filename: 'export',
            format: FileType.csv,
            useUtf8WithBom: true
          });
          break;
        case 'export-text-delimited':
          this.exportService.exportToFile({
            delimiter: DelimiterType.tab,
            filename: 'export',
            format: FileType.txt,
            useUtf8WithBom: true
          });
          break;
        case 'toggle-filter':
          this.sharedService.grid.setHeaderRowVisibility(!this.sharedService.grid.getOptions().showHeaderRow);
          break;
        case 'toggle-toppanel':
          this.sharedService.grid.setTopPanelVisibility(!this.sharedService.grid.getOptions().showTopPanel);
          break;
        case 'toggle-preheader':
          this.sharedService.grid.setPreHeaderPanelVisibility(!this.sharedService.grid.getOptions().showPreHeaderPanel);
          break;
        case 'refresh-dataset':
          this.refreshBackendDataset();
          break;
        default:
          break;
      }
    }
  }

  /** Refresh the dataset through the Backend Service */
  refreshBackendDataset(gridOptions?: GridOption) {
    let query = '';

    // user can pass new set of grid options which will override current ones
    if (gridOptions) {
      this.sharedService.gridOptions = { ...this.sharedService.gridOptions, ...gridOptions };
    }

    const backendApi = this.sharedService.gridOptions.backendServiceApi;
    if (!backendApi || !backendApi.service || !backendApi.process) {
      throw new Error(`BackendServiceApi requires at least a "process" function and a "service" defined`);
    }

    if (backendApi.service) {
      query = backendApi.service.buildQuery();
    }

    if (query && query !== '') {
      // keep start time & end timestamps & return it after process execution
      const startTime = new Date();

      if (backendApi.preProcess) {
        backendApi.preProcess();
      }

      // the process could be an Observable (like HttpClient) or a Promise
      // in any case, we need to have a Promise so that we can await on it (if an Observable, convert it to Promise)
      const processPromise = backendApi.process(query);

      processPromise.then((processResult: GraphqlResult | any) => {
        const endTime = new Date();

        // from the result, call our internal post process to update the Dataset and Pagination info
        if (processResult && backendApi && backendApi.internalPostProcess) {
          backendApi.internalPostProcess(processResult);
        }

        // send the response process to the postProcess callback
        if (backendApi && backendApi.postProcess) {
          if (processResult instanceof Object) {
            processResult.statistics = {
              startTime,
              endTime,
              executionTime: endTime.valueOf() - startTime.valueOf(),
              totalItemCount: this.sharedService.gridOptions && this.sharedService.gridOptions.pagination && this.sharedService.gridOptions.pagination.totalItems
            };
          }
          backendApi.postProcess(processResult);
        }
      });
    }
  }

  /** Create Grid Menu with Custom Commands if user has enabled Filters and/or uses a Backend Service (OData, GraphQL) */
  private addGridMenuCustomCommands() {
    const backendApi = this.sharedService.gridOptions.backendServiceApi || null;
    const gridMenuCustomItems: GridMenuItem[] = [];

    if (this.sharedService.gridOptions && this.sharedService.gridOptions.enableFiltering) {
      // show grid menu: clear all filters
      if (this.sharedService.gridOptions && this.sharedService.gridOptions.gridMenu && !this.sharedService.gridOptions.gridMenu.hideClearAllFiltersCommand) {
        gridMenuCustomItems.push(
          {
            iconCssClass: this.sharedService.gridOptions.gridMenu.iconClearAllFiltersCommand || 'fa fa-filter text-danger',
            title: this.sharedService.gridOptions.enableTranslate ? this.i18n.tr('CLEAR_ALL_FILTERS') : Constants.TEXT_CLEAR_ALL_FILTERS,
            disabled: false,
            command: 'clear-filter',
            positionOrder: 50
          }
        );
      }

      // show grid menu: toggle filter row
      if (this.sharedService.gridOptions && this.sharedService.gridOptions.gridMenu && !this.sharedService.gridOptions.gridMenu.hideToggleFilterCommand) {
        gridMenuCustomItems.push(
          {
            iconCssClass: this.sharedService.gridOptions.gridMenu.iconToggleFilterCommand || 'fa fa-random',
            title: this.sharedService.gridOptions.enableTranslate ? this.i18n.tr('TOGGLE_FILTER_ROW') : Constants.TEXT_TOGGLE_FILTER_ROW,
            disabled: false,
            command: 'toggle-filter',
            positionOrder: 52
          }
        );
      }

      // show grid menu: refresh dataset
      if (this.sharedService.gridOptions && this.sharedService.gridOptions.gridMenu && !this.sharedService.gridOptions.gridMenu.hideRefreshDatasetCommand && backendApi) {
        gridMenuCustomItems.push(
          {
            iconCssClass: this.sharedService.gridOptions.gridMenu.iconRefreshDatasetCommand || 'fa fa-refresh',
            title: this.sharedService.gridOptions.enableTranslate ? this.i18n.tr('REFRESH_DATASET') : Constants.TEXT_REFRESH_DATASET,
            disabled: false,
            command: 'refresh-dataset',
            positionOrder: 54
          }
        );
      }
    }

    if (this.sharedService.gridOptions.showPreHeaderPanel) {
      // show grid menu: toggle pre-header row
      if (this.sharedService.gridOptions && this.sharedService.gridOptions.gridMenu && !this.sharedService.gridOptions.gridMenu.hideTogglePreHeaderCommand) {
        gridMenuCustomItems.push(
          {
            iconCssClass: this.sharedService.gridOptions.gridMenu.iconTogglePreHeaderCommand || 'fa fa-random',
            title: this.sharedService.gridOptions.enableTranslate ? this.i18n.tr('TOGGLE_PRE_HEADER_ROW') : Constants.TEXT_TOGGLE_PRE_HEADER_ROW,
            disabled: false,
            command: 'toggle-preheader',
            positionOrder: 52
          }
        );
      }
    }

    if (this.sharedService.gridOptions.enableSorting) {
      // show grid menu: clear all sorting
      if (this.sharedService.gridOptions && this.sharedService.gridOptions.gridMenu && !this.sharedService.gridOptions.gridMenu.hideClearAllSortingCommand) {
        gridMenuCustomItems.push(
          {
            iconCssClass: this.sharedService.gridOptions.gridMenu.iconClearAllSortingCommand || 'fa fa-unsorted text-danger',
            title: this.sharedService.gridOptions.enableTranslate ? this.i18n.tr('CLEAR_ALL_SORTING') : Constants.TEXT_CLEAR_ALL_SORTING,
            disabled: false,
            command: 'clear-sorting',
            positionOrder: 51
          }
        );
      }
    }

    // show grid menu: export to file
    if (this.sharedService.gridOptions && this.sharedService.gridOptions.enableExport && this.sharedService.gridOptions.gridMenu && !this.sharedService.gridOptions.gridMenu.hideExportCsvCommand) {
      gridMenuCustomItems.push(
        {
          iconCssClass: this.sharedService.gridOptions.gridMenu.iconExportCsvCommand || 'fa fa-download',
          title: this.sharedService.gridOptions.enableTranslate ? this.i18n.tr('EXPORT_TO_CSV') : Constants.TEXT_EXPORT_IN_CSV_FORMAT,
          disabled: false,
          command: 'export-csv',
          positionOrder: 53
        }
      );
    }
    // show grid menu: export to text file as tab delimited
    if (this.sharedService.gridOptions && this.sharedService.gridOptions.enableExport && this.sharedService.gridOptions.gridMenu && !this.sharedService.gridOptions.gridMenu.hideExportTextDelimitedCommand) {
      gridMenuCustomItems.push(
        {
          iconCssClass: this.sharedService.gridOptions.gridMenu.iconExportTextDelimitedCommand || 'fa fa-download',
          title: this.sharedService.gridOptions.enableTranslate ? this.i18n.tr('EXPORT_TO_TAB_DELIMITED') : Constants.TEXT_EXPORT_IN_TEXT_FORMAT,
          disabled: false,
          command: 'export-text-delimited',
          positionOrder: 54
        }
      );
    }

    // add the custom "Commands" title if there are any commands
    if (this.sharedService.gridOptions && this.sharedService.gridOptions.gridMenu && (gridMenuCustomItems.length > 0 || (this.sharedService.gridOptions.gridMenu.customItems && this.sharedService.gridOptions.gridMenu.customItems.length > 0))) {
      this.sharedService.gridOptions.gridMenu.customTitle = this.sharedService.gridOptions.gridMenu.customTitle || this.extensionUtility.getPickerTitleOutputString('customTitle', 'gridMenu');
    }

    return gridMenuCustomItems;
  }

  /** Execute the Header Menu Commands that was triggered by the onCommand subscribe */
  executeHeaderMenuInternalCommands(e: Event, args: HeaderMenuOnCommandArgs) {
    if (args && args.command) {
      switch (args.command) {
        case 'hide':
          this.hideColumn(args.column);
          if (this.sharedService.gridOptions && this.sharedService.gridOptions.enableAutoSizeColumns) {
            this.sharedService.grid.autosizeColumns();
          }
          break;
        case 'sort-asc':
        case 'sort-desc':
          // get previously sorted columns
          const cols: ColumnSort[] = this.sortService.getPreviousColumnSorts(args.column.id + '');

          // add to the column array, the column sorted by the header menu
          cols.push({ sortCol: args.column, sortAsc: (args.command === 'sort-asc') });
          if (this.sharedService.gridOptions.backendServiceApi) {
            this.sortService.onBackendSortChanged(e, { multiColumnSort: true, sortCols: cols, grid: this.sharedService.grid });
          } else {
            this.sortService.onLocalSortChanged(this.sharedService.grid, this.sharedService.dataView, cols);
          }

          // update the this.sharedService.gridObj sortColumns array which will at the same add the visual sort icon(s) on the UI
          const newSortColumns: ColumnSort[] = cols.map((col) => {
            return {
              columnId: col && col.sortCol && col.sortCol.id,
              sortAsc: col && col.sortAsc
            };
          });
          this.sharedService.grid.setSortColumns(newSortColumns); // add sort icon in UI
          break;
        default:
          break;
      }
    }
  }

  /** Hide a column from the grid */
  hideColumn(column: Column) {
    if (this.sharedService.grid && this.sharedService.grid.getColumns && this.sharedService.grid.setColumns) {
      const columnIndex = this.sharedService.grid.getColumnIndex(column.id);
      this.sharedService.visibleColumns = this.extensionUtility.arrayRemoveItemByIndex(this.sharedService.grid.getColumns(), columnIndex);
      this.sharedService.grid.setColumns(this.sharedService.visibleColumns);
    }
  }

  /** Translate the Grid Menu titles and column picker */
  translateGridMenu() {
    // update the properties by pointers, that is the only way to get Grid Menu Control to see the new values
    // we also need to call the control init so that it takes the new Grid object with latest values
    if (this.sharedService.gridOptions && this.sharedService.gridOptions.gridMenu) {
      this.sharedService.gridOptions.gridMenu.customItems = [];
      this.emptyGridMenuTitles();

      // merge original user grid menu items with internal items
      // then sort all Grid Menu Custom Items (sorted by pointer, no need to use the return)
      this.sharedService.gridOptions.gridMenu.customItems = [...this.userOriginalGridMenu.customItems || [], ...this.addGridMenuCustomCommands()];
      this.extensionUtility.translateItems(this.sharedService.gridOptions.gridMenu.customItems, 'titleKey', 'title');
      this.extensionUtility.sortItems(this.sharedService.gridOptions.gridMenu.customItems, 'positionOrder');

      this.sharedService.gridOptions.gridMenu.columnTitle = this.extensionUtility.getPickerTitleOutputString('columnTitle', 'gridMenu');
      this.sharedService.gridOptions.gridMenu.forceFitTitle = this.extensionUtility.getPickerTitleOutputString('forceFitTitle', 'gridMenu');
      this.sharedService.gridOptions.gridMenu.syncResizeTitle = this.extensionUtility.getPickerTitleOutputString('syncResizeTitle', 'gridMenu');

      // translate all columns (including non-visible)
      this.extensionUtility.translateItems(this.sharedService.allColumns, 'headerKey', 'name');

      // re-initialize the Grid Menu, that will recreate all the menus & list
      // doing an "init()" won't drop any existing command attached
      if (this._extension.init) {
        this._extension.init(this.sharedService.grid);
      }
    }
  }

  private emptyGridMenuTitles() {
    if (this.sharedService && this.sharedService.gridOptions && this.sharedService.gridOptions.gridMenu) {
      this.sharedService.gridOptions.gridMenu.customTitle = '';
      this.sharedService.gridOptions.gridMenu.columnTitle = '';
      this.sharedService.gridOptions.gridMenu.forceFitTitle = '';
      this.sharedService.gridOptions.gridMenu.syncResizeTitle = '';
    }
  }

  /**
   * @return default Grid Menu options
   */
  private getDefaultGridMenuOptions(): GridMenu {
    return {
      customTitle: undefined,
      columnTitle: this.extensionUtility.getPickerTitleOutputString('columnTitle', 'gridMenu'),
      forceFitTitle: this.extensionUtility.getPickerTitleOutputString('forceFitTitle', 'gridMenu'),
      syncResizeTitle: this.extensionUtility.getPickerTitleOutputString('syncResizeTitle', 'gridMenu'),
      iconCssClass: 'fa fa-bars',
      menuWidth: 18,
      customItems: [],
      hideClearAllFiltersCommand: false,
      hideRefreshDatasetCommand: false,
      hideToggleFilterCommand: false,
    };
  }
}
