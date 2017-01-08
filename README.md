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
  "main": "index"
},
```
Finally use it in your Aurelia app by modifying your `main.js` file
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


## Styling is done with SASS
I am starting the development of `Aurelia-Slickgrid` with `Aurelia-CLI` and prefer to use `SASS`. Also coded a `Bootstrap` theme (not available anywhere else), also focusing on the upcoming `Bootstrap 4` which is now in Beta, however should work just fine with `Bootstrap 3` as well.

_You could also use `LESS` if you want since this is what is currently used under the `Slickgrid-ES6` fork. However the Bootstrap theme is not available anywhere but here._

## Main features
You will be able to see examples soon (see print screen below). What I got working so far are the following:
- Default Slickgrid example
- Auto-resize viewport with available space (basically take space available by the given div container)
- Server side sorting
- Server side pagination (pager is an Aurelia custom element)

## Screenshots

Screenshots from the demo app with the `Bootstrap` theme.

**Default Slickgrid example**
![Default Slickgrid Example](/screenshots/example1.png)

**Slickgrid Example with Server Side (sorting/pagination)**
![Slickgrid Server Side](/screenshots/exampleServerSide.png)
