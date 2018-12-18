System.register([], function (exports_1, context_1) {
    "use strict";
    var DelimiterType;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            (function (DelimiterType) {
                DelimiterType["colon"] = ":";
                DelimiterType["comma"] = ",";
                DelimiterType["equalSign"] = "=";
                DelimiterType["pipe"] = "|";
                DelimiterType["semicolon"] = ";";
                DelimiterType["space"] = " ";
                DelimiterType["tab"] = "\t";
                DelimiterType["doubleColon"] = "::";
                DelimiterType["doublePipe"] = "||";
                DelimiterType["doubleSemicolon"] = ";;";
            })(DelimiterType || (DelimiterType = {}));
            exports_1("DelimiterType", DelimiterType);
        }
    };
});
//# sourceMappingURL=delimiterType.enum.js.map