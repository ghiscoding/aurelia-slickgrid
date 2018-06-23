import { CompoundDateFilter } from './compoundDateFilter';
import { CompoundInputFilter } from './compoundInputFilter';
import { CompoundSliderFilter } from './compoundSliderFilter';
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
    /** Compound Slider Filter (compound of Operator + Slider) */
    compoundSlider: CompoundSliderFilter,
    /** Default Filter, input type text filter */
    input: InputFilter,
    /** Slider Filter */
    slider: SliderFilter,
    /** Multiple Select filter, which uses 3rd party lib "multiple-select.js" */
    multipleSelect: MultipleSelectFilter,
    /** Single Select filter, which uses 3rd party lib "multiple-select.js" */
    singleSelect: SingleSelectFilter,
    /** Select filter, which uses native DOM element select */
    select: SelectFilter
};
export { FilterFactory } from './filterFactory';
//# sourceMappingURL=index.js.map