import { FieldType } from './fieldType.enum';
import { OperatorString } from './operatorString';
import { SearchTerm } from './searchTerm.type';

export interface FilterConditionOption {
  dataKey?: string;
  operator: OperatorString;
  cellValue: any;
  cellValueLastChar?: string;
  fieldType: FieldType;
  filterSearchType?: FieldType;
  searchTerms?: SearchTerm[] | undefined;
}
