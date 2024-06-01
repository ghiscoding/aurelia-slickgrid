import { ExcelExportService } from '@slickgrid-universal/excel-export';

import type { AureliaGridInstance, Column, GridOption, GridStateChange, TreeToggledItem, TreeToggleStateChange, } from 'aurelia-slickgrid';
import { FieldType, GridStateType, Filters, Formatters, } from 'aurelia-slickgrid';
import './example27.scss'; // provide custom CSS/SASS styling

const NB_ITEMS = 500;

export class Example27 {
  title = 'Example 27: Tree Data <small> <span class="mdi mdi-file-tree mdi-27px"></span> (from a flat dataset with <code>parentId</code> references - <a href="https://ghiscoding.gitbook.io/aurelia-slickgrid/grid-functionalities/tree-data-grid" target="_blank">Wiki</a>)</small>';
  subTitle = `<ul>
    <li>It is assumed that your dataset will have Parent/Child references AND also Tree Level (indent) property.</li>
    <ul>
      <li>If you do not have the Tree Level (indent), you could call "convertParentChildArrayToHierarchicalView()" then call "convertHierarchicalViewToParentChildArray()"</li>
      <li>You could also pass the result of "convertParentChildArrayToHierarchicalView()" to "dataset-hierarchical.bind" as defined in the next Hierarchical Example</li>
    </ul>
  </ul>`;
  aureliaGrid!: AureliaGridInstance;
  gridOptions!: GridOption;
  columnDefinitions: Column[] = [];
  dataset: any[] = [];
  datasetHierarchical: any[] = [];
  loadingClass = '';
  isLargeDataset = false;
  hasNoExpandCollapseChanged = true;
  treeToggleItems: TreeToggledItem[] = [];

  constructor() {
    // define the grid options & columns and then create the grid itself
    this.defineGrid();
  }

  attached() {
    // populate the dataset once the grid is ready
    this.dataset = this.loadData(NB_ITEMS);
  }

  /* Define grid Options and Columns */
  defineGrid() {
    this.columnDefinitions = [
      {
        id: 'title', name: 'Title', field: 'title', width: 220, cssClass: 'cell-title',
        filterable: true, sortable: true, exportWithFormatter: false,
        queryFieldSorter: 'id', type: FieldType.string,
        formatter: Formatters.tree, exportCustomFormatter: Formatters.treeExport

      },
      { id: 'duration', name: 'Duration', field: 'duration', minWidth: 90, filterable: true },
      {
        id: 'percentComplete', name: '% Complete', field: 'percentComplete',
        minWidth: 120, maxWidth: 200, exportWithFormatter: false,
        sortable: true, filterable: true, filter: { model: Filters.compoundSlider, operator: '>=' },
        formatter: Formatters.percentCompleteBarWithText, type: FieldType.number,
      },
      {
        id: 'start', name: 'Start', field: 'start', minWidth: 60,
        type: FieldType.dateIso, filterable: true, sortable: true,
        filter: { model: Filters.compoundDate },
        formatter: Formatters.dateIso,
      },
      {
        id: 'finish', name: 'Finish', field: 'finish', minWidth: 60,
        type: FieldType.dateIso, filterable: true, sortable: true,
        filter: { model: Filters.compoundDate },
        formatter: Formatters.dateIso,
      },
      {
        id: 'effortDriven', name: 'Effort Driven', width: 80, minWidth: 20, maxWidth: 80, cssClass: 'cell-effort-driven', field: 'effortDriven',
        exportWithFormatter: false,
        formatter: Formatters.checkmarkMaterial, cannotTriggerInsert: true,
        filterable: true,
        filter: {
          collection: [{ value: '', label: '' }, { value: true, label: 'True' }, { value: false, label: 'False' }],
          model: Filters.singleSelect
        }
      }
    ];

    this.gridOptions = {
      autoResize: {
        container: '#demo-container',
        rightPadding: 10
      },
      enableAutoSizeColumns: true,
      enableAutoResize: true,
      enableFiltering: true,
      enableTreeData: true, // you must enable this flag for the filtering & sorting to work as expected
      treeDataOptions: {
        columnId: 'title',
        parentPropName: 'parentId',
        // this is optional, you can define the tree level property name that will be used for the sorting/indentation, internally it will use "__treeLevel"
        levelPropName: 'treeLevel',
        indentMarginLeft: 15,
        initiallyCollapsed: true,

        // you can optionally sort by a different column and/or sort direction
        // this is the recommend approach, unless you are 100% that your original array is already sorted (in most cases it's not)
        initialSort: {
          columnId: 'title',
          direction: 'ASC'
        },
        // we can also add a custom Formatter just for the title text portion
        titleFormatter: (_row, _cell, value, _def, dataContext) => {
          let prefix = '';
          if (dataContext.treeLevel > 0) {
            prefix = `<span class="mdi mdi-subdirectory-arrow-right mdi-v-align-sub color-se-secondary"></span>`;
          }
          return `${prefix}<span class="bold">${value}</span> <span style="font-size:11px; margin-left: 15px;">(parentId: ${dataContext.parentId})</span>`;
        },
      },
      multiColumnSort: false, // multi-column sorting is not supported with Tree Data, so you need to disable it
      showCustomFooter: true,
      // change header/cell row height for material design theme
      headerRowHeight: 45,
      rowHeight: 40,
      presets: {
        filters: [{ columnId: 'percentComplete', searchTerms: [25], operator: '>=' }],
        // treeData: { toggledItems: [{ itemId: 1, isCollapsed: false }] },
      },
      enableExcelExport: true,
      excelExportOptions: { exportWithFormatter: true, sanitizeDataExport: true },
      externalResources: [new ExcelExportService()],

      // use Material Design SVG icons
      contextMenu: {
        iconCollapseAllGroupsCommand: 'mdi mdi-arrow-collapse',
        iconExpandAllGroupsCommand: 'mdi mdi-arrow-expand',
        iconClearGroupingCommand: 'mdi mdi-close',
        iconCopyCellValueCommand: 'mdi mdi-content-copy',
        iconExportCsvCommand: 'mdi mdi-download',
        iconExportExcelCommand: 'mdi mdi-file-excel-outline',
        iconExportTextDelimitedCommand: 'mdi mdi-download',
      },
      gridMenu: {
        iconCssClass: 'mdi mdi-menu',
        iconClearAllFiltersCommand: 'mdi mdi-filter-remove-outline',
        iconClearAllSortingCommand: 'mdi mdi-swap-vertical',
        iconExportCsvCommand: 'mdi mdi-download',
        iconExportExcelCommand: 'mdi mdi-file-excel-outline',
        iconExportTextDelimitedCommand: 'mdi mdi-download',
        iconRefreshDatasetCommand: 'mdi mdi-sync',
        iconToggleFilterCommand: 'mdi mdi-flip-vertical',
        iconTogglePreHeaderCommand: 'mdi mdi-flip-vertical',
      },
      headerMenu: {
        iconClearFilterCommand: 'mdi mdi mdi-filter-remove-outline',
        iconClearSortCommand: 'mdi mdi-swap-vertical',
        iconSortAscCommand: 'mdi mdi-sort-ascending',
        iconSortDescCommand: 'mdi mdi-flip-v mdi-sort-descending',
        iconColumnHideCommand: 'mdi mdi-close',
      }
    };
  }

