export interface Pagination {
  pageCount?: number;
  pageNumber?: number;
  pageSizes: number[];
  pageSize: number;
  totalItems?: number;
  dataFrom?: number;
  dataTo?: number;
}
