import { I18N } from 'aurelia-i18n';
import { EventAggregator } from 'aurelia-event-aggregator';
import { BindingSignaler } from 'aurelia-templating-resources';
import { CollectionService } from './collection.service';
import { CollectionFilterBy } from '../models/collectionFilterBy.interface';

describe('CollectionService', () => {
  let collection = [];
  let i18n: I18N;
  let service: CollectionService;

  // stub some methods of the SlickGrid Grid instance
  const gridStub = {
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
    service = new CollectionService(i18n);

    collection = [
      { firstName: 'John', lastName: 'Z' },
      { firstName: 'Jane', lastName: 'Doe' },
      { firstName: 'Ava', lastName: null },
      { firstName: '', lastName: 'Cash' },
      { firstName: 'Bob', lastName: 'Cash' },
      { firstName: 'John', lastName: 'Doe' },
    ];
  });

  afterEach(() => {
    collection = undefined;
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should return array without filtered value', () => {
    const filterBy = { property: 'firstName', operator: 'NE', value: 'John' } as CollectionFilterBy;

    const result = service.filterCollection(collection, filterBy);

    expect(result).toEqual([
      { firstName: 'Jane', lastName: 'Doe' },
      { firstName: 'Ava', lastName: null },
      { firstName: '', lastName: 'Cash' },
      { firstName: 'Bob', lastName: 'Cash' },
    ]);
  });

  it('should return array without filtered values', () => {
    const filterBy = [
      { property: 'firstName', operator: 'NE', value: 'John' },
      { property: 'lastName', operator: 'NE', value: 'Doe' }
    ] as CollectionFilterBy[];

    const result = service.filterCollection(collection, filterBy);

    expect(result).toEqual([
      { firstName: 'Ava', lastName: null },
      { firstName: '', lastName: 'Cash' },
      { firstName: 'Bob', lastName: 'Cash' },
    ]);
  });
});
