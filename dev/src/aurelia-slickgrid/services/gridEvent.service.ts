import { OnCellClickArgs, CellArgs, GridOption } from './../models';

export class GridEventService {
  /* OnMouseHover (Enter/Leave) Events */
  attachOnMouseHover(grid: any) {
    grid.onMouseEnter.subscribe((e: any) => {
      const cell = grid.getCellFromEvent(e);
      if (cell && cell.row >= 0) {
        grid.setSelectedRows([cell.row]);
        e.preventDefault();
      }
    });
    grid.onMouseLeave.subscribe((e: any) => {
      grid.setSelectedRows([]);
      e.preventDefault();
    });
  }

  /* OnClick Event */
  attachOnClick(grid: any, gridOptions: GridOption, dataView: any) {

    grid.onClick.subscribe((e: Event, args: CellArgs) => {
      if (!e || !args || !args.grid || args.cell === undefined || !args.grid.getColumns || !args.grid.getDataItem) {
        return;
      }
      const column = args.grid.getColumns()[args.cell];

      // so if the columns definition does have an column.onCellClick property (a callback function attached), then run it
      if (typeof column.onCellClick === 'function') {
        // add more useful properties to the return of the onCellClick callback
        const onCellClickArgs: OnCellClickArgs = {
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
