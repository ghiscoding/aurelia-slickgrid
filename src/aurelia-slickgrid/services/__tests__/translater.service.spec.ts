import 'jest-extended';
import { I18N } from 'aurelia-i18n';
import { EventAggregator } from 'aurelia-event-aggregator';
import { BindingSignaler } from 'aurelia-templating-resources';

import { TranslaterService } from '../translater.service';

describe('Translater Service', () => {
  let ea: EventAggregator;
  let i18n: I18N;
  let service: TranslaterService;

  beforeEach(() => {
    ea = new EventAggregator();
    i18n = new I18N(ea, new BindingSignaler());
    service = new TranslaterService(i18n);

    i18n.setup({
      lng: 'en',
      fallbackLng: 'en',
      resources: {
        en: { translation: { ITEMS: 'items', OF: 'of', } },
        fr: { translation: { ITEMS: 'éléments', OF: 'de', } }
      },
    });
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should call "use" method and expect "getCurrentLanguage" to be equal', async () => {
    await service.use('jp');
    expect(service.getCurrentLanguage()).toBe('jp');
  });

  it('should call "translate" and expect translated value returned', async () => {
    await service.use('fr');
    const output = service.translate('ITEMS');
    expect(output).toBe('éléments');
  });
});
