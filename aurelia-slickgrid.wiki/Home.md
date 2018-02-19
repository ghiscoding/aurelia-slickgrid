Welcome to the Aurelia-Slickgrid wiki!

# Aurelia-Slickgrid
One of the best javascript datagrid [SlickGrid](https://github.com/mleibman/SlickGrid) which was originally developed by @mleibman is now available to Aurelia. I have tried and used a few datagrids and SlickGrid beats most of them in terms of functionalities and performance (it can easily deal with even a million row).

### SlickGrid Source
We will be using [6pac SlickGrid fork](https://github.com/6pac/SlickGrid/) (the most active fork since the original @mleibman fork was closed some time ago by his author personal reasons).

### Goal
The goal is of course to be able to run SlickGrid within Aurelia but also to incorporate as much as possible the entire list of functionalities (and more) that SlickGrid offers (you can see a vast list of samples on the [6pac SlickGrid examples](https://github.com/6pac/SlickGrid/wiki/Examples) website).

### Demo page
[Demo page](https://ghiscoding.github.io/aurelia-slickgrid) includes sample for most of the features and it keeps growing (so you might want to consult it whenever a new version comes out).

### NPM Package
[Aurelia-Slickgrid on NPM](https://www.npmjs.com/package/aurelia-slickgrid)

## Migration (from 0.x to 1.x)
### Breaking Changes
Since the version `1.x` is a complete rewrite, there are some drawbacks which we will discuss. By dropping [Slickgrid-ES6](https://github.com/DimitarChristoff/slickgrid-es6) dependency, it means introducing couple of breaking changes (that is, if you were using previous version). Also, the modules that you can import are different and the `Frozen` grid is gone.

### So, why the rewrite?
Mostly because the [Slickgrid-ES6](https://github.com/DimitarChristoff/slickgrid-es6) repo (which is maintained by 1 person, which mainly does `React` stuff) is not as maintained, neither stable, as the most active [6pac fork](https://github.com/6pac/SlickGrid). Also, I now have another repo for `Angular 4+` as well ([Angular-Slickgrid](https://github.com/ghiscoding/Angular-Slickgrid)) which I also maintain (that one is for work though) and is based on the [6pac fork](https://github.com/6pac/SlickGrid) fork as well. I prefer the 6pac fork for it's stability, list of available functionalities and samples (I even made a few PRs on that fork as well), which the `ES6` fork lacks. The goal is to make both `Angular-Slickgrid` and `Aurelia-Slickgrid` on par (feature wise) and in synch, also since it is used and developed at my work, it will grow much faster.

## Wiki / Documentation
The Wiki is where all the documentation and instructions will go, so please consult the [Aurelia-Slickgrid - Wiki](https://github.com/ghiscoding/aurelia-slickgrid/wiki) before opening any issues. The [Wiki - HOWTO](https://github.com/ghiscoding/aurelia-slickgrid/wiki/HOWTO---Step-by-Step) is a great place to start with. You can also take a look at the [Demo page](https://ghiscoding.github.io/aurelia-slickgrid), it includes sample for most of the features and it keeps growing (so you might want to consult it whenever a new version comes out).

## Main features
You can see some screenshots below and the instructions down below.

This is a work in progress, but so far here are some of the features that `aurelia-slickgrid` brings (on top of Slickgrid itself):
- Easier use of SlickGrid within `Aurelia` as it is just a component (simply pass a column definitions and a dataset and you're good to go)
- Bootstrap Theme with SASS variables for extra customization (if you create a theme, then please make a PR)
- Auto-resize (boolean flag), will resize the datagrid viewport with available space, that includes when browser resize (basically takes available space from it's parent container)
- Inline Editors (number, float, text, longText, date, ... you can also create your own custom ones)
- Formatters to display something different in UI, for example a boolean flag can be shown as a Font-Awesome checkmark icon
- Filters (input text, select, multi-select, single-select & even custom filter)
  - input text also support operators at the beginning of the input text:
    - `<`, `<=`, `>`, `>=`, `<>`, `!=`, `==`, `*`
    - `*` can be used for startsWith and endsWith
- Support all the SlickGrid [Controls](https://github.com/6pac/SlickGrid/tree/master/controls) and [Plugins](https://github.com/6pac/SlickGrid/tree/master/plugins)
- Row(s) Selection
- Server side (backend) Services (filtering, sorting, pagination)
    - [GraphQL](https://github.com/ghiscoding/aurelia-slickgrid/wiki/GraphQL)
    - [OData](https://github.com/ghiscoding/aurelia-slickgrid/wiki/OData)
- Some features of SlickGrid itself which are working out of the gate
  - Sort/Multi-Sort (client/server side)
  - Header Row with Filters (currently support `Input` and `Select` dropdown, multi-select is planned)
  - Inline Editors (number, float, text, longText, date, ... you can also create your own custom ones)
  - Formatters (this as well includes some defaults and they are customizable)
  - Optimized DataView which brings a lot of functionalities (sort, grouping, and more)
    - even server side data is saved back into a SlickGrid DataView to use these functionalities (e.g grouping)
  - All the [SlickGrid Events](https://github.com/6pac/SlickGrid/wiki/Grid-Events) are supported, see the [Wiki](https://github.com/ghiscoding/aurelia-slickgrid/wiki/Grid-&-DataView-Events)
- Localization support with [Aurelia i18n](http://aurelia.io/docs/plugins/i18n), please read the [Wiki - Localization](https://github.com/ghiscoding/aurelia-slickgrid/wiki/Localization)

## Missing features (planned items)
The following are SlickGrid features which are not yet included in this library
- Export to CSV
- Reload a grid with certain preset (could be filters or sorts that we want to reload)
- Grouping

**NOTE** 
What if `Aurelia-Slickgrid` is missing feature(s) versus the original `SlickGrid`? Fear not and directly use the `SlickGrid` and `DataView` objects that are expose from the start through Event Emitters. For more info continue reading on [Wiki - SlickGrid & DataView objects](/ghiscoding/aurelia-slickgrid/wiki/SlickGrid-&-DataView-Objects) and [Wiki - Grid & DataView Events](https://github.com/ghiscoding/aurelia-slickgrid/wiki/Grid-&-DataView-Events)