import { DataView } from './dataView.interface';
import { SlickGrid } from './slickGrid.interface';

export interface ViewModelBindableInputData {
  model: any;
  addon: any;
  grid: SlickGrid;
  dataView: DataView;
  parent?: any;
}
