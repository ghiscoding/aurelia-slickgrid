import { TranslaterService, TranslateServiceEventName } from '@slickgrid-universal/common';
import { inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';

interface Locales {
  [locale: string]: string;
}

interface TranslateOptions {
  loadPath: string;
  lang: string;
}

/**
 * This is a Translate Service Wrapper for Slickgrid-Universal,
 * it must implement Slickgrid-Universal TranslaterService interface to work properly
 */
@inject(I18N)
export class UniversalTranslateService implements TranslaterService {
  eventName = 'onLanguageChange' as TranslateServiceEventName;

  constructor(private i18n: I18N) { }

  getCurrentLanguage(): string {
    return this.i18n.getLocale();
  }

  async use(newLang: string): Promise<Locales> {
    return this.i18n.setLocale(newLang);
  }

  setup(options: TranslateOptions) {
    this.i18n.setup(options);
  }

  translate(translationKey: string): string {
    return this.i18n.tr(translationKey);
  }
}
