import * as $ from 'jquery';
export class GridExtraService {
    init(grid, dataView) {
        this._grid = grid;
        this._dataView = dataView;
    }
    /** Chain the item Metadata with our implementation of Metadata at given row index */
    getItemRowMetadata(previousItemMetadata) {
        return (rowNumber) => {
            const item = this._dataView.getItem(rowNumber);
            let meta = {
                cssClasses: ''
            };
            if (typeof previousItemMetadata === 'object' && !$.isEmptyObject(previousItemMetadata)) {
                meta = previousItemMetadata(rowNumber);
            }
            if (item && item._dirty) {
                meta.cssClasses = (meta.cssClasses || '') + ' dirty';
            }
            if (item && item.rowClass) {
                meta.cssClasses += ` ${item.rowClass}`;
                meta.cssClasses += ` row${rowNumber}`;
            }
            return meta;
        };
    }
    /**
     * Highlight then fade a row for x seconds.
     * The implementation follows this SO answer: https://stackoverflow.com/a/19985148/1212166
     * @param {number} rowNumber
     * @param {number} fadeDelay
     */
    highlightRow(rowNumber, fadeDelay = 1500) {
        // chain current item Metadata with our own Metadata for implementing highligh CSS styling
        const previousMetadata = this._dataView.getItemMetadata;
        this._grid.setSelectedRows([rowNumber]);
        this._dataView.getItemMetadata = this.getItemRowMetadata(this._dataView.getItemMetadata);
        const item = this._dataView.getItem(rowNumber);
        item.rowClass = 'highlight';
        this._dataView.updateItem(item.id, item);
        const gridOptions = this._grid.getOptions();
        // highlight the row for a user defined timeout
        const rowElm = $(`#${gridOptions.gridId}`)
            .find(`.highlight.row${rowNumber}`)
            .first();
        // delete the row's CSS that was attached for highlighting
        setTimeout(() => {
            delete item.rowClass;
            this._dataView.updateItem(item.id, item);
        }, fadeDelay + 10);
    }
    setSelectedRow(rowIndex) {
        this._grid.setSelectedRows([rowIndex]);
    }
    setSelectedRows(rowIndexes) {
        this._grid.setSelectedRows(rowIndexes);
    }
}
//# sourceMappingURL=gridExtra.service.js.map