import { BindingSignaler } from 'aurelia-templating-resources';
import { EventAggregator } from 'aurelia-event-aggregator';
import { I18N } from 'aurelia-i18n';
import { Column } from '../models';
import { translateBooleanFormatter } from './translateBooleanFormatter';

describe('the Translate Boolean Formatter', () => {
  let i18n: I18N;

  // mock methods of the Grid object
  const gridMock = {
    getOptions: jest.fn()
  };

  beforeEach(() => {
    i18n = new I18N(new EventAggregator(), new BindingSignaler());
    i18n.setup({
      resources: { en: { translation: { TRUE: 'True', FALSE: 'False' } }, fr: { translation: { TRUE: 'Vrai', FALSE: 'Faux' } } },
      lng: '0',
      fallbackLng: 'en',
      debug: false
    });
  });

  it('should return an empty string null value is passed', async () => {
    await i18n.setLocale('fr');
    gridMock.getOptions.mockReturnValueOnce({ i18n });
    const output = translateBooleanFormatter(1, 1, null, {} as Column, {}, gridMock);
    expect(output).toBe('');
  });

  it('should return the translated value when value passed is boolean', async () => {
    await i18n.setLocale('fr');
    gridMock.getOptions.mockReturnValueOnce({ i18n });
    const output = translateBooleanFormatter(1, 1, 'TRUE', {} as Column, {}, gridMock);
    expect(output).toBe('Vrai');
  });

  it('should return the translated value when value passed is a string', async () => {
    await i18n.setLocale('fr');
    gridMock.getOptions.mockReturnValueOnce({ i18n });
    const output = translateBooleanFormatter(1, 1, 'TRUE', {} as Column, {}, gridMock);
    expect(output).toBe('Vrai');
  });

  it('should return the translated value when value passed is a string and i18n service is passed as a ColumnDef Params', async () => {
    await i18n.setLocale('fr');
    gridMock.getOptions.mockReturnValueOnce({});
    const output = translateBooleanFormatter(1, 1, 'TRUE', { params: { i18n } } as Column, {}, gridMock);
    expect(output).toBe('Vrai');
  });

  it('should return the translated value when value passed is a string and i18n service is passed as a ColumnDef Params without any Grid object', async () => {
    await i18n.setLocale('fr');
    const output = translateBooleanFormatter(1, 1, 'TRUE', { params: { i18n } } as Column, {});
    expect(output).toBe('Vrai');
  });

  it('should convert any type of value to string', async () => {
    await i18n.setLocale('fr');
    gridMock.getOptions.mockReturnValueOnce({ i18n });
    const output = translateBooleanFormatter(1, 1, 99, {} as Column, {}, gridMock);
    expect(output).toBe('99');
  });

  it('should throw an error when no I18N service is not provided to Column Definition and/or Grid Options', () => {
    gridMock.getOptions.mockReturnValueOnce({});
    expect(() => translateBooleanFormatter(1, 1, null, {} as Column, {}, gridMock)).toThrowError('formatter requires the "I18N" Service');
  });
});
