import 'jest-extended';
import { EventAggregator } from 'aurelia';
import { MockSignaler } from '@aurelia/testing';
import { I18N, I18nInitOptions, I18nService } from '@aurelia/i18n';
import i18next from 'i18next';

import { TranslaterService } from '../translater.service';

describe.skip('Translater Service', () => {
  let i18n: I18N;
  let service: TranslaterService;
  const defaultLng = 'en';

  beforeEach(async () => {
    const options: I18nInitOptions = {
      lng: defaultLng,
      fallbackLng: defaultLng,
      debug: false,
      plugins: [],
      skipTranslationOnMissingKey: false,
      resources: {
        en: { translation: { ITEMS: 'items', OF: 'of', } },
        fr: { translation: { ITEMS: 'éléments', OF: 'de', } }
      }
    };
    // i18n = new I18nService({ i18next }, options, new EventAggregator(), new MockSignaler());
    i18n = new I18nService();
    await i18n.initPromise;
    service = new TranslaterService(i18n);
  });

  it('should create the service with default language', () => {
    expect(service).toBeTruthy();
    expect(service.getCurrentLanguage()).toBe(defaultLng);
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
