System.register(["./inputFilter"], function (exports_1, context_1) {
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
    var inputFilter_1, InputPasswordFilter;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (inputFilter_1_1) {
                inputFilter_1 = inputFilter_1_1;
            }
        ],
        execute: function () {
            InputPasswordFilter = /** @class */ (function (_super) {
                __extends(InputPasswordFilter, _super);
                /** Initialize the Filter */
                function InputPasswordFilter() {
                    var _this = _super.call(this) || this;
                    _this.inputType = 'password';
                    return _this;
                }
                return InputPasswordFilter;
            }(inputFilter_1.InputFilter));
            exports_1("InputPasswordFilter", InputPasswordFilter);
        }
    };
});
//# sourceMappingURL=inputPasswordFilter.js.map