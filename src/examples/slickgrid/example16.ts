import { AureliaGridInstance, Column, ExtensionName, Filters, Formatters, GridOption } from '../../aurelia-slickgrid';

export class Example16 {
  title = 'Example 16: Row Move & Checkbox Selector';
  subTitle = `
    This example demonstrates using the <b>Slick.Plugins.RowMoveManager</b> plugin to easily move a row in the grid.<br/>
    <ul>
      <li>Click to select, Ctrl+Click to toggle selection, Shift+Click to select a range.</li>
      <li>Drag one or more rows by the handle (icon) to reorder</li>
      <li>If you plan to use Row Selection + Row Move, then use "singleRowMove: true" and "disableRowSelection: true"</li>
      <li>You can change "columnIndexPosition" to move the icon position of any extension (RowMove, RowDetail or RowSelector icon)</li>
      <ul>
        <li>You will also want to enable the DataView "syncGridSelection: true" to keep row selection even after a row move</li>
      </ul>
      <li>If you plan to use only Row Move, then you could keep default values (or omit them completely) of "singleRowMove: false" and "disableRowSelection: false"</li>
      <ul>
        <li>SingleRowMove has the name suggest will only move 1 row at a time, by default it will move any row(s) that are selected unless you disable the flag</li>
      </ul>
    </ul>
  `;

  aureliaGrid!: AureliaGridInstance;
  columnDefinitions: Column[] = [];
  gridOptions!: GridOption;
  dataset: any[] = [];

  constructor() {
    this.defineGrid();
  }

  aureliaGridReady(aureliaGrid: AureliaGridInstance) {
    this.aureliaGrid = aureliaGrid;
  }

  get rowMoveInstance(): any {
    return this.aureliaGrid && this.aureliaGrid.extensionService.getSlickgridAddonInstance(ExtensionName.rowMoveManager) || {};
  }

  attached() {
    // populate the dataset once the grid is ready
    this.getData();
  }

  /* Define grid Options and Columns */
  defineGrid() {
    this.columnDefinitions = [
      { id: 'title', name: 'Title', field: 'title', filterable: true, },
      { id: 'duration', name: 'Duration', field: 'duration', filterable: true, sortable: true },
      { id: '%', name: '% Complete', field: 'percentComplete', filterable: true, sortable: true },
      {
        id: 'start', name: 'Start', field: 'start', filterable: true, sortable: true,
        filter: { model: Filters.compoundDate },
      },
      {
        id: 'finish', name: 'Finish', field: 'finish',
        filterable: true, sortable: true,
        filter: { model: Filters.compoundDate },
      },
      {
        id: 'effort-driven', name: 'Completed', field: 'effortDriven',
        formatter: Formatters.checkmark,
        filterable: true, sortable: true,
        filter: {
          collection: [{ value: '', label: '' }, { value: true, label: 'True' }, { value: false, label: 'False' }],
          model: Filters.singleSelect
        },
      }
    ];

    this.gridOptions = {
      enableAutoResize: true,
      autoResize: {
        container: '#demo-container',
        rightPadding: 10
      },
      enableFiltering: true,
      enableCheckboxSelector: true,
      checkboxSelector: {
        // you can toggle these 2 properties to show the "select all" checkbox in different location
        hideInFilterHeaderRow: false,
        hideInColumnTitleRow: true
      },
      enableRowSelection: true,
      rowSelectionOptions: {
        // True (Single Selection), False (Multiple Selections)
        selectActiveRow: false
      },
      dataView: {
        syncGridSelection: true, // enable this flag so that the row selection follows the row even if we move it to another position
      },
      enableRowMoveManager: true,
      rowMoveManager: {
        // when using Row Move + Row Selection, you want to move only a single row and we will enable the following flags so it doesn't cancel row selection
        singleRowMove: true,
        disableRowSelection: true,
        cancelEditOnDrag: true,
        width: 30,
        onBeforeMoveRows: this.onBeforeMoveRow,
        onMoveRows: this.onMoveRows.bind(this),

        // you can change the move icon position of any extension (RowMove, RowDetail or RowSelector icon)
        // note that you might have to play with the position when using multiple extension
        // since it really depends on which extension get created first to know what their real position are
        // columnIndexPosition: 1,

        // you can also override the usability of the rows, for example make every 2nd row the only moveable rows,
        // usabilityOverride: (row, dataContext, grid) => dataContext.id % 2 === 1
      },
      showCustomFooter: true,
      presets: {
        // you can presets row selection here as well, you can choose 1 of the following 2 ways of setting the selection
        // by their index position in the grid (UI) or by the object IDs, the default is "dataContextIds" and if provided it will use it and disregard "gridRowIndexes"
        // the RECOMMENDED is to use "dataContextIds" since that will always work even with Pagination, while "gridRowIndexes" is only good for 1 page
        rowSelection: {
          // gridRowIndexes: [2],       // the row position of what you see on the screen (UI)
          dataContextIds: [1, 2, 6, 7]  // (recommended) select by your data object IDs
        }
      },
    };
  }

