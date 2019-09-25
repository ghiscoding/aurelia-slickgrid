import { GraphqlResult } from '../models/graphqlResult.interface';
import { BackendServiceApi } from '../models/backendServiceApi.interface';
import { GridOption, EmitterType } from '../models/index';

/**
 * Execute the backend callback, which are mainly the "process" & "postProcess" methods.
 * Also note that "preProcess" was executed prior to this callback
 */
export async function executeBackendCallback(query: string, args: any, startTime: Date, gridOptions: GridOption, emitActionChangedCallback: (type: EmitterType) => void) {
  const backendApi = gridOptions && gridOptions.backendServiceApi;

  if (backendApi) {
    // emit an onFilterChanged event when it's not called by a clear filter
    if (args && !args.clearFilterTriggered) {
      emitActionChangedCallback(EmitterType.remote);
    }

    // the processes can be Observables (like HttpClient) or Promises
    const process = backendApi.process(query);
    if (process instanceof Promise && process.then) {
      process.then((processResult: GraphqlResult | any) => executeBackendProcessesCallback(startTime, processResult, backendApi, gridOptions))
        .catch((error: any) => onBackendError(error, backendApi));
    }
  }
}

/** Execute the Backend Processes Callback, that could come from an Observable or a Promise callback */
export function executeBackendProcessesCallback(startTime: Date, processResult: GraphqlResult | any, backendApi: BackendServiceApi, gridOptions: GridOption): GraphqlResult | any {
  const endTime = new Date();

  // define what our internal Post Process callback, only available for GraphQL Service for now
  // it will basically refresh the Dataset & Pagination removing the need for the user to always create his own PostProcess every time
  if (processResult && backendApi && backendApi.internalPostProcess) {
    backendApi.internalPostProcess(processResult);
  }

  // send the response process to the postProcess callback
  if (backendApi.postProcess !== undefined) {
    if (processResult instanceof Object) {
      processResult.metrics = {
        startTime,
        endTime,
        executionTime: endTime.valueOf() - startTime.valueOf(),
        itemCount: gridOptions && gridOptions.pagination && gridOptions.pagination.totalItems,
        totalItemCount: gridOptions && gridOptions.pagination && gridOptions.pagination.totalItems
      };
      // @deprecated
      processResult.statistics = processResult.metrics;
    }
    backendApi.postProcess(processResult);
  }
}

/** On a backend service api error, we will run the "onError" if there is 1 provided or just throw back the error when nothing is provided */
export function onBackendError(e: any, backendApi: BackendServiceApi) {
  if (backendApi && backendApi.onError) {
    backendApi.onError(e);
  } else {
    throw e;
  }
}
