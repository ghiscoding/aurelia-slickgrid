import 'jest-extended';
import { type I18N, I18nService } from '@aurelia/i18n';

import { TranslaterService } from '../translater.service';

describe.skip('Translater Service', () => {
  let i18n: I18N;
  let service: TranslaterService;
  const defaultLng = 'en';

  beforeEach(async () => {
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
