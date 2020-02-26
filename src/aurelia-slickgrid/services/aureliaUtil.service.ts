import {
  inject,
  Container,
  createOverrideContext,
  singleton,
  ViewCompiler,
  ViewResources,
  ViewSlot,
} from 'aurelia-framework';
import { AureliaViewOutput } from '../models/index';

@singleton(true)
@inject(
  Container,
  ViewCompiler,
  ViewResources
)
export class AureliaUtilService {
  constructor(
    private container: Container,
    private viewCompiler: ViewCompiler,
    private viewResources: ViewResources,
  ) { }

  createAureliaViewModelAddToSlot(templateUrl: string, bindableData: any, targetElement?: HTMLElement | Element, clearTargetContent = false): AureliaViewOutput | null {
    const viewFactory = this.viewCompiler.compile('<template><compose view-model.bind="template" view-model.ref="viewModelRef"></compose></template>', this.viewResources);

    if (targetElement) {
      if (clearTargetContent && targetElement.innerHTML) {
        targetElement.innerHTML = '';
      }

      // create some bindings including the template & other bindable data
      const bindings: any = { template: (templateUrl || ''), ...bindableData, viewModelRef: {} };

      // Creates a view
      const view = viewFactory.create(this.container);
      view.bind(bindings, createOverrideContext(bindings));

      // Add the view to the slot
      const viewSlot = new ViewSlot(targetElement, true);
      if (viewSlot && viewSlot.add) {
        viewSlot.add(view);
      }
      return { bindings, view, viewSlot };
    }
    return null;
  }

  createAureliaViewAddToSlot(templateUrl: string, targetElement?: HTMLElement | Element, clearTargetContent = false): AureliaViewOutput | null {
    const viewFactory = this.viewCompiler.compile('<template><compose view.bind="template" view-model.ref="viewModelRef"></compose></template>', this.viewResources);

    if (targetElement) {
      if (clearTargetContent && targetElement.innerHTML) {
        targetElement.innerHTML = '';
      }

      // create some bindings including the template & other bindable data
      const bindings = { template: (templateUrl || ''), viewModelRef: {} };

      // Creates a view
      const view = viewFactory.create(this.container);
      view.bind(bindings, createOverrideContext(bindings));

      // Add the view to the slot
      const viewSlot = new ViewSlot(targetElement, true);
      if (viewSlot && viewSlot.add) {
        viewSlot.add(view);
      }
      return { bindings, view, viewSlot };
    }
    return null;
  }
}
