import { GridOption as UniversalGridOption } from '@slickgrid-universal/common';
import { I18N } from 'aurelia-i18n';
import { RowDetailView } from './rowDetailView.interface';

export interface GridOption extends UniversalGridOption {
  /** Default prefix for Aurelia Event names */
  defaultAureliaEventPrefix?: string;

  /** Default prefix for SlickGrid Event names */
  defaultSlickgridEventPrefix?: string;

  /** I18N translation service instance */
  i18n?: I18N;

  /** Row Detail View Plugin options & events (columnId, cssClass, toolTip, width) */
  rowDetailView?: RowDetailView;
}
