import { OperatorString } from './operatorString';
import { OperatorType } from './operatorType.enum';

export interface GraphqlFilteringOption {
  /** Field name to use when filtering */
  field: string;

  /** Operator to use when filtering */
  operator: OperatorType | OperatorString;

  /** Value to use when filtering */
  value: any | any[];
}
