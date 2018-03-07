import { BackendEventChanged } from './backendEventChanged.interface';
export interface BackendServiceOption {
    /** What is the dataset name, this is required for the GraphQL query to be built */
    datasetName?: string;
    /** Pagination options (itemsPerPage, pageSize, pageSizes) */
    paginationOptions?: any;
    /** Filtering options, array of filter options */
    filteringOptions?: any[];
    /** Sorting options, array of sorter options */
    sortingOptions?: any[];
    /** Execute the process callback command on component init (page load) */
    executeProcessCommandOnInit?: boolean;
    /** Backend Service API callback definitions */
    onBackendEventApi?: BackendEventChanged;
}
