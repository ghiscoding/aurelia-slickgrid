# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
