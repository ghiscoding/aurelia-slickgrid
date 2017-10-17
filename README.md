# Aurelia-Slickgrid
One of the best javascript datagrid [SlickGrid](https://github.com/mleibman/SlickGrid) which was originally developed by @mleibman is now available to Aurelia. I have used a few datagrids and slickgrid beats most of them in terms of functionalities and performance (it can easily deal with even a million row).

### SlickGrid Source
We will be using [6pac SlickGrid fork](https://github.com/6pac/SlickGrid/) (the most active fork since the original @mleibman fork was closed some time ago by his author personal reasons).

### Goal
The goal is of course to be able to run SlickGrid within Aurelia but also to incorporate as much as possible the entire list of functionalities (and more) that SlickGrid offers (you can see a vast list of samples on the [6pac SlickGrid examples](https://github.com/6pac/SlickGrid/wiki/Examples) website).

### NPM Package
[Aurelia-Slickgrid on NPM](https://www.npmjs.com/package/aurelia-slickgrid)

## Wiki / Documentation
The Wiki is where all the documentation and instructions will go, so please consult the [Aurelia-Validation - Wiki](https://github.com/ghiscoding/aurelia-slickgrid/wiki) before opening any issues. The [Wiki - HOWTO](https://github.com/ghiscoding/aurelia-slickgrid/wiki/HOWTO---Step-by-Step) is a great place to start with.


<a name="main-features"></a>

## Main features
You can see some screenshots below and the instructions down below.

This is a work in progress, but so far here are some of the features that `aurelia-slickgrid` brings (on top of Slickgrid itself):
- Easier use of SlickGrid within `Aurelia` as it is just a component (simply pass a column definitions and a dataset and you're good to go)
- Bootstrap Theme with SASS variables for extra customization (if you create a theme, then please make a PR)
- Auto-resize, a boolean flag, will resize the datagrid viewport with available space even on browser resize (basically takes available space by the given div container)
- Integrated Plugins
    - Column Picker (show/hide any column by doing `right+click` in the header, click [here to see print screen](/screenshots/columnPicker.png)).
- Server side
    - Filtering
    - Sorting
    - Pagination (which is in itself another Aurelia component)
    - All of these functionalities are expandables and currently ships with a simple OData service
        - customizable with your own services by using `onFilterChanged()`, `onPaginationChanged()` and `onSortChanged()`.
        - extra services might come in the future (you could add yours and if you do, please make PR)
- Some Features of SlickGrid itself which are working out of the gate
  - Sort/Multi-Sort (client/server side)
  - Header Row with Filters (currently support `Input` and `Select` dropdown, multi-select is planned)
  - Formatters (a few default ones were added, and you can easily create custom ones too)
  - Optimized DataView which brings a lot of functionalities (sort, grouping, and more)
    - even server side data is saved into the SlickGrid DataView
- ... more to come

<a name="missing-features"></a>

## Missing features (planned items, not in necessarily in order of execution)
The following are SlickGrid features which are not yet included in this library
- Inline Editors
- Filters to support multi-select dropdown and eventually custom filters
- Plugins (Header Menu, Grid Menu, Column Header Buttons)
- Row selection, will probably provide a `onRowsChanged()` in the `gridOptions` object
- Cell click, will probably provide a `onCellClicked()` in the `gridOptions` object

## Screenshots

Screenshots from the demo app with the `Bootstrap` theme (that is the only available theme, but there is a lot of SASS variables to make it look like Material, or other theme if you wish to. If you create a new theme, please submit a PR).

### Slickgrid example with Formatters (last column shown is a custom Formatter)

![Default Slickgrid Example](/screenshots/formatters.png)

### Filter and Sort (clientside with DataView)

![Slickgrid Server Side](/screenshots/filter_and_sort.png)

### Slickgrid Example with Server Side (Filter/Sort/Pagination)

![Slickgrid Server Side](/screenshots/pagination.png)

<a name="main-features"></a>
## `Aurelia-Slickgrid` - Main features
This is a work in progress, but so far here is some of the features that `aurelia-slickgrid` brings (on top of Slickgrid itself):
- Easier use of `plugin()` within `Aurelia`
- Auto-resize datagrid viewport with available space (basically take space available by the given div container)
- Server side sorting
- Server side pagination (pager is an Aurelia custom element)
- ... more to come

## How to use Aurelia-Slickgrid?
`Aurelia-Slickgrid` is a wrapper of `Slickgrid-ES6` with extra features (like grid autoResize, backend sorting/pagination). These extra features (specifically coded for Aurelia) are under `SlickgridService`, however all the classes of `Slickgrid-ES6` are also available. The full list of classes that are available from `aurelia-slickgrid` are:

```javascript
import {Formatters} from 'aurelia-slickgrid';
```

## Installation
You can run the examples or build your own by doing the following.

### Aurelia-CLI / Webpack
```bash
npm install --save aurelia-slickgrid
```
#### Aurelia-CLI
For `CLI` you will need to add both plugins (`aurelia-slickgrid` and `slickgrid-es6`) to your `aurelia.json` file
```javascript
"jquery",
"moment",
{
  "name": "aurelia-slickgrid",
  "path": "../node_modules/aurelia-slickgrid/dist/amd",
  "main": "index",
  "resources": [
    "**/*.{css,html}"
  ]
},
{
  "name": "jquery-event",
  "path": "../node_modules/slickgrid/lib",
  "main": "jquery.event.drag-2.3.0"
},
{
  "name": "jquery-ui",
  "path": "../node_modules/slickgrid/lib",
  "main": "jquery-ui-1.11.3.min"
},
{
  "name": "slickgrid",
  "main": "slick.grid",
  "path": "../node_modules/slickgrid",
  "deps": [
    "jquery",
    "jquery-event",
    "jquery-ui"
  ]
}
```

#### Aurelia (main)
Make the plugin available globally in your `main.js` file.
```javascript
export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin('aurelia-slickgrid')
    .feature('resources');

  aurelia.start().then(() => aurelia.setRoot());
}
```
And finally use it your code
```javascript
import {inject} from 'aurelia-framework';
import {SlickService} from 'aurelia-slickgrid';

@inject(SlickService)
export class List {
  gridOptions = {}; // define your grid Options
  gridColumns = {}; // define your grid columns

  constructor(slickService) {
    this.slickgrid = slickService;
  }

  attached() {
    this.slickgrid.createGrid('myGrid', this.gridColumns, this.gridOptions, data);
  }
}
```

## Examples
I now have a working set of 10 Examples (however 4 & 6 are broken because of Plugins that is not bundled correctly in `Slickgrid-ES6`).

### Aurelia-CLI
```bash
git clone https://github.com/ghiscoding/aurelia-slickgrid
cd aurelia-slickgrid/client-cli
npm install
au run --watch
```

### Aurelia-Webpack
```bash
git clone https://github.com/ghiscoding/aurelia-slickgrid
cd aurelia-slickgrid/client-wp
npm install
npm start
```

## Styling
Load the default Bootstrap theme style
### css
Default compiled `css`
```html
<!-- Bootstrap theme -->
<link rel="stylesheet" type="text/css" href="../node_modules/aurelia-slickgrid/dist/styles/css/slickgrid-theme-bootstrap.css">

<!-- OR the default old slickgrid theme -->
<link rel="stylesheet" type="text/css" href="../node_modules/aurelia-slickgrid/dist/styles/css/slickgrid.css">
```
### scss (SASS)
You could also compile the SASS file with your customization, for that simply load the `_slick-grid-variables.scss` variable file then the main `slickgrid.scss` which should call the variables.

## Notes
If you are not intending to use any features (described in [Main Features](#main-features)), then you could simply your code by calling `Slickgrid-ES6` functionalities directly. For example
```javascript
import {Grid} from 'slickgrid-es6';
...
this.grid = new Grid(`#myGrid`, this.data, this.columnDefinition, this.gridOptions);
```
