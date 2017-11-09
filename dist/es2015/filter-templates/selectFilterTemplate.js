export const selectFilterTemplate = (searchTerm, columnDef) => {
    if (!columnDef.filter.selectOptions) {
        throw new Error(`SelectOptions with value/label is required to populate the Select list, for example:: { filter: type: FormElementType.select, selectOptions: [ { value: '1', label: 'One' } ]')`);
    }
    let options = '';
    columnDef.filter.selectOptions.forEach((option) => {
        options += `<option value="${option.value}">${option.label}</option>`;
    });
    return `<select class="form-control search-filter">${options}</select>`;
};
//# sourceMappingURL=selectFilterTemplate.js.map