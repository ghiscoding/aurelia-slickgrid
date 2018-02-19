GraphQL Backend Service (for Pagination purposes) to get data from a backend server with the help of GraphQL.

### Note
Use it when you need to support **Pagination** (that is when your dataset is rather large, more than 5k rows) with a GraphQL endpoint. If your dataset is small (less than 5k rows), then go with a [regular grid](https://ghiscoding.github.io/aurelia-slickgrid/#/slickgrid) with the "dataset.bind" property. SlickGrid can easily handle million of rows using a DataView object, but personally when the dataset is known to be large, I usually use a backend service (OData or GraphQL) and when it's small I go with a [regular grid](https://ghiscoding.github.io/aurelia-slickgrid/#/slickgrid). 

## Implementation
To connect a backend service into `Aurelia-Slickgrid`, you simply need to modify your `gridOptions` and add a declaration of `onBackendEventChanged`. See below for the signature and an example further down below.

### Demo
[Demo Page](https://ghiscoding.github.io/aurelia-slickgrid/#/slickgrid/example6) / [Demo ViewModel](/ghiscoding/aurelia-slickgrid/blob/master/aurelia-slickgrid/src/examples/slickgrid/example6.ts)

### TypeScript Signature
```javascript
onBackendEventApi: {
  // On init (or on page load), what action to perform?
  onInit?: (query: string) => Promise<any> | Observable<any>;

  // Before executing the query, what action to perform? For example, start a spinner
  preProcess?: () => void;

  // On Processing, we get the query back from the service, and we need to provide a Promise/Observable. For example: this.http.get(myGraphqlUrl)
  process: (query: string) => Promise<any> | Observable<any>;

  // After executing the query, what action to perform? For example, stop the spinner
  postProcess: (response: any) => void;

  // Backend Service instance (could be OData or GraphQL Service)
  service: BackendService;

  // Throttle the amount of requests sent to the backend. Default to 750ms
  filterTypingDebounce?: number;
}
```
As you can see, you mainly need to define which service to use (GridODataService or GraphQLService) and finally add the `process` and `postProcess` callback. 

#### Grid Definition & call of `onBackendEventApi`
##### Notes
- Pagination is optional and if not defined, it will use what is set in the  [Aurelia-Slickgrid - Global Options](https://github.com/ghiscoding/aurelia-slickgrid/blob/master/src/app/modules/aurelia-slickgrid/global-grid-options.ts)
- `onInit` is optional and is there to initialize the grid with data on first page load (typically the same call as `process`)
  - you could load the grid yourself outside of the `gridOptions` which is why it's optional
- `filterTypingDebounce` is a timer (in milliseconds) that waits for user input pause before querying the backend server
  - this is meant to throttle the amount of requests sent to the backend (we don't really want to query every keystroke)
  - 700ms is the default when not provided

##### Code
```javascript
import { inject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';
import { GraphqlService } from 'aurelia-slickgrid';

@inject(HttpClient, GraphqlService)
export class Example {
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset = [];
  http;
  graphqlService;

  constructor(http, graphqlService) {
    this.http = http;
    this.graphqlService = graphqlService;

    // define the grid options & columns and then create the grid itself
    this.defineGrid();
  }

  defineGrid() {
    this.columnDefinitions = [
      // your column definitions
    ];

    this.gridOptions = {
      enableFiltering: true,
      enablePagination: true,
      pagination: {
        pageSizes: [10, 15, 20, 25, 30, 40, 50, 75, 100],
        pageSize: defaultPageSize,
        totalItems: 0
      },
      onBackendEventApi: {
        preProcess: () => this.displaySpinner(true),
        process: (query) => this.getCustomerApiCall(query),
        postProcess: (response) => {
          this.displaySpinner(false);
          this.getCustomerCallback(response);
        },
        filterTypingDebounce: 700,
        service: this.graphqlService
      }
    };
  }

  // Web API call
  getCustomerApiCall(graphqlQuery) {
    return this.http.createRequest(`/api/getCustomers?${graphqlQuery}`).asGet().send();
  }
```

## GraphQL Server Definition
For the implementation of all 3 actions (filtering, sorting, pagination) with your GraphQL Server, please refer to the sections below to configure your GraphQL Schema accordingly.
- [Pagination](/ghiscoding/aurelia-slickgrid/wiki/GraphQL-Pagination)
- [Sorting](/ghiscoding/aurelia-slickgrid/wiki/GraphQL-Sorting)
- [Filtering](/ghiscoding/aurelia-slickgrid/wiki/GraphQL-Filtering)