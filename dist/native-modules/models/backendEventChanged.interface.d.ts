import { BackendService } from './index';
export interface BackendEventChanged {
    onInit?: (query: string) => Promise<any>;
    preProcess?: () => void;
    process: (query: string) => Promise<any>;
    postProcess: (response: any) => void;
    service: BackendService;
    filterTypingDebounce?: number;
}
