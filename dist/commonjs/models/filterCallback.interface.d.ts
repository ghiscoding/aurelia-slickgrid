import { SearchTerm } from './searchTerm.type';
import { Column } from './column.interface';
import { OperatorString } from './operatorString';
export interface FilterCallbackArg {
    columnDef: Column;
    operator?: OperatorString;
    searchTerm?: SearchTerm;
    searchTerms?: SearchTerm[];
}
export declare type FilterCallback = (e: Event | undefined, args: FilterCallbackArg) => void;
