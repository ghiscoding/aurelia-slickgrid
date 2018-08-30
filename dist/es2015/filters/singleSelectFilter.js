var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { I18N } from 'aurelia-i18n';
import { inject, BindingEngine } from 'aurelia-framework';
import { SelectFilter } from './selectFilter';
import { CollectionService } from '../services/collection.service';
let SingleSelectFilter = class SingleSelectFilter extends SelectFilter {
    /**
     * Initialize the Filter
     */
    constructor(bindingEngine, collectionService, i18n) {
        super(bindingEngine, collectionService, i18n, false);
        this.bindingEngine = bindingEngine;
        this.collectionService = collectionService;
        this.i18n = i18n;
    }
};
SingleSelectFilter = __decorate([
    inject(BindingEngine, CollectionService, I18N)
], SingleSelectFilter);
export { SingleSelectFilter };
//# sourceMappingURL=singleSelectFilter.js.map