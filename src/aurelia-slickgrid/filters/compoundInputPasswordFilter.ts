import { inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { CompoundInputFilter } from './compoundInputFilter';

@inject(I18N)
export class CompoundInputPasswordFilter extends CompoundInputFilter {
  /** Initialize the Filter */
  constructor(protected i18n: I18N) {
    super(i18n);
    this.inputType = 'password';
  }
}
