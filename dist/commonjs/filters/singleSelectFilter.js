"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var aurelia_i18n_1 = require("aurelia-i18n");
var aurelia_framework_1 = require("aurelia-framework");
var selectFilter_1 = require("./selectFilter");
var collection_service_1 = require("../services/collection.service");
var SingleSelectFilter = /** @class */ (function (_super) {
    __extends(SingleSelectFilter, _super);
    /**
     * Initialize the Filter
     */
    function SingleSelectFilter(bindingEngine, collectionService, i18n) {
        var _this = _super.call(this, bindingEngine, collectionService, i18n, false) || this;
        _this.bindingEngine = bindingEngine;
        _this.collectionService = collectionService;
        _this.i18n = i18n;
        return _this;
    }
    SingleSelectFilter = __decorate([
        aurelia_framework_1.inject(aurelia_framework_1.BindingEngine, collection_service_1.CollectionService, aurelia_i18n_1.I18N)
    ], SingleSelectFilter);
    return SingleSelectFilter;
}(selectFilter_1.SelectFilter));
exports.SingleSelectFilter = SingleSelectFilter;
//# sourceMappingURL=singleSelectFilter.js.map