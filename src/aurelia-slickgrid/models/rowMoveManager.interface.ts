export interface RowMoveManager {
  /**
   * Defaults to 0, the column index position in the grid by default it will show as the first column (index 0).
   * Also note that the index position might vary if you use other extensions, after each extension is created,
   * it will add an offset to take into consideration (1.CheckboxSelector, 2.RowDetail, 3.RowMove)
   */
  columnIndexPosition?: number;

  /** defaults to false, option to cancel edit on drag */
  cancelEditOnDrag?: boolean;

  //
  // Events

  /** Fired after extension (plugin) is registered by SlickGrid */
  onExtensionRegistered?: (plugin: any) => void;

  /** SlickGrid Event fired before the row is moved. */
  onBeforeMoveRows?: (e: Event, args: any) => void;

  /** SlickGrid Event fired while the row is moved. */
  onMoveRows?: (e: Event, args: any) => void;
}
