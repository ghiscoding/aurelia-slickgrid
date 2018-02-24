### Description
You can also create your own Custom Filter with any html/css you want and/or jQuery library you wish to use. Aurelia template (View) are not supported at this point, if you wish to contribute on that end then I certainly accept PR (Pull Request). 

#### Limitations
- as mentioned in the description, only html/css and/or jQuery libraries are supported.
  - this mainly mean that Aurelia templates (Views) are not supported (feel free to contribute).
- SlickGrid uses `table-cell` as CSS for it to display a consistent height for each rows (this keeps the same row height/line-height to always be the same). 
  - all this to say that you might be in a situation were your filter shows in the back of the grid. The best approach to overcome this is to use a modal if you can or if the library support `append to body container`. For example, you can see that `multiple-select.js` support a `container` and is needed for the filter to work as can be seen in the [multipleSelectFilter.ts](https://github.com/ghiscoding/aurelia-slickgrid/blob/master/aurelia-slickgrid/src/aurelia-slickgrid/filters/multipleSelectFilter.ts#L26)

### Demo
[Demo Page](https://ghiscoding.github.io/aurelia-slickgrid/#/slickgrid/example4) / [Demo Client Component](https://github.com/ghiscoding/aurelia-slickgrid/blob/master/aurelia-slickgrid/src/examples/slickgrid/example4.ts) / [Custom InputFilter.ts](https://github.com/ghiscoding/aurelia-slickgrid/blob/master/aurelia-slickgrid/src/examples/slickgrid/custom-inputFilter.ts)

### How to use Custom Filter?
1. You first need to create a `class` using the [Filter interface](https://github.com/ghiscoding/aurelia-slickgrid/blob/master/aurelia-slickgrid/src/aurelia-slickgrid/models/filter.interface.ts). Make sure to create all necessary public properties and functions. 
 - You can see a demo with a [custom-inputFilter.ts](https://github.com/ghiscoding/aurelia-slickgrid/blob/master/aurelia-slickgrid/src/examples/slickgrid/custom-inputFilter.ts) that is used in the [demo - example 4](https://ghiscoding.github.io/aurelia-slickgrid/#/slickgrid/example4)
2. There are two Simply set the filter type to `FilterType.custom` and instantiate your class with `new` (can also pass DI in the constructor if you wish). Here is an example with a custom input filter: 
```javascript 
// define you columns, in this demo Effort Driven will use a Select Filter
this.columnDefinitions = [      
  { id: 'title', name: 'Title', field: 'title' },
  { id: 'description', name: 'Description', field: 'description', type: FieldType.string,
    filterable: true, 
    filter: {
       type: FilterType.custom,
       customFilter: new CustomInputFilter() // create a new instance to make each Filter independent from each other
    }
  }
];

// you also need to enable the filters in the Grid Options
this.gridOptions = {
   enableFiltering: true
};
```

### Default Search Term(s)
If you want to load the grid with certain default filter(s), you can use the following optional properties:
- `searchTerm` (single value) with `singleSelect` or `select`
- `searchTerms` (array of values) with `multipleSelect`

For example, setting a default value into an `input` element, you can simply get the search term with `columnDef.filter.searchTerm` and set the default value in jquery with `$(filterElm).val(this.searchTerm);`

### Collection 
If you want to pass a `collection` to your filter (for example, a multiple-select needs a select list of options), you can then use it in your custom filter through `columnDef.filter.collection`

#### `key/label` pair
By default a `collection` uses the `label/value` pair. You can loop through your `collection` and use the `label/value` properties. For example:
```javascript
// loop through collection to create select option
this.columnDef.filter.collection.forEach((option: SelectOption) => {
  // use the option value & label
  options += `<option value="${option.value}">${option.label}</option>`;
});
```

#### Custom Structure (key/label pair)
What if your `collection` have totally different value/label pair? In this case, you can use the `customStructure` to change the property name(s) to use. You can change the label and/or the value, they can be passed independently. 
For example:
```javascript
// use custom structure value/label pair
const labelName = (this.columnDef.filter.customStructure) ? this.columnDef.filter.customStructure.label : 'label';
const valueName = (this.columnDef.filter.customStructure) ? this.columnDef.filter.customStructure.value : 'value';

this.columnDef.filter.collection.forEach((option: SelectOption) => {
  // use the option value & translated label
  options += `<option value="${option[valueName]}">${option[labelName]}</option>`;
});
```

### How to add Translation?

#### LabelKey
By default a `collection` uses the `label/value` pair without translation or `labelKey/value` pair with translation usage. So if you want to use translations, then you can loop through your `collection` and use the `labelKey/value` properties. For example:
```javascript
this.columnDef.filter.collection.forEach((option: SelectOption) => {
  // translate label      
  const textLabel = (option.labelKey && typeof this.i18n.tr === 'function') ? this.i18n.tr(option.labelKey || ' ') : option.labelKey;

  // use the option value & translated label
  options += `<option value="${option.value}">${textLabel}</option>`;
});
```

### Custom Structure with Translation
What if you want to use `customStructure` and translate the labels? Simply pass the flag `enableTranslateLabel: true`

For example:
```javascript
// use custom structure value/label pair
const labelName = (this.columnDef.filter.customStructure) ? this.columnDef.filter.customStructure.label : 'label';
const valueName = (this.columnDef.filter.customStructure) ? this.columnDef.filter.customStructure.value : 'value';

this.columnDef.filter.collection.forEach((option: SelectOption) => {
  // translate label      
  const textLabel = (option.labelKey && typeof this.i18n.tr === 'function') ? this.i18n.tr(option[labelName] || ' ') : option[labelName];

  // use the option value & translated label
  options += `<option value="${option[valueName]}">${textLabel}</option>`;
});
```
