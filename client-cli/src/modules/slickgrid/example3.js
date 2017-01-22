import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import $ from 'bootstrap';
import data from './sample-data/example-data';
import {SlickService, Grid, Formatters, Editors} from 'aurelia-slickgrid';

function checkmarkFormatter(row, cell, value, columnDef, dataContext){
  return value ? `<i class="fa fa-check" aria-hidden="true"></i>` : '';
}
function requiredFieldValidator(value){
  if (value == null || value == undefined || !value.length){
    return {valid: false, msg: 'This is a required field'};
  } else {
    return {valid: true, msg: null};
  }
}
const flatPickrOptions = {
  dateFormat: 'd/m/Y', // see https://chmln.github.io/flatpickr/#options,
  parseDate: function(input){
    var split = input.split('/');
    return new Date(split[1] + '-' + split[0] + '-' + split[2]);
  }
};

@inject(Router, SlickService)
export class List {
  heading = 'Example 3: Editing';
  description = '<h3>Demonstrates:</h3>' +
  '<ul><li>adding basic keyboard navigation and editing</li>' +
  '<li>custom editors and validators</li>' +
  '<li>auto-edit settings (single-click when enabled, double-click when disabled)</li></ul>' +
  '<h3>Options</h3>';
  grid = {};
  gridOptions = {};
  gridColumns = {};

  constructor(router, slickService) {
    this.router = router;
    this.slick = slickService;
  }

  attached() {
    // define the grid options & columns and then create the grid itself
    this.defineGrid();
    this.grid = this.slick.createGrid('myGrid', this.gridColumns, this.gridOptions, data);
  }

  /* Define grid Options and Columns */
  defineGrid() {
    this.gridColumns = [
      {
        id: 'title',
        name: 'Title',
        field: 'title',
        width: 120,
        cssClass: 'cell-title',
        editor: Editors.Text,
        validator: requiredFieldValidator
      },
      {id: 'desc', name: 'Description', field: 'description', width: 100, editor: Editors.LongText},
      {id: 'duration', name: 'Duration', field: 'duration', editor: Editors.Text},
      {
        id: '%',
        name: '% Complete',
        field: 'percentComplete',
        width: 100,
        resizable: false,
        formatter: Formatters.PercentCompleteBar,
        editor: Editors.Float
      },
      {id: 'start', name: 'Start', field: 'start', minWidth: 60, editor: Editors.Date, options: {
        date: flatPickrOptions
      }},
      {id: 'finish', name: 'Finish', field: 'finish', minWidth: 60, editor: Editors.Date},
      {
        id: 'effort-driven',
        name: 'Effort Driven',
        width: 80,
        minWidth: 20,
        maxWidth: 80,
        cssClass: 'cell-effort-driven',
        field: 'effortDriven',
        formatter: checkmarkFormatter,
        editor: Editors.Checkbox
      }
    ];

    this.gridOptions = {
      autoResize: true,
      columns: this.gridColumns,
      forceFitColumns: true,
      rowHeight: 35,
      gridContainerId: "slickGridContainer",
      editable: true,
      enableAddRow: true,
      enableCellNavigation: true,
      asyncEditorLoading: false,
      autoEdit: false
    };
  }

  setAutoEdit(isEnabled) {
    this.grid.setOptions({autoEdit: isEnabled});
  }
}
