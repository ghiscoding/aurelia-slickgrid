export class MouseService {
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
}
