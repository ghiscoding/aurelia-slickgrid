import { FilterType, DelimiterType, FileType, GridOption } from './models/index';

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
  defaultFilterType: FilterType.input,
  enableAutoResize: true,
  enableHeaderMenu: true,
  enableRowSelection: true,
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
    hideForceFitButton: false,
    hideSyncResizeButton: true,
    iconCssClass: 'fa fa-bars',
    iconClearAllFiltersCommand: 'fa fa-filter text-danger',
    iconClearAllSortingCommand: 'fa fa-unsorted text-danger',
    iconExportCsvCommand: 'fa fa-download',
    iconExportTextDelimitedCommand: 'fa fa-download',
    iconRefreshDatasetCommand: 'fa fa-refresh',
    iconToggleFilterCommand: 'fa fa-random',
    menuWidth: 16,
    resizeOnShowHeaderRow: true,
    showClearAllFiltersCommand: true,
    showClearAllSortingCommand: true,
    showExportCsvCommand: true,
    showRefreshDatasetCommand: true,
    showToggleFilterCommand: true
  },
  headerMenu: {
    autoAlign: true,
    autoAlignOffset: 12,
    minWidth: 140,
    iconSortAscCommand: 'fa fa-sort-asc',
    iconSortDescCommand: 'fa fa-sort-desc',
    iconColumnHideCommand: 'fa fa-times',
    showColumnHideCommand: true,
    showSortCommands: true
  },
  headerRowHeight: 35,
  multiColumnSort: true,
  numberedMultiColumnSort: true,
  tristateMultiColumnSort: false,
  sortColNumberInSeparateSpan: true,
  pagination: {
    pageSizes: [10, 15, 20, 25, 30, 40, 50, 75, 100],
    pageSize: 25,
    totalItems: 0
  },
  rowHeight: 35,
  showHeaderRow: false,
  topPanelHeight: 35
};