  getData() {
    // Set up some test columns.
    const mockDataset = [];
    for (let i = 0; i < 500; i++) {
      mockDataset[i] = {
        id: i,
        title: 'Task ' + i,
        duration: Math.round(Math.random() * 25) + ' days',
        percentComplete: Math.round(Math.random() * 100),
        start: '01/01/2009',
        finish: '01/05/2009',
        effortDriven: (i % 5 === 0)
      };
    }
    this.dataset = mockDataset;
  }

  onBeforeMoveRow(e: Event, data: any) {
    for (let i = 0; i < data.rows.length; i++) {
      // no point in moving before or after itself
      if (data.rows[i] === data.insertBefore || data.rows[i] === data.insertBefore - 1) {
        e.stopPropagation();
        return false;
      }
    }
    return true;
  }

  onMoveRows(_e: Event, args: any) {
    // rows and insertBefore references,
    // note that these references are assuming that the dataset isn't filtered at all
    // which is not always the case so we will recalcualte them and we won't use these reference afterward
    const rows = args.rows as number[];
    const insertBefore = args.insertBefore;
    const extractedRows = [];

    // when moving rows, we need to cancel any sorting that might happen
    // we can do this by providing an undefined sort comparer
    // which basically destroys the current sort comparer without resorting the dataset, it basically keeps the previous sorting
    this.aureliaGrid.dataView.sort(undefined as any, true);

    // the dataset might be filtered/sorted,
    // so we need to get the same dataset as the one that the SlickGrid DataView uses
    const tmpDataset = this.aureliaGrid.dataView.getItems();
    const filteredItems = this.aureliaGrid.dataView.getFilteredItems();

    const itemOnRight = this.aureliaGrid.dataView.getItem(insertBefore);
    const insertBeforeFilteredIdx = this.aureliaGrid.dataView.getIdxById(itemOnRight.id) || 0;

    const filteredRowItems: any[] = [];
    rows.forEach(row => filteredRowItems.push(filteredItems[row]));
    const filteredRows = filteredRowItems.map(item => this.aureliaGrid.dataView.getIdxById(item.id)) as number[];

    const left = tmpDataset.slice(0, insertBeforeFilteredIdx);
    const right = tmpDataset.slice(insertBeforeFilteredIdx, tmpDataset.length);

    // convert into a final new dataset that has the new order
    // we need to resort with
    rows.sort((a: number, b: number) => a - b);
    for (const filteredRow of filteredRows) {
      extractedRows.push(tmpDataset[filteredRow]);
    }
    filteredRows.reverse();
    for (const row of filteredRows) {
      if (row < insertBeforeFilteredIdx) {
        left.splice(row, 1);
      } else {
        right.splice(row - insertBeforeFilteredIdx, 1);
      }
    }

    // final updated dataset, we need to overwrite the DataView dataset (and our local one) with this new dataset that has a new order
    const finalDataset = left.concat(extractedRows.concat(right));
    this.dataset = finalDataset; // update dataset and re-render the grid
  }

  hideDurationColumnDynamically() {
    // -- you can hide by one Id or multiple Ids:
    // hideColumnById(id, options), hideColumnByIds([ids], options)
    // you can also provide options, defaults are: { autoResizeColumns: true, triggerEvent: true, hideFromColumnPicker: false, hideFromGridMenu: false }

    this.aureliaGrid.gridService.hideColumnById('duration');

    // or with multiple Ids and extra options
    // this.aureliaGrid.gridService.hideColumnByIds(['duration', 'finish'], { hideFromColumnPicker: true, hideFromGridMenu: false });
  }

  // Disable/Enable Filtering/Sorting functionalities
  // --------------------------------------------------

  disableFilters() {
    this.aureliaGrid.filterService.disableFilterFunctionality(true);
  }

  disableSorting() {
    this.aureliaGrid.sortService.disableSortFunctionality(true);
  }

  // or Toggle Filtering/Sorting functionalities
  // ---------------------------------------------

  toggleFilter() {
    this.aureliaGrid.filterService.toggleFilterFunctionality();
  }

  toggleSorting() {
    this.aureliaGrid.sortService.toggleSortFunctionality();
  }
}
