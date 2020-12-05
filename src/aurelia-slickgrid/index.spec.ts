import * as entry from './index';

describe('Testing library entry point', () => {
  it('should have an index entry point defined', () => {
    expect(entry).toBeTruthy();
  });

  it('should have all exported object defined', () => {
    expect(typeof entry.AureliaUtilService).toBe('function');
    expect(typeof entry.ResizerService).toBe('function');
    expect(typeof entry.UniversalPubSubService).toBe('function');
    expect(typeof entry.UniversalTranslateService).toBe('function');
    expect(typeof entry.disposeAllSubscriptions).toBe('function');
    expect(typeof entry.Aggregators).toBe('object');
    expect(typeof entry.Editors).toBe('object');
    expect(typeof entry.Enums).toBe('object');
    expect(typeof entry.Filters).toBe('object');
    expect(typeof entry.Formatters).toBe('object');
    expect(typeof entry.GroupTotalFormatters).toBe('object');
    expect(typeof entry.SortComparers).toBe('object');
    expect(typeof entry.Utilities).toBe('object');
  });
});
