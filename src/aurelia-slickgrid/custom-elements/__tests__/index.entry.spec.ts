import { FrameworkConfiguration } from 'aurelia-framework';
import { configure, SlickgridConfig } from '../../index';
import * as entry from '../../index';

jest.mock('flatpickr', () => { });

describe('Testing library entry point and aurelia configure routine', () => {
  const frameworkConfig = {
    globalResources: () => { /**/ },
    container: {
      registerInstance: () => { /**/ },
      registerTransient: () => { /**/ },
      get: (Type: any) => new Type()
    },
    postTask: jest.fn()
  } as any as FrameworkConfiguration;

  it('should export configure function', () => {
    expect(typeof configure).toBe('function');
  });

  it('should export a few functions', () => {
    expect(entry.AureliaSlickgridCustomElement).toBeTruthy();
    expect(entry.SlickPaginationCustomElement).toBeTruthy();
    expect(entry.SlickPaginationCustomElement).toBeTruthy();
  });

  it('should accept a setup callback passing back the instance', (done) => {
    const callback = (instance: SlickgridConfig) => {
      expect(typeof instance).toBe('object');
      done();

      return instance.options;
    };

    configure(frameworkConfig, callback);
  });

  it('should not throw any error if no callback is provided', () => {
    expect(() => { (configure as any)(frameworkConfig); }).not.toThrow();
  });
});
