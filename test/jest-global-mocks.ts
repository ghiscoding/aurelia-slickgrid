const mock = () => {
  let storage: any = {};
  return {
    getItem: (key: string) => key in storage ? storage[key] : null,
    setItem: (key: string, value: number | string) => storage[key] = value || '',
    removeItem: (key: string) => delete storage[key],
    clear: () => storage = {},
  };
};

Object.defineProperty(window, 'localStorage', { value: mock() });
Object.defineProperty(window, 'sessionStorage', { value: mock() });
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ['-webkit-appearance']
});

Object.defineProperty(window, '__env', { value: { env: { backendUrl: 'mocked URL' } } });

Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => {
      return '';
    }
  })
});
