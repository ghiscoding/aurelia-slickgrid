import { BindingLanguage, Container, ViewCompiler, ViewResources } from 'aurelia-framework';
import { AureliaUtilService } from '../aureliaUtil.service';

jest.mock('flatpickr', () => { });
const DOM_ELEMENT_ID = 'row-detail123';

describe('aureliaUtilService', () => {
  let service: AureliaUtilService;
  let container: Container;
  let viewCompiler: ViewCompiler;
  let viewResources: ViewResources;

  beforeEach(() => {
    // define a <div> container to simulate a row detail DOM element
    const div = document.createElement('div');
    div.innerHTML = `<div id="${DOM_ELEMENT_ID}">some text</div>`;
    document.body.appendChild(div);

    container = new Container();
    viewResources = new ViewResources();
    viewCompiler = new ViewCompiler(new BindingLanguage(), viewResources);
    service = new AureliaUtilService(container, viewCompiler, viewResources);
  });

  afterEach(() => {
    const domElm = document.getElementById(DOM_ELEMENT_ID) as HTMLElement;
    domElm.innerHTML = 'some text';
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  describe('createAureliaViewModelAddToSlot method', () => {
    it('should return null when html dom element is not provided', () => {
      const mockCompilerCreate = { bind: jest.fn(), appendNodesTo: jest.fn() };
      jest.spyOn(viewCompiler, 'compile').mockReturnValue({ create: () => mockCompilerCreate as any } as any);

      const output = service.createAureliaViewModelAddToSlot('./template/path', { firstName: 'John' }, undefined);

      expect(output).toBeNull();
    });

    it('should create an Aurelia ViewModel and add it to a View Slot', () => {
      const domElm = document.getElementById(DOM_ELEMENT_ID) as HTMLElement;
      const mockCompilerCreate = { bind: jest.fn(), appendNodesTo: jest.fn() };
      const spyCompiler = jest.spyOn(viewCompiler, 'compile').mockReturnValue({ create: () => mockCompilerCreate as any } as any);
      const spyView = jest.spyOn(mockCompilerCreate, 'bind').mockReturnValue({ create: jest.fn() });

      const output = service.createAureliaViewModelAddToSlot('./template/path', { firstName: 'John' }, domElm, true);

      expect(spyCompiler).toHaveBeenCalled();
      expect(spyView).toHaveBeenCalled();
      expect(domElm.innerHTML).toBe('');
      expect(output).toEqual({ bindings: { template: './template/path', firstName: 'John', viewModelRef: {} }, view: mockCompilerCreate, viewSlot: expect.anything() });
    });

    it('should create an Aurelia ViewModel and add it to a View Slot even when template is not provided', () => {
      const domElm = document.getElementById(DOM_ELEMENT_ID) as HTMLElement;
      const mockCompilerCreate = { bind: jest.fn(), appendNodesTo: jest.fn() };
      const spyCompiler = jest.spyOn(viewCompiler, 'compile').mockReturnValue({ create: () => mockCompilerCreate as any } as any);
      const spyView = jest.spyOn(mockCompilerCreate, 'bind').mockReturnValue({ create: jest.fn() });

      const output = service.createAureliaViewModelAddToSlot(undefined as any, { firstName: 'John' }, domElm, true);

      expect(spyCompiler).toHaveBeenCalled();
      expect(spyView).toHaveBeenCalled();
      expect(domElm.innerHTML).toBe('');
      expect(output).toEqual({ bindings: { template: '', firstName: 'John', viewModelRef: {} }, view: mockCompilerCreate, viewSlot: expect.anything() });
    });
  });

  describe('createAureliaViewAddToSlot method', () => {
    it('should return null when html dom element is not provided', () => {
      const mockCompilerCreate = { bind: jest.fn(), appendNodesTo: jest.fn() };
      jest.spyOn(viewCompiler, 'compile').mockReturnValue({ create: () => mockCompilerCreate as any } as any);

      const output = service.createAureliaViewAddToSlot('./template/path', undefined);

      expect(output).toBeNull();
    });

    it('should create an Aurelia ViewModel and add it to a View Slot', () => {
      const domElm = document.getElementById(DOM_ELEMENT_ID) as HTMLElement;
      const mockCompilerCreate = { bind: jest.fn(), appendNodesTo: jest.fn() };
      const spyCompiler = jest.spyOn(viewCompiler, 'compile').mockReturnValue({ create: () => mockCompilerCreate as any } as any);
      const spyView = jest.spyOn(mockCompilerCreate, 'bind').mockReturnValue({ create: jest.fn() });

      const output = service.createAureliaViewAddToSlot('./template/path', domElm, true);

      expect(spyCompiler).toHaveBeenCalled();
      expect(spyView).toHaveBeenCalled();
      expect(domElm.innerHTML).toBe('');
      expect(output).toEqual({ bindings: { template: './template/path', viewModelRef: {} }, view: mockCompilerCreate, viewSlot: expect.anything() });
    });

    it('should create an Aurelia ViewModel and add it to a View Slot even when template is not provided', () => {
      const domElm = document.getElementById(DOM_ELEMENT_ID) as HTMLElement;
      const mockCompilerCreate = { bind: jest.fn(), appendNodesTo: jest.fn() };
      const spyCompiler = jest.spyOn(viewCompiler, 'compile').mockReturnValue({ create: () => mockCompilerCreate as any } as any);
      const spyView = jest.spyOn(mockCompilerCreate, 'bind').mockReturnValue({ create: jest.fn() });

      const output = service.createAureliaViewAddToSlot(undefined as any, domElm, true);

      expect(spyCompiler).toHaveBeenCalled();
      expect(spyView).toHaveBeenCalled();
      expect(domElm.innerHTML).toBe('');
      expect(output).toEqual({ bindings: { template: '', viewModelRef: {} }, view: mockCompilerCreate, viewSlot: expect.anything() });
    });
  });
});
