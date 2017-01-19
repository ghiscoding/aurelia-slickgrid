# Aurelia-Slickgrid
One of the best javascript datagrid [SlickGrid](https://github.com/mleibman/SlickGrid) which was originally developed by mleibman is now available to Aurelia.

### SlickGrid introduction
It is worth to know that the original SlickGrid GitHub project was put aside by his original developer mleibman and there is multiple forks available. However 2 forks are standing out of the pack, they are [6pac fork of SlickGrid](https://github.com/6pac/SlickGrid) and [X-Slickgrid](https://github.com/ddomingues/X-SlickGrid). The first one ([6pac fork of SlickGrid](https://github.com/6pac/SlickGrid)) is closer to the original fork with more users/stars, while the later fork ([X-Slickgrid](https://github.com/ddomingues/X-SlickGrid)) offer frozen columns and rows functionalities.

### Aurelia-Slickgrid Goals
The main goal of `Aurelia-Slickgrid` plugin is obviously to easily use `Slickgrid` in `Aurelia`. It would also be great to be able to run any of the examples of the 2 forks mentioned in the introduction. You can see a list of examples for both fork. [6pac Slickgrid examples](https://github.com/6pac/SlickGrid/wiki/Examples) and [X-Slickgrid examples](http://ddomingues.com/X-SlickGrid/liveDemo/examples/index.html). In theory, all these examples should be doable in Aurelia.

### SlickGrid with ES6
Aurelia-Slickgrid was mostly possible due to another great fork namely [SlickGrid-ES6](https://github.com/DimitarChristoff/slickgrid-es6), which brings this great javascript datagrid to the `Javascript ES6` era. On top of that, this fork also brings a neat feature of combining some features of both forks mentioned in the introduction. As per a quote from the [SlickGrid-ES6](https://github.com/DimitarChristoff/slickgrid-es6) fork, the author describes his fork as being:
> This is a clone of the [6pac fork](https://github.com/6pac/SlickGrid/) of SlickGrid for some parts and [X-SlickGrid](https://github.com/ddomingues/X-SlickGrid) for the grid itself
> Goals
> - Make it easy to consume in Webpack/Babel/ES6 codebases

## How to use Aurelia-Slickgrid?
Examples are coming, I now have a working set of 10 Examples (however 4 & 6 are broken because of Plugins that is not bundled correctly in `Slickgrid-ES6`). `Aurelia-Slickgrid` is a wrapper of `Slickgrid-ES6` with extra features (like grid autoResize, backend sorting/pagination). These extra features (specifically coded for Aurelia) are under `SlickgridService`, however all the classes of `Slickgrid-ES6` are also available. The full list of classes that are available from `aurelia-slickgrid` are:

```javascript
import {Slick, Editors, Formatters, Data, Grid, FrozenGrid, Plugins, SlickPager, SlickWindowResizer, SlickService} from 'aurelia-slickgrid';
```

## Installation
You can run the examples or build your own by doing the following.

### Aurelia-CLI / Webpack
```bash
npm install --save aurelia-slickgrid
```
#### Aurelia-CLI
For `CLI` you will need to add the plugin to your `aurelia.json` file
```javascript
{
  "name": "aurelia-slickgrid",
  "path": "../node_modules/aurelia-slickgrid/dist/amd",
  "main": "index",
  "resources": ["**/*.{css,html}"]
},
```

#### Aurelia (main)
Make the plugin available globally your `main.js` file.
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
For now, only the `Aurelia-Webpack` version is avaiable. The `Aurelia-CLI` version will be available in the coming weekend.

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

## Main features
You will be able to see examples soon (see print screen below). What I got working so far are the following:
- Default Slickgrid example
- Auto-resize viewport with available space (basically take space available by the given div container)
- Server side sorting
- Server side pagination (pager is an Aurelia custom element)

## Notes
If you are not intending to use any features (described in `Main Features`), then you could instead use `Slickgrid-ES6` directly. For example
```javascript
import {Grid} from 'slickgrid-es6';
...
this.grid = new Grid(`#myGrid`, this.data, this.columnDefinition, this.gridOptions);
```

## Screenshots

Screenshots from the demo app with the `Bootstrap` theme.

**Default Slickgrid example**
![Default Slickgrid Example](/screenshots/example1.png)

**Slickgrid Example with Server Side (sorting/pagination)**
![Slickgrid Server Side](/screenshots/exampleServerSide.png)
