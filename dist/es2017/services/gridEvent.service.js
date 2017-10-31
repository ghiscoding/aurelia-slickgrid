export class GridEventService {
    /* OnMouseHover (Enter/Leave) Events */
    attachOnMouseHover(grid) {
        grid.onMouseEnter.subscribe((e) => {
            const cell = grid.getCellFromEvent(e);
            if (cell && cell.row >= 0) {
                grid.setSelectedRows([cell.row]);
                e.preventDefault();
            }
        });
        grid.onMouseLeave.subscribe((e) => {
            grid.setSelectedRows([]);
            e.preventDefault();
        });
    }
    /* OnClick Event */
    attachOnClick(grid, gridOptions, dataView) {
        grid.onClick.subscribe((e, args) => {
            if (!e || !args || !args.grid || args.cell === undefined || !args.grid.getColumns || !args.grid.getDataItem) {
                return;
            }
            const column = args.grid.getColumns()[args.cell];
            // so if the columns definition does have an column.onCellClick property (a callback function attached), then run it
            if (typeof column.onCellClick === 'function') {
                // add more useful properties to the return of the onCellClick callback
                const onCellClickArgs = {
                    dataView,
                    gridDefinition: gridOptions,
                    grid,
                    columnDef: column,
                    dataContext: args.grid.getDataItem(args.row)
                };
                // finally execute the onCellClick callback
                column.onCellClick(onCellClickArgs);
                e.stopImmediatePropagation();
            }
            // stop the click event bubbling
            // NOTE: We don't want to stop bubbling when doing an input edit, if we do the autoEdit which has intent of doing singleClick edit will become doubleClick edit
            if (!grid.getOptions || !grid.getOptions().autoEdit) {
                // e.stopImmediatePropagation();
            }
        });
    }
}
//# sourceMappingURL=gridEvent.service.js.map