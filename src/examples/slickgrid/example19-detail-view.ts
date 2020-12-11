import { bindable } from 'aurelia-framework';

import { Example19 } from './example19';
import { SlickDataView, SlickGrid, ViewModelBindableData } from '../../aurelia-slickgrid';

export class DetailViewCustomElement {
  @bindable() model: {
    duration: Date;
    percentComplete: number;
    reporter: string;
    start: Date;
    finish: Date;
    effortDriven: boolean;
    assignee: string;
    title: string;
  };

  // you also have access to the following objects (it must match the exact property names shown below)
  addon: any; // row detail addon instance
  grid: SlickGrid;
  dataView: SlickDataView;

  // you can also optionally use the Parent Component reference
  // NOTE that you MUST provide it through the "parent" property in your "rowDetail" grid options
  parent: Example19;

  bind(_bindingContext, overrideContext) {
    if (overrideContext && overrideContext.parentOverrideContext && overrideContext.parentOverrideContext.bindingContext && overrideContext.parentOverrideContext.bindingContext.model) {
      this.bindReferences(overrideContext.parentOverrideContext.bindingContext);
    }
  }

  bindReferences(data: ViewModelBindableData) {
    if (data) {
      this.model = data.model;
      this.addon = data.addon;
      this.grid = data.grid;
      this.dataView = data.dataView;
      this.parent = data.parent;
    }
  }

  alertAssignee(name: string) {
    if (typeof name === 'string') {
      alert(`Assignee on this task is: ${name.toUpperCase()}`);
    } else {
      alert('No one is assigned to this task.');
    }
  }

  deleteRow(model) {
    if (confirm(`Are you sure that you want to delete ${model.title}?`)) {
      // you first need to collapse all rows (via the 3rd party addon instance)
      this.addon.collapseAll();

      // then you can delete the item from the dataView
      this.dataView.deleteItem(model.rowId);

      this.parent.showFlashMessage(`Deleted row with ${model.title}`, 'danger');
    }
  }

  callParentMethod(model) {
    this.parent.showFlashMessage(`We just called Parent Method from the Row Detail Child Component on ${model.title}`);
  }
}
