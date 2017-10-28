System.register(["./dateEditor", "./floatEditor", "./integerEditor", "./longTextEditor", "./textEditor"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var dateEditor_1, floatEditor_1, integerEditor_1, longTextEditor_1, textEditor_1, Editors;
    return {
        setters: [
            function (dateEditor_1_1) {
                dateEditor_1 = dateEditor_1_1;
            },
            function (floatEditor_1_1) {
                floatEditor_1 = floatEditor_1_1;
            },
            function (integerEditor_1_1) {
                integerEditor_1 = integerEditor_1_1;
            },
            function (longTextEditor_1_1) {
                longTextEditor_1 = longTextEditor_1_1;
            },
            function (textEditor_1_1) {
                textEditor_1 = textEditor_1_1;
            }
        ],
        execute: function () {
            exports_1("Editors", Editors = {
                date: dateEditor_1.DateEditor,
                float: floatEditor_1.FloatEditor,
                integer: integerEditor_1.IntegerEditor,
                longText: longTextEditor_1.LongTextEditor,
                text: textEditor_1.TextEditor
            });
        }
    };
});
//# sourceMappingURL=index.js.map