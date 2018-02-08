export const selectFilterTemplate = (searchTerm, columnDef, i18n) => {
    if (!columnDef.filter.selectOptions) {
        throw new Error(`SelectOptions with value/label (or value/labelKey when using Locale) is required to populate the Select list, for example:: { filter: type: FormElementType.select, selectOptions: [ { value: '1', label: 'One' } ]')`);
    }
    let options = '';
    const labelName = (columnDef.filter.customStructure) ? columnDef.filter.customStructure.label : 'label';
    const valueName = (columnDef.filter.customStructure) ? columnDef.filter.customStructure.value : 'value';
    columnDef.filter.selectOptions.forEach((option) => {
        if (!option || (option[labelName] === undefined && option.labelKey === undefined)) {
            throw new Error(`SelectOptions with value/label (or value/labelKey when using Locale) is required to populate the Select list, for example:: { filter: type: FormElementType.select, selectOptions: [ { value: '1', label: 'One' } ]')`);
        }
        const labelKey = option.labelKey || option[labelName];
        const textLabel = ((option.labelKey || columnDef.filter.enableTranslateLabel) && i18n && typeof i18n.tr === 'function') ? i18n.tr(labelKey || ' ') : labelKey;
        options += `<option value="${option[valueName]}">${textLabel}</option>`;
    });
    return `<select class="form-control search-filter">${options}</select>`;
};
//# sourceMappingURL=selectFilterTemplate.js.map