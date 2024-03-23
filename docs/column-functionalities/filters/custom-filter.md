#### index
- [Filter Complex Object](Input-Filter.md#filter-complex-object)
- [Update Filters Dynamically](Input-Filter.md#update-filters-dynamically)
- [Custom Filter with Aurelia Custom Elements](#custom-filter-with-aurelia-custom-element)

### Demo
[Demo Page](https://ghiscoding.github.io/aurelia-slickgrid/#/slickgrid/example4) / [Demo Client Component](https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example4.ts) / [Custom InputFilter.ts](https://github.com/ghiscoding/aurelia-slickgrid/blob/master/src/examples/slickgrid/custom-inputFilter.ts)

### Description
You can also create your own Custom Filter with any html/css you want and/or jQuery library you wish to use. Aurelia template (View) are not supported at this point, if you wish to contribute on that end then I certainly accept PR (Pull Request).

#### Limitations
- as mentioned in the description, only html/css and/or jQuery libraries are supported.
  - this mainly mean that Aurelia templates (Views) are not supported (feel free to contribute).
- SlickGrid uses `table-cell` as CSS for it to display a consistent height for each rows (this keeps the same row height/line-height to always be the same).
  - all this to say that you might be in a situation were your filter shows in the back of the grid. The best approach to overcome this is to use a modal if you can or if the library support `append to body container`. For example, you can see that `multiple-select.js` support a `container` and is needed for the filter to work as can be seen in the [multipleSelectFilter.ts](https://github.com/ghiscoding/aurelia-slickgrid/blob/master/aurelia-slickgrid/src/aurelia-slickgrid/filters/multipleSelectFilter.ts#L26)

### How to use Custom Filter?
1. You first need to create a `class` using the [Filter interface](https://github.com/ghiscoding/slickgrid-universal/blob/master/packages/common/src/interfaces/filter.interface.ts). Make sure to create all necessary public properties and functions.
 - You can see a demo with a [custom-inputFilter.ts](https://github.com/ghiscoding/aurelia-slickgrid/blob/master/src/examples/slickgrid/custom-inputFilter.ts) that is used in the [demo - example 4](https://ghiscoding.github.io/aurelia-slickgrid/#/slickgrid/example4)
2. There are two methods to use your custom filters on the grid.
   1.  Simply set the `columnDefinition.filter.model` to your new custom Filter class and instantiate it with `new` (you can also use dependency injection in the constructor if you wish). Here is an example with a custom input filter:
   ```typescript
   // define you columns, in this demo Effort Driven will use a Select Filter
   this.columnDefinitions = [
     { id: 'title', name: 'Title', field: 'title' },
     { id: 'description', name: 'Description', field: 'description', type: FieldType.string,
       filterable: true,
       filter: {
          model: CustomInputFilter // create a new instance to make each Filter independent from each other
       }
     }
   ];

   // you also need to enable the filters in the Grid Options
   this.gridOptions = {
      enableFiltering: true
   };
   ```
   2. Or register your filter with the `registerTransient` method on the aurelia container in the startup file (see the demo [index.ts](https://github.com/ghiscoding/aurelia-slickgrid/blob/master/aurelia-slickgrid/src/aurelia-slickgrid/index.ts). It is recommended to use `registerTransient`, though you could use whatever lifetime you want). This registration is usually in `main.ts` or `main.js`. Then in your view model pass your custom filter to `columnDefinition.filter.model` property and we will use aurelia's container to instantiate your filter. Here is that example:

   **myCustomFilter.ts**
   ```typescript
   export class MyCustomFilter implements Filter {
     private $filterElm: any;
     grid: any;
     searchTerms: SearchTerm[];
     columnDef: Column;
     callback: FilterCallback;
     operator: OperatorType | OperatorString = OperatorType.equal;

     init(args: FilterArguments) {
       // ...logic
     }

     clear(triggerFilterKeyup = true) {
       // ...logic
     }

     destroy() {
       // ...logic
     }
   ```
   **main.ts**
   ```typescript
   // import your custom filter from its location
   import { MyCustomFilter } from './cutomFilters/myCustomFilter';

   // main.ts or main.js
   export function configure(aurelia) {
     aurelia.use.standardConfiguration().plugin(PLATFORM.moduleName('aurelia-slickgrid'))


     // this can be registered before or after the plugin
     aurelia.container.registerTransient(FILTER_PLUGIN_NAME, MyCustomFilter);
     aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
   }
   ```

   **my-view-model.ts**
   ```typescript
   // define you columns, in this demo Effort Driven will use a Select Filter
   this.columnDefinitions = [
     { id: 'title', name: 'Title', field: 'title' },
     { id: 'description', name: 'Description', field: 'description', type: FieldType.string,
       filterable: true,
       filter: {
          type: 'my-custom-filter'
       }
     }
   ];

   // you also need to enable the filters in the Grid Options
   this.gridOptions = {
      enableFiltering: true
   };
   ```

### Default Filter Type
By default, the library uses the [inputFilter](https://github.com/ghiscoding/aurelia-slickgrid/blob/master/aurelia-slickgrid/src/aurelia-slickgrid/filters/inputFilter.ts) when none is specified. However, you can override this value with any filter you like during the startup/configuration of your Aurelia application:

**main.ts**
```typescript
  aurelia.use.feature(PLATFORM.moduleName('aurelia-slickgrid/index'), config => {
    // change any of the default global options
    config.options.defaultFilter = CustomInputFilter // or you can use another library Filter
});
```

### Default Search Term(s)
If you want to load the grid with certain default filter(s), you can use the following optional properties:
- `searchTerms` (array of values)

For example, setting a default value into an `input` element, you can simply get the search term with `columnDef.filter.searchTerms` and set the default value in jquery with `$(filterElm).val(this.searchTerms);`

### Collection
If you want to pass a `collection` to your filter (for example, a multiple-select needs a select list of options), you can then use it in your custom filter through `columnDef.filter.collection`

#### `key/label` pair
By default a `collection` uses the `label/value` pair. You can loop through your `collection` and use the `label/value` properties. For example:
```typescript
// loop through collection to create select option
this.columnDef.filter.collection.forEach((option: SelectOption) => {
  // use the option value & label
  options += `<option value="${option.value}">${option.label}</option>`;
});
```

#### Custom Structure (key/label pair)
What if your `collection` have totally different value/label pair? In this case, you can use the `customStructure` to change the property name(s) to use. You can change the label and/or the value, they can be passed independently.
For example:
```typescript
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
```typescript
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
```typescript
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

## Custom Filter with Aurelia Custom Element
I added a new [Example 26](https://ghiscoding.github.io/aurelia-slickgrid/#/slickgrid/example26) which have both Custom Editors & Filters which uses Aurelia Custom Elements. The 2nd column "Assignee" is the column that uses both (it's a simple select dropdown created as an Aurelia Custom Elements [here](https://github.com/ghiscoding/aurelia-slickgrid/blob/master/src/examples/slickgrid/filter-select.ts)) and you need to create a Custom Filter like [here](https://github.com/ghiscoding/aurelia-slickgrid/blob/master/src/examples/slickgrid/custom-aureliaViewModelFilter.ts) and use that Custom Filter in your column definition like [here](https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example26.ts#L110).

Personally I don't find this very straightforward and I don't recommend using Aurelia Custom Elements for Editors/Filters as it adds a lot of boilerplate (compare to 1 step with a jQuery Custom Filter) but if you really wish to go that route, it's now possible following the steps shown below.

The steps to use an Aurelia Custom Element as a Custom Filter are the following:
1. Create a Custom Filter that will handle the creation or compilation of the Aurelia Custom Element into a SlickGrid Filter. For that you can take a look at this [Custom Filter](https://github.com/ghiscoding/aurelia-slickgrid/blob/master/src/examples/slickgrid/custom-aureliaViewModelFilter.ts)
2. Define your Aurelia Custom Element, for example take a look at this simple [Select Custom Element](https://github.com/ghiscoding/aurelia-slickgrid/blob/master/src/examples/slickgrid/filter-select.ts)
3. Use the Custom Filter inside your Column Definitions, for that you can see previous paragraph [here](https://github.com#how-to-use-custom-filter)
