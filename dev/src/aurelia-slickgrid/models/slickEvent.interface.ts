export interface SlickEvent {
  notify: (fn: any) => (args: any, e: Event, scope: any) => Promise<any>;
  subscribe: (fn: any) => (e: any, args: any) => Promise<any>;
  unsubscribe: () => void;
}
