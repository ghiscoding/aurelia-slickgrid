System.register(["./models/index"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var index_1, GlobalGridOptions;
    return {
        setters: [
            function (index_1_1) {
                index_1 = index_1_1;
            }
        ],
        execute: function () {
            /**
             * Default Options that can be passed to the Aurelia-Slickgrid
             */
            exports_1("GlobalGridOptions", GlobalGridOptions = {
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
                defaultFilterType: index_1.FilterType.input,
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
                    menuWidth: 16,
                    resizeOnShowHeaderRow: false,
                    showClearAllFiltersCommand: true,
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
            });
        }
    };
});
//# sourceMappingURL=global-grid-options.js.map