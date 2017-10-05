System.register(["./inputFilterTemplate", "./selectFilterTemplate"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var inputFilterTemplate_1, selectFilterTemplate_1, FilterTemplates;
    return {
        setters: [
            function (inputFilterTemplate_1_1) {
                inputFilterTemplate_1 = inputFilterTemplate_1_1;
            },
            function (selectFilterTemplate_1_1) {
                selectFilterTemplate_1 = selectFilterTemplate_1_1;
            }
        ],
        execute: function () {
            exports_1("FilterTemplates", FilterTemplates = {
                input: inputFilterTemplate_1.inputFilterTemplate,
                select: selectFilterTemplate_1.selectFilterTemplate
            });
        }
    };
});
