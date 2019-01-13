import { InputFilter } from './inputFilter';

export class InputMaskFilter extends InputFilter {
  /** Initialize the Filter */
  constructor(args) {
    super();
    this.inputType = 'text';
    this.hasMask = true;
  }
}
