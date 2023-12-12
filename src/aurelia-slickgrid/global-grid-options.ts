import { Column, DelimiterType, EventNamingStyle, FileType, Filters, OperatorType, TreeDataOption } from '@slickgrid-universal/common';
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
    cssClass: 'slick-cell-checkboxsel',
    width: 40
  },
  cellMenu: {
    autoAdjustDrop: true,
    autoAlignSide: true,
    hideCloseButton: true,
    hideCommandSection: false,
    hideOptionSection: false,
  },
  columnGroupSeparator: ' - ',
  columnPicker: {
    hideForceFitButton: false,
    hideSyncResizeButton: true,
    headerColumnValueExtractor: pickerHeaderColumnValueExtractor
  },
  compositeEditorOptions: {
    labels: {
      cancelButtonKey: 'CANCEL',
      cloneButtonKey: 'CLONE',
      resetEditorButtonTooltipKey: 'RESET_INPUT_VALUE',
      resetFormButtonKey: 'RESET_FORM',
      massSelectionButtonKey: 'APPLY_TO_SELECTION',
      massSelectionStatusKey: 'X_OF_Y_MASS_SELECTED',
      massUpdateButtonKey: 'APPLY_MASS_UPDATE',
      massUpdateStatusKey: 'ALL_X_RECORDS_SELECTED',
      saveButtonKey: 'SAVE',
    },
    resetEditorButtonCssClass: 'fa fa-repeat',
    resetFormButtonIconCssClass: 'fa fa-repeat'
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
    iconCollapseAllGroupsCommand: 'fa fa-compress',
    iconExpandAllGroupsCommand: 'fa fa-expand',
    iconClearGroupingCommand: 'fa fa-times',
    iconCopyCellValueCommand: 'fa fa-clone',
    iconExportCsvCommand: 'fa fa-download',
    iconExportExcelCommand: 'fa fa-file-excel-o text-success',
    iconExportTextDelimitedCommand: 'fa fa-download',
  },
  customFooterOptions: {
    dateFormat: 'YYYY-MM-DD, hh:mm a',
    hideRowSelectionCount: false,
    hideTotalItemCount: false,
    hideLastUpdateTimestamp: true,
    footerHeight: 25,
    leftContainerClass: 'col-xs-12 col-sm-5',
    rightContainerClass: 'col-xs-6 col-sm-7',
    metricSeparator: '|',
    metricTexts: {
      items: 'items',
      itemsKey: 'ITEMS',
      of: 'of',
      ofKey: 'OF',
      itemsSelected: 'items selected',
      itemsSelectedKey: 'ITEMS_SELECTED'
    }
  },
  dataView: {
    // when enabled, this will preserve the row selection even after filtering/sorting/grouping
    syncGridSelection: {
      preserveHidden: false,
      preserveHiddenOnSelectionChange: true
    },
    syncGridSelectionWithBackendService: false, // but disable it when using backend services
  },
  datasetIdPropertyName: 'id',
  defaultAureliaEventPrefix: '',
  defaultFilter: Filters.input,
  defaultBackendServiceFilterTypingDebounce: 500,
  defaultColumnSortFieldId: 'id',
  defaultFilterPlaceholder: '🔎︎', // magnifying glass icon
  defaultFilterRangeOperator: OperatorType.rangeInclusive,
  defaultSlickgridEventPrefix: '',
  editable: false,
  editorTypingDebounce: 450,
  filterTypingDebounce: 0,
  enableEmptyDataWarningMessage: true,
  enableFilterTrimWhiteSpace: false, // do we want to trim white spaces on all Filters?
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
  enableAutoResize: true,
  enableAutoSizeColumns: true,
  enableCellNavigation: false,
  enableColumnPicker: true,
  enableColumnReorder: true,
  enableColumnResizeOnDoubleClick: true,
  enableContextMenu: true,
  enableExcelExport: false,
  enableTextExport: false,
  enableGridMenu: true,
  enableHeaderMenu: true,
  enableMouseHoverHighlightRow: true,
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
    groupCollapsedSymbol: '⮞',
    groupExpandedSymbol: '⮟',
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
    dropSide: 'left',
    commandLabels: {
      clearAllFiltersCommandKey: 'CLEAR_ALL_FILTERS',
      clearAllSortingCommandKey: 'CLEAR_ALL_SORTING',
      clearFrozenColumnsCommandKey: 'CLEAR_PINNING',
      exportCsvCommandKey: 'EXPORT_TO_CSV',
      exportExcelCommandKey: 'EXPORT_TO_EXCEL',
      exportTextDelimitedCommandKey: 'EXPORT_TO_TAB_DELIMITED',
      refreshDatasetCommandKey: 'REFRESH_DATASET',
      toggleFilterCommandKey: 'TOGGLE_FILTER_ROW',
      togglePreHeaderCommandKey: 'TOGGLE_PRE_HEADER_ROW',
    },
    hideClearAllFiltersCommand: false,
    hideClearAllSortingCommand: false,
    hideClearFrozenColumnsCommand: true, // opt-in command
    hideExportCsvCommand: false,
    hideExportExcelCommand: false,
    hideExportTextDelimitedCommand: true,
    hideForceFitButton: false,
    hideRefreshDatasetCommand: false,
    hideSyncResizeButton: true,
    hideToggleFilterCommand: false,
    hideTogglePreHeaderCommand: false,
    iconCssClass: 'fa fa-bars',
    iconClearAllFiltersCommand: 'fa fa-filter',
    iconClearAllSortingCommand: 'fa fa-unsorted',
    iconClearFrozenColumnsCommand: 'fa fa-times',
    iconExportCsvCommand: 'fa fa-download',
    iconExportExcelCommand: 'fa fa-file-excel-o',
    iconExportTextDelimitedCommand: 'fa fa-download',
    iconRefreshDatasetCommand: 'fa fa-refresh',
    iconToggleFilterCommand: 'fa fa-random',
    iconTogglePreHeaderCommand: 'fa fa-random',
    menuWidth: 16,
    resizeOnShowHeaderRow: true,
    headerColumnValueExtractor: pickerHeaderColumnValueExtractor
  },
  headerMenu: {
    autoAlign: true,
    autoAlignOffset: 12,
    minWidth: 140,
    iconClearFilterCommand: 'fa fa-filter',
    iconClearSortCommand: 'fa fa-unsorted',
    iconFreezeColumns: 'fa fa-thumb-tack',
    iconSortAscCommand: 'fa fa-sort-amount-asc',
    iconSortDescCommand: 'fa fa-sort-amount-desc',
    iconColumnHideCommand: 'fa fa-times',
    iconColumnResizeByContentCommand: 'fa fa-arrows-h',
    hideColumnResizeByContentCommand: false,
    hideColumnHideCommand: false,
    hideClearFilterCommand: false,
    hideClearSortCommand: false,
    hideFreezeColumnsCommand: true, // opt-in command
    hideSortCommands: false
  },
  multiColumnSort: true,
  numberedMultiColumnSort: true,
  tristateMultiColumnSort: false,
  sortColNumberInSeparateSpan: true,
  suppressActiveCellChangeOnEdit: false,
  pagination: {
    pageSizes: [10, 15, 20, 25, 30, 40, 50, 75, 100],
    pageSize: 25,
    totalItems: 0
  },
  rowDetailView: {
    collapseAllOnSort: true,
    cssClass: 'detail-view-toggle',
    panelRows: 1,
    keyPrefix: '__',
    useRowClick: false,
    useSimpleViewportCalc: true,
    saveDetailViewOnScroll: false,
  } as RowDetailView,
  headerRowHeight: 35,
  rowHeight: 35,
  topPanelHeight: 30,
  translationNamespaceSeparator: ':',
  resetFilterSearchValueAfterOnBeforeCancellation: true,
  resizeByContentOnlyOnFirstLoad: true,
  resizeByContentOptions: {
    alwaysRecalculateColumnWidth: false,
    cellCharWidthInPx: 7.8,
    cellPaddingWidthInPx: 14,
    defaultRatioForStringType: 0.88,
    formatterPaddingWidthInPx: 0,
    maxItemToInspectCellContentWidth: 1000,
    maxItemToInspectSingleColumnWidthByContent: 5000,
    widthToRemoveFromExceededWidthReadjustment: 50,
  },
  treeDataOptions: {
    exportIndentMarginLeft: 5,
    exportIndentationLeadingChar: '͏͏͏͏͏͏͏͏͏·',
  } as unknown as TreeDataOption
};

/**
 * Value Extractor for both ColumnPicker & GridMenu Picker
 * when using Column Header Grouping, we'll prefix the column group title
 * else we'll simply return the column name title
 */
function pickerHeaderColumnValueExtractor(column: Column, gridOptions?: GridOption) {
  const headerGroup = column?.columnGroup || '';
  const columnGroupSeparator = gridOptions?.columnGroupSeparator ?? ' - ';
  if (headerGroup) {
    return headerGroup + columnGroupSeparator + column.name;
  }
  return column?.name ?? '';
}
