import { BindingSignaler } from 'aurelia-templating-resources';
import { EventAggregator } from 'aurelia-event-aggregator';
import { I18N } from 'aurelia-i18n';
import { Column } from '../../models';
import { translateBooleanFormatter } from '../translateBooleanFormatter';

describe('the Translate Boolean Formatter', () => {
  let i18n: I18N;

  // stub some methods of the SlickGrid Grid instance
  const gridStub = {
    getOptions: jest.fn()
  };

  beforeEach(() => {
    i18n = new I18N(new EventAggregator(), new BindingSignaler());
    i18n.setup({
      resources: { en: { translation: { TRUE: 'True', FALSE: 'False' } }, fr: { translation: { TRUE: 'Vrai', FALSE: 'Faux' } } },
      lng: 'en',
      fallbackLng: 'en',
      debug: false
    });
  });

  it('should return an empty string when null value is passed', async () => {
    await i18n.setLocale('fr');
    gridStub.getOptions.mockReturnValueOnce({ i18n });
    const output = translateBooleanFormatter(1, 1, null, {} as Column, {}, gridStub);
    expect(output).toBe('');
  });

  it('should return an empty string when empty string value is passed', async () => {
    await i18n.setLocale('fr');
    gridStub.getOptions.mockReturnValueOnce({ i18n });
    const output = translateBooleanFormatter(1, 1, '', {} as Column, {}, gridStub);
    expect(output).toBe('');
  });

  it('should return the translated value when value passed is boolean', async () => {
    await i18n.setLocale('fr');
    gridStub.getOptions.mockReturnValueOnce({ i18n });
    const output = translateBooleanFormatter(1, 1, 'TRUE', {} as Column, {}, gridStub);
    expect(output).toBe('Vrai');
  });

  it('should return the translated value when value passed is a string', async () => {
    await i18n.setLocale('fr');
    gridStub.getOptions.mockReturnValueOnce({ i18n });
    const output = translateBooleanFormatter(1, 1, 'TRUE', {} as Column, {}, gridStub);
    expect(output).toBe('Vrai');
  });

  it('should return the translated value when value passed is a string and i18n service is passed as a ColumnDef Params', async () => {
    await i18n.setLocale('fr');
    gridStub.getOptions.mockReturnValueOnce({});
    const output = translateBooleanFormatter(1, 1, 'TRUE', { params: { i18n } } as Column, {}, gridStub);
    expect(output).toBe('Vrai');
  });

  it('should return the translated value when value passed is a string and i18n service is passed as a ColumnDef Params without any Grid object', async () => {
    await i18n.setLocale('fr');
    const output = translateBooleanFormatter(1, 1, 'TRUE', { params: { i18n } } as Column, {}, {});
    expect(output).toBe('Vrai');
  });

  it('should convert any type of value to string', async () => {
    await i18n.setLocale('fr');
    gridStub.getOptions.mockReturnValueOnce({ i18n });
    const output = translateBooleanFormatter(1, 1, 99, {} as Column, {}, gridStub);
    expect(output).toBe('99');
  });

  it('should throw an error when no I18N service is not provided to Column Definition and/or Grid Options', () => {
    gridStub.getOptions.mockReturnValueOnce({});
    expect(() => translateBooleanFormatter(1, 1, null, {} as Column, {}, gridStub)).toThrowError('formatter requires the "I18N" Service');
  });
});
