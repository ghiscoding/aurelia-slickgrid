import { IDisposable } from 'aurelia';

/**
 * A class that will be used for internal communication of parent-child
 *
 * All methods are abstract for typings purposes only
 */
export abstract class SlickgridEventAggregator {
  abstract publish(event: string, data: any): void;

  abstract subscribe(event: string, callback: (data: any) => void): IDisposable;
}
