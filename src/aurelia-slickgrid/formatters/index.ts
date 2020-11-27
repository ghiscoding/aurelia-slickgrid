import { Formatters } from '@slickgrid-universal/common';

import { translateFormatter } from './translateFormatter';
import { translateBooleanFormatter } from './translateBooleanFormatter';

// --
// override Aurelia specific Formatters
// -------------------------------------

/** Takes a cell value and translates it (i18n). Requires an instance of the Translate Service:: `i18n: this.translate */
Formatters.translate = translateFormatter;

/** Takes a boolean value, cast it to upperCase string and finally translates it (i18n). */
Formatters.translateBoolean = translateBooleanFormatter;

// re-export with overriden Formatters
export { Formatters };
