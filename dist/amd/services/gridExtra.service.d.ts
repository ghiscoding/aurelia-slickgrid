export declare class GridExtraService {
    private _grid;
    private _dataView;
    /** Getter for the Grid Options pulled through the Grid Object */
    private readonly _gridOptions;
    /**
     * Initialize the Service
     * @param grid
     * @param dataView
     */
    init(grid: any, dataView: any): void;
    getDataItemByRowNumber(rowNumber: number): any;
    /** Chain the item Metadata with our implementation of Metadata at given row index */
    getItemRowMetadata(previousItemMetadata: any): any;
    /**
     * Highlight then fade a row for x seconds.
     * The implementation follows this SO answer: https://stackoverflow.com/a/19985148/1212166
     * @param rowNumber
     * @param fadeDelay
     */
    highlightRow(rowNumber: number, fadeDelay?: number): void;
    getSelectedRows(): any;
    setSelectedRow(rowIndex: number): void;
    setSelectedRows(rowIndexes: number[]): void;
    renderGrid(): void;
    /**
     * Add an item (data item) to the datagrid
     * @param object dataItem: item object holding all properties of that row
     */
    addItemToDatagrid(item: any): void;
    /**
     * Delete an existing item from the datagrid (dataView)
     * @param object item: item object holding all properties of that row
     */
    deleteDataGridItem(item: any): void;
    /**
     * Delete an existing item from the datagrid (dataView)
     * @param object item: item object holding all properties of that row
     */
    deleteDataGridItemById(id: string | number): void;
    /**
     * Update an existing item with new properties inside the datagrid (dataView)
     * @param object item: item object holding all properties of that row
     */
    updateDataGridItem(item: any): void;
}
