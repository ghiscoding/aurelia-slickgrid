import { SlickDataView } from '@slickgrid-universal/common';
import { SlickGrid } from './slickGrid.interface';

export interface ViewModelBindableInputData {
  model: any;
  addon: any;
  grid: SlickGrid;
  dataView: SlickDataView;
  parent?: any;
}
