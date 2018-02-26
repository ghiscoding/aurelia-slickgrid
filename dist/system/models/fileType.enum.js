System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var FileType;
    return {
        setters: [],
        execute: function () {
            (function (FileType) {
                FileType["csv"] = "csv";
                FileType["doc"] = "doc";
                FileType["docx"] = "docx";
                FileType["pdf"] = "pdf";
                FileType["txt"] = "txt";
                FileType["xls"] = "xls";
                FileType["xlsx"] = "xlsx";
            })(FileType || (FileType = {}));
            exports_1("FileType", FileType);
        }
    };
});
//# sourceMappingURL=fileType.enum.js.map