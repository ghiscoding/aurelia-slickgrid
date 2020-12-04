
import { Column, FormatterResultObject } from '@slickgrid-universal/common';
import { SlickGrid } from './slickGrid.interface';

export declare type Formatter<T = any> = (row: number, cell: number, value: any, columnDef: Column<T>, dataContext: T, grid: SlickGrid) => string | FormatterResultObject;
