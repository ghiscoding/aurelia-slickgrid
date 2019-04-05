import {
  inject,
  Container,
  createOverrideContext,
  ViewCompiler,
  ViewResources,
  ViewSlot,
} from 'aurelia-framework';
import { AureliaViewOutput } from './../models/aureliaViewOutput.interface';

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

  createAureliaViewModelAddToSlot(template: string, item: any, targetElement?: HTMLElement | Element, clearTargetContent = false): AureliaViewOutput | null {
    const viewFactory = this.viewCompiler.compile('<template><compose view-model.bind="template"></compose></template>', this.viewResources);

    if (targetElement) {
      if (clearTargetContent && targetElement.innerHTML) {
        targetElement.innerHTML = '';
      }

      // Creates a view
      const view = viewFactory.create(this.container);
      const viewModel = { template: template || '', model: item };

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

  createAureliaViewAddToSlot(template: string, targetElement?: HTMLElement | Element, clearTargetContent = false): AureliaViewOutput | null {
    const viewFactory = this.viewCompiler.compile('<template><compose view.bind="template"></compose></template>', this.viewResources);

    if (targetElement) {
      if (clearTargetContent && targetElement.innerHTML) {
        targetElement.innerHTML = '';
      }

      // Creates a view
      const view = viewFactory.create(this.container);
      const viewModel = { template: template || '' };

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
