import { SearchTerm } from './searchTerm.type';
import { Column } from './column.interface';
import { ColumnFilters } from './columnFilters.interface';
import { OperatorType } from './operatorType.enum';
import { OperatorString } from './operatorString';
import { SlickGrid } from './slickGrid.interface';

export interface FilterChangedArgs {
  /** Was a clear filter triggered? */
  clearFilterTriggered?: boolean;

  /** Column definition */
  columnDef: Column;

  /** Object which contains all the column filters (used by SlickGrid) */
  columnFilters: ColumnFilters;

  /** SlickGrid Grid object */
  grid: SlickGrid;

  /** Operator to use when filtering */
  operator: OperatorType | OperatorString;

  /** Filter search terms */
  searchTerms: SearchTerm[];

  /** Defaults to true, should we trigger an event when querying? */
  shouldTriggerQuery?: boolean;
}
