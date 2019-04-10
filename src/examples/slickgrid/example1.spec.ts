import { Example1 } from './example1';

describe('the Example 1', () => {
  let sut: any;

  beforeEach(() => {
    sut = new Example1();
  });

  it('should make sure Example1 is defined', () => {
    expect(sut).toBeTruthy();
  });

  it('should have 2 datasets of 1000 items', () => {
    const spy = jest.spyOn(sut, 'mockData');
    sut.attached();

    expect(Array.isArray(sut.dataset1)).toBe(true);
    expect(Array.isArray(sut.dataset2)).toBe(true);
    expect(sut.dataset1.length).toBe(1000);
    expect(sut.dataset2.length).toBe(1000);
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
