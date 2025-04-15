# Aurelia-Slickgrid
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![NPM downloads](https://img.shields.io/npm/dy/aurelia-slickgrid)](https://npmjs.org/package/aurelia-slickgrid)
[![npm version](https://img.shields.io/npm/v/aurelia-slickgrid.svg?logo=npm&logoColor=fff&label=npm)](https://www.npmjs.com/package/aurelia-slickgrid)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/aurelia-slickgrid?color=success&label=gzip)](https://bundlephobia.com/result?p=aurelia-slickgrid)

[![Actions Status](https://github.com/ghiscoding/aurelia-slickgrid/workflows/CI%20Build/badge.svg)](https://github.com/ghiscoding/aurelia-slickgrid/actions)
[![Cypress.io](https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg?logo=cypress)](https://www.cypress.io/)
[![jest](https://jestjs.io/img/jest-badge.svg)](https://github.com/facebook/jest)
<!-- [![codecov](https://codecov.io/gh/ghiscoding/aurelia-slickgrid/branch/master/graph/badge.svg)](https://codecov.io/gh/ghiscoding/aurelia-slickgrid) -->

## Structure Change (happening soon)
> [!NOTE]
> Please note that Aurelia-Slickgrid (and all other supported frameworks) will soon be moved under the [Slickgrid-Universal](https://github.com/ghiscoding/slickgrid-universal) project.
> This will happen in the next major version, which is by end of April 2025. The installation will remain the same `npm install aurelia-slickgrid`, it's just the project that will be moved into a central location (much easier to maintain).

### Brief introduction
One of the best JavasSript data grid [SlickGrid](https://github.com/mleibman/SlickGrid), which was originally developed by @mleibman, is now available to the Aurelia world. SlickGrid beats most other data grids in terms of features, customizability & performance (running smoothly with even a million rows). Aurelia-Slickgrid is a wrapper on top of [Slickgrid-Universal](https://github.com/ghiscoding/slickgrid-universal/) (which is a dependency), in the early beginning we used the `6pac/SlickGrid` fork but that was dropped in >=[v7.0](https://github.com/ghiscoding/aurelia-slickgrid/releases/tag/v7.0.3) since Slickgrid-Universal is now a standalone project. SlickGrid was also recently rewritten with browser native code (no more ~jQuery~ 🎉).

## Documentation
📕 [Documentation](https://ghiscoding.gitbook.io/aurelia-slickgrid/getting-started/quick-start) website powered by GitBook for version 7+ (_or use the [Wikis](https://github.com/ghiscoding/aurelia-slickgrid/wiki) for older versions_).

## Installation
Available in Stackblitz (Codeflow) below, this can also be used to provide an issue repro.

[![Open in Codeflow](https://developer.stackblitz.com/img/open_in_codeflow.svg)](https:///pr.new/ghiscoding/aurelia-slickgrid)

Refer to the **[Docs - Quick Start](https://ghiscoding.gitbook.io/aurelia-slickgrid/getting-started/quick-start)** and/or clone the [Aurelia-Slickgrid Demos](https://github.com/ghiscoding/aurelia-slickgrid-demos) repository. Please review the [Documentation](https://ghiscoding.gitbook.io/aurelia-slickgrid/) website before opening any new issue, also consider asking installation and/or general questions on [Stack Overflow](https://stackoverflow.com/search?tab=newest&q=slickgrid) unless you think there's a bug with the library.

```sh
npm install aurelia-slickgrid
```
Install any optional Slickgrid-Universal dependencies, for example Excel Export
```sh
npm install @slickgrid-universal/excel-export
```

### Versions Compatibility

> **Note** please be aware that only the latest major version of Aurelia-Slickgrid will be supported and receive bug fixes (it's already a lot of work to maintain for a single developer like me).

| Aurelia-Slickgrid | Aurelia version | Migration Guide | Notes |
|-------------------|-----------------|-----------------|------|
| 8.x               | Aurelia 2       | [Migration 8.x](https://ghiscoding.gitbook.io/aurelia-slickgrid/migrations/migration-to-8.x)     | modern UI / Dark Mode, requires Slickgrid-Universal [5.x](https://github.com/ghiscoding/slickgrid-universal/releases/tag/v5.0.0) |
| 7.x               | Aurelia 2       | [Migration 7.x](https://ghiscoding.gitbook.io/aurelia-slickgrid/migrations/migration-to-7.x)     | merge SlickGrid into Slickgrid-Universal, requires Slickgrid-Universal [4.x](https://github.com/ghiscoding/slickgrid-universal/releases/tag/v4.0.2) |
| 6.x               | 1.x             | [Migration 6.x](https://github.com/ghiscoding/aurelia-slickgrid/wiki/Migration-to-6.x)     | removal of jQuery (now uses browser native code), requires Slickgrid-Universal [3.x](https://github.com/ghiscoding/slickgrid-universal/releases/tag/v3.0.0) |
| 5.x               | 1.x             | [Migration 5.x](https://github.com/ghiscoding/aurelia-slickgrid/wiki/Migration-to-5.x)     | removal of jQueryUI, requires Slickgrid-Universal [2.x](https://github.com/ghiscoding/slickgrid-universal/releases/tag/v2.0.0) version |

For a full compatibility table of all Aurelia-Slickgrid versions with Slickgrid-Universal, please refer to the [Versions Compatibility Table - Wiki](https://github.com/ghiscoding/aurelia-slickgrid/wiki/Versions-Compatibility-Table)

### Styling Themes

Multiple styling themes are available
- Default (UI agnostic)
- Bootstrap (see all Aurelia-Slickgrid [live demos](https://ghiscoding.github.io/aurelia-slickgrid/))
- Material (see [Slickgrid-Universal](https://ghiscoding.github.io/slickgrid-universal/#/example07))
- Salesforce (see [Slickgrid-Universal](https://ghiscoding.github.io/slickgrid-universal/#/example16))

Also note that all of these themes also have a **Dark Theme** equivalent and even though Bootstrap is often used for live demos, it does work as well with any other UI framework like Bulma, Material, ...

### Demo page

`Aurelia-Slickgrid` works with all `Bootstrap` versions, you can see a demo of each one below. It also works well with any other frameworks like Material or Bulma and there are also couple of extra styling themes based on Material & Salesforce which are also available. You can also use different SVG icons, you may want to look at the [Docs - SVG Icons](https://ghiscoding.gitbook.io/aurelia-slickgrid/styling/svg-icons)
- [Bootstrap 5 demo](https://ghiscoding.github.io/aurelia-slickgrid) / [examples repo](https://github.com/ghiscoding/aurelia-slickgrid-demos/tree/master/webpack-bs5-demo)
- [Bootstrap 5 demo with Single Locale](https://ghiscoding.github.io/aurelia-slickgrid-demos) / [examples repo](https://github.com/ghiscoding/aurelia-slickgrid-demos/tree/master/webpack-bs5-demo-with-locales)

There are also 2 new Themes, Material & Salesforce that are available as well and if you wish to use SVG then take a look at the [Docs - SVG Icons](https://ghiscoding.gitbook.io/aurelia-slickgrid/styling/svg-icons).

#### Working Demos
For a complete set of working demos (40+ examples), we strongly suggest you to clone the [Aurelia-Slickgrid Demos](https://github.com/ghiscoding/aurelia-slickgrid-demos) repository (instructions are provided inside it). The repo provides multiple examples which are updated for every new release, so it is updated frequently and is also the GitHub live demo page for both the [Bootstrap 5 demo](https://ghiscoding.github.io/aurelia-slickgrid) and [Bootstrap 5 demo (single Locale)](https://ghiscoding.github.io/aurelia-slickgrid-demos).

## License
[MIT License](LICENSE)

### Like it? ⭐ it
You like and use **Aurelia-Slickgrid**? Be sure to upvote ⭐ and feel free to contribute.

#### Like my work?
You could ⭐ the lib and maybe support me with caffeine [☕](https://ko-fi.com/ghiscoding) or GitHub sponsoring. Thanks.

<a href='https://ko-fi.com/ghiscoding' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi3.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

### Latest News & Releases
Check out the [Releases](https://github.com/ghiscoding/aurelia-slickgrid/releases) section for all latest News & Releases.

### Tested with [Jest](https://jestjs.io/) (Unit Tests) - [Cypress](https://www.cypress.io/) (E2E Tests)
Slickgrid-Universal has **100%** Unit Test Coverage and all Aurelia-Slickgrid Examples are tested with [Cypress](https://www.cypress.io/) as E2E tests.


#### Basic Grid

```ts
import { type Column, type GridOption } from 'aurelia-slickgrid';

export class Example {
  columnDefinitions: Column[] = [];
  gridOptions: GridOption;
  dataset: any[] = [];

  constructor() {
    this.columnDefinitions = [
      { id: 'firstName', name: 'First Name', field: 'firstName', sortable: true },
      { id: 'lastName', name: 'Last Name', field: 'lastName', sortable: true },
      { id: 'age', name: 'Age', field: 'age', type: 'number', sortable: true }
    ];
  }

  attached() {
    this.dataset = [
      { id: 1, firstName: 'John', lastName: 'Doe', age: 20 },
      { id: 2, firstName: 'Jane', lastName: 'Smith', age: 21 }
    ];
    this.gridOptions = { /*...*/ }; // optional grid options
  }
}
```

```html
<aurelia-slickgrid
  grid-id="grid2"
  column-definitions.bind="columnDefinitions"
  grid-options.bind="gridOptions"
  dataset.bind="dataset">
</aurelia-slickgrid>
```

## Sponsors

Thanks to all my sponsors! 

<div>
  <span>
    <a href="https://github.com/wundergraph" class="Link" title="Wundergraph" target="_blank"><img src="https://avatars.githubusercontent.com/u/64281914" width="50" height="50" valign="middle" /></a>
  </span>
  &nbsp;
  <span>
    <a href="https://github.com/johnsoncodehk" class="Link" title="johnsoncodehk (Volar)" target="_blank"><img src="https://avatars.githubusercontent.com/u/16279759" width="50" height="50" valign="middle" /></a>
  </span>
   &nbsp;
  <span>
    <a href="https://github.com/kevinburkett" class="Link" title="kevinburkett" target="_blank"><img class="circle avatar-user" src="https://avatars.githubusercontent.com/u/48218815?s=52&amp;v=4" width="45" height="45" valign="middle" /></a>
  </span>
  &nbsp;
  <span>
    <a href="https://github.com/anton-gustafsson" class="Link" title="anton-gustafsson" target="_blank"><img src="https://avatars.githubusercontent.com/u/22906905?s=52&v=4" width="50" height="50" valign="middle" /></a>
  </span>
  &nbsp;
  <span>
    <a href="https://github.com/gibson552" class="Link" title="gibson552" target="_blank"><img src="https://avatars.githubusercontent.com/u/84058359?s=52&v=4" width="50" height="50" valign="middle" /></a>
  </span>
</div>
