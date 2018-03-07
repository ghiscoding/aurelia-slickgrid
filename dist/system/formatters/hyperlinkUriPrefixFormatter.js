System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var hyperlinkUriPrefixFormatter;
    return {
        setters: [],
        execute: function () {
            /** Takes an hyperlink URI prefix (passed in column definition "params.uriPrefix") and adds the cell value. The structure will be "<a href="uriPrefix">value</a>"  */
            exports_1("hyperlinkUriPrefixFormatter", hyperlinkUriPrefixFormatter = function (row, cell, value, columnDef, dataContext) {
                var uriPrefix = (columnDef && columnDef.params && columnDef.params.uriPrefix) ? columnDef.params.uriPrefix : '';
                if (value && uriPrefix && typeof uriPrefix === 'string' && !uriPrefix.includes('<script>')) {
                    uriPrefix += value;
                    return '<a href="' + uriPrefix + '">' + value + '</a>';
                }
                return '';
            });
        }
    };
});
//# sourceMappingURL=hyperlinkUriPrefixFormatter.js.map