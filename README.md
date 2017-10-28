# Aurelia-Slickgrid
One of the best javascript datagrid [SlickGrid](https://github.com/mleibman/SlickGrid) which was originally developed by @mleibman is now available to Aurelia. I have used a few datagrids and slickgrid beats most of them in terms of functionalities and performance (it can easily deal with even a million row).

### SlickGrid Source
We will be using [6pac SlickGrid fork](https://github.com/6pac/SlickGrid/) (the most active fork since the original @mleibman fork was closed some time ago by his author personal reasons).

### Goal
The goal is of course to be able to run SlickGrid within Aurelia but also to incorporate as much as possible the entire list of functionalities (and more) that SlickGrid offers (you can see a vast list of samples on the [6pac SlickGrid examples](https://github.com/6pac/SlickGrid/wiki/Examples) website).

### Demo page
...soon

### NPM Package
[Aurelia-Slickgrid on NPM](https://www.npmjs.com/package/aurelia-slickgrid)

## Migration (from 0.x to 1.x)
### Breaking Changes
Since the version `1.x` is a complete rewrite, there are some drawbacks (Frozen grid is dropped and some lib imports are little funky since we now point to legacy libs). So we dropped the dependecies of [Slickgrid-ES6](https://github.com/DimitarChristoff/slickgrid-es6), that means that there are some breaking changes. The modules you can import are different and the `Frozen` grid is gone.

### Why the rewrite?
Mostly because the [Slickgrid-ES6](https://github.com/DimitarChristoff/slickgrid-es6) repo (which is maintained by 1 person, which mainly does `React` stuff) is not as maintained, neither stable, as the official [6pac fork](https://github.com/6pac/SlickGrid). Also, I now have another repo for `Angular 4+` as well ([Angular-Slickgrid](https://github.com/ghiscoding/Angular-Slickgrid)) which I also maintain (that one is for work though) and is based on the [6pac fork](https://github.com/6pac/SlickGrid) fork, in which I prefer for it's stability, list of functionalities and samples (I even made a few PRs on that fork as well), which the `ES6` fork lacks. The goal is to make both `Angular-Slickgrid` and `Aurelia-Slickgrid` on par (feature wise) and because it is used and developed at my work, it will grow much faster.

## Wiki / Documentation
The Wiki is where all the documentation and instructions will go, so please consult the [Aurelia-Validation - Wiki](https://github.com/ghiscoding/aurelia-slickgrid/wiki) before opening any issues. The [Wiki - HOWTO](https://github.com/ghiscoding/aurelia-slickgrid/wiki/HOWTO---Step-by-Step) is a great place to start with.

## Main features
You can see some screenshots below and the instructions down below.

This is a work in progress, but so far here are some of the features that `aurelia-slickgrid` brings (on top of Slickgrid itself):
- Easier use of SlickGrid within `Aurelia` as it is just a component (simply pass a column definitions and a dataset and you're good to go)
- Bootstrap Theme with SASS variables for extra customization (if you create a theme, then please make a PR)
- Auto-resize (boolean flag), will resize the datagrid viewport with available space, that includes when browser resize (basically takes available space from it's parent container)
- Integrated Plugins.
    - Column Picker (show/hide any columns from a `right+click` in the header, [see a print screen here](/screenshots/columnPicker.png)).
    - ... more to come
- Server side (backend) Services (filtering, sorting, pagination)
    - [GraphQL](https://github.com/ghiscoding/aurelia-slickgrid/wiki/GraphQL)
    - [OData](https://github.com/ghiscoding/aurelia-slickgrid/wiki/OData)
- Some features of SlickGrid itself which are working out of the gate
  - Sort/Multi-Sort (client/server side)
  - Header Row with Filters (currently support `Input` and `Select` dropdown, multi-select is planned)
  - Inline Editors (a few defaults were added, and you can easily create custom ones too)
  - Formatters (this as well includes some defaults and they are customizable)
  - Optimized DataView which brings a lot of functionalities (sort, grouping, and more)
    - even server side data is saved back into a SlickGrid DataView to use these functionalities (e.g grouping)
- ... more to come

<a name="missing-features"></a>

## Missing features (planned items, not necessarily in order of execution)
The following are SlickGrid features which are not yet included in this library but will be in the upcoming future.
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