  /**
   * A simple method to add a new item inside the first group that we find (it's random and is only for demo purposes).
   * After adding the item, it will sort by parent/child recursively
   */
  addNewRow() {
    const newId = this.aureliaGrid.dataView.getItemCount();
    const parentPropName = 'parentId';
    const treeLevelPropName = 'treeLevel'; // if undefined in your options, the default prop name is "__treeLevel"
    const newTreeLevel = 1;
    // find first parent object and add the new item as a child
    const childItemFound = this.dataset.find((item) => item[treeLevelPropName] === newTreeLevel);
    const parentItemFound = this.aureliaGrid.dataView.getItemByIdx(childItemFound[parentPropName]);

    if (childItemFound && parentItemFound) {
      const newItem = {
        id: newId,
        parentId: parentItemFound.id,
        title: `Task ${newId}`,
        duration: '1 day',
        percentComplete: 99,
        start: new Date(),
        finish: new Date(),
        effortDriven: false
      };

      // use the Grid Service to insert the item,
      // it will also internally take care of updating & resorting the hierarchical dataset
      this.aureliaGrid.gridService.addItem(newItem);
    }
  }

  updateFirstRow() {
    // to update any of the grid rows, we CANNOT simply pass a new updated object
    // we MUST read it from the DataView first (that will include all mutated Tree Data props, like `__treeLevel`, `__parentId`, ...) and then update it
    const item = this.aureliaGrid.dataView.getItemById<any>(0);

    // option 1
    /*
    // now that we have the extra Tree Data props, we can update any of the object properties (while keeping the Tree Data props)
    item.duration = `11 days`;
    item.percentComplete = 77;
    item.start = new Date();
    item.finish = new Date();
    item.effortDriven = false;
    // finally we can now update the item which includes our updated props + the Tree Data props (`__treeLevel`, ...)
    this.aureliaGrid.gridService.updateItem(item);
    */

    // optiona 2 - alternative
    // we could also simply use the spread operator directly
    this.aureliaGrid.gridService.updateItem({ ...item, duration: `11 days`, percentComplete: 77, start: new Date(), finish: new Date(), effortDriven: false });
  }

  collapseAll() {
    this.aureliaGrid.treeDataService.toggleTreeDataCollapse(true);
  }

  collapseAllWithoutEvent() {
    this.aureliaGrid.treeDataService.toggleTreeDataCollapse(true, false);
  }

