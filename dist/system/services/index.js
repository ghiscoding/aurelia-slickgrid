System.register(["./filter.service", "./grid-odata.service", "./mouse.service", "./odata.service", "./resizer.service", "./sort.service"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (filter_service_1_1) {
                exports_1({
                    "FilterService": filter_service_1_1["FilterService"]
                });
            },
            function (grid_odata_service_1_1) {
                exports_1({
                    "GridOdataService": grid_odata_service_1_1["GridOdataService"]
                });
            },
            function (mouse_service_1_1) {
                exports_1({
                    "MouseService": mouse_service_1_1["MouseService"]
                });
            },
            function (odata_service_1_1) {
                exports_1({
                    "OdataService": odata_service_1_1["OdataService"]
                });
            },
            function (resizer_service_1_1) {
                exports_1({
                    "ResizerService": resizer_service_1_1["ResizerService"]
                });
            },
            function (sort_service_1_1) {
                exports_1({
                    "SortService": sort_service_1_1["SortService"]
                });
            }
        ],
        execute: function () {
        }
    };
});
//# sourceMappingURL=index.js.map