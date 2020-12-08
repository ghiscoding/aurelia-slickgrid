import { Column, DelimiterType, EventNamingStyle, FileType, Filters, OperatorType } from '@slickgrid-universal/common';
import { GridOption, RowDetailView } from './models/index';

/**
 * Default Options that can be passed to the Aurelia-Slickgrid
 */
export const GlobalGridOptions: Partial<GridOption> = {
  alwaysShowVerticalScroll: true,
  autoEdit: false,
  asyncEditorLoading: false,
  autoFitColumnsOnFirstLoad: true,
  autoResize: {
    applyResizeToContainer: true,
    calculateAvailableSizeBy: 'window',
    bottomPadding: 20,
    minHeight: 180,
    minWidth: 300,
    rightPadding: 0
  },
  cellHighlightCssClass: 'slick-cell-modified',
  checkboxSelector: {
    cssClass: 'slick-cell-checkboxsel'
  },
  cellMenu: {
    autoAdjustDrop: true,
    autoAlignSide: true,
    hideCloseButton: true,
    hideCommandSection: false,
    hideOptionSection: false,
  },
  columnPicker: {
    fadeSpeed: 0,
    hideForceFitButton: false,
    hideSyncResizeButton: true,
    headerColumnValueExtractor: pickerHeaderColumnValueExtractor
  },
  contextMenu: {
    autoAdjustDrop: true,
    autoAlignSide: true,
    hideCloseButton: true,
    hideClearAllGrouping: false,
    hideCollapseAllGroups: false,
    hideCommandSection: false,
    hideCopyCellValueCommand: false,
    hideExpandAllGroups: false,
    hideExportCsvCommand: false,
    hideExportExcelCommand: false,
    hideExportTextDelimitedCommand: true,
    hideMenuOnScroll: true,
    hideOptionSection: false,
    iconCopyCellValueCommand: 'fa fa-clone',
    iconExportCsvCommand: 'fa fa-download',
    iconExportExcelCommand: 'fa fa-file-excel-o text-success',
    iconExportTextDelimitedCommand: 'fa fa-download',
    width: 200,
  },
  customFooterOptions: {
    dateFormat: 'YYYY-MM-DD, hh:mm a',
    hideTotalItemCount: false,
    hideLastUpdateTimestamp: true,
    footerHeight: 20,
    leftContainerClass: 'col-xs-12 col-sm-5',
    rightContainerClass: 'col-xs-6 col-sm-7',
    metricSeparator: '|',
    metricTexts: {
      items: 'items',
      of: 'of',
      itemsKey: 'ITEMS',
      ofKey: 'OF',
    }
  },
  dataView: {
    syncGridSelection: true, // when enabled, this will preserve the row selection even after filtering/sorting/grouping
    syncGridSelectionWithBackendService: false, // but disable it when using backend services
  },
  datasetIdPropertyName: 'id',
  defaultColumnSortFieldId: 'id',
  defaultAureliaEventPrefix: 'asg',
  defaultSlickgridEventPrefix: 'sg',
  defaultFilter: Filters.input,
  defaultFilterPlaceholder: '&#128269;', // magnifying glass icon
  defaultFilterRangeOperator: OperatorType.rangeExclusive,
  editable: false,
  enableAutoResize: true,
  enableAutoSizeColumns: true,
  enableHeaderMenu: true,
  enableEmptyDataWarningMessage: true,
  emptyDataWarning: {
    className: 'slick-empty-data-warning',
    message: 'No data to display.',
    messageKey: 'EMPTY_DATA_WARNING_MESSAGE',
    hideFrozenLeftWarning: false,
    hideFrozenRightWarning: false,
    leftViewportMarginLeft: '40%',
    rightViewportMarginLeft: '40%',
    frozenLeftViewportMarginLeft: '0px',
    frozenRightViewportMarginLeft: '40%',
  },
  enableCellNavigation: false,
  enableCheckboxSelector: false,
  enableColumnPicker: true,
  enableColumnReorder: true,
  enableContextMenu: true,
  enableExcelExport: false, // both exports are now opt-in
  enableTextExport: false,
  enableFilterTrimWhiteSpace: false, // do we want to trim white spaces on all Filters?
  enableGridMenu: true,
  enableSorting: true,
  enableTextSelectionOnCells: true,
  eventNamingStyle: EventNamingStyle.kebabCase,
  explicitInitialization: true,
  excelExportOptions: {
    addGroupIndentation: true,
    exportWithFormatter: false,
    filename: 'export',
    format: FileType.xlsx,
    groupingColumnHeaderTitle: 'Group By',
    groupCollapsedSymbol: '\u25B9',
    groupExpandedSymbol: '\u25BF',
    groupingAggregatorRowText: '',
    sanitizeDataExport: false,
  },
  textExportOptions: {
    delimiter: DelimiterType.comma,
    exportWithFormatter: false,
    filename: 'export',
    format: FileType.csv,
    groupingColumnHeaderTitle: 'Group By',
    groupingAggregatorRowText: '',
    sanitizeDataExport: false,
    useUtf8WithBom: true
  },
  forceFitColumns: false,
  frozenHeaderWidthCalcDifferential: 1,
  gridMenu: {
    hideClearAllFiltersCommand: false,
    hideClearAllSortingCommand: false,
    hideClearFrozenColumnsCommand: true, // opt-in command
    hideExportCsvCommand: false,
    hideExportExcelCommand: false,
    hideExportTextDelimitedCommand: true,
    hideForceFitButton: false,
    hideRefreshDatasetCommand: false,
    hideToggleFilterCommand: false,
    hideTogglePreHeaderCommand: false,
    hideSyncResizeButton: true,
    iconCssClass: 'fa fa-bars',
    iconClearAllFiltersCommand: 'fa fa-filter text-danger',
    iconClearAllSortingCommand: 'fa fa-unsorted text-danger',
    iconClearFrozenColumnsCommand: 'fa fa-times',
    iconExportCsvCommand: 'fa fa-download',
    iconExportExcelCommand: 'fa fa-file-excel-o text-success',
    iconExportTextDelimitedCommand: 'fa fa-download',
    iconRefreshDatasetCommand: 'fa fa-refresh',
    iconToggleFilterCommand: 'fa fa-random',
    iconTogglePreHeaderCommand: 'fa fa-random',
    menuWidth: 16,
    resizeOnShowHeaderRow: true,
    useClickToRepositionMenu: false, // use icon location to reposition instead
    headerColumnValueExtractor: pickerHeaderColumnValueExtractor
  },
  headerMenu: {
    autoAlign: true,
    autoAlignOffset: 12,
    minWidth: 140,
    iconClearFilterCommand: 'fa fa-filter text-danger',
    iconClearSortCommand: 'fa fa-unsorted',
    iconFreezeColumns: 'fa fa-thumb-tack',
    iconSortAscCommand: 'fa fa-sort-amount-asc',
    iconSortDescCommand: 'fa fa-sort-amount-desc',
    iconColumnHideCommand: 'fa fa-times',
    hideColumnHideCommand: false,
    hideClearFilterCommand: false,
    hideClearSortCommand: false,
    hideFreezeColumnsCommand: true, // opt-in command
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
  // technically speaking the Row Detail requires the process & viewComponent but we'll ignore it just to set certain options
  rowDetailView: {
    cssClass: 'detail-view-toggle',
    panelRows: 1,
    keyPrefix: '__',
    useRowClick: false,
    useSimpleViewportCalc: true,
    saveDetailViewOnScroll: false,
    viewModel: '',
  } as RowDetailView,
  rowHeight: 35,
  sortColNumberInSeparateSpan: true,
  suppressActiveCellChangeOnEdit: true,
  topPanelHeight: 35,
  translationNamespaceSeparator: ':',
};

/**
 * Value Extractor for both ColumnPicker & GridMenu Picker
 * when using Column Header Grouping, we'll prefix the column group title
 * else we'll simply return the column name title
 */
function pickerHeaderColumnValueExtractor(column: Column) {
  const headerGroup = column && column.columnGroup || '';
  if (headerGroup) {
    return headerGroup + ' - ' + column.name;
  }
  return column && column.name || '';
}
