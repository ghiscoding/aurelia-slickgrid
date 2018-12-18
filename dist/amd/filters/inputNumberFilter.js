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
define(["require", "exports", "./inputFilter"], function (require, exports, inputFilter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var InputNumberFilter = /** @class */ (function (_super) {
        __extends(InputNumberFilter, _super);
        /** Initialize the Filter */
        function InputNumberFilter() {
            var _this = _super.call(this) || this;
            _this.inputType = 'number';
            return _this;
        }
        return InputNumberFilter;
    }(inputFilter_1.InputFilter));
    exports.InputNumberFilter = InputNumberFilter;
});
//# sourceMappingURL=inputNumberFilter.js.map