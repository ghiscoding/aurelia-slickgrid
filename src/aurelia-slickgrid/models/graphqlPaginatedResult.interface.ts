import { Metrics } from './metrics.interface';
import { Statistic } from './statistic.interface';

export interface GraphqlPaginatedResult {
  data: {
    [datasetName: string]: {
      nodes: any[];
      pageInfo: {
        hasNextPage: boolean;
      };
      totalCount: number;
    }
  };

  metrics?: Metrics;

  /** @deprecated please use "metrics" instead */
  statistics?: Statistic;
}
