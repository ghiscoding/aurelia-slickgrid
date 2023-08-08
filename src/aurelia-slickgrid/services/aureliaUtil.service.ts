import { AureliaViewOutput, ViewModelBindableInputData } from '../models/index';
import { Constructable, CustomElement, IAurelia, singleton } from 'aurelia';

@singleton()
export class AureliaUtilService {
  constructor(
    @IAurelia private readonly au: IAurelia
  ) { }

  async createAureliaViewModelAddToSlot(viewModel: Constructable, bindableData: ViewModelBindableInputData, targetElement?: HTMLElement | Element, clearTargetContent = false): Promise<AureliaViewOutput | null> {
    if (targetElement) {
      // TODO: MB - is this needed?
      if (clearTargetContent && targetElement.innerHTML) {
        targetElement.innerHTML = '';
      }

      const def = CustomElement.getDefinition(viewModel);
      targetElement.innerHTML = `<${def.name} model.bind="bindableData.model" addon.bind="bindableData.addon" grid.bind="bindableData.grid" data-view.bind="bindableData.dataView" parent.bind="bindableData.parent"></${def.name}>`;
      return { controller: await this.au.enhance({ host: targetElement, component: { bindableData } }) };
    }
    return null;
  }
}
