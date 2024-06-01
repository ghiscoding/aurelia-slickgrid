import { AureliaViewOutput, ViewModelBindableInputData } from '../models/index';
import { AppTask, Constructable, CustomElement, IAurelia, resolve, singleton } from 'aurelia';

(IAurelia as any).test = 'import 1';

@singleton()
export class AureliaUtilService {
  constructor(private readonly au: IAurelia = resolve(IAurelia)) { }

  async createAureliaViewModelAddToSlot(viewModel: Constructable, bindableData?: ViewModelBindableInputData, targetElement?: HTMLElement | Element): Promise<AureliaViewOutput | null> {
    if (!targetElement) {
      return null;
    }

    const def = CustomElement.getDefinition(viewModel);
    const addonBindable = bindableData?.addon ? 'addon.bind="bindableData.addon"' : '';
    const gridBindable = bindableData?.grid ? 'grid.bind="bindableData.grid"' : '';
    const dataViewBindable = bindableData?.dataView ? 'data-view.bind="bindableData.dataView"' : '';
    const parentBindable = bindableData?.parent ? 'parent.bind="bindableData.parent"' : '';

    targetElement.innerHTML = `<${def.name} model.bind="bindableData.model" ${addonBindable} ${gridBindable} ${dataViewBindable} ${parentBindable}></${def.name}>`.trim();

    return await this.au.enhance({
      host: targetElement,
      component: { bindableData },
      container: this.au.container.createChild().register(AppTask.creating(() => { }))
    });
  }
}
