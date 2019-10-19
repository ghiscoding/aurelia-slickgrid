# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="2.14.0"></a>
# [2.14.0](https://github.com/ghiscoding/aurelia-slickgrid/compare/v2.13.5...v2.14.0) (2019-10-19)


### Bug Fixes

* **backend:** query should not include pagination option when disabled ([#220](https://github.com/ghiscoding/aurelia-slickgrid/issues/220)) ([e9731d9](https://github.com/ghiscoding/aurelia-slickgrid/commit/e9731d9))
* **editor:** autocommit should not save if value is the same as before ([#238](https://github.com/ghiscoding/aurelia-slickgrid/issues/238)) ([78d1d81](https://github.com/ghiscoding/aurelia-slickgrid/commit/78d1d81))
* **editor:** provide complex object override path for select editor ([#237](https://github.com/ghiscoding/aurelia-slickgrid/issues/237)) ([bb467cd](https://github.com/ghiscoding/aurelia-slickgrid/commit/bb467cd))
* **editors:** complex objects should work with all editors ([#226](https://github.com/ghiscoding/aurelia-slickgrid/issues/226)) ([b792863](https://github.com/ghiscoding/aurelia-slickgrid/commit/b792863))
* **filter:** should be able to filter even on hidden columns ([#236](https://github.com/ghiscoding/aurelia-slickgrid/issues/236)) ([390fe8a](https://github.com/ghiscoding/aurelia-slickgrid/commit/390fe8a))
* **gridService:** addItem/updatedItemById pass array to setSelectedRows ([#234](https://github.com/ghiscoding/aurelia-slickgrid/issues/234)) ([96d04cc](https://github.com/ghiscoding/aurelia-slickgrid/commit/96d04cc))
* **gridService:** refactor the code and add more unit tests ([8a4d438](https://github.com/ghiscoding/aurelia-slickgrid/commit/8a4d438))
* **gridService:** upsertItem(s) should trigger onItemAdded/Updated event ([#231](https://github.com/ghiscoding/aurelia-slickgrid/issues/231)) ([11c3c52](https://github.com/ghiscoding/aurelia-slickgrid/commit/11c3c52))
* **styling:** styling issue in Firefox after col reordering ([#228](https://github.com/ghiscoding/aurelia-slickgrid/issues/228)) ([a737cdf](https://github.com/ghiscoding/aurelia-slickgrid/commit/a737cdf))


### Features

* **backend:** extract Pagination into its own Service to expose methods ([#230](https://github.com/ghiscoding/aurelia-slickgrid/issues/230)) ([9af863d](https://github.com/ghiscoding/aurelia-slickgrid/commit/9af863d))
* **conditions:** add field type float/integer to sorters/filters util ([#233](https://github.com/ghiscoding/aurelia-slickgrid/issues/233)) ([017f93d](https://github.com/ghiscoding/aurelia-slickgrid/commit/017f93d))
* **export:** add delimiter/listSeparator override to use with GraphQL ([#232](https://github.com/ghiscoding/aurelia-slickgrid/issues/232)) ([c4ae19d](https://github.com/ghiscoding/aurelia-slickgrid/commit/c4ae19d))
* **export:** add Export to Excel feature ([#235](https://github.com/ghiscoding/aurelia-slickgrid/issues/235)) ([feeb6ad](https://github.com/ghiscoding/aurelia-slickgrid/commit/feeb6ad))
* **filter:** add unit test suite for multiple Filters ([#221](https://github.com/ghiscoding/aurelia-slickgrid/issues/221)) ([f0a526d](https://github.com/ghiscoding/aurelia-slickgrid/commit/f0a526d))
* **insert:** add option to insert item at bottom of grid ([#229](https://github.com/ghiscoding/aurelia-slickgrid/issues/229)) ([ed759e8](https://github.com/ghiscoding/aurelia-slickgrid/commit/ed759e8))
* **metrics:** deprecated Statistic and renamed to Metrics ([#225](https://github.com/ghiscoding/aurelia-slickgrid/issues/225)) ([147c894](https://github.com/ghiscoding/aurelia-slickgrid/commit/147c894))
* **odata:** add "enableCount" flag to add to OData query ([#224](https://github.com/ghiscoding/aurelia-slickgrid/issues/224)) ([5018ca8](https://github.com/ghiscoding/aurelia-slickgrid/commit/5018ca8))
* **sorters:** consolidate & provide all date sorters ([#218](https://github.com/ghiscoding/aurelia-slickgrid/issues/218)) ([f8e2127](https://github.com/ghiscoding/aurelia-slickgrid/commit/f8e2127))
* **tests:** add AutoComplete Filter & Editor Unit Tests ([#222](https://github.com/ghiscoding/aurelia-slickgrid/issues/222)) ([77bb18b](https://github.com/ghiscoding/aurelia-slickgrid/commit/77bb18b))
* **tests:** add missing AutoComplete unit tests ([dd04d4e](https://github.com/ghiscoding/aurelia-slickgrid/commit/dd04d4e))
* **tests:** add unit tests for SingleSelect & MultipleSelect Filters ([#219](https://github.com/ghiscoding/aurelia-slickgrid/issues/219)) ([42e38a6](https://github.com/ghiscoding/aurelia-slickgrid/commit/42e38a6))



<a name="2.13.5"></a>
## [2.13.5](https://github.com/ghiscoding/aurelia-slickgrid/compare/v2.13.4...v2.13.5) (2019-08-17)



<a name="2.13.4"></a>
## [2.13.4](https://github.com/ghiscoding/aurelia-slickgrid/compare/v2.13.3...v2.13.4) (2019-08-17)


### Bug Fixes

* **i18n:** aurelia-i18n needs to stay a dependency even if optional ([6920fbf](https://github.com/ghiscoding/aurelia-slickgrid/commit/6920fbf))



<a name="2.13.3"></a>
## 2.13.3 (2019-08-17)


### Bug Fixes

* **bs4:** fix another Bootstrap 4 styling ([8a949a6](https://github.com/ghiscoding/aurelia-slickgrid/commit/8a949a6))



<a name="2.13.3"></a>
## [2.13.3](https://github.com/ghiscoding/aurelia-slickgrid/compare/v2.13.2...v2.13.3) (2019-08-17)


### Bug Fixes

* **bs4:** fix some Bootstrap 4 styling ([432bad0](https://github.com/ghiscoding/aurelia-slickgrid/commit/432bad0))



<a name="2.13.2"></a>
## [2.13.2](https://github.com/ghiscoding/aurelia-slickgrid/compare/v2.13.1...v2.13.2) (2019-08-17)



<a name="2.13.1"></a>
## [2.13.1](https://github.com/ghiscoding/aurelia-slickgrid/compare/v2.13.0...v2.13.1) (2019-08-17)



<a name="2.13.0"></a>
# 2.13.0 (2019-08-17)



<a name="2.13.0"></a>
# [2.13.0](https://github.com/ghiscoding/aurelia-slickgrid/compare/v2.12.3...v2.13.0) (2019-08-17)


### Bug Fixes

* **dom:** ColumnPicker & GridMenu were creating multiple DOM elements ([#205](https://github.com/ghiscoding/aurelia-slickgrid/issues/205)) ([901da5e](https://github.com/ghiscoding/aurelia-slickgrid/commit/901da5e))
* **editor:** fix negative number in floatEditor ([c02379b](https://github.com/ghiscoding/aurelia-slickgrid/commit/c02379b))
* **odata:** use contains with OData version 4 ([#215](https://github.com/ghiscoding/aurelia-slickgrid/issues/215)) ([2ff9a91](https://github.com/ghiscoding/aurelia-slickgrid/commit/2ff9a91)), closes [#263](https://github.com/ghiscoding/aurelia-slickgrid/issues/263)
* **presets:** Grid State & Presets stopped working for columns ([#213](https://github.com/ghiscoding/aurelia-slickgrid/issues/213)) ([d1949aa](https://github.com/ghiscoding/aurelia-slickgrid/commit/d1949aa))
* **selection:** selected row should be none after filtering ([#210](https://github.com/ghiscoding/aurelia-slickgrid/issues/210)) ([315a8b8](https://github.com/ghiscoding/aurelia-slickgrid/commit/315a8b8))


### Features

* **cypress:** add Cypress E2E testing to CircleCI build ([#207](https://github.com/ghiscoding/aurelia-slickgrid/issues/207)) ([1d3e341](https://github.com/ghiscoding/aurelia-slickgrid/commit/1d3e341))
* **filter:** add filter search range functionality ([#214](https://github.com/ghiscoding/aurelia-slickgrid/issues/214)) ([e9298ed](https://github.com/ghiscoding/aurelia-slickgrid/commit/e9298ed))
* **filter:** add optional placeholder to multiple select ([dc6a2f6](https://github.com/ghiscoding/aurelia-slickgrid/commit/dc6a2f6))
* **registry:** add npm package info for github package registry ([7727c3c](https://github.com/ghiscoding/aurelia-slickgrid/commit/7727c3c))
* **tests:** add Cypress E2E tests to cover hidden columns ([#211](https://github.com/ghiscoding/aurelia-slickgrid/issues/211)) ([c76ca3e](https://github.com/ghiscoding/aurelia-slickgrid/commit/c76ca3e))
* **translate:** make I18N an optional dependency ([#208](https://github.com/ghiscoding/aurelia-slickgrid/issues/208)) ([6bb9056](https://github.com/ghiscoding/aurelia-slickgrid/commit/6bb9056))



<a name="2.12.3"></a>
## [2.12.3](https://github.com/ghiscoding/aurelia-slickgrid/compare/v2.12.2...v2.12.3) (2019-07-25)


### Bug Fixes

* **backend:** clear empty filter by header menu not stopping spinner ([#206](https://github.com/ghiscoding/aurelia-slickgrid/issues/206)) ([1537315](https://github.com/ghiscoding/aurelia-slickgrid/commit/1537315))
* **gridMenu:** adding user customItems in GridMenu was no longer showing ([#209](https://github.com/ghiscoding/aurelia-slickgrid/issues/209)) ([38c1c4c](https://github.com/ghiscoding/aurelia-slickgrid/commit/38c1c4c))
* **gridMenu:** external grid menu was not triggering ([#204](https://github.com/ghiscoding/aurelia-slickgrid/issues/204)) ([2f83774](https://github.com/ghiscoding/aurelia-slickgrid/commit/2f83774))


### Features

* **cypress:** add Cypress E2E testing to CircleCI build ([5d9d5fb](https://github.com/ghiscoding/aurelia-slickgrid/commit/5d9d5fb))



<a name="2.12.2"></a>
## [2.12.2](https://github.com/ghiscoding/aurelia-slickgrid/compare/v2.12.1...v2.12.2) (2019-07-13)


### Bug Fixes

* **export:** exporting null or undefined should replace by empty string ([06f9e00](https://github.com/ghiscoding/aurelia-slickgrid/commit/06f9e00))
* **menu:** Column Picker & Grid Menu not updated dynamically ([#200](https://github.com/ghiscoding/aurelia-slickgrid/issues/200)) ([5b88df0](https://github.com/ghiscoding/aurelia-slickgrid/commit/5b88df0))
* **slickgrid:** use previous version of Slickgrid to fix column autosize ([9d90cb6](https://github.com/ghiscoding/aurelia-slickgrid/commit/9d90cb6))


### Features

* **tests:** add ExportService full test suite ([#201](https://github.com/ghiscoding/aurelia-slickgrid/issues/201)) ([01fbb6b](https://github.com/ghiscoding/aurelia-slickgrid/commit/01fbb6b))
* **tests:** add more ResizerService tests ([#203](https://github.com/ghiscoding/aurelia-slickgrid/issues/203)) ([ad6f698](https://github.com/ghiscoding/aurelia-slickgrid/commit/ad6f698))



<a name="2.12.1"></a>
## [2.12.1](https://github.com/ghiscoding/aurelia-slickgrid/compare/v2.12.0...v2.12.1) (2019-07-03)


### Bug Fixes

* **filterService:** regression introduced in "clearFilters" last commit ([0a0cd8e](https://github.com/ghiscoding/aurelia-slickgrid/commit/0a0cd8e))



<a name="2.12.0"></a>
# [2.12.0](https://github.com/ghiscoding/aurelia-slickgrid/compare/v2.11.3...v2.12.0) (2019-07-02)


### Bug Fixes

* **backend:** regression in both backend service with gridstate ([b77c15e](https://github.com/ghiscoding/aurelia-slickgrid/commit/b77c15e))
* **filter:** regression, small issue detected when using compound filter ([d32e0a0](https://github.com/ghiscoding/aurelia-slickgrid/commit/d32e0a0))


### Features

* **build:** replace moment with moment-mini for smaller build ([3a0b2a9](https://github.com/ghiscoding/aurelia-slickgrid/commit/3a0b2a9))
* **tests:** add AureliaUtilService full test suite ([#195](https://github.com/ghiscoding/aurelia-slickgrid/issues/195)) ([a7fca15](https://github.com/ghiscoding/aurelia-slickgrid/commit/a7fca15))
* **tests:** add more unit tests to FilterService ([#199](https://github.com/ghiscoding/aurelia-slickgrid/issues/199)) ([7bf603f](https://github.com/ghiscoding/aurelia-slickgrid/commit/7bf603f))
* **tests:** add some unit tests for FilterService ([#198](https://github.com/ghiscoding/aurelia-slickgrid/issues/198)) ([6097a8d](https://github.com/ghiscoding/aurelia-slickgrid/commit/6097a8d))



<a name="2.11.3"></a>
## [2.11.3](https://github.com/ghiscoding/aurelia-slickgrid/compare/v2.11.2...v2.11.3) (2019-06-18)


### Bug Fixes

* **core:** update to latest SlickGrid version to fix column resize ([4590844](https://github.com/ghiscoding/aurelia-slickgrid/commit/4590844))
* **queryField:** queryFieldFilter and queryFieldSorter have precedence ([#191](https://github.com/ghiscoding/aurelia-slickgrid/issues/191)) ([73c8f37](https://github.com/ghiscoding/aurelia-slickgrid/commit/73c8f37))
* **singleton:** all Services should be singleton, fixes [#190](https://github.com/ghiscoding/aurelia-slickgrid/issues/190) ([#192](https://github.com/ghiscoding/aurelia-slickgrid/issues/192)) ([0bbb0ae](https://github.com/ghiscoding/aurelia-slickgrid/commit/0bbb0ae))


### Features

* **example:** add Bootstrap Tabs example ([8255772](https://github.com/ghiscoding/aurelia-slickgrid/commit/8255772))
* **odata:** add presets to GridOdata Service (and unit tests) ([#193](https://github.com/ghiscoding/aurelia-slickgrid/issues/193)) ([64b07fe](https://github.com/ghiscoding/aurelia-slickgrid/commit/64b07fe))
* **tests:** add GraphqlQueryBuilder unit tests ([#189](https://github.com/ghiscoding/aurelia-slickgrid/issues/189)) ([3f9edba](https://github.com/ghiscoding/aurelia-slickgrid/commit/3f9edba))
* **tests:** add missing sorterUtilities test ([#188](https://github.com/ghiscoding/aurelia-slickgrid/issues/188)) ([a2f5a67](https://github.com/ghiscoding/aurelia-slickgrid/commit/a2f5a67))
* **tests:** add more RowDetailViewExtension unit tests ([#187](https://github.com/ghiscoding/aurelia-slickgrid/issues/187)) ([ffd9f0f](https://github.com/ghiscoding/aurelia-slickgrid/commit/ffd9f0f))



<a name="2.11.2"></a>
## [2.11.2](https://github.com/ghiscoding/aurelia-slickgrid/compare/v2.11.1...v2.11.2) (2019-06-08)



<a name="2.11.1"></a>
## [2.11.1](https://github.com/ghiscoding/aurelia-slickgrid/compare/v2.11.0...v2.11.1) (2019-06-08)



<a name="2.11.0"></a>
# [2.11.0](https://github.com/ghiscoding/aurelia-slickgrid/compare/v2.10.1...v2.11.0) (2019-06-08)


### Bug Fixes

* **copy:** copy+paste cells was not working ([#160](https://github.com/ghiscoding/aurelia-slickgrid/issues/160)) ([7d5090a](https://github.com/ghiscoding/aurelia-slickgrid/commit/7d5090a))
* **dateEditor:** allow backspace for deleting a date ([7ddb0cc](https://github.com/ghiscoding/aurelia-slickgrid/commit/7ddb0cc))
* **editor:** dynamically adding editor column throws error ([#181](https://github.com/ghiscoding/aurelia-slickgrid/issues/181)) ([41517d4](https://github.com/ghiscoding/aurelia-slickgrid/commit/41517d4))
* **editor:** force user input in autocomplete ([15cfa2d](https://github.com/ghiscoding/aurelia-slickgrid/commit/15cfa2d))
* **editor:** integer editor was always showing invalid when null value ([#180](https://github.com/ghiscoding/aurelia-slickgrid/issues/180)) ([ca7c591](https://github.com/ghiscoding/aurelia-slickgrid/commit/ca7c591))
* **gridState:** columnPicker & gridMenu not triggering gridState change ([#170](https://github.com/ghiscoding/aurelia-slickgrid/issues/170)) ([01e5a56](https://github.com/ghiscoding/aurelia-slickgrid/commit/01e5a56))
* **height:** should throw error when no height or enableAutoResize ([70f069c](https://github.com/ghiscoding/aurelia-slickgrid/commit/70f069c))
* **rowDetail:** update to latest SlickGrid version to fix scrolling ([c159be0](https://github.com/ghiscoding/aurelia-slickgrid/commit/c159be0))
* **selection:** styling of row selection is incorrect when adding rows ([325ff0b](https://github.com/ghiscoding/aurelia-slickgrid/commit/325ff0b))
* **selection:** syncGridSelection and preserveHidden ([#173](https://github.com/ghiscoding/aurelia-slickgrid/issues/173)) ([bc33773](https://github.com/ghiscoding/aurelia-slickgrid/commit/bc33773))


### Features

* **build:** add Codecov badge to show coverage ([601078a](https://github.com/ghiscoding/aurelia-slickgrid/commit/601078a))
* **build:** add Cypress CI to build plan ([4e7b1fa](https://github.com/ghiscoding/aurelia-slickgrid/commit/4e7b1fa))
* **copy:** add ExcelCopyBufferOptions to grid option ([#178](https://github.com/ghiscoding/aurelia-slickgrid/issues/178)) ([b309e82](https://github.com/ghiscoding/aurelia-slickgrid/commit/b309e82))
* **demo:** add custom formatter with onCellClick ([dd4d109](https://github.com/ghiscoding/aurelia-slickgrid/commit/dd4d109))
* **euro:** add Euro Formatters and Sorters (day/month/year) ([#168](https://github.com/ghiscoding/aurelia-slickgrid/issues/168)) ([ab408a1](https://github.com/ghiscoding/aurelia-slickgrid/commit/ab408a1))
* **formatter:** add formatterOptions to Formatters, Grouping Formatters ([#166](https://github.com/ghiscoding/aurelia-slickgrid/issues/166)) ([015476d](https://github.com/ghiscoding/aurelia-slickgrid/commit/015476d))
* **formatters:** consolidate all Date Formatters into 1 method call DRY ([#169](https://github.com/ghiscoding/aurelia-slickgrid/issues/169)) ([4bcb74b](https://github.com/ghiscoding/aurelia-slickgrid/commit/4bcb74b))
* **gridService:** add "upsertItem" method to Grid Service ([#179](https://github.com/ghiscoding/aurelia-slickgrid/issues/179)) ([e65609b](https://github.com/ghiscoding/aurelia-slickgrid/commit/e65609b))
* **jest:** add few more Formatter unit tests & fixed some Formatters ([0d8ca4a](https://github.com/ghiscoding/aurelia-slickgrid/commit/0d8ca4a))
* **menu:** add options to exclude column titles from Menus ([#176](https://github.com/ghiscoding/aurelia-slickgrid/issues/176)) ([71d290d](https://github.com/ghiscoding/aurelia-slickgrid/commit/71d290d))
* **resizer:** add calculateAvailableSizeBy container option ([#161](https://github.com/ghiscoding/aurelia-slickgrid/issues/161)) ([2085a62](https://github.com/ghiscoding/aurelia-slickgrid/commit/2085a62))
* **resizer:** add new method "pauseResizer" ([#183](https://github.com/ghiscoding/aurelia-slickgrid/issues/183)) ([72fa5db](https://github.com/ghiscoding/aurelia-slickgrid/commit/72fa5db))
* **rowDetail:** add option to limit expanded row to only 1 at a time ([#177](https://github.com/ghiscoding/aurelia-slickgrid/issues/177)) ([e835b34](https://github.com/ghiscoding/aurelia-slickgrid/commit/e835b34))
* **test:** add lib index entry point unit tests ([#163](https://github.com/ghiscoding/aurelia-slickgrid/issues/163)) ([5c6d028](https://github.com/ghiscoding/aurelia-slickgrid/commit/5c6d028))
* **tests:** add Aggregators full test suite ([802521a](https://github.com/ghiscoding/aurelia-slickgrid/commit/802521a))
* **tests:** add Extension Service full test suite ([#174](https://github.com/ghiscoding/aurelia-slickgrid/issues/174)) ([55c3502](https://github.com/ghiscoding/aurelia-slickgrid/commit/55c3502))
* **tests:** add few Grid Service unit tests ([#182](https://github.com/ghiscoding/aurelia-slickgrid/issues/182)) ([b34b585](https://github.com/ghiscoding/aurelia-slickgrid/commit/b34b585))
* **tests:** add Grouping Formatters full test suite ([#165](https://github.com/ghiscoding/aurelia-slickgrid/issues/165)) ([f9a7872](https://github.com/ghiscoding/aurelia-slickgrid/commit/f9a7872))
* **tests:** add missing Formatter unit tests ([#162](https://github.com/ghiscoding/aurelia-slickgrid/issues/162)) ([51c0bbd](https://github.com/ghiscoding/aurelia-slickgrid/commit/51c0bbd))
* **tests:** add more Extensions unit tests ([#184](https://github.com/ghiscoding/aurelia-slickgrid/issues/184)) ([5f6f3b0](https://github.com/ghiscoding/aurelia-slickgrid/commit/5f6f3b0))
* **tests:** add more RowDetailExtension tests ([#185](https://github.com/ghiscoding/aurelia-slickgrid/issues/185)) ([e4d99e9](https://github.com/ghiscoding/aurelia-slickgrid/commit/e4d99e9))
* **tests:** add Service Utilities full test suite ([#167](https://github.com/ghiscoding/aurelia-slickgrid/issues/167)) ([e6e4ed8](https://github.com/ghiscoding/aurelia-slickgrid/commit/e6e4ed8))
* **tests:** add Sorters full test suite ([#164](https://github.com/ghiscoding/aurelia-slickgrid/issues/164)) ([d375939](https://github.com/ghiscoding/aurelia-slickgrid/commit/d375939))



<a name="2.10.1"></a>
## [2.10.1](https://github.com/ghiscoding/aurelia-slickgrid/compare/v2.10.0...v2.10.1) (2019-04-21)



<a name="2.10.0"></a>
# [2.10.0](https://github.com/ghiscoding/aurelia-slickgrid/compare/v2.9.2...v2.10.0) (2019-04-21)


### Bug Fixes

* **backend:** Filter presets is getting removed when calling sort ([98e8199](https://github.com/ghiscoding/aurelia-slickgrid/commit/98e8199))
* **formatter:** rewrite formatter do what it was supposed to do ([9100e2c](https://github.com/ghiscoding/aurelia-slickgrid/commit/9100e2c))
* **headerMenu:** calling "Clear Filter" was calling incorrect grid state ([a699c45](https://github.com/ghiscoding/aurelia-slickgrid/commit/a699c45))
* **input:** remove autocomplete from all Editors & Filters ([6db160e](https://github.com/ghiscoding/aurelia-slickgrid/commit/6db160e))
* **input:** remove autocomplete from all Editors & Filters again ([437e913](https://github.com/ghiscoding/aurelia-slickgrid/commit/437e913))
* **pageSizes:** setting different sizes extend global sizes, fixes [#150](https://github.com/ghiscoding/aurelia-slickgrid/issues/150) ([d64cf9a](https://github.com/ghiscoding/aurelia-slickgrid/commit/d64cf9a))
* **rowDetail:** use latest Github SlickGrid code, temporary fix ([c4a319b](https://github.com/ghiscoding/aurelia-slickgrid/commit/c4a319b))
* **select:** sync multiple-select.js with core lib & fix some js event ([a9b6093](https://github.com/ghiscoding/aurelia-slickgrid/commit/a9b6093))


### Features

* **e2e:** add Jest & Cypress to the lib ([#148](https://github.com/ghiscoding/aurelia-slickgrid/issues/148)) ([9905245](https://github.com/ghiscoding/aurelia-slickgrid/commit/9905245))
* **editor:** add title attribute to all Editors ([#156](https://github.com/ghiscoding/aurelia-slickgrid/issues/156)) ([6e0d125](https://github.com/ghiscoding/aurelia-slickgrid/commit/6e0d125))
* **filter:** add demo of single search filter, closes [#152](https://github.com/ghiscoding/aurelia-slickgrid/issues/152) ([#157](https://github.com/ghiscoding/aurelia-slickgrid/issues/157)) ([919872e](https://github.com/ghiscoding/aurelia-slickgrid/commit/919872e))
* **filters:** add flag to optionally trim filter white spaces ([f0496fb](https://github.com/ghiscoding/aurelia-slickgrid/commit/f0496fb))
* **jest:** write a couple more Jest unit tests ([35537ba](https://github.com/ghiscoding/aurelia-slickgrid/commit/35537ba))
* **rowDetail:** user can override expand icon logic ([#154](https://github.com/ghiscoding/aurelia-slickgrid/issues/154)) ([4c887c6](https://github.com/ghiscoding/aurelia-slickgrid/commit/4c887c6))
* **rowSelection:** user can override row selection checkbox logic ([#155](https://github.com/ghiscoding/aurelia-slickgrid/issues/155)) ([b5d7546](https://github.com/ghiscoding/aurelia-slickgrid/commit/b5d7546))



<a name="2.9.2"></a>
## [2.9.2](https://github.com/ghiscoding/aurelia-slickgrid/compare/v2.9.1...v2.9.2) (2019-03-18)



<a name="2.9.1"></a>
## [2.9.1](https://github.com/ghiscoding/aurelia-slickgrid/compare/v2.9.0...v2.9.1) (2019-03-18)



<a name="2.9.0"></a>
# [2.9.0](https://github.com/ghiscoding/aurelia-slickgrid/compare/v2.8.2...v2.9.0) (2019-03-16)


### Bug Fixes

* **cellCopy:** fix a small issue with cell copy ([b31edc4](https://github.com/ghiscoding/aurelia-slickgrid/commit/b31edc4))
* **client-cli:** replace gulp package link, ref issue [#139](https://github.com/ghiscoding/aurelia-slickgrid/issues/139) ([eb662e2](https://github.com/ghiscoding/aurelia-slickgrid/commit/eb662e2))
* **editor:** allow all Editors to work with complex objects ([#145](https://github.com/ghiscoding/aurelia-slickgrid/issues/145)) ([ffa62f3](https://github.com/ghiscoding/aurelia-slickgrid/commit/ffa62f3))
* **example:** multiSelect should be false when using single row select ([a3afa3d](https://github.com/ghiscoding/aurelia-slickgrid/commit/a3afa3d))
* **formatters:** some formatters were not considering empty string ([74bfcaa](https://github.com/ghiscoding/aurelia-slickgrid/commit/74bfcaa))
* **mapDateFormat:** add missing date format in map utility ([fd00013](https://github.com/ghiscoding/aurelia-slickgrid/commit/fd00013))
* **rowDetail:** clear Row Detail content before recreating it ([#146](https://github.com/ghiscoding/aurelia-slickgrid/issues/146)) ([83bb1dd](https://github.com/ghiscoding/aurelia-slickgrid/commit/83bb1dd))
* **RowDetail:** fix missing html tag closing for <template> ([7ddbd6c](https://github.com/ghiscoding/aurelia-slickgrid/commit/7ddbd6c))
* **select:** when destroying Select Filter/Editor, escape dot in name ([1ae74d0](https://github.com/ghiscoding/aurelia-slickgrid/commit/1ae74d0))
* **updateItem:** call grid.updateRow instead of grid.invalidateRow ([8c503a4](https://github.com/ghiscoding/aurelia-slickgrid/commit/8c503a4))


### Features

* **autoHeight:** add autoHeight Grid Option with Example ([#142](https://github.com/ghiscoding/aurelia-slickgrid/issues/142)) ([688173e](https://github.com/ghiscoding/aurelia-slickgrid/commit/688173e))
* **editors:** add "required" and "alwaysSaveOnEnterKey" options ([#141](https://github.com/ghiscoding/aurelia-slickgrid/issues/141)) ([9900f74](https://github.com/ghiscoding/aurelia-slickgrid/commit/9900f74))
* **flatpickr:** add filterOptions & editorOptions ([#147](https://github.com/ghiscoding/aurelia-slickgrid/issues/147)) ([2f829f6](https://github.com/ghiscoding/aurelia-slickgrid/commit/2f829f6))
* **gridMenu:** demo Grid Menu button can be added anywhere ([#144](https://github.com/ghiscoding/aurelia-slickgrid/issues/144)) ([ec4c78a](https://github.com/ghiscoding/aurelia-slickgrid/commit/ec4c78a))
* **rowDetail:** dynamically change row detail view row count ([acb881c](https://github.com/ghiscoding/aurelia-slickgrid/commit/acb881c))



<a name="2.8.2"></a>
## [2.8.2](https://github.com/ghiscoding/aurelia-slickgrid/compare/v2.8.1...v2.8.2) (2019-02-09)


### Bug Fixes

* **filter:** all jquery .on bound event should also be unbound ([#137](https://github.com/ghiscoding/aurelia-slickgrid/issues/137)) ([0570a95](https://github.com/ghiscoding/aurelia-slickgrid/commit/0570a95))
* **filter:** select filter drop doesn't get removed on destroy ([#138](https://github.com/ghiscoding/aurelia-slickgrid/issues/138)) ([d967348](https://github.com/ghiscoding/aurelia-slickgrid/commit/d967348))



<a name="2.8.1"></a>
## [2.8.1](https://github.com/ghiscoding/aurelia-slickgrid/compare/v2.8.0...v2.8.1) (2019-02-02)


### Bug Fixes

* **backend:** debounceTypingDelay on input Filter was no longer working ([#134](https://github.com/ghiscoding/aurelia-slickgrid/issues/134)) ([ab2be81](https://github.com/ghiscoding/aurelia-slickgrid/commit/ab2be81))
* **pagination:** incorrect pagination behavior on adding/removing items ([#135](https://github.com/ghiscoding/aurelia-slickgrid/issues/135)) ([1092282](https://github.com/ghiscoding/aurelia-slickgrid/commit/1092282))


### Features

* **gridService:** add new methods to GridService ([#133](https://github.com/ghiscoding/aurelia-slickgrid/issues/133)) ([e881bd3](https://github.com/ghiscoding/aurelia-slickgrid/commit/e881bd3)), closes [#110](https://github.com/ghiscoding/aurelia-slickgrid/issues/110) [#111](https://github.com/ghiscoding/aurelia-slickgrid/issues/111)



<a name="2.8.0"></a>
# [2.8.0](https://github.com/ghiscoding/aurelia-slickgrid/compare/v2.7.0...v2.8.0) (2019-01-19)


### Bug Fixes

* **filter:** Header Menu Clear Filter not calling Grid State change ([85e34d3](https://github.com/ghiscoding/aurelia-slickgrid/commit/85e34d3))
* **styling:** fix a small styling issue when Filters are filled ([58bb1e1](https://github.com/ghiscoding/aurelia-slickgrid/commit/58bb1e1))



<a name="2.7.0"></a>
# [2.7.0](https://github.com/ghiscoding/aurelia-slickgrid/compare/v2.6.2...v2.7.0) (2019-01-16)


### Bug Fixes

* **autocomplete:** add "ui-front" to parent container of autocomplete ([a2b07ff](https://github.com/ghiscoding/aurelia-slickgrid/commit/a2b07ff))
* **filter:** Select Filter "addBlankEntry" sometimes add 2x entries ([#126](https://github.com/ghiscoding/aurelia-slickgrid/issues/126)) ([e07e726](https://github.com/ghiscoding/aurelia-slickgrid/commit/e07e726))
* **pagination:** refresh paging after adding/deleting item with DataView ([#124](https://github.com/ghiscoding/aurelia-slickgrid/issues/124)) ([3e31b24](https://github.com/ghiscoding/aurelia-slickgrid/commit/3e31b24))
* **translateFormatter:** shouldn't convert null values to string ([#127](https://github.com/ghiscoding/aurelia-slickgrid/issues/127)) ([79a159c](https://github.com/ghiscoding/aurelia-slickgrid/commit/79a159c))


### Features

* **autocomplete:** Editor & Filter autocomplete feature  ([#122](https://github.com/ghiscoding/aurelia-slickgrid/issues/122)) ([d89b3ab](https://github.com/ghiscoding/aurelia-slickgrid/commit/d89b3ab))
* **build:** distribution folder shouldn't be part of the Git ([#128](https://github.com/ghiscoding/aurelia-slickgrid/issues/128)) ([f84662c](https://github.com/ghiscoding/aurelia-slickgrid/commit/f84662c))
* **divider:** add divider option to Grid Menu & Column Header Menu ([#131](https://github.com/ghiscoding/aurelia-slickgrid/issues/131)) ([4788904](https://github.com/ghiscoding/aurelia-slickgrid/commit/4788904))
* **filter:** input mask filter ([#132](https://github.com/ghiscoding/aurelia-slickgrid/issues/132)) ([d591a8b](https://github.com/ghiscoding/aurelia-slickgrid/commit/d591a8b))
* **frozen:** add frozen column/row example ([#121](https://github.com/ghiscoding/aurelia-slickgrid/issues/121)) ([12dde76](https://github.com/ghiscoding/aurelia-slickgrid/commit/12dde76))
* **frozen:** add option to freeze bottom instead of just top ([#123](https://github.com/ghiscoding/aurelia-slickgrid/issues/123)) ([deb1e19](https://github.com/ghiscoding/aurelia-slickgrid/commit/deb1e19))
* **headermenu:** add Clear Filter to each Column Header Menu ([#130](https://github.com/ghiscoding/aurelia-slickgrid/issues/130)) ([b7fa750](https://github.com/ghiscoding/aurelia-slickgrid/commit/b7fa750))
* **sorter:** add object with dataKey as a Sort and add custom Sorter ([#129](https://github.com/ghiscoding/aurelia-slickgrid/issues/129)) ([189fb20](https://github.com/ghiscoding/aurelia-slickgrid/commit/189fb20))
* **sorting:** add "Clear Sort" in each Column Header Menu ([#125](https://github.com/ghiscoding/aurelia-slickgrid/issues/125)) ([cd6a6e5](https://github.com/ghiscoding/aurelia-slickgrid/commit/cd6a6e5))



<a name="2.6.2"></a>
## [2.6.2](https://github.com/ghiscoding/aurelia-slickgrid/compare/v2.6.1...v2.6.2) (2018-12-20)


### Bug Fixes

* **converter:** add prefix to value converter to avoid conflicts ([87ad6cc](https://github.com/ghiscoding/aurelia-slickgrid/commit/87ad6cc))
* **converter:** rename converter camel case with prefix ([5b83be8](https://github.com/ghiscoding/aurelia-slickgrid/commit/5b83be8))



<a name="2.6.1"></a>
## [2.6.1](https://github.com/ghiscoding/aurelia-slickgrid/compare/v2.6.0...v2.6.1) (2018-12-20)


### Bug Fixes

* **grouping:** toggle group not working in example 18, fixes [#119](https://github.com/ghiscoding/aurelia-slickgrid/issues/119) ([#120](https://github.com/ghiscoding/aurelia-slickgrid/issues/120)) ([10c6190](https://github.com/ghiscoding/aurelia-slickgrid/commit/10c6190))



<a name="2.6.0"></a>
# [2.6.0](https://github.com/ghiscoding/aurelia-slickgrid/compare/v2.5.0...v2.6.0) (2018-12-18)


### Bug Fixes

* **editor:** Float Editor not working with .5 but works with 0.5 ([1082fdf](https://github.com/ghiscoding/aurelia-slickgrid/commit/1082fdf))
* **filter:** Date in UTC format with milliseconds not filtering well ([718b7c4](https://github.com/ghiscoding/aurelia-slickgrid/commit/718b7c4))
* **pagination:** fixed a few pagination problem used by backend service ([4f2362b](https://github.com/ghiscoding/aurelia-slickgrid/commit/4f2362b))
* **resize:** global delay timer was affecting multiple grid resize ([a661115](https://github.com/ghiscoding/aurelia-slickgrid/commit/a661115))


### Features

* **backend:** add onError callback which catch error from process ([#116](https://github.com/ghiscoding/aurelia-slickgrid/issues/116)) ([17092b8](https://github.com/ghiscoding/aurelia-slickgrid/commit/17092b8))
* **badge:** add download count badge ([1676d7c](https://github.com/ghiscoding/aurelia-slickgrid/commit/1676d7c))
* **grouping:** draggable grouping plugin ([#114](https://github.com/ghiscoding/aurelia-slickgrid/issues/114)) ([0972471](https://github.com/ghiscoding/aurelia-slickgrid/commit/0972471))
* **inputType:** Add multiple Filter input types (number/password) ([#117](https://github.com/ghiscoding/aurelia-slickgrid/issues/117)) ([387cd21](https://github.com/ghiscoding/aurelia-slickgrid/commit/387cd21))
* **plugin:** add Row Detail Plugin extension ([#113](https://github.com/ghiscoding/aurelia-slickgrid/issues/113)) ([755e026](https://github.com/ghiscoding/aurelia-slickgrid/commit/755e026))
* **remote:** add Remote Model example with custom dataview ([#115](https://github.com/ghiscoding/aurelia-slickgrid/issues/115)) ([7cc2faa](https://github.com/ghiscoding/aurelia-slickgrid/commit/7cc2faa))
* **selector:** add new property to display Select All chkbox elsewhere ([#118](https://github.com/ghiscoding/aurelia-slickgrid/issues/118)) ([db68f7e](https://github.com/ghiscoding/aurelia-slickgrid/commit/db68f7e))
* **update:** add updateDataGridItems for multiple changes ([824af29](https://github.com/ghiscoding/aurelia-slickgrid/commit/824af29))



<a name="2.5.0"></a>
# [2.5.0](https://github.com/ghiscoding/aurelia-slickgrid/compare/v2.4.2...v2.5.0) (2018-11-17)


### Bug Fixes

* **resize:** auto-resize shouldn't resize when fixing gridHeight/Width ([4586d29](https://github.com/ghiscoding/aurelia-slickgrid/commit/4586d29))
* **select:** multiple-select autoAdjustDropWidth sometime incorrect ([2e86cec](https://github.com/ghiscoding/aurelia-slickgrid/commit/2e86cec))
* **select:** Single Select should use EQ operator instead of IN ([550a974](https://github.com/ghiscoding/aurelia-slickgrid/commit/550a974))
* **select:** Single Select should use EQ operator instead of IN ([3f3f9ed](https://github.com/ghiscoding/aurelia-slickgrid/commit/3f3f9ed))


### Features

* **editor:** add "editor-{id}" to all Editors. easier styling & target ([#112](https://github.com/ghiscoding/aurelia-slickgrid/issues/112)) ([6d52536](https://github.com/ghiscoding/aurelia-slickgrid/commit/6d52536))
* **filter:** add "filter-{id}" to all Filters. easier styling & target ([#111](https://github.com/ghiscoding/aurelia-slickgrid/issues/111)) ([d836e7c](https://github.com/ghiscoding/aurelia-slickgrid/commit/d836e7c))
* **plugin:** split out all controls/plugins into their own class ([#110](https://github.com/ghiscoding/aurelia-slickgrid/issues/110)) ([6027d0c](https://github.com/ghiscoding/aurelia-slickgrid/commit/6027d0c))
* **select:** collection can also be of type String ([#109](https://github.com/ghiscoding/aurelia-slickgrid/issues/109)) ([9733d08](https://github.com/ghiscoding/aurelia-slickgrid/commit/9733d08))



<a name="2.4.2"></a>
## [2.4.2](https://github.com/ghiscoding/aurelia-slickgrid/compare/v2.4.0...v2.4.2) (2018-10-20)


### Bug Fixes

* **resize:** autoAdjustDropWidthByTextSize should handle 100% width ([c567f73](https://github.com/ghiscoding/aurelia-slickgrid/commit/c567f73))
* **resize:** when having 2 grids resize only works on 1 grid ([5cf81e1](https://github.com/ghiscoding/aurelia-slickgrid/commit/5cf81e1))


### Features

* **select:** Filter/Editor able to translate prefix/suffix/optionLabel ([0732e53](https://github.com/ghiscoding/aurelia-slickgrid/commit/0732e53))



<a name="2.4.0"></a>
# [2.4.0](https://github.com/ghiscoding/aurelia-slickgrid/compare/v2.3.0...v2.4.0) (2018-10-05)


### Bug Fixes

* **autocommit:** auto-commit should not save if field is invalid ([#108](https://github.com/ghiscoding/aurelia-slickgrid/issues/108)) ([dac989b](https://github.com/ghiscoding/aurelia-slickgrid/commit/dac989b))
* **chrome:** Compensate incorrect SlickGrid measureScrollbar ([24a1bfa](https://github.com/ghiscoding/aurelia-slickgrid/commit/24a1bfa))
* **chrome:** patch horizontal scroll appearing only in Chrome ([877f5a3](https://github.com/ghiscoding/aurelia-slickgrid/commit/877f5a3))
* **chrome:** patch horizontal scroll appearing only in Chrome ([e1ef209](https://github.com/ghiscoding/aurelia-slickgrid/commit/e1ef209))
* **editor:** Select Editor should close when tabbing away, fixes [#92](https://github.com/ghiscoding/aurelia-slickgrid/issues/92) ([#94](https://github.com/ghiscoding/aurelia-slickgrid/issues/94)) ([f8f808c](https://github.com/ghiscoding/aurelia-slickgrid/commit/f8f808c))
* **example:** prerequisite prop should only use integer values, closes [#95](https://github.com/ghiscoding/aurelia-slickgrid/issues/95) ([#97](https://github.com/ghiscoding/aurelia-slickgrid/issues/97)) ([fddda24](https://github.com/ghiscoding/aurelia-slickgrid/commit/fddda24))
* **export:** Export should work with datasetIdPropertyName defined ([#99](https://github.com/ghiscoding/aurelia-slickgrid/issues/99)) ([fad2117](https://github.com/ghiscoding/aurelia-slickgrid/commit/fad2117))
* **export:** remove extra comma at the end of each line ([501b779](https://github.com/ghiscoding/aurelia-slickgrid/commit/501b779))
* **header:** hidding column from header menu after reordering column ([88097ad](https://github.com/ghiscoding/aurelia-slickgrid/commit/88097ad))
* **header:** use showHeaderRow flag when defined by user ([#105](https://github.com/ghiscoding/aurelia-slickgrid/issues/105)) ([d9ccdf2](https://github.com/ghiscoding/aurelia-slickgrid/commit/d9ccdf2))
* **http:** remove aurelia-http-client dependency, closes [#101](https://github.com/ghiscoding/aurelia-slickgrid/issues/101) ([#103](https://github.com/ghiscoding/aurelia-slickgrid/issues/103)) ([f203b0f](https://github.com/ghiscoding/aurelia-slickgrid/commit/f203b0f))
* **styling:** remove black border bottom from column headers ([3e42538](https://github.com/ghiscoding/aurelia-slickgrid/commit/3e42538))


### Features

* **collection:** support multiple filterBy/sortBy in CollectionService ([#106](https://github.com/ghiscoding/aurelia-slickgrid/issues/106)) ([86e8561](https://github.com/ghiscoding/aurelia-slickgrid/commit/86e8561))
* **demo:** Add Dynamic Row CSS Styling example ([bb7f757](https://github.com/ghiscoding/aurelia-slickgrid/commit/bb7f757))
* **demo:** Add Dynamic Row CSS Styling example ([ab16a4e](https://github.com/ghiscoding/aurelia-slickgrid/commit/ab16a4e))
* **editor:** Add auto commit edit flag to grid options ([#96](https://github.com/ghiscoding/aurelia-slickgrid/issues/96)) ([6c9c197](https://github.com/ghiscoding/aurelia-slickgrid/commit/6c9c197)), closes [#82](https://github.com/ghiscoding/aurelia-slickgrid/issues/82)
* **editor:** pass Editor Args to Editor Custom Validators  ([#98](https://github.com/ghiscoding/aurelia-slickgrid/issues/98)) ([27c7132](https://github.com/ghiscoding/aurelia-slickgrid/commit/27c7132))
* **filter:** add posibility to filter complex objects ([#100](https://github.com/ghiscoding/aurelia-slickgrid/issues/100)) ([cfc5565](https://github.com/ghiscoding/aurelia-slickgrid/commit/cfc5565))
* **resize:** add maxHeight & maxWidth options to resizer ([#104](https://github.com/ghiscoding/aurelia-slickgrid/issues/104)) ([547faa5](https://github.com/ghiscoding/aurelia-slickgrid/commit/547faa5))
* **select:** add option to use label as selected text ([#107](https://github.com/ghiscoding/aurelia-slickgrid/issues/107)) ([8df592b](https://github.com/ghiscoding/aurelia-slickgrid/commit/8df592b))
* **sort:** add posibility to sort complex objects ([#102](https://github.com/ghiscoding/aurelia-slickgrid/issues/102)) ([ed6e729](https://github.com/ghiscoding/aurelia-slickgrid/commit/ed6e729))



<a name="2.3.0"></a>
# [2.3.0](https://github.com/ghiscoding/aurelia-slickgrid/compare/v2.2.3...v2.3.0) (2018-08-30)


### Bug Fixes

* **editor:** auto adjust drop position (up/down) broken multiple editors ([a477e53](https://github.com/ghiscoding/aurelia-slickgrid/commit/a477e53))
* **filter:** MultipleSelect Filter had z-index too low in modal window ([c78c9fd](https://github.com/ghiscoding/aurelia-slickgrid/commit/c78c9fd))
* **formatter:** null values not handled properly with number formatters ([9dd649a](https://github.com/ghiscoding/aurelia-slickgrid/commit/9dd649a))
* **grouping:** Filter & Grouping should work together, closes [#90](https://github.com/ghiscoding/aurelia-slickgrid/issues/90) ([#91](https://github.com/ghiscoding/aurelia-slickgrid/issues/91)) ([153e6cc](https://github.com/ghiscoding/aurelia-slickgrid/commit/153e6cc))
* **import:** add missing typings to fix import lodash.isequal ([a32773b](https://github.com/ghiscoding/aurelia-slickgrid/commit/a32773b))
* **options:** be able to disable filtering even when set globally ([1d50635](https://github.com/ghiscoding/aurelia-slickgrid/commit/1d50635))
* **selector:** Row Selection should be reset on Sort changes ([f7162fb](https://github.com/ghiscoding/aurelia-slickgrid/commit/f7162fb))
* **style:** use the correct radio icon for singleSelect ([18478d9](https://github.com/ghiscoding/aurelia-slickgrid/commit/18478d9))


### Features

* **async:** Filter & Editor load Collection Async & Watch, closes [#83](https://github.com/ghiscoding/aurelia-slickgrid/issues/83) ([#89](https://github.com/ghiscoding/aurelia-slickgrid/issues/89)) ([e12019b](https://github.com/ghiscoding/aurelia-slickgrid/commit/e12019b))
* **columnSize:** add flag enableAutoSizeColumns ([5641871](https://github.com/ghiscoding/aurelia-slickgrid/commit/5641871))
* **filter:** auto adjust drop position (up/down) of select filter ([c362e3c](https://github.com/ghiscoding/aurelia-slickgrid/commit/c362e3c))
* **formatter:** add 2 new DateTime Short Formatter without seconds ([ac14e4e](https://github.com/ghiscoding/aurelia-slickgrid/commit/ac14e4e))
* **formatter:** add new arrayObjectToCsv Formatter ([cdf801e](https://github.com/ghiscoding/aurelia-slickgrid/commit/cdf801e))
* **multiselect:** auto-adjust height & position of multiple-select.js ([#93](https://github.com/ghiscoding/aurelia-slickgrid/issues/93)) ([b8f3e72](https://github.com/ghiscoding/aurelia-slickgrid/commit/b8f3e72))
* **resize:** add possibility to override default delay before resizing ([583e63a](https://github.com/ghiscoding/aurelia-slickgrid/commit/583e63a))



<a name="2.2.3"></a>
## [2.2.3](https://github.com/ghiscoding/aurelia-slickgrid/compare/v2.2.2...v2.2.3) (2018-08-05)


### Bug Fixes

* **requirejs:** fix import of DOMPurify to also work with RequireJS ([3b0d2b2](https://github.com/ghiscoding/aurelia-slickgrid/commit/3b0d2b2))



<a name="2.2.2"></a>
## [2.2.2](https://github.com/ghiscoding/aurelia-slickgrid/compare/v2.2.1...v2.2.2) (2018-08-04)



<a name="2.2.1"></a>
## [2.2.1](https://github.com/ghiscoding/aurelia-slickgrid/compare/v2.2.0...v2.2.1) (2018-08-04)


### Bug Fixes

* **sanitize:** replace sanitize-html with DOMPurify ([c3cdc22](https://github.com/ghiscoding/aurelia-slickgrid/commit/c3cdc22))



<a name="2.2.0"></a>
# [2.2.0](https://github.com/ghiscoding/aurelia-slickgrid/compare/v2.1.1...v2.2.0) (2018-08-04)


### Bug Fixes

* **error:** add item to datagrid should not require selection model ([7b7fffe](https://github.com/ghiscoding/aurelia-slickgrid/commit/7b7fffe))
* **event:** dispatchEvent should be cancelable, closes [#84](https://github.com/ghiscoding/aurelia-slickgrid/issues/84) ([#86](https://github.com/ghiscoding/aurelia-slickgrid/issues/86)) ([44cfd38](https://github.com/ghiscoding/aurelia-slickgrid/commit/44cfd38))
* **filter:** Filters should trigger only when different ([2464558](https://github.com/ghiscoding/aurelia-slickgrid/commit/2464558))
* **filter:** MultipleSelect & SingleSelect Filters only trigger changes ([17d8ee3](https://github.com/ghiscoding/aurelia-slickgrid/commit/17d8ee3))
* **filter:** searchTerms sometime comes back even after clear filter ([735c03b](https://github.com/ghiscoding/aurelia-slickgrid/commit/735c03b))
* **odata:** missing column in query using Grid Presets and hidden col ([23b8981](https://github.com/ghiscoding/aurelia-slickgrid/commit/23b8981))
* **pagination:** Only display Pagination with backendServiceApi ([3b5133e](https://github.com/ghiscoding/aurelia-slickgrid/commit/3b5133e))
* **selection:** On filter or Page changed, remove any rows selection ([6578a97](https://github.com/ghiscoding/aurelia-slickgrid/commit/6578a97))
* **selection:** single row selector should hide "Select All", closes [#85](https://github.com/ghiscoding/aurelia-slickgrid/issues/85) ([6b6753a](https://github.com/ghiscoding/aurelia-slickgrid/commit/6b6753a))


### Features

* **filter:** add Prefix/Suffix/RenderHtml to Filters & Editors ([#87](https://github.com/ghiscoding/aurelia-slickgrid/issues/87)) ([701f51e](https://github.com/ghiscoding/aurelia-slickgrid/commit/701f51e))
* **graphql:** export dispose function to aureliaGridInstance ([64d5dd0](https://github.com/ghiscoding/aurelia-slickgrid/commit/64d5dd0))
* **service:** add commonly functions to get item data ([982de13](https://github.com/ghiscoding/aurelia-slickgrid/commit/982de13))
* **service:** add more commonly used functions ([88a0c07](https://github.com/ghiscoding/aurelia-slickgrid/commit/88a0c07))



<a name="2.1.1"></a>
## [2.1.1](https://github.com/ghiscoding/aurelia-slickgrid/compare/v2.1.0...v2.1.1) (2018-07-14)


### Bug Fixes

* **css:** plugin styling was affecting pages outside of slickgrid ([2c103c0](https://github.com/ghiscoding/aurelia-slickgrid/commit/2c103c0))
* **formatter:** don't use strict date check on Date Formatters ([8746f11](https://github.com/ghiscoding/aurelia-slickgrid/commit/8746f11))
* **graphql:** resort was causing issues when used with Presets ([5715bce](https://github.com/ghiscoding/aurelia-slickgrid/commit/5715bce))
* **graphql:** typing empty filter in GraphQL shouldn't include empty str ([3d17d7e](https://github.com/ghiscoding/aurelia-slickgrid/commit/3d17d7e))
* **gridState:** Grid Stage changed was not being called on empty filter ([842d6e7](https://github.com/ghiscoding/aurelia-slickgrid/commit/842d6e7))
* **regression:** dynamically add a new column definition ([b8b4d01](https://github.com/ghiscoding/aurelia-slickgrid/commit/b8b4d01))



<a name="2.1.0"></a>
# [2.1.0](https://github.com/ghiscoding/aurelia-slickgrid/compare/v2.0.1...v2.1.0) (2018-07-07)


### Bug Fixes

* **filter:** input filter was using EQ operator instead of Contains ([9a86a74](https://github.com/ghiscoding/aurelia-slickgrid/commit/9a86a74))
* **formatter:** Date Formatters should only transform on valid dates ([2e08e47](https://github.com/ghiscoding/aurelia-slickgrid/commit/2e08e47))
* **formatter:** Date Formatters should only transform on valid dates ([d1ab5e5](https://github.com/ghiscoding/aurelia-slickgrid/commit/d1ab5e5))
* **formatter:** Date Formatters should only transform on valid dates ([8f67cd9](https://github.com/ghiscoding/aurelia-slickgrid/commit/8f67cd9))
* **slider:** slider issues with IE and Edge ([4c2a193](https://github.com/ghiscoding/aurelia-slickgrid/commit/4c2a193))
* **slider:** slider issues with IE and Edge ([015ecfc](https://github.com/ghiscoding/aurelia-slickgrid/commit/015ecfc))
* **slider:** slider number shown on right was sometime offset ([f21dba3](https://github.com/ghiscoding/aurelia-slickgrid/commit/f21dba3))


### Features

* **bs4:** support Bootstrap 4 ([6865bed](https://github.com/ghiscoding/aurelia-slickgrid/commit/6865bed))
* **formatter:** add new Decimal Formatter ([f33d075](https://github.com/ghiscoding/aurelia-slickgrid/commit/f33d075))



<a name="2.0.1"></a>
## [2.0.1](https://github.com/ghiscoding/aurelia-slickgrid/compare/v2.0.0...v2.0.1) (2018-06-23)



<a name="2.0.0"></a>
# [2.0.0](https://github.com/ghiscoding/aurelia-slickgrid/compare/v2.0.0-beta...v2.0.0) (2018-06-23)


### Bug Fixes

* **filter:** clear filter should trigger only 1 Grid State change ([43fc269](https://github.com/ghiscoding/aurelia-slickgrid/commit/43fc269))
* **filter:** Grid State incorrect after clear filters w/backend service ([289deec](https://github.com/ghiscoding/aurelia-slickgrid/commit/289deec))
* **filter:** multipleSelect filter doesn't handle cell value arrays ([e695660](https://github.com/ghiscoding/aurelia-slickgrid/commit/e695660))
* **filter:** regression, input filter using with typed operator ([65aa4eb](https://github.com/ghiscoding/aurelia-slickgrid/commit/65aa4eb))
* **filter:** SingleSelect Filter (& others) should return all when empty ([#77](https://github.com/ghiscoding/aurelia-slickgrid/issues/77)) ([266507e](https://github.com/ghiscoding/aurelia-slickgrid/commit/266507e))
* **gridMenu:** custom user commands not recreated after locale switch ([d585de5](https://github.com/ghiscoding/aurelia-slickgrid/commit/d585de5))
* **gridState:** multiple fixes with Grid State & Presets with locale ([8182351](https://github.com/ghiscoding/aurelia-slickgrid/commit/8182351))
* **menu:** Column Picker menu list was not being translated ([3f41262](https://github.com/ghiscoding/aurelia-slickgrid/commit/3f41262))
* **menu:** Grid Menu & Header Menu custom items were not translated ([729242e](https://github.com/ghiscoding/aurelia-slickgrid/commit/729242e))
* **merge:** fix merge conflict ([a4456ae](https://github.com/ghiscoding/aurelia-slickgrid/commit/a4456ae))
* **presets:** Presets w/MultipleFilter only taking 1st filtered value ([eacd633](https://github.com/ghiscoding/aurelia-slickgrid/commit/eacd633))
* **selector:** Checkbox selector was not working correctly with Presets ([8055050](https://github.com/ghiscoding/aurelia-slickgrid/commit/8055050))
* **slider:** slider should always be starting at 0 ([b771182](https://github.com/ghiscoding/aurelia-slickgrid/commit/b771182))
* **sort:** Presets & Sort caused unintended behavior w/dataview changed ([#76](https://github.com/ghiscoding/aurelia-slickgrid/issues/76)) ([d199488](https://github.com/ghiscoding/aurelia-slickgrid/commit/d199488))
* **update:** updateDataGridItemById was throwing error on 1st row (0) ([94e0820](https://github.com/ghiscoding/aurelia-slickgrid/commit/94e0820))


### Features

* **editor:** add new Slider Editor & refactor Editor Validation ([#80](https://github.com/ghiscoding/aurelia-slickgrid/issues/80)) ([46f140c](https://github.com/ghiscoding/aurelia-slickgrid/commit/46f140c))
* **filter:** add new Slider Filter (input range) ([#79](https://github.com/ghiscoding/aurelia-slickgrid/issues/79)) ([6b45b0c](https://github.com/ghiscoding/aurelia-slickgrid/commit/6b45b0c))
* **formatter:** add new Mask Formatter ([1c3c09c](https://github.com/ghiscoding/aurelia-slickgrid/commit/1c3c09c))



<a name="1.13.1"></a>
## [1.13.1](https://github.com/ghiscoding/aurelia-slickgrid/compare/v1.13.0...v1.13.1) (2018-05-26)


### Bug Fixes

* **filters:** return false when invalid date ([#69](https://github.com/ghiscoding/aurelia-slickgrid/issues/69)) ([93f0db1](https://github.com/ghiscoding/aurelia-slickgrid/commit/93f0db1)), closes [#68](https://github.com/ghiscoding/aurelia-slickgrid/issues/68)
* **sorters:** return -1 or 1 for invalid dates ([#70](https://github.com/ghiscoding/aurelia-slickgrid/issues/70)) ([04ce67e](https://github.com/ghiscoding/aurelia-slickgrid/commit/04ce67e)), closes [#68](https://github.com/ghiscoding/aurelia-slickgrid/issues/68) [#69](https://github.com/ghiscoding/aurelia-slickgrid/issues/69)


### Features

* **rowSelect:** add preselectedRows and expose all Plugin ([#71](https://github.com/ghiscoding/aurelia-slickgrid/issues/71)) ([02fa681](https://github.com/ghiscoding/aurelia-slickgrid/commit/02fa681))



<a name="1.13.0"></a>
# [1.13.0](https://github.com/ghiscoding/aurelia-slickgrid/compare/v1.12.2...v1.13.0) (2018-05-21)


### Bug Fixes

* **control:** Grid Menu z-index is too low when inside a modal window ([b722f6d](https://github.com/ghiscoding/aurelia-slickgrid/commit/b722f6d))
* **dataview:** preserve any previous sort when resetting items ([#62](https://github.com/ghiscoding/aurelia-slickgrid/issues/62)) ([2112768](https://github.com/ghiscoding/aurelia-slickgrid/commit/2112768))
* **editor:** Int/Float Editors multiple small enhancements ([#54](https://github.com/ghiscoding/aurelia-slickgrid/issues/54)) ([b208fcf](https://github.com/ghiscoding/aurelia-slickgrid/commit/b208fcf))
* **editors:** fix serialization/deserilization in editors ([2ee03b0](https://github.com/ghiscoding/aurelia-slickgrid/commit/2ee03b0)), closes [#56](https://github.com/ghiscoding/aurelia-slickgrid/issues/56)
* **editors:** fix serialization/deserilization in editors ([f3610d7](https://github.com/ghiscoding/aurelia-slickgrid/commit/f3610d7)), closes [#58](https://github.com/ghiscoding/aurelia-slickgrid/issues/58)
* **editors:** use indexOf in multiple select editor to load value ([21215c4](https://github.com/ghiscoding/aurelia-slickgrid/commit/21215c4)), closes [#50](https://github.com/ghiscoding/aurelia-slickgrid/issues/50)
* **editors:** use indexOf in multiple select editor to load value ([599a803](https://github.com/ghiscoding/aurelia-slickgrid/commit/599a803))
* **eventService:** use grid.getOptions for gridDefinition ([e67e93a](https://github.com/ghiscoding/aurelia-slickgrid/commit/e67e93a)), closes [#49](https://github.com/ghiscoding/aurelia-slickgrid/issues/49)
* **eventService:** use grid.getOptions for gridDefinition in event service ([0be30fd](https://github.com/ghiscoding/aurelia-slickgrid/commit/0be30fd)), closes [#51](https://github.com/ghiscoding/aurelia-slickgrid/issues/51)
* **grid:** issue [#44](https://github.com/ghiscoding/aurelia-slickgrid/issues/44), sort icon hidden behind grid menu w/small dataset ([#53](https://github.com/ghiscoding/aurelia-slickgrid/issues/53)) ([737da5f](https://github.com/ghiscoding/aurelia-slickgrid/commit/737da5f))
* **grid:** Resizer on 1st grid stop working after 2nd grid is created ([ed462ca](https://github.com/ghiscoding/aurelia-slickgrid/commit/ed462ca))
* **grid:** Support Row Selection & Inline Editors in 1 view ([1da7b7a](https://github.com/ghiscoding/aurelia-slickgrid/commit/1da7b7a))
* **grid:** use this.gridOptions in bind & remove aurelia args ([3bd2d90](https://github.com/ghiscoding/aurelia-slickgrid/commit/3bd2d90))
* **gridOptions:** use this.gridOptions in bind fn ([48de363](https://github.com/ghiscoding/aurelia-slickgrid/commit/48de363))
* **headerMenu:** we should not display header menu on row select column ([#64](https://github.com/ghiscoding/aurelia-slickgrid/issues/64)) ([efe1c21](https://github.com/ghiscoding/aurelia-slickgrid/commit/efe1c21))


### Features

* **filters:** add more operator types to collection svc filter ([#66](https://github.com/ghiscoding/aurelia-slickgrid/issues/66)) ([4359e67](https://github.com/ghiscoding/aurelia-slickgrid/commit/4359e67)), closes [#63](https://github.com/ghiscoding/aurelia-slickgrid/issues/63)
* **grid:** ability to dynamically add or change Column Headers ([#65](https://github.com/ghiscoding/aurelia-slickgrid/pull/65)), closes [#57](https://github.com/ghiscoding/aurelia-slickgrid/issues/57)
* **resize:** use gridHeight or gridWidth when provided on autoResize ([#59](https://github.com/ghiscoding/aurelia-slickgrid/pull/59)

### BREAKING CHANGES

* **filters:** Reversing the 'EQ' filter logic. This was done now because the filter feature was new and it follows the javascript `filter` logic (since equal will filter values equal to the value provided)

* refactor(example): add example code to Doc and Client-CLI samples



<a name="1.12.2"></a>
## [1.12.2](https://github.com/ghiscoding/aurelia-slickgrid/compare/v1.12.1...v1.12.2) (2018-04-14)


### Bug Fixes

* **delete:** deleteDataGridItemById should also work on row index 0 ([af283f3](https://github.com/ghiscoding/aurelia-slickgrid/commit/af283f3))



<a name="1.12.1"></a>
## [1.12.1](https://github.com/ghiscoding/aurelia-slickgrid/compare/v1.12.0...v1.12.1) (2018-04-13)


### Bug Fixes

* **grid:** after expanding a column,  scrolling should not resize grid ([bf83c90](https://github.com/ghiscoding/aurelia-slickgrid/commit/bf83c90))


### Features

* **grid:** add deleteDataGridItem & deleteDataGridItemById into Service ([2e927f2](https://github.com/ghiscoding/aurelia-slickgrid/commit/2e927f2))



<a name="1.12.0"></a>
# [1.12.0](https://github.com/ghiscoding/aurelia-slickgrid/compare/v1.11.1...v1.12.0) (2018-04-12)


### Bug Fixes

* **editor:** Single/MultiSelect Editors misbehave w/Desc Sort, fixes [#46](https://github.com/ghiscoding/aurelia-slickgrid/issues/46) ([71916dc](https://github.com/ghiscoding/aurelia-slickgrid/commit/71916dc))
* **excelCopy:** Excel Copy Buffer should have sanitize option as export ([8c57298](https://github.com/ghiscoding/aurelia-slickgrid/commit/8c57298))
* **formatter:** make sure object exist before getting property ([4961cab](https://github.com/ghiscoding/aurelia-slickgrid/commit/4961cab))
* **grid:** calling refreshBackendDataset was not refreshing UI ([24a061e](https://github.com/ghiscoding/aurelia-slickgrid/commit/24a061e))


### Features

* **colspan:** add colspanCallback into gridOptions for easier usage ([6996862](https://github.com/ghiscoding/aurelia-slickgrid/commit/6996862))
* **graphql:** add option to pass extra query arguments ([f278c73](https://github.com/ghiscoding/aurelia-slickgrid/commit/f278c73))
* **grid:** add a default Header Menu with Sort Asc/Desc & HideColumn ([#47](https://github.com/ghiscoding/aurelia-slickgrid/issues/47)) ([db5fc16](https://github.com/ghiscoding/aurelia-slickgrid/commit/db5fc16))
* **grid:** add all missing grid options available in SlickGrid ([7d194ed](https://github.com/ghiscoding/aurelia-slickgrid/commit/7d194ed))
* **grid:** add Column Span (colspan) demo ([e20a3f6](https://github.com/ghiscoding/aurelia-slickgrid/commit/e20a3f6))
* **grid:** add sample for Header Grouping spanning accros multiple cols ([#43](https://github.com/ghiscoding/aurelia-slickgrid/issues/43)) ([67ff867](https://github.com/ghiscoding/aurelia-slickgrid/commit/67ff867))
* **grid:** Excel like Copy with Copy Manager Plugin ([#45](https://github.com/ghiscoding/aurelia-slickgrid/issues/45)) ([dbbbe56](https://github.com/ghiscoding/aurelia-slickgrid/commit/dbbbe56))
* **sorting:** add support for multi-columns number indicator & tristate ([ada47cd](https://github.com/ghiscoding/aurelia-slickgrid/commit/ada47cd))



<a name="1.11.1"></a>
## [1.11.1](https://github.com/ghiscoding/aurelia-slickgrid/compare/v1.11.0...v1.11.1) (2018-04-05)


### Bug Fixes

* **grid:** grid fixed sizes wasn't working in Edge/Firefox, closes [#35](https://github.com/ghiscoding/aurelia-slickgrid/issues/35) ([a7669df](https://github.com/ghiscoding/aurelia-slickgrid/commit/a7669df))



<a name="1.11.0"></a>
# [1.11.0](https://github.com/ghiscoding/aurelia-slickgrid/compare/v1.10.0...v1.11.0) (2018-04-04)


### Bug Fixes

* **graphql:** make sure column exist before trying to get properties ([7122d6a](https://github.com/ghiscoding/aurelia-slickgrid/commit/7122d6a))
* **graphql:** remove throw error when dataset is empty or bad structure ([36ea506](https://github.com/ghiscoding/aurelia-slickgrid/commit/36ea506))
* **grid:** gridHeight & gridWidth not set, closes [#35](https://github.com/ghiscoding/aurelia-slickgrid/issues/35) ([#40](https://github.com/ghiscoding/aurelia-slickgrid/issues/40)) ([0bd2c53](https://github.com/ghiscoding/aurelia-slickgrid/commit/0bd2c53))
* **merge:** fix last merge had conflicts ([15e80e8](https://github.com/ghiscoding/aurelia-slickgrid/commit/15e80e8))
* **merge:** fix some merge conflicts ([d2172df](https://github.com/ghiscoding/aurelia-slickgrid/commit/d2172df))
* **preset:** Preset with backend were not working when using queryField ([7ce538a](https://github.com/ghiscoding/aurelia-slickgrid/commit/7ce538a))
* **tasks:** VSCode Taks command were broken in new VSCode insiders ([653ecb8](https://github.com/ghiscoding/aurelia-slickgrid/commit/653ecb8))


### Features

* **editor:** add dependency injection support in editors ([#33](https://github.com/ghiscoding/aurelia-slickgrid/issues/33)) ([61a1a31](https://github.com/ghiscoding/aurelia-slickgrid/commit/61a1a31)), closes [#18](https://github.com/ghiscoding/aurelia-slickgrid/issues/18)
* **editor:** auto-adjust ms-select drop up/down by space, closes [#34](https://github.com/ghiscoding/aurelia-slickgrid/issues/34) ([c86911c](https://github.com/ghiscoding/aurelia-slickgrid/commit/c86911c))
* **filter/editor:** add functionality to filter/sort collection ([#38](https://github.com/ghiscoding/aurelia-slickgrid/issues/38)) ([2a276a6](https://github.com/ghiscoding/aurelia-slickgrid/commit/2a276a6))
* **grouping:** Grouping & Aggregators  ([#41](https://github.com/ghiscoding/aurelia-slickgrid/issues/41)) ([333182f](https://github.com/ghiscoding/aurelia-slickgrid/commit/333182f))
* **resizer:** add last resized Grid Dimension getter ([cd6013e](https://github.com/ghiscoding/aurelia-slickgrid/commit/cd6013e))
* **sort:** add a Clear Sorting function and grid menu command ([#39](https://github.com/ghiscoding/aurelia-slickgrid/issues/39)) ([f709dc7](https://github.com/ghiscoding/aurelia-slickgrid/commit/f709dc7))
* **styling:** make the multiple-select.js "Select All" text 100% wide ([0b2909c](https://github.com/ghiscoding/aurelia-slickgrid/commit/0b2909c))



<a name="1.10.0"></a>
# [1.10.0](https://github.com/ghiscoding/aurelia-slickgrid/compare/v1.9.2...v1.10.0) (2018-03-20)
### Features

* **filter:** Compound Filters (input & date) (PR #32) ([763e766](https://github.com/ghiscoding/aurelia-slickgrid/commit/763e766))

### Bug Fixes

* **backend:** Grid Presets sort order not correct with backend services ([22f687b](https://github.com/ghiscoding/aurelia-slickgrid/commit/22f687b))
* **editor:** i18n service can also be passed as params in gridOptions ([c11eff4](https://github.com/ghiscoding/aurelia-slickgrid/commit/c11eff4))
* **filter:** single select filter incorrect onFilterChanged on Presets ([c7e186a](https://github.com/ghiscoding/aurelia-slickgrid/commit/c7e186a))
* **formatter:** dateTimeIso Formatter was using dateIso ([6756de8](https://github.com/ghiscoding/aurelia-slickgrid/commit/6756de8))
* **gridState:** Filter were not always returning searchTerm in GridState ([67f167a](https://github.com/ghiscoding/aurelia-slickgrid/commit/67f167a))
* **jquery-ui:** use latest version of jQuery-UI to avoid jQuery 3 errors ([c546865](https://github.com/ghiscoding/aurelia-slickgrid/commit/c546865))



<a name="1.9.2"></a>
## [1.9.2](https://github.com/ghiscoding/aurelia-slickgrid/compare/v1.9.1...v1.9.2) (2018-03-13)



<a name="1.9.1"></a>
## [1.9.1](https://github.com/ghiscoding/aurelia-slickgrid/compare/v1.9.0...v1.9.1) (2018-03-13)


### Bug Fixes

* **formatter:** translate formatter was causing issues in some occasion ([8acdc28](https://github.com/ghiscoding/aurelia-slickgrid/commit/8acdc28))



<a name="1.9.0"></a>
# [1.9.0](https://github.com/ghiscoding/aurelia-slickgrid/compare/v1.7.1...v1.9.0) (2018-03-13)


### Bug Fixes

* **build:** incorrect type any ([5ffc0a1](https://github.com/ghiscoding/aurelia-slickgrid/commit/5ffc0a1))
* **formatter:** add throw error with instruction if missing params ([cbb01d9](https://github.com/ghiscoding/aurelia-slickgrid/commit/cbb01d9))
* **formatter:** multipleFormatter should pass value to next formatter ([bf6b006](https://github.com/ghiscoding/aurelia-slickgrid/commit/bf6b006))
* **pagination:** Pagination with BackendServiceApi was incorrect ([fba8750](https://github.com/ghiscoding/aurelia-slickgrid/commit/fba8750))
* **requireJS:** import for RequireJS should have /index ([b796c26](https://github.com/ghiscoding/aurelia-slickgrid/commit/b796c26))
* **sample:** fix the client-CLI sample ([407ba66](https://github.com/ghiscoding/aurelia-slickgrid/commit/407ba66))
* **sass:** all sass properties should have an override capability ([6d03cd7](https://github.com/ghiscoding/aurelia-slickgrid/commit/6d03cd7))
* **utilities:** move findOrDefault to a function ([#29](https://github.com/ghiscoding/aurelia-slickgrid/issues/29)) ([3d21548](https://github.com/ghiscoding/aurelia-slickgrid/commit/3d21548)), closes [#27](https://github.com/ghiscoding/aurelia-slickgrid/issues/27)


### Features

* **demo:** update demo pages with latest features ([5d4587d](https://github.com/ghiscoding/aurelia-slickgrid/commit/5d4587d))
* **event:** [#24](https://github.com/ghiscoding/aurelia-slickgrid/issues/24) add onGridStateChanged and onPaginationChanged events ([#28](https://github.com/ghiscoding/aurelia-slickgrid/issues/28)) ([b657e75](https://github.com/ghiscoding/aurelia-slickgrid/commit/b657e75))
* **service:** expose refreshBackendDataset for backend ([68c8266](https://github.com/ghiscoding/aurelia-slickgrid/commit/68c8266))



<a name="1.7.0"></a>
# [1.7.0](https://github.com/ghiscoding/aurelia-slickgrid/compare/v1.6.0...v1.7.0) (2018-03-07)


### Bug Fixes

* **backend:** backend filter on delay was broken since GridState feature ([a25147d](https://github.com/ghiscoding/aurelia-slickgrid/commit/a25147d))
* **build:** fox all build errors ([3d24212](https://github.com/ghiscoding/aurelia-slickgrid/commit/3d24212))
* **doc:** updated contributing as per comment in [#10](https://github.com/ghiscoding/aurelia-slickgrid/issues/10) ([f437e39](https://github.com/ghiscoding/aurelia-slickgrid/commit/f437e39))
* **events:** every subscribed event should have an unsubscribe ([5abc223](https://github.com/ghiscoding/aurelia-slickgrid/commit/5abc223))
* **events:** every subscribed event should have an unsubscribe ([31b4e24](https://github.com/ghiscoding/aurelia-slickgrid/commit/31b4e24))
* **filter:** remove unused function ([00b3654](https://github.com/ghiscoding/aurelia-slickgrid/commit/00b3654))
* **graphql:** a column type of number should use EQ in GraphQL query ([a7da882](https://github.com/ghiscoding/aurelia-slickgrid/commit/a7da882))
* **grid:** delete duplicate gridOptions it was causing issues ([fb131aa](https://github.com/ghiscoding/aurelia-slickgrid/commit/fb131aa))
* **grid:** update SlickGrid version and configure Header Menu autoAlign ([211ea96](https://github.com/ghiscoding/aurelia-slickgrid/commit/211ea96))
* **odata:** OData string filter should also support operators ([0bf8928](https://github.com/ghiscoding/aurelia-slickgrid/commit/0bf8928))


### Features

* **doc:** install and setup "prepare-release" for changelog and commit ([3925050](https://github.com/ghiscoding/aurelia-slickgrid/commit/3925050))
* **filter:** add new InputNoPlaceholderFilter and global default filter ([739ff3f](https://github.com/ghiscoding/aurelia-slickgrid/commit/739ff3f))
* **formatter:** add a new HyperlinkURI formatter, you need to uriPrefix ([52de978](https://github.com/ghiscoding/aurelia-slickgrid/commit/52de978))
* **grid:** add inline editor undo command ([72ef747](https://github.com/ghiscoding/aurelia-slickgrid/commit/72ef747))
* **grid:** add Pagination page number input ([8a89c58](https://github.com/ghiscoding/aurelia-slickgrid/commit/8a89c58))
* **query:** add `excludeFromQuery` prop and use it for Row Selection ([cda0e39](https://github.com/ghiscoding/aurelia-slickgrid/commit/cda0e39))
* **queryFilter:** add new "queryFieldFilter" and "queryFieldSorter" ([9d2aae1](https://github.com/ghiscoding/aurelia-slickgrid/commit/9d2aae1))
* **selectEditors:** add select grid editors ([#22](https://github.com/ghiscoding/aurelia-slickgrid/issues/22)) ([5bd7215](https://github.com/ghiscoding/aurelia-slickgrid/commit/5bd7215))
