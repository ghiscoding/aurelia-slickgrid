import {
  inject,
  Container,
  createOverrideContext,
  ViewCompiler,
  ViewResources,
  ViewSlot,
  View,
} from 'aurelia-framework';

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

  appendAureliaViewModelToDom(template: string, item: any, targetElement?: HTMLElement | Element): { view: View, viewSlot: ViewSlot } {
    const viewFactory = this.viewCompiler.compile('<template><compose view-model.bind="template"></compose></template>', this.viewResources);

    if (targetElement) {
      // Creates a view
      // targetElement.empty();
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
  }

  appendAureliaViewToDom(template: string, targetElement?: HTMLElement | Element): { view: View, viewSlot: ViewSlot } {
    const viewFactory = this.viewCompiler.compile('<template><compose view.bind="template"></compose></template>', this.viewResources);

    if (targetElement) {
      // Creates a view
      // targetElement.empty();
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
  }
}
