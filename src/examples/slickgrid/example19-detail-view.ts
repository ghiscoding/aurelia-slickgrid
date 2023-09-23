import { bindable } from 'aurelia';
import { SlickDataView, SlickGrid } from '../../aurelia-slickgrid';
import { SlickRowDetailView } from '@slickgrid-universal/row-detail-view-plugin';

export class Example19DetailView {
  @bindable() model!: {
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
  @bindable() addon: SlickRowDetailView; // row detail addon instance
  @bindable() grid!: SlickGrid;
  @bindable() dataView!: SlickDataView;

  // you can also optionally use the Parent Component reference
  // NOTE that you MUST provide it through the "parent" property in your "rowDetail" grid options
  @bindable() parent?: any;

  alertAssignee(name: string) {
    if (typeof name === 'string') {
      alert(`Assignee on this task is: ${name.toUpperCase()}`);
    } else {
      alert('No one is assigned to this task.');
    }
  }

  deleteRow(model: any) {
    if (confirm(`Are you sure that you want to delete ${model.title}?`)) {
      // you first need to collapse all rows (via the 3rd party addon instance)
      this.addon.collapseAll();

      // then you can delete the item from the dataView
      this.dataView.deleteItem(model.rowId);

      this.parent!.showFlashMessage(`Deleted row with ${model.title}`, 'danger');
    }
  }

  callParentMethod(model: any) {
    this.parent!.showFlashMessage(`We just called Parent Method from the Row Detail Child Component on ${model.title}`);
  }
}
