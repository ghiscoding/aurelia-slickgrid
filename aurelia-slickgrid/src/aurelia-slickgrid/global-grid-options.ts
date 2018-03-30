import { FilterType, DelimiterType, FileType, GridOption } from './models/index';

/**
 * Default Options that can be passed to the Aurelia-Slickgrid
 */
export const GlobalGridOptions: GridOption = {
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
  defaultFilterPlaceholder: '&#128269;', // magnifying glass icon
  defaultFilterType: FilterType.input,
  enableAutoResize: true,
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
  exportWithFormatter: false,
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
    resizeOnShowHeaderRow: false,
    showClearAllFiltersCommand: true,
    showClearAllSortingCommand: true,
    showExportCsvCommand: true,
    showRefreshDatasetCommand: true,
    showToggleFilterCommand: true
  },
  headerRowHeight: 35,
  multiColumnSort: true,
  pagination: {
    pageSizes: [10, 15, 20, 25, 30, 40, 50, 75, 100],
    pageSize: 25,
    totalItems: 0
  },
  rowHeight: 35,
  showHeaderRow: false,
  topPanelHeight: 35
};
