### Definition
`Formatters` are functions that can be used to change and format certain column(s) in the grid. Please note that it does not alter the input data, it simply changes the styling of the column data (what the user visually see). 

A good example of a `Formatter` could be a column name `isActive` which is a `boolean` field with input data as `True` or `False`. User would prefer to simply see a checkbox as a visual indication representing the `True` flag, for this behavior you can use `Formatters.checkmark` which will use [Font-Awesome](http://fontawesome.io/icons/) icon of `fa-check` when `True` or an empty string when `False`.

For a [UI sample](/ghiscoding/aurelia-slickgrid/wiki/Formatters#ui-sample), scroll down below.

### Demo
[Demo Page](https://ghiscoding.github.io/aurelia-slickgrid/#/slickgrid/example2) / [Demo ViewModel](/ghiscoding/aurelia-slickgrid/blob/master/aurelia-slickgrid/src/examples/slickgrid/example2.ts)

### Provided Formatters
`Aurelia-Slickgrid` ships with a few `Formatters` by default which helps with common fields, you can see the [entire list here](/ghiscoding/aurelia-slickgrid/tree/master/aurelia-slickgrid/src/aurelia-slickgrid/formatters). 

### Extra Arguments/Params
What if you want to pass extra arguments that you want to use within the Formatter? You can use `params` for that. For example, let say you have a custom formatter to build a select list (dropdown), you could do it this way:
```javascript
let optionList = ['True', 'False'];

this.columnDefinitions = [
      { id: 'title', field: 'title',
        headerTranslate: 'TITLE', 
        formatter: myCustomSelectFormatter,
        params: { options: optionList }
      },
```

#### List of provided `Formatters`
- `arrayToCsv` : takes an array of text and returns it as CSV string
- `checkbox` : a simple HTML checkbox (it's preferable to use `checkmark` for a better UI)
- `checkmark` : uses Font-Awesome [(fa-check)](http://fontawesome.io/icon/check/)
- `dateIso` : represents a Date in ISO format (YYYY-MM-DD)
- `dateTimeIso` : represents a Date in ISO format & time in 24hrs (YYYY-MM-DD h:mm:ss) 
- `dateTimeIsoAmPm` : represents a Date in ISO format & time am/pm (YYYY-MM-DD h:mm:ss a) 
- `dateUs` : represents a Date in US format (MM/DD/YYYY)
- `dateTimeUs` : represents a Date in ISO format & time in 24hrs (MM/DD/YYYY h:mm:ss) 
- `dateTimeUsAmPm` : represents a Date in ISO format & time am/pm (MM/DD/YYYY h:mm:ss a) 
- `deleteIcon`: add an delete icon using Font Awesome (`fa-trash`), you can change the color via the CSS class `delete-icon`.
- `editIcon`: add an edit icon using Font Awesome (`fa-pencil`), you can change the color via the CSS class `edit-icon`.
- `hyperlink`: format a link into a clickable hyperlink url
- `lowercase`: to lowercase the cell value text
- `multiple`: pipe multiple formatters (executed in sequence), use `params` to pass the list of formatters.
   - example: `{ field: 'title', formatter: Formatters.multiple, params: { formatters: [ Formatters.lowercase, Formatters.uppercase ] }`
- `percentComplete` : takes a percentage value (0-100%), displays a bar following this logic:
   - `red`: < 30%, `grey`: < 70%, `green`: >= 70%
- `percentCompleteBar` : same as `percentComplete` but uses [Bootstrap - Progress Bar with label](https://getbootstrap.com/docs/3.3/components/#progress-label).
- `uppercase`: to uppercase the cell value text
- `yesNo` : from a `boolean` value, it will display `Yes` or `No` as text

**Note:** The list might not always be up to date, you can refer to the [Formatters export](/ghiscoding/aurelia-slickgrid/tree/master/aurelia-slickgrid/src/aurelia-slickgrid/formatters/index.ts) to know exactly which ones are available.

#### Usage
To use any of them, you need to import `Formatters` from `Aurelia-Slickgrid` and add a `formatter: ...` in your column definitions as shown below:
```javascript
import { Formatters } from 'aurelia-slickgrid';

export class Example {
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];

  constructor() {
    // define the grid options & columns and then create the grid itself
    this.defineGrid();
  }

  defineGrid() {
    this.columnDefinitions = [
      { id: 'title', name: 'Title', field: 'title' },
      { id: 'duration', name: 'Duration (days)', field: 'duration' },
      { id: '%', name: '% Complete', field: 'percentComplete', formatter: Formatters.percentComplete },
      { id: 'start', name: 'Start', field: 'start', formatter: Formatters.dateIso },
      { id: 'finish', name: 'Finish', field: 'finish', formatter: Formatters.dateIso },
      { id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven', formatter: Formatters.checkmark }
    ];
  }
}
```

## Custom Formatter
You could also create your own custom `Formatter` by simply following the structure shown below.

## PostRender Formatter
SlickGrid also support Post Render Formatter (asynchronously) via the Column property `asyncPostRender` (you will also need to enable in the grid options via `enableAsyncPostRender`). When would you want to use this? It's useful if your formatter is expected to take a while to render, like showing a graph with Sparklines, and you don't want to delay rendering your grid, the Post Render will happen after all the grid is loaded.

To see it in action, from the 6pac samples, click [here](http://6pac.github.io/SlickGrid/examples/example10-async-post-render.html)
Code example:
```javascript
const renderSparklineFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any) => {
    var vals = [
      dataContext["n1"],
      dataContext["n2"],
      dataContext["n3"],
      dataContext["n4"],
      dataContext["n5"]
    ];
    $(cellNode).empty().sparkline(vals, {width: "100%"});
  }

 defineGrid() {
   this.columnDefinitions = [
      { id: 'title', name: 'Title', field: 'title' },
      { id: "chart", name: "Chart", sortable: false, width: 60, 
         formatter: waitingFormatter, 
         rerenderOnResize: true, 
         asyncPostRender: renderSparklineFormatter
      }
    ];
 }
```

#### TypeScript function signature
```javascript
export type Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any) => string;
```

#### Example of a Custom Formatter
For example, we will use `Font-Awesome` with a `boolean` as input data, and display a (fire) icon when `True` or a (snowflake) when `False`. This custom formatter is actually display in the [UI sample](/ghiscoding/aurelia-slickgrid/wiki/Formatters#ui-sample) shown below.
```javascript
// create a custom Formatter with the Formatter type
const myCustomCheckboxFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any) =>
  value ? `<i class="fa fa-fire" aria-hidden="true"></i>` : '<i class="fa fa-snowflake-o" aria-hidden="true"></i>';
```
#### More Complex Example
If you need to add more complex logic to a `Formatter`, you can take a look at the [percentCompleteBar](/ghiscoding/aurelia-slickgrid/blob/master/aurelia-slickgrid/src/aurelia-slickgrid/formatters/percentCompleteBarFormatter.ts) `Formatter` for more inspiration.

## UI Sample
![Default Slickgrid Example](https://github.com/ghiscoding/aurelia-slickgrid/blob/master/screenshots/formatters.png)