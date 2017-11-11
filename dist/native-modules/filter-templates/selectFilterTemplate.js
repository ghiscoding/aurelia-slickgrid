export var selectFilterTemplate = function (searchTerm, columnDef) {
    if (!columnDef.filter.selectOptions) {
        throw new Error("SelectOptions with value/label is required to populate the Select list, for example:: { filter: type: FormElementType.select, selectOptions: [ { value: '1', label: 'One' } ]')");
    }
    var options = '';
    columnDef.filter.selectOptions.forEach(function (option) {
        options += "<option value=\"" + option.value + "\">" + option.label + "</option>";
    });
    return "<select class=\"form-control search-filter\">" + options + "</select>";
};
//# sourceMappingURL=selectFilterTemplate.js.map