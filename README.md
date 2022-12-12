# Aurelia-Slickgrid
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![NPM downloads](https://img.shields.io/npm/dy/aurelia-slickgrid)](https://npmjs.org/package/aurelia-slickgrid)
[![npm version](https://img.shields.io/npm/v/aurelia-slickgrid.svg?logo=npm&logoColor=fff&label=npm)](https://www.npmjs.com/package/aurelia-slickgrid)

[![Actions Status](https://github.com/ghiscoding/aurelia-slickgrid/workflows/CI%20Build/badge.svg)](https://github.com/ghiscoding/aurelia-slickgrid/actions)
[![Cypress.io](https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg)](https://www.cypress.io/)
[![jest](https://jestjs.io/img/jest-badge.svg)](https://github.com/facebook/jest)
[![codecov](https://codecov.io/gh/ghiscoding/aurelia-slickgrid/branch/master/graph/badge.svg)](https://codecov.io/gh/ghiscoding/aurelia-slickgrid)

### Community
Recently moved all my SlickGrid related repos into [ghiscoding](https://github.com/ghiscoding) org to regroup them all under a single location.

### Description
One of the best javascript datagrid [SlickGrid](https://github.com/mleibman/SlickGrid) which was originally developed by @mleibman is now available to Aurelia. I have used a few datagrids and SlickGrid beats most of them in terms of functionalities and performance (it can easily deal with even a million row). We will be using the [6pac/SlickGrid](https://github.com/6pac/SlickGrid/) fork, this is the most active fork since the original @mleibman fork was closed some time ago by his author for personal reasons. Also worth to know, I also contributed a lot to the 6pac/SlickGrid fork for the benefit of Aurelia-Slickgrid.

## Installation
Refer to the **[Wiki - HOWTO Step by Step](https://github.com/ghiscoding/aurelia-slickgrid/wiki/HOWTO--Step-by-Step)** and/or clone the [Aurelia-Slickgrid Demos](https://github.com/ghiscoding/aurelia-slickgrid-demos) repository. Please consult all Wikis before opening new issues, also consider asking installation and/or general questions on [Stack Overflow](https://stackoverflow.com/search?tab=newest&q=slickgrid) unless you think there's a bug with the library.

```sh
npm install aurelia-slickgrid
```

### Versions Compatibility
For a full compatibility table of Aurelia-Slickgrid with Slickgrid-Universal, you can consult the [Versions Compatibility Table - Wiki](https://github.com/ghiscoding/aurelia-slickgrid/wiki/Versions-Compatibility-Table)

### License
[MIT License](LICENSE)

### Like it? :star: it
You like and use **Aurelia-Slickgrid**? Be sure to upvote :star: and feel free to contribute. :construction_worker:

### Like my work?
You could :star: the lib and maybe support me with cafeine :coffee:. Thanks.

<a href='https://ko-fi.com/ghiscoding' target='_blank'><img height='32' style='border:0px;height:32px;' src='https://az743702.vo.msecnd.net/cdn/kofi3.png?v=0' border='0' alt='Buy Me a Coffee at ko-fi.com' />

### Demo page

`Aurelia-Slickgrid` works with all `Bootstrap` versions, you can see a demo of each one below.
- [Bootstrap 4 demo](https://ghiscoding.github.io/aurelia-slickgrid-demos) / [examples repo](https://github.com/ghiscoding/aurelia-slickgrid-demos/tree/master/webpack-bs4-demo)
- [Bootstrap 5 demo](https://ghiscoding.github.io/aurelia-slickgrid) / [examples repo](https://github.com/ghiscoding/aurelia-slickgrid-demos/tree/master/webpack-bs5-demo)

There are also 2 new Themes, Material & Salesforce that are available as well and if you wish to use SVG then take a look at the [Wiki - SVG Icons](https://github.com/ghiscoding/aurelia-slickgrid/wiki/SVG--Icons).

#### Working Demos
For a complete working set of demos, you can clone the [Aurelia-Slickgrid Demos](https://github.com/ghiscoding/aurelia-slickgrid-demos) repository (instructions are provided in the demo repo). This repo provides multiple samples (RequireJS, WebPack, CLI, ...) and it is also worth to know that the 2 WebPacks demos are updated frequently since they are the actual live GitHub [Bootstrap 4 demo](https://ghiscoding.github.io/aurelia-slickgrid-demos/#/slickgrid) / [Bootstrap 5 demo](https://ghiscoding.github.io/aurelia-slickgrid).

## Wiki / Documentation
The Wikis is where you'll find all the documentation and instructions for the lib, so please consult the [Aurelia-Slickgrid - Wiki](https://github.com/ghiscoding/aurelia-slickgrid/wiki) before opening any new issue. The [Wiki - HOWTO](https://github.com/ghiscoding/aurelia-slickgrid/wiki/HOWTO--Step-by-Step) is a great place to start with.

### Latest News & Releases
Check out the [Releases](https://github.com/ghiscoding/aurelia-slickgrid/releases) section for all latest News & Releases.

## Fully Tested with [Jest](https://jestjs.io/) (Unit Tests) - [Cypress](https://www.cypress.io/) (E2E tests)
Aurelia-Slickgrid has **100%** Unit Test Coverage, we are talking of 15,000+ lines of code (3,750+ unit tests, most of these tests were moved into Slickgrid-Universal) fully tested with [Jest](https://jestjs.io/). On the UI side, all Aurelia-Slickgrid Example are tested with [Cypress](https://www.cypress.io/), there are over 550+ Cypress E2E tests.

## Usage

#### How to load data with `Fetch-Client` or `Http-Client`?
You might have noticed that all demos are made with mocked dataset that are embedded in each examples, that is mainly for demo purposes, but you might be wondering how to connect this with a `FetchClient` or `Http-Client`? Easy... just replace the mocked data, assigned to the `dataset` property, by your `FetchClient` call and that's it. The `dataset` property can be changed at any time, which is why you can use local data and/or connect it to a `Promise` or an async call with `FetchClient` (internally it's just a SETTER that refreshes the grid). See [Example 22](https://ghiscoding.github.io/aurelia-slickgrid/#/slickgrid/example22) for a demo showing how to load a JSON file with `FetchClient`.

## Main features
You can see a few screenshots below to demo some of the lib features as well as instructions underneath them and if that is not enough to convince you then head over to the [Wiki - Main Features](https://github.com/ghiscoding/aurelia-slickgrid/wiki).

## Missing features
What if `Aurelia-Slickgrid` is missing feature(s) compare to the original core library [6pac/SlickGrid](https://github.com/6pac/SlickGrid/)?

Fear not, you can simply reference the `SlickGrid` and `DataView` objects, just like in the core lib (they are exposed through Custom Events). For more info continue reading on [Wiki - SlickGrid & DataView objects](/ghiscoding/aurelia-slickgrid/wiki/SlickGrid-&-DataView-Objects) and [Wiki - Grid & DataView Events](https://github.com/ghiscoding/aurelia-slickgrid/wiki/Grid-&-DataView-Events)


## Screenshots

Screenshots from the demo app with the `Bootstrap` theme.

### Slickgrid example with Formatters (last column shown is a custom Formatter)

#### You can also see the Grid Menu opened (aka hambuger menu)

![Default Slickgrid Example](/screenshots/formatters.png)

### Filter and Sort (clientside with DataView)

![Filter and Sort](/screenshots/filter_and_sort.png)

### Editors and/or onCellClick

![Editors](/screenshots/editors.png)

### Pinned (aka frozen) Columns/Rows

![Pinned Columns/Rows](/screenshots/frozen.png)

### Draggable Grouping & Aggregators

![Draggable Grouping](/screenshots/draggable-grouping.png)

### Slickgrid Example with Server Side (Filter/Sort/Pagination)
#### Comes with OData & GraphQL support (you can implement custom too)

![Slickgrid Server Side](/screenshots/pagination.png)

### Composite Editor Modal Windows
![Composite Editor Modal](/screenshots/composite-editor.png)
