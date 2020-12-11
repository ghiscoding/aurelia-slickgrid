import { SlickDataView } from '@slickgrid-universal/common';
import { SlickGrid } from './slickGrid.interface';

export interface ViewModelBindableData {
  template: string;
  model: any;
  addon: any;
  grid: SlickGrid;
  dataView: SlickDataView;
  parent?: any;
}
