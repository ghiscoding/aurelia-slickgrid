export class MouseService {
    attachOnMouseHover(grid) {
        grid.onMouseEnter.subscribe(function (e) {
            const cell = grid.getCellFromEvent(e);
            if (cell && cell.row >= 0) {
                grid.setSelectedRows([cell.row]);
                e.preventDefault();
            }
        });
        grid.onMouseLeave.subscribe(function (e) {
            grid.setSelectedRows([]);
            e.preventDefault();
        });
    }
}
//# sourceMappingURL=mouse.service.js.map