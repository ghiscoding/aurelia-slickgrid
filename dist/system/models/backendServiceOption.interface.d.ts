import { BackendEventChanged } from './backendEventChanged.interface';
export interface BackendServiceOption {
    /** What is the dataset, this is required for the GraphQL query to be built */
    datasetName?: string;
    paginationOptions?: any;
    filteringOptions?: any[];
    sortingOptions?: any[];
    /** Execute the process callback command on component init (page load) */
    executeProcessCommandOnInit?: boolean;
    /** Backend Service API callback definitions */
    onBackendEventApi?: BackendEventChanged;
}
