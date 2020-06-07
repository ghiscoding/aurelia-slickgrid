import { SlickDataView } from './slickDataView.interface';
import { SlickGrid } from './slickGrid.interface';

export interface ViewModelBindableInputData {
  model: any;
  addon: any;
  grid: SlickGrid;
  dataView: SlickDataView;
  parent?: any;
}
