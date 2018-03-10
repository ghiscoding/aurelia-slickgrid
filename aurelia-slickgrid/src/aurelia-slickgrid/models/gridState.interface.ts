import { CurrentFilter, CurrentSorter } from './../models/index';

export interface GridState {
  /** Filters (and their state, columnId, searchTerm(s)) that are currently applied in the grid */
  filters?: CurrentFilter[] | null;

  /** Sorters (and their state, columnId, direction) that are currently applied in the grid */
  sorters?: CurrentSorter[] | null;

  /** Pagination (and it's state, pageNumber, pageSize) that are currently applied in the grid */
  pagination?: {
    pageNumber: number;
    pageSize: number;
  } | null;
}
