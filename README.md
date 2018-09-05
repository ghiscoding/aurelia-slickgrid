# Aurelia-Slickgrid
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![npm version](https://badge.fury.io/js/aurelia-slickgrid.svg)](https://badge.fury.io/js/aurelia-slickgrid)

One of the best javascript datagrid [SlickGrid](https://github.com/mleibman/SlickGrid) which was originally developed by @mleibman is now available to Aurelia. I have tried and used a few datagrids and SlickGrid beats most of them in terms of functionalities and performance (it can easily deal with even a million row).

### SlickGrid Source
We will be using [6pac SlickGrid fork](https://github.com/6pac/SlickGrid/) (the most active fork since the original @mleibman fork was closed some time ago by his author for personal reasons).

### Goal
The goal is of course to be able to run SlickGrid within Aurelia but also to incorporate as much as possible the entire list of functionalities (and more) that SlickGrid offers (you can see a vast list of samples on the [6pac SlickGrid examples](https://github.com/6pac/SlickGrid/wiki/Examples) website).

### Demo page
The creation of `Aurelia-Slickgrid` started with `Bootstrap 3` support and `Bootstrap 4` is now supported as well starting with version `2.1.0`
- [Bootstrap 3 demo](https://ghiscoding.github.io/aurelia-slickgrid) / [examples repo](https://github.com/ghiscoding/aurelia-slickgrid/tree/master/aurelia-slickgrid/src/examples/slickgrid)
- [Bootstrap 4 demo](https://ghiscoding.github.io/aurelia-slickgrid-bs4-demo) / [examples repo](https://github.com/ghiscoding/aurelia-slickgrid-bs4-demo/tree/master/src/examples/slickgrid)


### NPM Package
[Aurelia-Slickgrid on NPM](https://www.npmjs.com/package/aurelia-slickgrid)

## Installation
Refer to the [Wiki - HOWTO Step by Step](https://github.com/ghiscoding/aurelia-slickgrid/wiki/HOWTO--Step-by-Step)

## Wiki / Documentation
The Wiki is where all the documentation and instructions will go, so please consult the [Aurelia-Slickgrid - Wiki](https://github.com/ghiscoding/aurelia-slickgrid/wiki) before opening any issues. The [Wiki - HOWTO](https://github.com/ghiscoding/aurelia-slickgrid/wiki/HOWTO--Step-by-Step) is a great place to start with.

## Main features
You can see some screenshots below and the instructions down below.

This is a work in progress, but so far here are some of the features that `aurelia-slickgrid` brings (on top of Slickgrid itself):
- Easier use of SlickGrid within `Aurelia` as it is just a component (simply pass a column definitions and a dataset and you're good to go)
- Bootstrap Theme with SASS variables for extra customization (if you create a theme, then please make a PR)
- Auto-resize (boolean flag), will resize the datagrid viewport with available space, that includes when browser resize (basically takes available space from it's parent container)
- Support all SlickGrid [Controls](https://github.com/6pac/SlickGrid/tree/master/controls) and [Plugins](https://github.com/6pac/SlickGrid/tree/master/plugins).
- Row(s) Selection
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
  - All the [SlickGrid Events](https://github.com/6pac/SlickGrid/wiki/Grid-Events) are supported, see the [Wiki](https://github.com/ghiscoding/aurelia-slickgrid/wiki/Grid-&-DataView-Events)

### License
[MIT License](LICENSE)

## Contributions/Comments
Contributions are welcome, this is what the community is for. If you wish to suggest something and/or want to make a PR (Pull Request), please feel free to do so.

## Use it, like it?
You like and use this great library `Aurelia-Slickgrid`? You can always upvote :star: and/or contribute :)

## Like my work?
If you like my work, you can also support me with caffeine :smile:
[Buy Me a Coffee](https://ko-fi.com/N4N679OT)

## Screenshots

Screenshots from the demo app with the `Bootstrap` theme (that is the only available theme, but there is a lot of SASS variables to make it look like Material, or other theme if you wish to. If you create a new theme, please submit a PR).

### Slickgrid example with Formatters (last column shown is a custom Formatter)

![Default Slickgrid Example](/screenshots/formatters.png)

### Filter and Sort (clientside with DataView)

![Slickgrid Server Side](/screenshots/filter_and_sort.png)

### Editors and/or onCellClick

![Editors](/screenshots/editors.png)

### Slickgrid Example with Server Side (Filter/Sort/Pagination)

![Slickgrid Server Side](/screenshots/pagination.png)
