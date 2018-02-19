### Description
Input filter is the default filter when enabling filters.

### Demo
[Demo Page](https://ghiscoding.github.io/aurelia-slickgrid/#/slickgrid/example4) / [Demo Component](https://github.com/ghiscoding/aurelia-slickgrid/blob/master/aurelia-slickgrid/src/examples/slickgrid/example4.ts)

### How to use Input Filter
Simply set the flag `filterable` to True and and enable the filters in the Grid Options. Here is an example with a full column definition: 
```javascript 
// define you columns, in this demo Effort Driven will use a Select Filter
this.columnDefinitions = [      
  { id: 'title', name: 'Title', field: 'title' },
  { id: 'description', name: 'Description', field: 'description', filterable: true }
];

// you also need to enable the filters in the Grid Options
this.gridOptions = {
   enableFiltering: true
};
```

### Filtering with Localization (i18n)
When using a regular grid with a JSON dataset (that is without using Backend Service API), the filter might not working correctly on cell values that are translated (because it will try to filter against the translation key instead of the actual formatted value). So to bypass this problem, a new extra `params` was created to resolve this, you need to set `useFormatterOuputToFilter` to True and the filter will, has the name suggest, use the output of the Formatter to filter against. Example:
```javascript 
// define you columns, in this demo Effort Driven will use a Select Filter
this.columnDefinitions = [      
  { id: 'title', name: 'Title', field: 'id', 
    headerKey: 'TITLE', 
    formatter: this.taskTranslateFormatter,  // <-- this could be a custom Formatter or the built-in translateFormatter
    filterable: true, 
    params: { useFormatterOuputToFilter: true } // <-- set this flag to True
  },
  { id: 'description', name: 'Description', field: 'description', filterable: true }
];

// you also need to enable the filters in the Grid Options
this.gridOptions = {
   enableFiltering: true
};

// using a custom translate Formatter OR translateFormatter
taskTranslateFormatter: Formatter = (row, cell, value, columnDef, dataContext) => {
  return this.translate.instant('TASK_X', { x: value });
}
```
