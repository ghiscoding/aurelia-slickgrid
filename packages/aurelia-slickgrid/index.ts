export {
  SlickDataView, FieldType, ExtensionName, Editors, Formatters, Filters, Column,
  Editor,
  EditorValidator,
  EditorValidationResult,
  GridStateChange,
  FileType,
  Formatter,
  DelimiterType,
  AutocompleterOption,
  EditCommand,
  FlatpickrOption,
  OnEventArgs,
  OperatorType,
  SlickGlobalEditorLock,
  SortComparers,
  CompositeEditorModalType,
  formatNumber,
  LongTextEditorOption,
  OnCompositeEditorChangeEventArgs,
  CursorPageInfo,
  Metrics,
  MultipleSelectOption,
  SortDirection,
  Pagination,
  Aggregators,
  deepCopy,
  GroupTotalFormatters,
  ContextMenu,
  GridStateType,
  MenuCommandItemCallbackArgs,
  decimalFormatted,
  findItemInTreeStructure,
  isNumber,
  TreeToggledItem, TreeToggleStateChange,
  SlickEventHandler,
  GridState,
  Grouping,
  SortDirectionNumber,
  OperatorString,
  ColumnEditorDualInput,
  GroupingGetterFunction,
  ItemMetadata,
  GridService,
  CurrentFilter,
  SliderRangeOption,
  ColumnFilter,
  emptyElement,
  Filter,
  FilterArguments,
  FilterCallback,
  SearchTerm,
  ColumnEditor,

} from '@slickgrid-universal/common';
import { IContainer } from 'aurelia';
import { AureliaSlickgridCustomElement } from './custom-elements/aurelia-slickgrid';
import { SlickgridConfig } from './slickgrid-config';

export const AureliaSlickGridConfiguration = {
  register(container: IContainer): IContainer {
    return container.register(AureliaSlickgridCustomElement);
  },

  customize(optionsProvider: (config: SlickgridConfig) => void) {
    return {
      register(container: IContainer): IContainer {
        const options = container.get(SlickgridConfig);
        optionsProvider(options);
        return AureliaSlickGridConfiguration.register(container);
      },
    };
  }
};

export { AureliaSlickgridCustomElement } from './custom-elements/aurelia-slickgrid';
import type {
  AureliaGridInstance,
  AureliaViewOutput,
  GridOption,
  RowDetailView,
  SlickGrid,
  ViewModelBindableData,
  ViewModelBindableInputData
} from './models/index';

// re-export only the Aurelia interfaces (models), some of which were overriden from Slickgrid-Universal
export {
  AureliaGridInstance,
  AureliaViewOutput,
  GridOption,
  RowDetailView,
  SlickGrid,
  ViewModelBindableData,
  ViewModelBindableInputData,
  SlickgridConfig
};

// expose all public classes
export {
  AureliaUtilService,
  TranslaterService,
  disposeAllSubscriptions
} from './services/index';
