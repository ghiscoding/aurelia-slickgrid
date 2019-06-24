import { AsgNumberValueConverter } from './asgNumber';

describe('AsgNumberValueConverter method', () => {
  it('should return a number', () => {
    const converter = new AsgNumberValueConverter();
    const output = converter.fromView('99');
    expect(output).toBe(99);
  });

  it('should return original value when input is not a number', () => {
    const converter = new AsgNumberValueConverter();
    const output = converter.fromView('abc');
    expect(output).toBe('abc');
  });
});
