var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var MultipleSelectFilter = /** @class */ (function (_super) {
    __extends(MultipleSelectFilter, _super);
    /**
     * Initialize the Filter
     */
    function MultipleSelectFilter(bindingEngine, collectionService, i18n) {
        var _this = _super.call(this, bindingEngine, collectionService, i18n, true) || this;
        _this.bindingEngine = bindingEngine;
        _this.collectionService = collectionService;
        _this.i18n = i18n;
        return _this;
    }
    MultipleSelectFilter = __decorate([
        inject(BindingEngine, CollectionService, I18N)
    ], MultipleSelectFilter);
    return MultipleSelectFilter;
}(SelectFilter));
export { MultipleSelectFilter };
//# sourceMappingURL=multipleSelectFilter.js.map