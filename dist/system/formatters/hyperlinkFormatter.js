System.register([], function (exports_1, context_1) {
    "use strict";
    var hyperlinkFormatter;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            exports_1("hyperlinkFormatter", hyperlinkFormatter = function (row, cell, value, columnDef, dataContext) {
                if (value && typeof value === 'string') {
                    var matchUrl = value.match(/^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:\/~\+#]*[\w\-\@?^=%&amp;\/~\+#])?/i);
                    if (matchUrl && Array.isArray(matchUrl)) {
                        return "<a href=\"" + matchUrl[0] + "\">' + value + '</a>";
                    }
                }
                return '';
            });
        }
    };
});
//# sourceMappingURL=hyperlinkFormatter.js.map