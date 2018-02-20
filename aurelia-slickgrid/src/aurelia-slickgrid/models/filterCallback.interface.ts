import { Column } from './column.interface';
import { OperatorString } from './operatorString';

export interface FilterCallbackArg {
  columnDef: Column;
  operator?: OperatorString;
  searchTerm?: string | number | boolean;
  searchTerms?: number[] | string[] | boolean[];
}

export type FilterCallback = (e: Event | undefined, args: FilterCallbackArg) => void;
