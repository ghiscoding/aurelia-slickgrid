import { I18N } from '@aurelia/i18n';
import { GridOption as UniversalGridOption } from '@slickgrid-universal/common';

import { RowDetailView } from './rowDetailView.interface';

export interface GridOption extends UniversalGridOption {
  /** I18N translation service instance */
  i18n?: I18N;

  /** Row Detail View Plugin options & events (columnId, cssClass, toolTip, width) */
  rowDetailView?: RowDetailView;
}
