import { BindingSignaler } from 'aurelia-templating-resources';
import { EventAggregator } from 'aurelia-event-aggregator';
import { I18N } from 'aurelia-i18n';
import { Column } from '../models';
import { translateFormatter } from './translateFormatter';

describe('the Translate Formatter', () => {
  let i18n: I18N;

  // mock methods of the Grid object
  const gridMock = {
    getOptions: jest.fn()
  };

  beforeEach(() => {
    i18n = new I18N(new EventAggregator(), new BindingSignaler());
    i18n.setup({
      resources: { en: { translation: { HELLO: 'Hello' } }, fr: { translation: { HELLO: 'Bonjour' } } },
      lng: '0',
      fallbackLng: 'en',
      debug: false
    });
  });

  it('should return an empty string when no value is passed', async () => {
    await i18n.setLocale('fr');
    gridMock.getOptions.mockReturnValueOnce({ i18n });
    const output = translateFormatter(1, 1, '', {} as Column, {}, gridMock);
    expect(i18n.getLocale()).toBe('fr');
    expect(output).toBe('');
  });

  it('should return the translated value as string', async () => {
    await i18n.setLocale('fr');
    gridMock.getOptions.mockReturnValueOnce({ i18n });
    const output = translateFormatter(1, 1, 'HELLO', {} as Column, {}, gridMock);
    expect(output).toBe('Bonjour');
  });

  it('should return the translated value when value passed is a string and i18n service is passed as a ColumnDef Params', async () => {
    await i18n.setLocale('fr');
    gridMock.getOptions.mockReturnValueOnce({});
    const output = translateFormatter(1, 1, 'HELLO', { params: { i18n } } as Column, {}, gridMock);
    expect(output).toBe('Bonjour');
  });

  it('should return the translated value when value passed is a string and i18n service is passed as a ColumnDef Params without any Grid object', async () => {
    await i18n.setLocale('fr');
    const output = translateFormatter(1, 1, 'HELLO', { params: { i18n } } as Column, {});
    expect(output).toBe('Bonjour');
  });

  it('should convert any type of value to string', async () => {
    await i18n.setLocale('fr');
    gridMock.getOptions.mockReturnValueOnce({ i18n });
    const output = translateFormatter(1, 1, 99, {} as Column, {}, gridMock);
    expect(output).toBe('99');
  });

  it('should throw an error when no I18N service provided to neither ColumnDefinition and GridOptions', () => {
    gridMock.getOptions.mockReturnValueOnce({});
    expect(() => { translateFormatter(1, 1, null, {} as Column, {}, gridMock) }).toThrowError('formatter requires the "I18N" Service');
  });
});
