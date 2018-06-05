import { singleton, inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import {
  CellArgs,
  Column,
  ColumnSort,
  CustomGridMenu,
  DelimiterType,
  Extension,
  FileType,
  GraphqlResult,
  GridMenu,
  GridOption,
  HeaderButtonOnCommandArgs,
  HeaderMenu,
  HeaderMenuItem,
  HeaderMenuOnCommandArgs,
  HeaderMenuOnBeforeMenuShowArgs,
} from './../models/index';
import { ExportService } from './export.service';
import { FilterService } from './filter.service';
import { SortService } from './sort.service';
import { sanitizeHtmlToText } from './../services/utilities';
import * as $ from 'jquery';

// using external non-typed js libraries
declare var Slick: any;

@singleton(true)
@inject(ExportService, FilterService, I18N, SortService)
export class ControlAndPluginService {
  private _dataView: any;
  private _grid: any;
  allColumns: Column[];
  visibleColumns: Column[];
  areVisibleColumnDifferent = false;
  extensionList: Extension[] = [];

  // controls & plugins
  autoTooltipPlugin: any;
  cellExternalCopyManagerPlugin: any;
  checkboxSelectorPlugin: any;
  columnPickerControl: any;
  headerButtonsPlugin: any;
  headerMenuPlugin: any;
  gridMenuControl: any;
  groupItemMetaProviderPlugin: any;
  rowSelectionPlugin: any;
  undoRedoBuffer: any;

  constructor(
    private exportService: ExportService,
    private filterService: FilterService,
    private i18n: I18N,
    private sortService: SortService
  ) { }

  /** Getter for the Grid Options pulled through the Grid Object */
  private get _gridOptions(): GridOption {
    return (this._grid && this._grid.getOptions) ? this._grid.getOptions() : {};
  }

  /** Getter for the Column Definitions pulled through the Grid Object */
  private get _columnDefinitions(): Column[] {
    return (this._grid && this._grid.getColumns) ? this._grid.getColumns() : [];
  }

  /** Auto-resize all the column in the grid to fit the grid width */
  autoResizeColumns() {
    this._grid.autosizeColumns();
  }

  /** Get all columns (includes visible and non-visible) */
  getAllColumns(): Column[] {
    return this.allColumns || [];
  }

  /** Get only visible columns */
  getVisibleColumns(): Column[] {
    return this.visibleColumns || [];
  }

  /** Get all Extensions */
  getAllExtensions(): Extension[] {
    return this.extensionList;
  }

  /**
   * Get an Extension by it's name
   *  @param name
   */
  getExtensionByName(name: string): Extension | undefined {
    return this.extensionList.find((p) => p.name === name);
  }

  /**
   * Attach/Create different Controls or Plugins after the Grid is created
   * @param grid
   * @param dataView
   * @param groupItemMetadataProvider
   */
  attachDifferentControlOrPlugins(grid: any, dataView: any, groupItemMetadataProvider: any) {
    this._grid = grid;
    this._dataView = dataView;
    this.allColumns = this._columnDefinitions;
    this.visibleColumns = this._columnDefinitions;

    // make sure all columns are translated before creating ColumnPicker/GridMenu Controls
    // this is to avoid having hidden columns not being translated on first load
    if (this._gridOptions.enableTranslate) {
      for (const column of this.allColumns) {
        if (column.headerKey) {
          column.name = this.i18n.tr(column.headerKey);
        }
      }
    }

    // Column Picker Control
    if (this._gridOptions.enableColumnPicker) {
      this.columnPickerControl = this.createColumnPicker(grid, this._columnDefinitions);
      this.extensionList.push({ name: 'ColumnPicker', service: this.columnPickerControl });
    }

    // Grid Menu Control
    if (this._gridOptions.enableGridMenu) {
      this.gridMenuControl = this.createGridMenu(grid, this._columnDefinitions);
      this.extensionList.push({ name: 'GridMenu', service: this.gridMenuControl });
    }

    // Auto Tooltip Plugin
    if (this._gridOptions.enableAutoTooltip) {
      this.autoTooltipPlugin = new Slick.AutoTooltips(this._gridOptions.autoTooltipOptions || {});
      grid.registerPlugin(this.autoTooltipPlugin);
      this.extensionList.push({ name: 'AutoTooltip', service: this.autoTooltipPlugin });
    }

    // Grouping Plugin
    // register the group item metadata provider to add expand/collapse group handlers
    if (this._gridOptions.enableGrouping) {
      this.groupItemMetaProviderPlugin = groupItemMetadataProvider || {};
      this._grid.registerPlugin(this.groupItemMetaProviderPlugin);
      this.extensionList.push({ name: 'GroupItemMetaProvider', service: this.groupItemMetaProviderPlugin });
    }

    // Checkbox Selector Plugin
    if (this._gridOptions.enableCheckboxSelector) {
      // when enabling the Checkbox Selector Plugin, we need to also watch onClick events to perform certain actions
      // the selector column has to be created BEFORE the grid (else it behaves oddly), but we can only watch grid events AFTER the grid is created
      grid.registerPlugin(this.checkboxSelectorPlugin);
      this.extensionList.push({ name: 'CheckboxSelector', service: this.checkboxSelectorPlugin });

      // this also requires the Row Selection Model to be registered as well
      if (!this.rowSelectionPlugin || !grid.getSelectionModel()) {
        this.rowSelectionPlugin = new Slick.RowSelectionModel(this._gridOptions.rowSelectionOptions || {});
        grid.setSelectionModel(this.rowSelectionPlugin);
      }

      // user might want to pre-select some rows
      // the setTimeout is because of timing issue with styling (row selection happen but rows aren't highlighted properly)
      if (this._gridOptions.preselectedRows && this.rowSelectionPlugin && grid.getSelectionModel()) {
        setTimeout(() => this.checkboxSelectorPlugin.selectRows(this._gridOptions.preselectedRows), 0);
      }
    }

    // Row Selection Plugin
    if (!this._gridOptions.enableCheckboxSelector && this._gridOptions.enableRowSelection) {
      this.rowSelectionPlugin = new Slick.RowSelectionModel(this._gridOptions.rowSelectionOptions || {});
      grid.setSelectionModel(this.rowSelectionPlugin);
    }

    // Header Button Plugin
    if (this._gridOptions.enableHeaderButton) {
      this.headerButtonsPlugin = new Slick.Plugins.HeaderButtons(this._gridOptions.headerButton || {});
      grid.registerPlugin(this.headerButtonsPlugin);
      this.extensionList.push({ name: 'HeaderButtons', service: this.headerButtonsPlugin });

      this.headerButtonsPlugin.onCommand.subscribe((e: Event, args: HeaderButtonOnCommandArgs) => {
        if (this._gridOptions.headerButton && typeof this._gridOptions.headerButton.onCommand === 'function') {
          this._gridOptions.headerButton.onCommand(e, args);
        }
      });
    }

    // Header Menu Plugin
    if (this._gridOptions.enableHeaderMenu) {
      this.headerMenuPlugin = this.createHeaderMenu(this._grid, this._dataView, this._columnDefinitions);
    }

    // Cell External Copy Manager Plugin (Excel Like)
    if (this._gridOptions.enableExcelCopyBuffer) {
      this.createUndoRedoBuffer();
      this.hookUndoShortcutKey();
      this.createCellExternalCopyManagerPlugin(this._grid);
    }

    // manually register other plugins
    if (this._gridOptions.registerPlugins !== undefined) {
      if (Array.isArray(this._gridOptions.registerPlugins)) {
        this._gridOptions.registerPlugins.forEach((plugin) => {
          grid.registerPlugin(plugin);
          this.extensionList.push({ name: 'generic', service: plugin });
        });
      } else {
        grid.registerPlugin(this._gridOptions.registerPlugins);
        this.extensionList.push({ name: 'generic', service: this._gridOptions.registerPlugins });
      }
    }
  }

  /**
   * Attach/Create different plugins before the Grid creation.
   * For example the multi-select have to be added to the column definition before the grid is created to work properly
   * @param columnDefinitions
   * @param options
   */
  createPluginBeforeGridCreation(columnDefinitions: Column[], options: GridOption) {
    if (options.enableCheckboxSelector) {
      this.checkboxSelectorPlugin = new Slick.CheckboxSelectColumn(options.checkboxSelector || {});
      const selectionColumn: Column = this.checkboxSelectorPlugin.getColumnDefinition();
      selectionColumn.excludeFromExport = true;
      selectionColumn.excludeFromQuery = true;
      selectionColumn.excludeFromHeaderMenu = true;
      columnDefinitions.unshift(selectionColumn);
    }
  }

  /** Create the Excel like copy manager */
  createCellExternalCopyManagerPlugin(grid: any) {
    let newRowIds = 0;
    const pluginOptions = {
      clipboardCommandHandler: (editCommand: any) => {
        this.undoRedoBuffer.queueAndExecuteCommand.call(this.undoRedoBuffer, editCommand);
      },
      dataItemColumnValueExtractor: (item: any, columnDef: Column) => {
        // when grid or cell is not editable, we will possibly evaluate the Formatter if it was passed
        // to decide if we evaluate the Formatter, we will use the same flag from Export which is "exportWithFormatter"
        if (this._gridOptions && (!this._gridOptions.editable || !columnDef.editor)) {
          const exportOptionWithFormatter = (this._gridOptions && this._gridOptions.exportOptions) ? this._gridOptions.exportOptions.exportWithFormatter : false;
          const isEvaluatingFormatter = (columnDef.exportWithFormatter !== undefined) ? columnDef.exportWithFormatter : exportOptionWithFormatter;
          if (columnDef.formatter && isEvaluatingFormatter) {
            const formattedOutput = columnDef.formatter(0, 0, item[columnDef.field], columnDef, item, this._grid);
            if (columnDef.sanitizeDataExport || (this._gridOptions.exportOptions && this._gridOptions.exportOptions.sanitizeDataExport)) {
              return sanitizeHtmlToText(formattedOutput);
            }
            return formattedOutput;
          }
        }

        // else use the default "dataItemColumnValueExtractor" from the plugin itself
        // we can do that by setting back the getter with null
        return null;
      },
      readOnlyMode: false,
      includeHeaderWhenCopying: false,
      newRowCreator: (count: number) => {
        for (let i = 0; i < count; i++) {
          const item = {
            id: 'newRow_' + newRowIds++
          };
          grid.getData().addItem(item);
        }
      }
    };

    grid.setSelectionModel(new Slick.CellSelectionModel());
    this.cellExternalCopyManagerPlugin = new Slick.CellExternalCopyManager(pluginOptions);
    grid.registerPlugin(this.cellExternalCopyManagerPlugin);
    this.extensionList.push({ name: 'CellExternalCopyManager', service: this.cellExternalCopyManagerPlugin });
  }

  /**
   * Create the Column Picker and expose all the available hooks that user can subscribe (onColumnsChanged)
   * @param grid
   * @param columnDefinitions
   */
  createColumnPicker(grid: any, columnDefinitions: Column[]) {
    // localization support for the picker
    const forceFitTitle = this._gridOptions.enableTranslate ? this.getDefaultTranslationByKey('forcefit') : 'Force fit columns';
    const syncResizeTitle = this._gridOptions.enableTranslate ? this.getDefaultTranslationByKey('synch') : 'Synchronous resize';

    this._gridOptions.columnPicker = this._gridOptions.columnPicker || {};
    this._gridOptions.columnPicker.forceFitTitle = this._gridOptions.columnPicker.forceFitTitle || forceFitTitle;
    this._gridOptions.columnPicker.syncResizeTitle = this._gridOptions.columnPicker.syncResizeTitle || syncResizeTitle;

    this.columnPickerControl = new Slick.Controls.ColumnPicker(columnDefinitions, grid, this._gridOptions);
    if (grid && this._gridOptions.enableColumnPicker) {
      this.columnPickerControl.onColumnsChanged.subscribe((e: Event, args: CellArgs) => {
        if (this._gridOptions.columnPicker && typeof this._gridOptions.columnPicker.onColumnsChanged === 'function') {
          this._gridOptions.columnPicker.onColumnsChanged(e, args);
        }
      });
    }

    return this.columnPickerControl;
  }

  /**
   * Create (or re-create) Grid Menu and expose all the available hooks that user can subscribe (onCommand, onMenuClose, ...)
   * @param grid
   * @param columnDefinitions
   */
  createGridMenu(grid: any, columnDefinitions: Column[]) {
    this._gridOptions.gridMenu = { ...this.getDefaultGridMenuOptions(), ...this._gridOptions.gridMenu };
    this.addGridMenuCustomCommands(grid);

    const gridMenuControl = new Slick.Controls.GridMenu(columnDefinitions, grid, this._gridOptions);
    if (grid && this._gridOptions.gridMenu) {
      gridMenuControl.onBeforeMenuShow.subscribe((e: Event, args: CellArgs) => {
        if (this._gridOptions.gridMenu && typeof this._gridOptions.gridMenu.onBeforeMenuShow === 'function') {
          this._gridOptions.gridMenu.onBeforeMenuShow(e, args);
        }
      });
      gridMenuControl.onColumnsChanged.subscribe((e: Event, args: CellArgs) => {
        this.areVisibleColumnDifferent = true;
        if (this._gridOptions.gridMenu && typeof this._gridOptions.gridMenu.onColumnsChanged === 'function') {
          this._gridOptions.gridMenu.onColumnsChanged(e, args);
        }
      });
      gridMenuControl.onCommand.subscribe((e: Event, args: CellArgs) => {
        if (this._gridOptions.gridMenu && typeof this._gridOptions.gridMenu.onCommand === 'function') {
          this._gridOptions.gridMenu.onCommand(e, args);
        }
      });
      gridMenuControl.onMenuClose.subscribe((e: Event, args: CellArgs) => {
        if (this._gridOptions.gridMenu && typeof this._gridOptions.gridMenu.onMenuClose === 'function') {
          this._gridOptions.gridMenu.onMenuClose(e, args);
        }

        // we also want to resize the columns if the user decided to hide certain column(s)
        if (grid && typeof grid.autosizeColumns === 'function') {
          // make sure that the grid still exist (by looking if the Grid UID is found in the DOM tree)
          const gridUid = grid.getUID();
          if (this.areVisibleColumnDifferent && gridUid && $(`.${gridUid}`).length > 0) {
            grid.autosizeColumns();
            this.areVisibleColumnDifferent = false;
          }
        }
      });
    }
    return gridMenuControl;
  }

  /**
   * Create the Header Menu and expose all the available hooks that user can subscribe (onCommand, onBeforeMenuShow, ...)
   * @param grid
   * @param dataView
   * @param columnDefinitions
   */
  createHeaderMenu(grid: any, dataView: any, columnDefinitions: Column[]) {
    this._gridOptions.headerMenu = { ...this.getDefaultHeaderMenuOptions(), ...this._gridOptions.headerMenu };
    if (this._gridOptions.enableHeaderMenu) {
      this._gridOptions.headerMenu = this.addHeaderMenuCustomCommands(grid, dataView, columnDefinitions);
    }

    const headerMenuPlugin = new Slick.Plugins.HeaderMenu(this._gridOptions.headerMenu);

    grid.registerPlugin(headerMenuPlugin);
    headerMenuPlugin.onCommand.subscribe((e: Event, args: HeaderMenuOnCommandArgs) => {
      if (this._gridOptions.headerMenu && typeof this._gridOptions.headerMenu.onCommand === 'function') {
        this._gridOptions.headerMenu.onCommand(e, args);
      }
    });
    headerMenuPlugin.onCommand.subscribe((e: Event, args: HeaderMenuOnBeforeMenuShowArgs) => {
      if (this._gridOptions.headerMenu && typeof this._gridOptions.headerMenu.onBeforeMenuShow === 'function') {
        this._gridOptions.headerMenu.onBeforeMenuShow(e, args);
      }
    });

    return headerMenuPlugin;
  }

  /** Create an undo redo buffer used by the Excel like copy */
  createUndoRedoBuffer() {
    const commandQueue: any[] = [];
    let commandCtr = 0;

    this.undoRedoBuffer = {
      queueAndExecuteCommand: (editCommand: any) => {
        commandQueue[commandCtr] = editCommand;
        commandCtr++;
        editCommand.execute();
      },
      undo: () => {
        if (commandCtr === 0) { return; }
        commandCtr--;
        const command = commandQueue[commandCtr];
        if (command && Slick.GlobalEditorLock.cancelCurrentEdit()) {
          command.undo();
        }
      },
      redo: () => {
        if (commandCtr >= commandQueue.length) { return; }
        const command = commandQueue[commandCtr];
        commandCtr++;
        if (command && Slick.GlobalEditorLock.cancelCurrentEdit()) {
          command.execute();
        }
      }
    };
  }

  /** Hide a column from the grid */
  hideColumn(column: Column) {
    if (this._grid && this.visibleColumns) {
      const columnIndex = this._grid.getColumnIndex(column.id);
      this.visibleColumns = this.removeColumnByIndex(this.visibleColumns, columnIndex);
      this._grid.setColumns(this.visibleColumns);
    }
  }

  /** Attach an undo shortcut key hook that will redo/undo the copy buffer */
  hookUndoShortcutKey() {
    // undo shortcut
    $(document).keydown((e) => {
      if (e.which === 90 && (e.ctrlKey || e.metaKey)) {    // CTRL + (shift) + Z
        if (e.shiftKey) {
          this.undoRedoBuffer.redo();
        } else {
          this.undoRedoBuffer.undo();
        }
      }
    });
  }

  dispose() {
    this._grid = null;
    this._dataView = null;
    this.visibleColumns = [];

    // dispose of each control/plugin if it has a destroy method
    this.extensionList.forEach((item) => {
      if (item && item.service && item.service.destroy) {
        item.service.destroy();
      }
    });
    this.extensionList = [];
  }

  /**
   * Create Grid Menu with Custom Commands if user has enabled Filters and/or uses a Backend Service (OData, GraphQL)
   * @param grid
   */
  private addGridMenuCustomCommands(grid: any) {
    const backendApi = this._gridOptions.backendServiceApi || null;

    if (this._gridOptions && this._gridOptions.enableFiltering) {
      // show grid menu: clear all filters
      if (this._gridOptions && this._gridOptions.gridMenu && !this._gridOptions.gridMenu.hideClearAllFiltersCommand && this._gridOptions.gridMenu.customItems && this._gridOptions.gridMenu.customItems.filter((item: CustomGridMenu) => item.command === 'clear-filter').length === 0) {
        this._gridOptions.gridMenu.customItems.push(
          {
            iconCssClass: this._gridOptions.gridMenu.iconClearAllFiltersCommand || 'fa fa-filter text-danger',
            title: this._gridOptions.enableTranslate ? this.i18n.tr('CLEAR_ALL_FILTERS') : 'Clear All Filters',
            disabled: false,
            command: 'clear-filter',
            positionOrder: 50
          }
        );
      }
      // show grid menu: toggle filter row
      if (this._gridOptions && this._gridOptions.gridMenu && !this._gridOptions.gridMenu.hideToggleFilterCommand && this._gridOptions.gridMenu.customItems && this._gridOptions.gridMenu.customItems.filter((item: CustomGridMenu) => item.command === 'toggle-filter').length === 0) {
        this._gridOptions.gridMenu.customItems.push(
          {
            iconCssClass: this._gridOptions.gridMenu.iconToggleFilterCommand || 'fa fa-random',
            title: this._gridOptions.enableTranslate ? this.i18n.tr('TOGGLE_FILTER_ROW') : 'Toggle Filter Row',
            disabled: false,
            command: 'toggle-filter',
            positionOrder: 52
          }
        );
      }

      // show grid menu: refresh dataset
      if (this._gridOptions && this._gridOptions.gridMenu && !this._gridOptions.gridMenu.hideRefreshDatasetCommand && backendApi && this._gridOptions.gridMenu.customItems && this._gridOptions.gridMenu.customItems.filter((item: CustomGridMenu) => item.command === 'refresh-dataset').length === 0) {
        this._gridOptions.gridMenu.customItems.push(
          {
            iconCssClass: this._gridOptions.gridMenu.iconRefreshDatasetCommand || 'fa fa-refresh',
            title: this._gridOptions.enableTranslate ? this.i18n.tr('REFRESH_DATASET') : 'Refresh Dataset',
            disabled: false,
            command: 'refresh-dataset',
            positionOrder: 54
          }
        );
      }
    }

    if (this._gridOptions.enableSorting) {
      // show grid menu: clear all sorting
      if (this._gridOptions && this._gridOptions.gridMenu && !this._gridOptions.gridMenu.hideClearAllSortingCommand && this._gridOptions.gridMenu.customItems && this._gridOptions.gridMenu.customItems.filter((item: CustomGridMenu) => item.command === 'clear-sorting').length === 0) {
        this._gridOptions.gridMenu.customItems.push(
          {
            iconCssClass: this._gridOptions.gridMenu.iconClearAllSortingCommand || 'fa fa-unsorted text-danger',
            title: this._gridOptions.enableTranslate ? this.i18n.tr('CLEAR_ALL_SORTING') : 'Clear All Sorting',
            disabled: false,
            command: 'clear-sorting',
            positionOrder: 51
          }
        );
      }
    }

    // show grid menu: export to file
    if (this._gridOptions && this._gridOptions.enableExport && this._gridOptions.gridMenu && !this._gridOptions.gridMenu.hideExportCsvCommand && this._gridOptions.gridMenu.customItems && this._gridOptions.gridMenu.customItems.filter((item: CustomGridMenu) => item.command === 'export-csv').length === 0) {
      this._gridOptions.gridMenu.customItems.push(
        {
          iconCssClass: this._gridOptions.gridMenu.iconExportCsvCommand || 'fa fa-download',
          title: this._gridOptions.enableTranslate ? this.i18n.tr('EXPORT_TO_CSV') : 'Export in CSV format',
          disabled: false,
          command: 'export-csv',
          positionOrder: 53
        }
      );
    }
    // show grid menu: export to text file as tab delimited
    if (this._gridOptions && this._gridOptions.enableExport && this._gridOptions.gridMenu && !this._gridOptions.gridMenu.hideExportTextDelimitedCommand && this._gridOptions.gridMenu.customItems && this._gridOptions.gridMenu.customItems.filter((item: CustomGridMenu) => item.command === 'export-text-delimited').length === 0) {
      this._gridOptions.gridMenu.customItems.push(
        {
          iconCssClass: this._gridOptions.gridMenu.iconExportTextDelimitedCommand || 'fa fa-download',
          title: this._gridOptions.enableTranslate ? this.i18n.tr('EXPORT_TO_TAB_DELIMITED') : 'Export in Text format (Tab delimited)',
          disabled: false,
          command: 'export-text-delimited',
          positionOrder: 54
        }
      );
    }

    // Command callback, what will be executed after command is clicked
    if (this._gridOptions && this._gridOptions.gridMenu && Array.isArray(this._gridOptions.gridMenu.customItems) && this._gridOptions.gridMenu.customItems.length > 0) {
      this._gridOptions.gridMenu.onCommand = (e, args) => {
        if (args && args.command) {
          switch (args.command) {
            case 'clear-filter':
              this.filterService.clearFilters();
              this._dataView.refresh();
              break;
            case 'clear-sorting':
              this.sortService.clearSorting();
              this._dataView.refresh();
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
              grid.setHeaderRowVisibility(!this._gridOptions.showHeaderRow);
              break;
            case 'toggle-toppanel':
              grid.setTopPanelVisibility(!this._gridOptions.showTopPanel);
              break;
            case 'refresh-dataset':
              this.refreshBackendDataset();
              break;
            default:
              alert('Command: ' + args.command);
              break;
          }
        }
      };
    }

    // add the custom "Commands" title if there are any commands
    if (this._gridOptions && this._gridOptions.gridMenu && this._gridOptions.gridMenu.customItems && this._gridOptions.gridMenu.customItems.length > 0) {
      const customTitle = this._gridOptions.enableTranslate ? this.i18n.tr('COMMANDS') : 'Commands';
      this._gridOptions.gridMenu.customTitle = this._gridOptions.gridMenu.customTitle || customTitle;

      // sort the custom items by their position in the list
      this._gridOptions.gridMenu.customItems.sort((itemA, itemB) => {
        if (itemA && itemB && itemA.hasOwnProperty('positionOrder') && itemB.hasOwnProperty('positionOrder')) {
          return (itemA.positionOrder || 0) - (itemB.positionOrder || 0);
        }
        return 0;
      });
    }
  }

  /** Call a refresh dataset with a BackendServiceApi */
  refreshBackendDataset() {
    let query;
    const backendApi = this._gridOptions.backendServiceApi;
    if (!backendApi || !backendApi.service || !backendApi.process) {
      throw new Error(`BackendServiceApi requires at least a "process" function and a "service" defined`);
    }

    if (backendApi.service) {
      query = backendApi.service.buildQuery();
    }

    if (query && query !== '') {
      if (backendApi.preProcess) {
        backendApi.preProcess();
      }

      // execute the process promise
      const processPromise = backendApi.process(query);

      processPromise.then((processResult: GraphqlResult | any) => {
        // from the result, call our internal post process to update the Dataset and Pagination info
        if (processResult && backendApi && backendApi.internalPostProcess) {
          backendApi.internalPostProcess(processResult);
        }

        // send the response process to the postProcess callback
        if (backendApi && backendApi.postProcess) {
          backendApi.postProcess(processResult);
        }
      });
    }
  }

  /**
   * Remove a column from the grid by it's index in the grid
   * @param array input
   * @param index
   */
  removeColumnByIndex(array: any[], index: number) {
    return array.filter((el: any, i: number) => {
      return index !== i;
    });
  }

  /** Translate the Column Picker and it's last 2 checkboxes */
  translateColumnPicker() {
    // update the properties by pointers, that is the only way to get Grid Menu Control to see the new values
    if (this._gridOptions && this._gridOptions.columnPicker) {
      this._gridOptions.columnPicker.columnTitle = this.getDefaultTranslationByKey('columns');
      this._gridOptions.columnPicker.forceFitTitle = this.getDefaultTranslationByKey('forcefit');
      this._gridOptions.columnPicker.syncResizeTitle = this.getDefaultTranslationByKey('synch');
    }
  }

  /** Translate the Grid Menu titles and column picker */
  translateGridMenu() {
    // update the properties by pointers, that is the only way to get Grid Menu Control to see the new values
    // we also need to call the control init so that it takes the new Grid object with latest values
    if (this._gridOptions && this._gridOptions.gridMenu) {
      this._gridOptions.gridMenu.customItems = [];
      this._gridOptions.gridMenu.customTitle = '';
      this._gridOptions.gridMenu.columnTitle = this.getDefaultTranslationByKey('columns');
      this._gridOptions.gridMenu.forceFitTitle = this.getDefaultTranslationByKey('forcefit');
      this._gridOptions.gridMenu.syncResizeTitle = this.getDefaultTranslationByKey('synch');

      // translate all columns (including non-visible)
      for (const column of this.allColumns) {
        if (column.headerKey) {
          column.name = this.i18n.tr(column.headerKey);
        }
      }

      // re-create the list of Custom Commands
      this.addGridMenuCustomCommands(this._grid);
      this.gridMenuControl.init(this._grid);
    }
  }

  /**
   * Translate the Header Menu titles, we need to loop through all column definition to re-translate them
   */
  translateHeaderMenu() {
    if (this._gridOptions && this._gridOptions.headerMenu) {
      this.resetHeaderMenuTranslations(this.visibleColumns);
    }
  }

  /**
   * Translate manually the header titles.
   * We could optionally pass a locale (that will change currently loaded locale), else it will use current locale
   * @param locale to use
   */
  translateColumnHeaders(locale?: boolean | string, newColumnDefinitions?: Column[]) {
    if (locale) {
      this.i18n.setLocale(locale as string);
    }

    const columnDefinitions = newColumnDefinitions || this._columnDefinitions;
    for (const column of columnDefinitions) {
      if (column.headerKey) {
        column.name = this.i18n.tr(column.headerKey);
      }
    }

    // re-render the column headers
    this.renderColumnHeaders(columnDefinitions);
  }

  /**
   * Render (or re-render) the column headers from column definitions.
   * calling setColumns() will trigger a grid re-render
   */
  renderColumnHeaders(newColumnDefinitions?: Column[]) {
    const collection = newColumnDefinitions || this._columnDefinitions;
    if (Array.isArray(collection) && this._grid && this._grid.setColumns) {
      this._grid.setColumns(collection);
    }
  }

  /**
   * Create Header Menu with Custom Commands if user has enabled Header Menu
   * @param grid
   * @param dataView
   * @param columnDefinitions
   * @return header menu
   */
  private addHeaderMenuCustomCommands(grid: any, dataView: any, columnDefinitions: Column[]): HeaderMenu | undefined {
    const headerMenuOptions = this._gridOptions.headerMenu;

    if (columnDefinitions && Array.isArray(columnDefinitions) && this._gridOptions.enableHeaderMenu) {
      columnDefinitions.forEach((columnDef: Column) => {
        if (columnDef && !columnDef.excludeFromHeaderMenu) {
          if (!columnDef.header || !columnDef.header.menu) {
            columnDef.header = {
              menu: {
                items: []
              }
            };
          }
          if (columnDef && columnDef.header && columnDef.header.menu) {
            const columnHeaderMenuItems: HeaderMenuItem[] = columnDef.header.menu.items || [];

            // Sorting Commands
            if (this._gridOptions.enableSorting && columnDef.sortable && headerMenuOptions && headerMenuOptions.showSortCommands) {
              if (columnHeaderMenuItems.filter((item: HeaderMenuItem) => item.command === 'sort-asc').length === 0) {
                columnHeaderMenuItems.push({
                  iconCssClass: headerMenuOptions.iconSortAscCommand || 'fa fa-sort-asc',
                  title: this._gridOptions.enableTranslate ? this.i18n.tr('SORT_ASCENDING') : 'Sort Ascending',
                  command: 'sort-asc'
                });
              }
              if (columnHeaderMenuItems.filter((item: HeaderMenuItem) => item.command === 'sort-desc').length === 0) {
                columnHeaderMenuItems.push({
                  iconCssClass: headerMenuOptions.iconSortDescCommand || 'fa fa-sort-desc',
                  title: this._gridOptions.enableTranslate ? this.i18n.tr('SORT_DESCENDING') : 'Sort Descending',
                  command: 'sort-desc'
                });
              }
            }

            // Hide Column Command
            if (headerMenuOptions && headerMenuOptions.showColumnHideCommand && columnHeaderMenuItems.filter((item: HeaderMenuItem) => item.command === 'hide').length === 0) {
              columnHeaderMenuItems.push({
                iconCssClass: headerMenuOptions.iconColumnHideCommand || 'fa fa-times',
                title: this._gridOptions.enableTranslate ? this.i18n.tr('HIDE_COLUMN') : 'Hide Column',
                command: 'hide'
              });
            }
          }
        }
      });

      // Command callback, what will be executed after command is clicked
      if (headerMenuOptions) {
        headerMenuOptions.onCommand = (e, args) => {
          if (args && args.command) {
            switch (args.command) {
              case 'hide':
                this.hideColumn(args.column);
                this.autoResizeColumns();
                break;
              case 'sort-asc':
              case 'sort-desc':
                // get previously sorted columns
                const cols: ColumnSort[] = this.sortService.getPreviousColumnSorts(args.column.id + '');

                // add to the column array, the column sorted by the header menu
                cols.push({ sortCol: args.column, sortAsc: (args.command === 'sort-asc') });
                if (this._gridOptions.backendServiceApi) {
                  this.sortService.onBackendSortChanged(e, { multiColumnSort: true, sortCols: cols, grid });
                } else {
                  this.sortService.onLocalSortChanged(grid, dataView, cols);
                }

                // update the this.gridObj sortColumns array which will at the same add the visual sort icon(s) on the UI
                const newSortColumns: ColumnSort[] = cols.map((col) => {
                  return {
                    columnId: (col && col.sortCol) ? col.sortCol.id : '',
                    sortAsc: col.sortAsc
                  };
                });
                grid.setSortColumns(newSortColumns); // add sort icon in UI
                break;
              default:
                alert('Command: ' + args.command);
                break;
            }
          }
        };
      }
    }

    return headerMenuOptions;
  }

  /**
   * @return default Grid Menu options
   */
  private getDefaultGridMenuOptions(): GridMenu {
    return {
      columnTitle: this.getDefaultTranslationByKey('columns'),
      forceFitTitle: this.getDefaultTranslationByKey('forcefit'),
      syncResizeTitle: this.getDefaultTranslationByKey('synch'),
      iconCssClass: 'fa fa-bars',
      menuWidth: 18,
      customTitle: undefined,
      customItems: [],
      hideClearAllFiltersCommand: false,
      hideRefreshDatasetCommand: false,
      hideToggleFilterCommand: false
    };
  }

  /**
   * @return default Header Menu options
   */
  private getDefaultHeaderMenuOptions(): HeaderMenu {
    return {
      autoAlignOffset: 12,
      minWidth: 140,
      showColumnHideCommand: true,
      showSortCommands: true
    };
  }

  private getDefaultTranslationByKey(key: 'commands' | 'columns' | 'forcefit' | 'synch') {
    let output = '';
    switch (key) {
      case 'commands':
        output = this.i18n.tr('COMMANDS') || 'Commands';
        break;
      case 'columns':
        output = this.i18n.tr('COLUMNS') || 'Columns';
        break;
      case 'forcefit':
        output = this.i18n.tr('FORCE_FIT_COLUMNS') || 'Force fit columns';
        break;
      case 'synch':
        output = this.i18n.tr('SYNCHRONOUS_RESIZE') || 'Synchronous resize';
        break;
    }
    return output;
  }

  /**
   * Reset all the Grid Menu options which have text to translate
   * @param columnDefinitions
   */
  private resetHeaderMenuTranslations(columnDefinitions: Column[]) {
    columnDefinitions.forEach((columnDef: Column) => {
      if (columnDef && !columnDef.excludeFromHeaderMenu && columnDef.header && columnDef.header.menu && columnDef.header.menu.items) {
        const columnHeaderMenuItems: HeaderMenuItem[] = columnDef.header.menu.items || [];
        columnHeaderMenuItems.forEach((item) => {
          switch (item.command) {
            case 'sort-asc':
              item.title = this.i18n.tr('SORT_ASCENDING') || 'Sort Ascending';
              break;
            case 'sort-desc':
              item.title = this.i18n.tr('SORT_DESCENDING') || 'Sort Ascending';
              break;
            case 'hide':
              item.title = this.i18n.tr('HIDE_COLUMN') || 'Sort Ascending';
              break;
          }
        });
      }
    });
  }
}
