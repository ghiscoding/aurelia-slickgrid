var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "aurelia-framework", "aurelia-i18n", "./../models/index", "../sorters/sorterUtilities"], function (require, exports, aurelia_framework_1, aurelia_i18n_1, index_1, sorterUtilities_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CollectionService = /** @class */ (function () {
        function CollectionService(i18n) {
            this.i18n = i18n;
        }
        /**
         * Filter items from a collection
         * @param collection
         * @param filterBy
         */
        CollectionService.prototype.filterCollection = function (collection, filterBy) {
            var filteredCollection = [];
            if (filterBy) {
                var property_1 = filterBy.property || '';
                var operator = filterBy.operator || index_1.OperatorType.equal;
                var value_1 = filterBy.value || '';
                if (operator === index_1.OperatorType.equal) {
                    filteredCollection = collection.filter(function (item) { return item[property_1] !== value_1; });
                }
                else {
                    filteredCollection = collection.filter(function (item) { return item[property_1] === value_1; });
                }
            }
            return filteredCollection;
        };
        /**
         * Sort items in a collection
         * @param collection
         * @param sortBy
         * @param columnDef
         * @param translate
         */
        CollectionService.prototype.sortCollection = function (collection, sortBy, enableTranslateLabel) {
            var _this = this;
            var sortedCollection = [];
            if (sortBy) {
                var property_2 = sortBy.property || '';
                var sortDirection_1 = sortBy.hasOwnProperty('sortDesc') ? (sortBy.sortDesc ? -1 : 1) : 1;
                var fieldType_1 = sortBy.fieldType || index_1.FieldType.string;
                sortedCollection = collection.sort(function (dataRow1, dataRow2) {
                    var value1 = (enableTranslateLabel) ? _this.i18n.tr(dataRow1[property_2] || ' ') : dataRow1[property_2];
                    var value2 = (enableTranslateLabel) ? _this.i18n.tr(dataRow2[property_2] || ' ') : dataRow2[property_2];
                    var result = sorterUtilities_1.sortByFieldType(value1, value2, fieldType_1, sortDirection_1);
                    return result;
                });
            }
            return sortedCollection;
        };
        CollectionService = __decorate([
            aurelia_framework_1.inject(aurelia_i18n_1.I18N)
        ], CollectionService);
        return CollectionService;
    }());
    exports.CollectionService = CollectionService;
});
//# sourceMappingURL=collection.service.js.map