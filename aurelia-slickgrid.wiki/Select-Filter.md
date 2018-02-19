### Description
Select (dropdown) filter is useful when we want to filter the grid with 1 defined selection.

### Demo
[Demo Page](https://ghiscoding.github.io/aurelia-slickgrid/#/slickgrid/example4) / [Demo Component](https://github.com/ghiscoding/aurelia-slickgrid/blob/master/aurelia-slickgrid/src/examples/slickgrid/example4.ts)

##### Demo with Localization 
[Demo Page](https://ghiscoding.github.io/aurelia-slickgrid/#/slickgrid/example12) / [Demo Component](https://github.com/ghiscoding/aurelia-slickgrid/blob/master/aurelia-slickgrid/src/examples/slickgrid/example12.ts)

### How to use Select Filter
Simply set the flag `filterable` to True and and enable the filters in the Grid Options. Here is an example with a full column definition: 
```javascript 
// define you columns, in this demo Effort Driven will use a Select Filter
this.columnDefinitions = [      
  { id: 'title', name: 'Title', field: 'title' },
  { id: 'description', name: 'Description', field: 'description', filterable: true },
  { id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven', 
    formatter: Formatters.checkmark, 
    type: FieldType.boolean,
    filterable: true,
    filter: {
       searchTerm: '', // default selection
       type: FormElementType.select,
       selectOptions: [ { value: '', label: '' }, { value: true, label: 'true' }, { value: false, label: 'false' } ]
   }
];

// you also need to enable the filters in the Grid Options
this.gridOptions = {
   enableFiltering: true
};
```

### How to add Translation?
#### LabelKey
For the Select (dropdown) filter, you can fill in the "labelKey" property, if found it will translate it right away. If no `labelKey` is provided nothing will be translated (unless you have `enableTranslateLabel` set to true), else it will use "label"
```javascript 
// define you columns, in this demo Effort Driven will use a Select Filter
this.columnDefinitions = [      
  { id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven', 
    formatter: Formatters.checkmark, 
    type: FieldType.boolean,
    filterable: true,
    filter: {
       searchTerm: '', // default selection
       type: FormElementType.select,
       selectOptions: [ { value: '', label: '' }, { value: true, labelKey: 'TRUE' }, { value: false, label: 'FALSE' } ]
   }
];
```

#### enableTranslateLabel
You could also use the `enableTranslateLabel` which will translate regardless of the label key name (so it could be used with `label`, `labelKey` or even a `customStructure` label).
```javascript 
// define you columns, in this demo Effort Driven will use a Select Filter
this.columnDefinitions = [      
  { id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven', 
    formatter: Formatters.checkmark, 
    type: FieldType.boolean,
    filterable: true,
    filter: {
       enableTranslateLabel: true,
       searchTerm: '', // default selection
       type: FormElementType.select,
       selectOptions: [ { value: '', label: '' }, { value: true, label: 'true' }, { value: false, label: 'false' } ]
   }
];
```

### Custom Structure (key/label pair)
What if your select options (collection) have totally different value/label pair? In this case, you can use the `customStructure` to change the property name(s) to use. You can change the label and/or the value, they can be passed independently. 
```javascript 
// define you columns, in this demo Effort Driven will use a Select Filter
this.columnDefinitions = [      
  { id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven', 
    formatter: Formatters.checkmark, 
    type: FieldType.boolean,
    filterable: true,
    filter: {
       customStructure: {
         label: 'customLabel',
         value: 'customValue'
       },
       searchTerm: '', // default selection
       type: FormElementType.select,
       selectOptions: [
         { customValue: '', customLabel: '' }, 
         { customValue: true, customLabel: 'true' }, 
         { customValue: false, customLabel: 'false' } 
      ]
   }
];
```

### Custom Structure with Translation
What if you want to use `customStructure` and translate the labels? Simply pass the flag `enableTranslateLabel: true`

```javascript 
// define you columns, in this demo Effort Driven will use a Select Filter
this.columnDefinitions = [      
  { id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven', 
    formatter: Formatters.checkmark, 
    type: FieldType.boolean,
    filterable: true,
    filter: {
       customStructure: {
         label: 'customLabel',
         value: 'customValue'
       },
       enableTranslateLabel: true,
       searchTerm: '', // default selection
       type: FormElementType.select,
       selectOptions: [
         { customValue: '', customLabel: '' }, 
         { customValue: true, customLabel: 'TRUE' }, 
         { customValue: false, customLabel: 'FALSE' } 
      ]
   }
];
```