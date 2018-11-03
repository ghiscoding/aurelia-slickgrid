export interface RowDetailViewOption {
  /** A CSS class to be added to the row detail */
  cssClass?: string;

  /** Defaults to false, when True will load the data once and then reuse it. */
  loadOnce?: boolean;

  /** Template that will be used before the async process (typically used to show a spinner/loading) */
  preTemplate?: any;

  /** Template that will be loaded once the async function finishes */
  postTemplate: any;

  /** Async server function call */
  process: (item: any) => Promise<any>;

  /**
   * How many grid rows do we want to use for the detail panel view
   * also note that the detail view adds an extra 1 row for padding purposes
   * so if you choose 4 panelRows, the display will in fact use 5 rows
   */
  panelRows: number;

  /** Defaults to false, when True will open the row detail on a row click (from any column) */
  useRowClick?: boolean;

  /** Defaults to '_', prefix used for all the plugin metadata added to the item object (meta e.g.: padding, collapsed, parent) */
  keyPrefix: string;
}
