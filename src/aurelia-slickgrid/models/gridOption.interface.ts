import { GridOption as UniversalGridOption } from '@slickgrid-universal/common';
import { RowDetailView } from './rowDetailView.interface';

export interface GridOption extends UniversalGridOption {
  /**
   * @deprecated this will be removed in future release and event prefixes will be removed completely.
   * Default prefix for Aurelia Event names
   */
  defaultAureliaEventPrefix?: string;

  /**
   * @deprecated this will be removed in future release and event prefixes will be removed completely.
   * Default prefix for SlickGrid Event names
   */
  defaultSlickgridEventPrefix?: string;

  /** I18N translation service instance */
  i18n?: unknown;

  /** Row Detail View Plugin options & events (columnId, cssClass, toolTip, width) */
  rowDetailView?: RowDetailView;
}
