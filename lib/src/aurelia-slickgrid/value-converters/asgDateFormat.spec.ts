import { AsgDateFormatValueConverter } from './asgDateFormat';

describe('AsgDateFormatConverter method', () => {
  it('should return a formatted date', () => {
    const converter = new AsgDateFormatValueConverter();
    const output = converter.toView(new Date('2019-05-01T02:36:07'), 'YYYY-MM-DD');
    expect(output).toBe('2019-05-01');
  });
});
