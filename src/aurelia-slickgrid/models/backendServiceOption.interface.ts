import { BackendEventChanged } from './backendEventChanged.interface';
import { QueryArgument } from './queryArgument.interface';

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

  /**
   * Extra query arguments that be passed in addition to the default query arguments
   * For example in GraphQL, if we want to pass "userId" and we want the query to look like
   * users (first: 20, offset: 10, userId: 123) { ... }
   */
  extraQueryArguments?: QueryArgument[];
}
