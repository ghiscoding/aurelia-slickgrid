The implementation of a GraphQL Service requires a certain structure to follow for `Aurelia-Slickgrid` to work correctly (it will fail if your GraphQL Schema is any different than what is shown below).

**NOTE** Since this is still in beta testing, only the option (without cursor) is currently supported. 

### Implementation
For the implementation in your code, refer to the [GraphQL Service](/ghiscoding/aurelia-slickgrid/wiki/GraphQL) section.

### Without Cursor
Pagination without cursor, this is the simplest implementation and is what we use on our side. The query can have any of the 3 arguments:
- `first`: integer representing how many rows of data to get from the start of dataset
- `last`: integer representing how many rows of data to get from the end of dataset
- `offset`: integer representing how many to skip 

For example
```javascript
  users (first:20, offset: 10) {
    totalCount
    pageInfo {
      hasNextPage
    }
    nodes {
      name
      gender
    }
  }
```

### With Cursor (not fully supported yet)
Pagination with cursor, the query can have any of the 4 arguments:
- `first`: integer representing how many rows of data to get from the start of dataset
- `after`: pull data starting at `cursor` "x", where "x" is the last item `cursor`
- `last`: integer representing how many rows of data to get from the end of dataset
- `before`: pull data before a `cursor` "x", where "x" is the last item `cursor`

For example
```javascript
  users (first:20, after:"YXJyYXljb25uZWN0aW9uOjM=") {
    totalCount
    pageInfo {
      hasNextPage
      endCursor
    }
    edges {
      cursor
      node {
        name
        gender
      }
    }
  }
```