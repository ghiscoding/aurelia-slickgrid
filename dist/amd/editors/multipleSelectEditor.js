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
define(["require", "exports", "aurelia-framework", "../services/index", "aurelia-i18n", "./selectEditor"], function (require, exports, aurelia_framework_1, index_1, aurelia_i18n_1, selectEditor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MultipleSelectEditor = /** @class */ (function (_super) {
        __extends(MultipleSelectEditor, _super);
        /**
         * Initialize the Editor
         */
        function MultipleSelectEditor(bindingEngine, collectionService, i18n, args) {
            var _this = _super.call(this, bindingEngine, collectionService, i18n, args, true) || this;
            _this.bindingEngine = bindingEngine;
            _this.collectionService = collectionService;
            _this.i18n = i18n;
            _this.args = args;
            return _this;
        }
        MultipleSelectEditor = __decorate([
            aurelia_framework_1.inject(aurelia_framework_1.BindingEngine, index_1.CollectionService, aurelia_i18n_1.I18N)
        ], MultipleSelectEditor);
        return MultipleSelectEditor;
    }(selectEditor_1.SelectEditor));
    exports.MultipleSelectEditor = MultipleSelectEditor;
});
//# sourceMappingURL=multipleSelectEditor.js.map