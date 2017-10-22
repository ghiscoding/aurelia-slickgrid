var MouseService = /** @class */ (function () {
    function MouseService() {
    }
    MouseService.prototype.attachOnMouseHover = function (grid) {
        grid.onMouseEnter.subscribe(function (e) {
            var cell = grid.getCellFromEvent(e);
            if (cell && cell.row >= 0) {
                grid.setSelectedRows([cell.row]);
                e.preventDefault();
            }
        });
        grid.onMouseLeave.subscribe(function (e) {
            grid.setSelectedRows([]);
            e.preventDefault();
        });
    };
    return MouseService;
}());
export { MouseService };
//# sourceMappingURL=mouse.service.js.map