  expandAll() {
    this.aureliaGrid.treeDataService.toggleTreeDataCollapse(false);
  }

  dynamicallyChangeFilter() {
    this.aureliaGrid.filterService.updateFilters([{ columnId: 'percentComplete', operator: '<', searchTerms: [40] }]);
  }

  logHierarchicalStructure() {
    console.log('exploded array', this.aureliaGrid.treeDataService.datasetHierarchical /* , JSON.stringify(explodedArray, null, 2) */);
  }

  logFlatStructure() {
    console.log('flat array', this.aureliaGrid.treeDataService.dataset /* , JSON.stringify(outputFlatArray, null, 2) */);
  }

  hideSpinner() {
    setTimeout(() => this.loadingClass = '', 200); // delay the hide spinner a bit to avoid show/hide too quickly
  }

  showSpinner() {
    if (this.isLargeDataset) {
      this.loadingClass = 'mdi mdi-load mdi-spin-1s mdi-24px color-alt-success';
    }
  }

  loadData(rowCount: number) {
    this.isLargeDataset = rowCount > 5000; // we'll show a spinner when it's large, else don't show show since it should be fast enough
    let indent = 0;
    const parents: any[] = [];
    const data: any[] = [];

    // prepare the data
    for (let i = 0; i < rowCount; i++) {
      const randomYear = 2000 + Math.floor(Math.random() * 10);
      const randomMonth = Math.floor(Math.random() * 11);
      const randomDay = Math.floor((Math.random() * 29));
      const item: any = (data[i] = {});
      let parentId;

      /*
        for demo & E2E testing purposes, let's make "Task 0" empty and then "Task 1" a parent that contains at least "Task 2" and "Task 3" which the latter will also contain "Task 4" (as shown below)
        also for all other rows don't go over indent tree level depth of 2
        Task 0
        Task 1
          Task 2
          Task 3
            Task 4
        ...
       */
      if (i === 1 || i === 0) {
        indent = 0;
        parents.pop();
      } if (i === 3) {
        indent = 1;
      } else if (i === 2 || i === 4 || (Math.random() > 0.8 && i > 0 && indent < 3 && i - 1 !== 0 && i - 1 !== 2)) { // also make sure Task 0, 2 remains empty
        indent++;
        parents.push(i - 1);
      } else if ((Math.random() < 0.3 && indent > 0)) {
        indent--;
        parents.pop();
      }

      if (parents.length > 0) {
        parentId = parents[parents.length - 1];
      } else {
        parentId = null;
      }

      item['id'] = i;
      item['parentId'] = parentId;
      item['title'] = `Task ${i}`;
      item['duration'] = '5 days';
      item['percentComplete'] = Math.round(Math.random() * 100);
      item['start'] = new Date(randomYear, randomMonth, randomDay);
      item['finish'] = new Date(randomYear, (randomMonth + 1), randomDay);
      item['effortDriven'] = (i % 5 === 0);
    }
    this.dataset = data;
    return data;
  }

  handleOnTreeFullToggleEnd(treeToggleExecution: TreeToggleStateChange) {
    console.log('Tree Data changes', treeToggleExecution);
    this.hideSpinner();
  }

  /** Whenever a parent is being toggled, we'll keep a reference of all of these changes so that we can reapply them whenever we want */
  handleOnTreeItemToggled(treeToggleExecution: TreeToggleStateChange) {
    this.hasNoExpandCollapseChanged = false;
    this.treeToggleItems = treeToggleExecution.toggledItems as TreeToggledItem[];
    console.log('Tree Data changes', treeToggleExecution);
  }

  handleOnGridStateChanged(gridStateChange: GridStateChange) {
    this.hasNoExpandCollapseChanged = false;

    if (gridStateChange?.change?.type === GridStateType.treeData) {
      console.log('Tree Data gridStateChange', gridStateChange?.gridState?.treeData);
      this.treeToggleItems = gridStateChange?.gridState?.treeData?.toggledItems as TreeToggledItem[];
    }
  }

  logTreeDataToggledItems() {
    console.log(this.aureliaGrid.treeDataService.getToggledItems());
  }

  dynamicallyToggledFirstParent() {
    const parentPropName = 'parentId';
    const treeLevelPropName = 'treeLevel'; // if undefined in your options, the default prop name is "__treeLevel"
    const newTreeLevel = 1;

    // find first parent object and toggle it
    const childItemFound = this.dataset.find((item) => item[treeLevelPropName] === newTreeLevel);
    const parentItemFound = this.aureliaGrid.dataView.getItemByIdx(childItemFound[parentPropName]);

    if (childItemFound && parentItemFound) {
      this.aureliaGrid.treeDataService.dynamicallyToggleItemState([{ itemId: parentItemFound.id, isCollapsed: !parentItemFound.__collapsed }]);
    }
  }

  reapplyToggledItems() {
    this.aureliaGrid.treeDataService.applyToggledItemStateChanges(this.treeToggleItems);
  }
}
