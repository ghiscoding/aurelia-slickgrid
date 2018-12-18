System.register([], function (exports_1, context_1) {
    "use strict";
    var KeyCode;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            (function (KeyCode) {
                KeyCode[KeyCode["BACKSPACE"] = 8] = "BACKSPACE";
                KeyCode[KeyCode["DELETE"] = 46] = "DELETE";
                KeyCode[KeyCode["DOWN"] = 40] = "DOWN";
                KeyCode[KeyCode["END"] = 35] = "END";
                KeyCode[KeyCode["ENTER"] = 13] = "ENTER";
                KeyCode[KeyCode["ESCAPE"] = 27] = "ESCAPE";
                KeyCode[KeyCode["HOME"] = 36] = "HOME";
                KeyCode[KeyCode["INSERT"] = 45] = "INSERT";
                KeyCode[KeyCode["LEFT"] = 37] = "LEFT";
                KeyCode[KeyCode["PAGE_DOWN"] = 34] = "PAGE_DOWN";
                KeyCode[KeyCode["PAGE_UP"] = 33] = "PAGE_UP";
                KeyCode[KeyCode["RIGHT"] = 39] = "RIGHT";
                KeyCode[KeyCode["TAB"] = 9] = "TAB";
                KeyCode[KeyCode["UP"] = 38] = "UP";
            })(KeyCode || (KeyCode = {}));
            exports_1("KeyCode", KeyCode);
        }
    };
});
//# sourceMappingURL=keyCode.enum.js.map