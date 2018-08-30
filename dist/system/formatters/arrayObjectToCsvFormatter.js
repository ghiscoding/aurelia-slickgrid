System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var arrayObjectToCsvFormatter;
    return {
        setters: [],
        execute: function () {
            exports_1("arrayObjectToCsvFormatter", arrayObjectToCsvFormatter = function (row, cell, value, columnDef, dataContext) {
                var propertyNames = columnDef && columnDef.params && columnDef.params.propertyNames;
                var parentObjectKeyName = columnDef && columnDef.field && columnDef.field.split('.')[0]; // e.g. "users.roles" would be "users"
                if (!propertyNames || !Array.isArray(propertyNames) || !parentObjectKeyName) {
                    throw new Error("Formatters.arrayObjectToCsv requires you to pass an array of \"propertyNames\" (declared in \"params\") that you want to pull the data from.\n      For example, if we have an array of user objects that have the property of firstName & lastName then we need to pass in your column definition:: { params: { propertyNames: ['firtName'] }}");
                }
                // the dataContext holds all the data, so we can find the values we want even when "value" argument might be null
                // e.g. if we want to use the propertyNames of ['firstName', 'lastName'] from the "users" array of objects
                if (dataContext[parentObjectKeyName] && Array.isArray(dataContext[parentObjectKeyName])) {
                    // we will 1st get the object from the dataContext, then
                    if (Array.isArray(dataContext[parentObjectKeyName])) {
                        var outputStrings_1 = [];
                        dataContext[parentObjectKeyName].forEach(function (data) {
                            var strings = [];
                            // 2nd from that data loop through all propertyNames we want to use (e.g.: ['firstName', 'lastName'])
                            propertyNames.forEach(function (prop) {
                                strings.push(data[prop]);
                            });
                            // we will join these strings with spaces (e.g. 'John Doe' where 'John' was firstName and 'Doe' was lastName)
                            outputStrings_1.push(strings.join(' '));
                        });
                        // finally join all the output strings by CSV (e.g.: 'John Doe, Jane Doe')
                        var output = outputStrings_1.join(', ');
                        return "<span title=\"" + output + "\">" + output + "</span>";
                    }
                }
                return '';
            });
        }
    };
});
//# sourceMappingURL=arrayObjectToCsvFormatter.js.map