import { Filters } from './filters/index';
import { DelimiterType, FileType, GridOption } from './models/index';

/**
 * Default Options that can be passed to the Aurelia-Slickgrid
 */
export const GlobalGridOptions: GridOption = {
  alwaysShowVerticalScroll: true,
  autoEdit: false,
  asyncEditorLoading: false,
  autoFitColumnsOnFirstLoad: true,
  autoResize: {
    bottomPadding: 20,
    minHeight: 180,
    minWidth: 300,
    sidePadding: 0
  },
  cellHighlightCssClass: 'slick-cell-modified',
  checkboxSelector: {
    cssClass: 'slick-cell-checkboxsel'
  },
  columnPicker: {
    hideForceFitButton: false,
    hideSyncResizeButton: true
  },
  datasetIdPropertyName: 'id',
  defaultAureliaEventPrefix: 'asg',
  defaultSlickgridEventPrefix: 'sg',
  defaultFilterPlaceholder: '&#128269;', // magnifying glass icon
  defaultFilter: Filters.input,
  enableAutoResize: true,
  enableAutoSizeColumns: true,
  enableHeaderMenu: true,
  editable: false,
  enableCellNavigation: false,
  enableCheckboxSelector: false,
  enableColumnPicker: true,
  enableColumnReorder: true,
  enableExport: true,
  enableGridMenu: true,
  enableSorting: true,
  enableTextSelectionOnCells: true,
  explicitInitialization: true,
  exportOptions: {
    delimiter: DelimiterType.comma,
    exportWithFormatter: false,
    filename: 'export',
    format: FileType.csv,
    groupingAggregatorRowText: '',
    sanitizeDataExport: false,
    useUtf8WithBom: true
  },
  forceFitColumns: false,
  gridMenu: {
    hideClearAllFiltersCommand: false,
    hideClearAllSortingCommand: false,
    hideExportCsvCommand: false,
    hideExportTextDelimitedCommand: true,
    hideForceFitButton: false,
    hideRefreshDatasetCommand: false,
    hideToggleFilterCommand: false,
    hideTogglePreHeaderCommand: false,
    hideSyncResizeButton: true,
    iconCssClass: 'fa fa-bars',
    iconClearAllFiltersCommand: 'fa fa-filter text-danger',
    iconClearAllSortingCommand: 'fa fa-unsorted text-danger',
    iconExportCsvCommand: 'fa fa-download',
    iconExportTextDelimitedCommand: 'fa fa-download',
    iconRefreshDatasetCommand: 'fa fa-refresh',
    iconToggleFilterCommand: 'fa fa-random',
    iconTogglePreHeaderCommand: 'fa fa-random',
    menuWidth: 16,
    resizeOnShowHeaderRow: true,
  },
  headerMenu: {
    autoAlign: true,
    autoAlignOffset: 12,
    minWidth: 140,
    iconClearFilterCommand: 'fa fa-filter text-danger',
    iconClearSortCommand: 'fa fa-unsorted',
    iconSortAscCommand: 'fa fa-sort-amount-asc',
    iconSortDescCommand: 'fa fa-sort-amount-desc',
    iconColumnHideCommand: 'fa fa-times',
    hideColumnHideCommand: false,
    hideClearFilterCommand: false,
    hideClearSortCommand: false,
    hideSortCommands: false,
    hideSortCommandsDivider: false
  },
  headerRowHeight: 35,
  multiColumnSort: true,
  numberedMultiColumnSort: true,
  tristateMultiColumnSort: false,
  pagination: {
    pageSizes: [10, 15, 20, 25, 30, 40, 50, 75, 100],
    pageSize: 25,
    totalItems: 0
  },
  rowDetailView: {
    cssClass: 'detail-view-toggle',
    panelRows: 1,
    keyPrefix: '__',
    useRowClick: true,
    useSimpleViewportCalc: true,
    saveDetailViewOnScroll: false,

    // the following 2 property/method should always be override by the user
    process: () => new Promise((resolve) => resolve('')),
    viewModel: '',
  },
  rowHeight: 35,
  sortColNumberInSeparateSpan: true,
  suppressActiveCellChangeOnEdit: true,
  topPanelHeight: 35
};
