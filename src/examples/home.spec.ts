import { Home } from './home';

describe('Home Page', () => {
  it('should test home ViewModel', () => {
    const sut = new Home();
    expect(sut).toBeDefined();
  });
});
