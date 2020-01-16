import {
  inject,
  Container,
  createOverrideContext,
  singleton,
  ViewCompiler,
  ViewResources,
  ViewSlot,
} from 'aurelia-framework';
import { AureliaViewOutput, ViewModelBindableData, ViewModelBindableInputData } from '../models/index';

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

  createAureliaViewModelAddToSlot(template: string, bindableData: ViewModelBindableInputData, targetElement?: HTMLElement | Element, clearTargetContent = false): AureliaViewOutput | null {
    const viewFactory = this.viewCompiler.compile('<template><compose view-model.bind="template"></compose></template>', this.viewResources);

    if (targetElement) {
      if (clearTargetContent && targetElement.innerHTML) {
        targetElement.innerHTML = '';
      }

      // Creates a view
      const view = viewFactory.create(this.container);
      const { item, addon, dataView, grid, parent } = bindableData;
      const viewModel: ViewModelBindableData = { template: template || '', model: item, addon, dataView, grid, parent };

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
