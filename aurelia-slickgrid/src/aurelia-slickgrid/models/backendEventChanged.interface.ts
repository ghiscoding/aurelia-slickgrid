import { BackendService } from './index';

export interface BackendEventChanged {
  /** On init (or on page load), what action to perform? */
  onInit?: (query: string) => Promise<any>;

  /** Before executing the query, what action to perform? For example, start a spinner */
  preProcess?: () => void;

  /** Before executing the query, what action to perform? For example, start a spinner */
  process: (query: string) => Promise<any>;

  /** After executing the query, what action to perform? For example, stop the spinner */
  postProcess: (response: any) => void;

  /** Backend Service instance (could be OData or GraphQL Service) */
  service: BackendService;

  /** How long to wait until we start querying backend to avoid sending too many requests to backend server. Default to 750ms */
  filterTypingDebounce?: number;
}
