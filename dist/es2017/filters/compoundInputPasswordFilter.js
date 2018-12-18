var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { CompoundInputFilter } from './compoundInputFilter';
let CompoundInputPasswordFilter = class CompoundInputPasswordFilter extends CompoundInputFilter {
    /** Initialize the Filter */
    constructor(i18n) {
        super(i18n);
        this.i18n = i18n;
        this.inputType = 'password';
    }
};
CompoundInputPasswordFilter = __decorate([
    inject(I18N)
], CompoundInputPasswordFilter);
export { CompoundInputPasswordFilter };
//# sourceMappingURL=compoundInputPasswordFilter.js.map