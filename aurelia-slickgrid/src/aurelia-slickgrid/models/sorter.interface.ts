import { Column } from './column.interface';

export type Sorter = (value1: any, value2: any, sortDirection: number, sortColumn?: Column) => number;
