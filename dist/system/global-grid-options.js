System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var GlobalGridOptions;
    return {
        setters: [],
        execute: function () {
            /**
             * Options that can be passed to the Aurelia-Slickgrid
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
                enableAutoResize: true,
                enableRowSelection: true,
                editable: false,
                enableCellNavigation: false,
                enableColumnPicker: true,
                enableColumnReorder: true,
                enableGridMenu: true,
                enableMouseHoverHighlightRow: true,
                enablePagination: false,
                enableSorting: true,
                enableTextSelectionOnCells: true,
                explicitInitialization: true,
                forceFitColumns: false,
                gridMenu: {
                    columnTitle: 'Columns',
                    iconCssClass: 'fa fa-bars',
                    menuWidth: 16
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