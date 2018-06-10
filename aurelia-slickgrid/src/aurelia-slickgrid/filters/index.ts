import { CompoundDateFilter } from './compoundDateFilter';
import { CompoundInputFilter } from './compoundInputFilter';
import { InputFilter } from './inputFilter';
import { SliderFilter } from './sliderFilter';
import { MultipleSelectFilter } from './multipleSelectFilter';
import { SelectFilter } from './selectFilter';
import { SingleSelectFilter } from './singleSelectFilter';

export const Filters = {
  /** Compound Date Filter (compound of Operator + Date picker) */
  compoundDate: CompoundDateFilter,

  /** Compound Input Filter (compound of Operator + Input) */
  compoundInput: CompoundInputFilter,

  /** Default Filter, input type text filter with a magnifying glass placeholder */
  input: InputFilter,

  /** Default Filter, input type text filter with a magnifying glass placeholder */
  slider: SliderFilter,

  /** Multiple Select filter, which uses 3rd party lib "multiple-select.js" */
  multipleSelect: MultipleSelectFilter,

  /** Single Select filter, which uses 3rd party lib "multiple-select.js" */
  singleSelect: SingleSelectFilter,

  /** Select filter, which uses native DOM element select */
  select: SelectFilter
};

export { FilterFactory } from './filterFactory';
