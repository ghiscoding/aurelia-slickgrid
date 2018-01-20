/**
 * Default Options that can be passed to the Aurelia-Slickgrid
 */
export const GlobalGridOptions = {
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
    enableAutoResize: true,
    enableRowSelection: true,
    editable: false,
    enableCellNavigation: false,
    enableCheckboxSelector: false,
    enableColumnPicker: true,
    enableColumnReorder: true,
    enableGridMenu: true,
    enablePagination: false,
    enableSorting: true,
    enableTextSelectionOnCells: true,
    explicitInitialization: true,
    forceFitColumns: false,
    gridMenu: {
        iconCssClass: 'fa fa-bars',
        menuWidth: 16,
        resizeOnShowHeaderRow: false,
        showClearAllFiltersCommand: true,
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
//# sourceMappingURL=global-grid-options.js.map