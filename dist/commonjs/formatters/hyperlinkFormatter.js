"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hyperlinkFormatter = function (row, cell, value, columnDef, dataContext) {
    var matchUrl = value.match(/^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:\/~\+#]*[\w\-\@?^=%&amp;\/~\+#])?/, 'i');
    if (matchUrl && Array.isArray(matchUrl)) {
        return "<a href=\"" + matchUrl[0] + "\">' + value + '</a>";
    }
    return '';
};
//# sourceMappingURL=hyperlinkFormatter.js.map