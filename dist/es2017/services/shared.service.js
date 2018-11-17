var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { singleton } from 'aurelia-framework';
let SharedService = class SharedService {
    // --
    // public
    /** Getter for All Columns  in the grid (hidden/visible) */
    get allColumns() {
        return this._allColumns;
    }
    /** Setter for All Columns  in the grid (hidden/visible) */
    set allColumns(allColumns) {
        this._allColumns = allColumns;
    }
    /** Getter for the Column Definitions pulled through the Grid Object */
    get columnDefinitions() {
        return (this._grid && this._grid.getColumns) ? this._grid.getColumns() : [];
    }
    /** Getter for SlickGrid DataView object */
    get dataView() {
        return this._dataView;
    }
    /** Setter for SlickGrid DataView object */
    set dataView(dataView) {
        this._dataView = dataView;
    }
    /** Getter for SlickGrid Grid object */
    get grid() {
        return this._grid;
    }
    /** Setter for SlickGrid Grid object */
    set grid(grid) {
        this._grid = grid;
    }
    /** Getter for the Grid Options pulled through the Grid Object */
    get gridOptions() {
        return (this._grid && this._grid.getOptions) ? this._grid.getOptions() : {};
    }
    /** Setter for the Grid Options pulled through the Grid Object */
    set gridOptions(gridOptions) {
        this.gridOptions = gridOptions;
    }
    /** Getter for the Grid Options */
    get groupItemMetadataProvider() {
        return this._groupItemMetadataProvider;
    }
    /** Setter for the Grid Options */
    set groupItemMetadataProvider(groupItemMetadataProvider) {
        this._groupItemMetadataProvider = groupItemMetadataProvider;
    }
    /** Getter for the Visible Columns in the grid */
    get visibleColumns() {
        return this._visibleColumns;
    }
    /** Setter for the Visible Columns in the grid */
    set visibleColumns(visibleColumns) {
        this._visibleColumns = visibleColumns;
    }
};
SharedService = __decorate([
    singleton(true)
], SharedService);
export { SharedService };
//# sourceMappingURL=shared.service.js.map