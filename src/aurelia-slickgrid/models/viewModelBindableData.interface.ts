import { DataView } from './dataView.interface';
import { SlickGrid } from './slickGrid.interface';

export interface ViewModelBindableData {
  template: string;
  model: any;
  addon: any;
  grid: SlickGrid;
  dataView: DataView;
  parent?: any;
}
