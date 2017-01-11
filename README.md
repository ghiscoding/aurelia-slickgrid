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
Still working on that, however you can see some print screen at the bottom. I will most probably create a project with samples and/or `GistRun` which I haven't tried yet. The main focus for now is to make the `Aurelia-Slickgrid` plugin available under `NPM` and get it working. This is my first Aurelia plugin, so we'll see how it goes.

### Aurelia-CLI
```bash
npm install --save aurelia-slickgrid
```
Then add the plugin to your `aurelia.json` file
```javascript
{
  "name": "aurelia-slickgrid",
  "path": "../node_modules/aurelia-slickgrid/dist/amd",
  "main": "index",
  "resources": ["**/*.{css,html}"]
},
```
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
    this.slickgrid.createDatagrid('myGrid', this.gridColumns, this.gridOptions, data);
  }
}

```

## Styling
Load the default Bootstrap theme style
### css
Default compiled `css`
```html
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
