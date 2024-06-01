import { customElement, Aurelia } from 'aurelia';
import { IAurelia } from 'aurelia';
import { AureliaUtilService } from '../aureliaUtil.service';
import { ViewModelBindableInputData } from '../../models';

const DOM_ELEMENT_ID = 'row-detail123';

// @ts-ignore
@customElement({ name: 'example-loader', template: '<p>Some Paragraph</p>' })
export class ExampleLoader { }


describe('aureliaUtilService', () => {
  let service: AureliaUtilService;
  let au: IAurelia;

  beforeEach(() => {
    // define a <div> container to simulate a row detail DOM element
    const div = document.createElement('div');
    div.innerHTML = `<div id="${DOM_ELEMENT_ID}">some text</div>`;
    document.body.appendChild(div);

    au = new Aurelia();
    service = new AureliaUtilService(au);
  });

  afterEach(() => {
    const domElm = document.getElementById(DOM_ELEMENT_ID) as HTMLElement;
    domElm.innerHTML = 'some text';
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  describe('createAureliaViewModelAddToSlot method', () => {
    it('should return null when html dom element is not provided', async () => {
      const output = await service.createAureliaViewModelAddToSlot(ExampleLoader, { model: { firstName: 'John' } } as ViewModelBindableInputData, undefined);

      expect(output).toBeNull();
    });

    it('should create an Aurelia ViewModel and add it to a View Slot with only model attribute when nothing else is provided', async () => {
      const controllerMock = { viewModel: {} };
      const domElm = document.getElementById(DOM_ELEMENT_ID) as HTMLElement;
      const enhanceSpy = jest.spyOn(au, 'enhance').mockResolvedValue(controllerMock as any);

      const output = await service.createAureliaViewModelAddToSlot(ExampleLoader, { model: { firstName: 'John' } } as ViewModelBindableInputData, domElm);

      expect(enhanceSpy).toHaveBeenCalled();
      expect(domElm.innerHTML).toBe('<example-loader model.bind=\"bindableData.model\"></example-loader>');
      expect(output).toEqual(controllerMock);
    });

    it('should create an Aurelia ViewModel and add it to a View Slot with all bindable attributes when all are provided', async () => {
      const controllerMock = { viewModel: {} };
      const domElm = document.getElementById(DOM_ELEMENT_ID) as HTMLElement;
      const enhanceSpy = jest.spyOn(au, 'enhance').mockResolvedValue(controllerMock as any);

      const output = await service.createAureliaViewModelAddToSlot(ExampleLoader, { model: { firstName: 'John', }, addon: {}, grid: {}, dataView: {}, parent: {} } as ViewModelBindableInputData, domElm);

      expect(enhanceSpy).toHaveBeenCalled();
      expect(domElm.innerHTML).toBe('<example-loader model.bind="bindableData.model" addon.bind="bindableData.addon" grid.bind="bindableData.grid" data-view.bind="bindableData.dataView" parent.bind="bindableData.parent"></example-loader>');
      expect(output).toEqual(controllerMock);
    });
  });
});
