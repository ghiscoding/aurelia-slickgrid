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
    const viewFactory = this.viewCompiler.compile('<template><compose view-model.bind="template"></compose></template>', this.viewResources);

    if (targetElement) {
      if (clearTargetContent && targetElement.innerHTML) {
        targetElement.innerHTML = '';
      }

      // Creates a view
      const view = viewFactory.create(this.container);
      const bindings: any = { template: (templateUrl || ''), ...bindableData };

      view.bind(bindings, createOverrideContext(bindings));

      // Add the view to the slot
      const viewSlot = new ViewSlot(targetElement, true);
      if (viewSlot && viewSlot.add) {
        viewSlot.add(view);
      }
      return { view, viewSlot };
    }
    return null;
  }

  createAureliaViewAddToSlot(templateUrl: string, targetElement?: HTMLElement | Element, clearTargetContent = false): AureliaViewOutput | null {
    const viewFactory = this.viewCompiler.compile('<template><compose view.bind="template"></compose></template>', this.viewResources);

    if (targetElement) {
      if (clearTargetContent && targetElement.innerHTML) {
        targetElement.innerHTML = '';
      }

      // Creates a view
      const view = viewFactory.create(this.container);
      const viewModel = { template: (templateUrl || '') };

      view.bind(viewModel, createOverrideContext(viewModel));

      // Add the view to the slot
      const viewSlot = new ViewSlot(targetElement, true);
      if (viewSlot && viewSlot.add) {
        viewSlot.add(view);
      }
      return { view, viewSlot };
    }
    return null;
  }
}
