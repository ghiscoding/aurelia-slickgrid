import { inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { mapOperatorType } from './utilities';
import { Pagination } from './../models/pagination.interface';
import {
  BackendService,
  FilterChangedArgs,
  GraphqlCursorPaginationOption,
  GraphqlDatasetFilter,
  GraphqlFilteringOption,
  GraphqlPaginationOption,
  GraphqlServiceOption,
  GraphqlSortingOption,
  PaginationChangedArgs,
  SortChangedArgs,
  SortDirection
} from './../models/index';
import QueryBuilder from './graphqlQueryBuilder';
import { GridOption } from '../models/gridOption.interface';

// timer for keeping track of user typing waits
let timer: any;
const DEFAULT_FILTER_TYPING_DEBOUNCE = 750;
const DEFAULT_ITEMS_PER_PAGE = 25;

@inject(I18N)
export class GraphqlService implements BackendService {
  options: GraphqlServiceOption;
  pagination: Pagination | undefined;
  defaultOrderBy: GraphqlSortingOption = { field: 'id', direction: SortDirection.ASC };
  defaultPaginationOptions: GraphqlPaginationOption | GraphqlCursorPaginationOption = {
    first: DEFAULT_ITEMS_PER_PAGE,
    offset: 0
  };

  constructor(private i18n: I18N) { }

  /**
   * Build the GraphQL query, since the service include/exclude cursor, the output query will be different.
   * @param serviceOptions GraphqlServiceOption
   */
  buildQuery() {
    if (!this.options || !this.options.datasetName || (!this.options.columnIds && !this.options.dataFilters && !this.options.columnDefinitions)) {
      throw new Error('GraphQL Service requires "datasetName" & ("dataFilters" or "columnDefinitions") properties for it to work');
    }
    const queryQb = new QueryBuilder('query');
    const datasetQb = new QueryBuilder(this.options.datasetName);
    const pageInfoQb = new QueryBuilder('pageInfo');
    const dataQb = (this.options.isWithCursor) ? new QueryBuilder('edges') : new QueryBuilder('nodes');

    // get all the columnds Ids for the filters to work
    let columnIds: string[];
    if (this.options.columnDefinitions) {
      columnIds = Array.isArray(this.options.columnDefinitions) ? this.options.columnDefinitions.map((column) => column.field) : [];
    } else {
      columnIds = this.options.columnIds || this.options.dataFilters || [];
    }

    // Slickgrid also requires the "id" field to be part of DataView
    // push it to the GraphQL query if it wasn't already part of the list
    if (columnIds.indexOf('id') === -1) {
      columnIds.push('id');
    }

    const filters = this.buildFilterQuery(columnIds);

    if (this.options.isWithCursor) {
      // ...pageInfo { hasNextPage, endCursor }, edges { cursor, node { _filters_ } }
      pageInfoQb.find('hasNextPage', 'endCursor');
      dataQb.find(['cursor', { node: filters }]);
    } else {
      // ...pageInfo { hasNextPage }, nodes { _filters_ }
      pageInfoQb.find('hasNextPage');
      dataQb.find(filters);
    }

    datasetQb.find(['totalCount', pageInfoQb, dataQb]);

    // add dataset filters, could be Pagination and SortingFilters and/or FieldFilters
    const datasetFilters: GraphqlDatasetFilter = {
      ...this.options.paginationOptions,
      first: ((this.options.paginationOptions && this.options.paginationOptions.first) ? this.options.paginationOptions.first : ((this.pagination && this.pagination.pageSize) ? this.pagination.pageSize : null)) || this.defaultPaginationOptions.first
    };

    if (!this.options.isWithCursor) {
      datasetFilters.offset = ((this.options.paginationOptions && this.options.paginationOptions.hasOwnProperty('offset')) ? +this.options.paginationOptions['offset'] : 0);
    }

    if (this.options.sortingOptions && Array.isArray(this.options.sortingOptions) && this.options.sortingOptions.length > 0) {
      // orderBy: [{ field:x, direction: 'ASC' }]
      datasetFilters.orderBy = this.options.sortingOptions;
    }
    if (this.options.filteringOptions && Array.isArray(this.options.filteringOptions) && this.options.filteringOptions.length > 0) {
      // filterBy: [{ field: date, operator: '>', value: '2000-10-10' }]
      datasetFilters.filterBy = this.options.filteringOptions;
    }
    if (this.options.addLocaleIntoQuery) {
      // first: 20, ... locale: "en-CA"
      datasetFilters.locale = this.i18n.getLocale() || 'en';
    }

    // query { users(first: 20, orderBy: [], filterBy: [])}
    datasetQb.filter(datasetFilters);
    queryQb.find(datasetQb);

    const enumSearchProperties = ['direction:', 'field:', 'operator:'];
    return this.trimDoubleQuotesOnEnumField(queryQb.toString(), enumSearchProperties, this.options.keepArgumentFieldDoubleQuotes || false);
  }

  /**
   * From an input array of strings, we want to build a GraphQL query string.
   * The process has to take the dot notation and parse it into a valid GraphQL query
   * Following this SO answer https://stackoverflow.com/a/47705476/1212166
   *
   * INPUT
   *  ['firstName', 'lastName', 'billing.address.street', 'billing.address.zip']
   * OUTPUT
   * firstName, lastName, billing{address{street, zip}}
   * @param inputArray
   */
  buildFilterQuery(inputArray: string[]) {

    const set = (o: any = {}, a: any) => {
      const k = a.shift();
      o[k] = a.length ? set(o[k], a) : null;
      return o;
    };

    const output = inputArray.reduce((o: any, a: string) => set(o, a.split('.')), {});

    return JSON.stringify(output)
      .replace(/\"|\:|null/g, '')
      .replace(/^\{/, '')
      .replace(/\}$/, '');
  }

  initOptions(serviceOptions?: GraphqlServiceOption, pagination?: Pagination): void {
    this.options = serviceOptions || {};
    this.pagination = pagination;
  }

  /**
   * Get an initialization of Pagination options
   * @return Pagination Options
   */
  getInitPaginationOptions(): GraphqlDatasetFilter {
    return (this.options.isWithCursor) ? { first: (this.pagination ? this.pagination.pageSize : DEFAULT_ITEMS_PER_PAGE) } : { first: (this.pagination ? this.pagination.pageSize : DEFAULT_ITEMS_PER_PAGE), offset: 0 };
  }

  getDatasetName(): string {
    return this.options.datasetName || '';
  }

  /*
   * Reset the pagination options
   */
  resetPaginationOptions() {
    let paginationOptions;
    if (this.options.isWithCursor) {
      // first, last, after, before
      paginationOptions = {
        after: '',
        before: undefined,
        last: undefined
      } as GraphqlCursorPaginationOption;
    } else {
      // first, last, offset
      paginationOptions = (this.options.paginationOptions || this.getInitPaginationOptions()) as GraphqlPaginationOption;
      paginationOptions.offset = 0;
    }
    this.updateOptions({ paginationOptions });
  }

  updateOptions(serviceOptions?: GraphqlServiceOption) {
    this.options = { ...this.options, ...serviceOptions };
  }

  /*
   * FILTERING
   */
  onFilterChanged(event: Event, args: FilterChangedArgs): Promise<string> {
    const searchByArray: GraphqlFilteringOption[] = [];
    const serviceOptions: GridOption = args.grid.getOptions();
    const backendApi = serviceOptions.backendServiceApi || serviceOptions.onBackendEventApi;

    if (backendApi === undefined) {
      throw new Error('Something went wrong in the GraphqlService, "backendServiceApi" is not initialized');
    }

    // only add a delay when user is typing, on select dropdown filter it will execute right away
    let debounceTypingDelay = 0;
    if (event.type === 'keyup' || event.type === 'keydown') {
      debounceTypingDelay = backendApi.filterTypingDebounce || DEFAULT_FILTER_TYPING_DEBOUNCE;
    }

    const promise = new Promise<string>((resolve, reject) => {
      let searchValue: string | string[] | number[];

      if (!args || !args.grid) {
        throw new Error('Something went wrong when trying create the GraphQL Backend Service, it seems that "args" is not populated correctly');
      }

      // loop through all columns to inspect filters
      for (const columnId in args.columnFilters) {
        if (args.columnFilters.hasOwnProperty(columnId)) {
          const columnFilter = args.columnFilters[columnId];
          const columnDef = columnFilter.columnDef;
          if (!columnDef) {
            return;
          }
          const fieldName = columnDef.queryField || columnDef.field || columnDef.name || '';
          const searchTerms = (columnFilter ? columnFilter.searchTerms : null) || [];
          let fieldSearchValue = columnFilter.searchTerm;
          if (typeof fieldSearchValue === 'undefined') {
            fieldSearchValue = '';
          }

          if (typeof fieldSearchValue !== 'string' && !searchTerms) {
            throw new Error(`GraphQL filter searchTerm property must be provided as type "string", if you use filter with options then make sure your IDs are also string. For example: filter: {type: FilterType.select, collection: [{ id: "0", value: "0" }, { id: "1", value: "1" }]`);
          }

          fieldSearchValue = '' + fieldSearchValue; // make sure it's a string
          const matches = fieldSearchValue.match(/^([<>!=\*]{0,2})(.*[^<>!=\*])([\*]?)$/); // group 1: Operator, 2: searchValue, 3: last char is '*' (meaning starts with, ex.: abc*)
          let operator = columnFilter.operator || ((matches) ? matches[1] : '');
          searchValue = (!!matches) ? matches[2] : '';
          const lastValueChar = (!!matches) ? matches[3] : '';

          // no need to query if search value is empty
          if (fieldName && searchValue === '' && searchTerms.length === 0) {
            continue;
          }

          // when having more than 1 search term (we need to create a CSV string for GraphQL "IN" or "NOT IN" filter search)
          if (searchTerms && searchTerms.length > 0) {
            searchValue = searchTerms.join(',');
          } else {
            // escaping the search value
            searchValue = searchValue.replace(`'`, `''`); // escape single quotes by doubling them
            if (operator === '*' || lastValueChar === '*') {
              operator = (operator === '*') ? 'endsWith' : 'startsWith';
            }
          }

          searchByArray.push({
            field: fieldName,
            operator: mapOperatorType(operator),
            value: searchValue
          });
        }
      }

      this.updateOptions({ filteringOptions: searchByArray });

      // reset Pagination, then build the GraphQL query which we will use in the WebAPI callback
      // wait a minimum user typing inactivity before processing any query
      clearTimeout(timer);
      timer = setTimeout(() => {
        this.resetPaginationOptions();
        resolve(this.buildQuery());
      }, debounceTypingDelay);
    });

    return promise;
  }

  /*
   * PAGINATION
   * With cursor, the query can have 4 arguments (first, after, last, before), for example:
   *   users (first:20, after:"YXJyYXljb25uZWN0aW9uOjM=") {
   *     totalCount
   *     pageInfo {
   *       hasNextPage
   *       endCursor
   *     }
   *     edges {
   *       cursor
   *       node {
   *         name
   *         gender
   *       }
   *     }
   *   }
   * Without cursor, the query can have 3 arguments (first, last, offset), for example:
   *   users (first:20, offset: 10) {
   *     totalCount
   *     pageInfo {
   *       hasNextPage
   *     }
   *     nodes {
   *       name
   *       gender
   *     }
   *   }
   */
  onPaginationChanged(event: Event, args: PaginationChangedArgs) {
    let paginationOptions;
    const pageSize = +args.pageSize || 20;

    if (this.options.isWithCursor) {
      paginationOptions = {
        first: pageSize
      };
    } else {
      paginationOptions = {
        first: pageSize,
        offset: (args.newPage - 1) * pageSize
      };
    }

    this.updateOptions({ paginationOptions });

    // build the GraphQL query which we will use in the WebAPI callback
    return this.buildQuery();
  }

  /*
   * SORTING
   * we will use sorting as per a Facebook suggestion on a Github issue (with some small changes)
   * https://github.com/graphql/graphql-relay-js/issues/20#issuecomment-220494222
   */
  onSortChanged(event: Event, args: SortChangedArgs) {
    let sortByArray: GraphqlSortingOption[] = [];
    const sortColumns = (args.multiColumnSort) ? args.sortCols : new Array({ sortCol: args.sortCol, sortAsc: args.sortAsc });

    // build the orderBy array, it could be multisort, example
    // orderBy:[{field: lastName, direction: ASC}, {field: firstName, direction: DESC}]
    if (sortColumns && sortColumns.length === 0) {
      sortByArray = new Array(this.defaultOrderBy); // when empty, use the default sort
    } else {
      if (sortColumns) {
        for (const column of sortColumns) {
          const fieldName = column.sortCol.queryField || column.sortCol.field || column.sortCol.id;
          const direction = column.sortAsc ? SortDirection.ASC : SortDirection.DESC;
          sortByArray.push({
            field: fieldName,
            direction
          });
        }
      }
    }

    this.updateOptions({ sortingOptions: sortByArray });

    // build the GraphQL query which we will use in the WebAPI callback
    return this.buildQuery();
  }

  /**
   * A function which takes an input string and removes double quotes only
   * on certain fields are identified as GraphQL enums (except fields with dot notation)
   * For example let say we identified ("direction:", "sort") as word which are GraphQL enum fields
   * then the result will be:
   * FROM
   * query { users (orderBy:[{field:"firstName", direction:"ASC"} }]) }
   * TO
   * query { users (orderBy:[{field: firstName, direction: ASC}})}
   *
   * EXCEPTIONS (fields with dot notation "." which are inside a "field:")
   * these fields will keep double quotes while everything else will be stripped of double quotes
   * query { users (orderBy:[{field:"billing.street.name", direction: "ASC"} }
   * TO
   * query { users (orderBy:[{field:"billing.street.name", direction: ASC}}
   * @param inputStr input string
   * @param enumSearchWords array of enum words to filter
   * @returns outputStr output string
   */
  trimDoubleQuotesOnEnumField(inputStr: string, enumSearchWords: string[], keepArgumentFieldDoubleQuotes: boolean) {
    const patternWordInQuotes = `\s?((field:\s*)?".*?")`;
    let patternRegex = enumSearchWords.join(patternWordInQuotes + '|');
    patternRegex += patternWordInQuotes; // the last one should also have the pattern but without the pipe "|"
    // example with (field: & direction:):  /field:s?(".*?")|direction:s?(".*?")/
    const reg = new RegExp(patternRegex, 'g');

    return inputStr.replace(reg, (group1, group2, group3) => {
      // remove double quotes except when the string starts with a "field:"
      let removeDoubleQuotes = true;
      if (group1.startsWith('field:') && keepArgumentFieldDoubleQuotes) {
        removeDoubleQuotes = false;
      }
      const rep = removeDoubleQuotes ? group1.replace(/"/g, '') : group1;
      return rep;
    });
  }
}
