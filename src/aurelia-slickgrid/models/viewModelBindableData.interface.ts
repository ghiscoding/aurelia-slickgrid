import { SlickDataView } from './slickDataView.interface';
import { SlickGrid } from './slickGrid.interface';

export interface ViewModelBindableData {
  template: string;
  model: any;
  addon: any;
  grid: SlickGrid;
  dataView: SlickDataView;
  parent?: any;
}
