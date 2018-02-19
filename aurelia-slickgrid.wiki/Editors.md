## Inline Editors
`Aurelia-Slickgrid` ships with a few default inline editors (checkbox, float, integer, text, longText). You can see the full list [here](/ghiscoding/aurelia-slickgrid/tree/master/aurelia-slickgrid/src/aurelia-slickgrid/editors), however the `dateEditor` is causing some issues at library build and is not yet available for that reason. 

### Demo
[Demo Page](https://ghiscoding.github.io/aurelia-slickgrid/#/slickgrid/example3) / [Demo ViewModel](https://github.com/ghiscoding/aurelia-slickgrid/blob/master/aurelia-slickgrid/src/examples/slickgrid/example3.ts)

### How to use Inline Editors
Simply call the `editor` in your column definition with the `Editors` you want, as for example (`editor: Editors.text`). Here is an example with a full column definition: 
```javascript 
this.columnDefinitions = [      
      { id: 'title', name: 'Title', field: 'title', type: FieldType.string, editor: Editors.longText },
      { id: 'duration', name: 'Duration (days)', field: 'duration', type: FieldType.number, editor: Editors.text },
      { id: 'complete', name: '% Complete', field: 'percentComplete', type: FieldType.number, editor: Editors.integer },
      { id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven', formatter: Formatters.checkmark, type: FieldType.number, editor: Editors.checkbox }
    ];
```

#### Editor Output Type
You could also define an `outputType` to an inline editor. The only built-in Editor with this functionality for now is the `dateEditor`. For example, on a date field, we can call this `outputType: fieldType.dateIso` (by default it uses `dateUtc` as the output):
```javascript
this.columnDefinitions = [  
 { id: 'start', name: 'Start', field: 'start', type: FieldType.date, editor: Editors.date, outputType: fieldType.dateIso }
];
```

### Perform an action after inline edit
#### Recommended way
What is ideal is to bind to a SlickGrid Event, for that you can take a look at this [Wiki - On Events](/ghiscoding/aurelia-slickgrid/wiki/Grid-&-DataView-Events)

#### Not the recommended way
You could also, perform an action after the item changed event with `onCellChange`. However, this is not the recommended way, since it would require to add a `onCellChange` on every every single column definition. 

## Inline OnClick Editor (icon click)
Instead of an inline editor, you might want to simply click on an edit icon that could call a modal window, or a redirect URL, or whatever you wish to do. For that you can use the inline `onCellClick` event and define a callback function for the action (you could also create your own [Custom Formatter](https://github.com/ghiscoding/aurelia-slickgrid/wiki/Formatters)). 
- The `Formatters.editIcon` will give you a pen icon, while a `Formatters.deleteIcon` is an "x" icon
```javascript
this.columnDefinitions = [
   {
      id: 'edit', field: 'id',
      formatter: Formatters.editIcon,
      maxWidth: 30,
      onCellClick: (args: OnEventArgs) => {
        console.log(args);
      }
   },
   // ...
];
```
The `args` returned to the `onCellClick` callback is of type `OnEventArgs` which is the following:
```javascript
{
  columnDef: Column;
  dataContext: any;  // basically the row data
  dataView: any;
  grid: any;
  gridDefinition: GridOption;
}
```