import { ColumnFilters } from './columnFilters.interface';
import { SearchTerm } from './searchTerm.type';
export interface FilterChangedArgs {
    columnFilters: ColumnFilters;
    grid: any;
    searchTerm: SearchTerm;
    searchTerms: SearchTerm[];
}
