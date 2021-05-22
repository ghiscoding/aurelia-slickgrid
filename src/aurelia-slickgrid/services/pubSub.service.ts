import {
  EventNamingStyle,
  PubSubService as UniversalPubSubService,
  titleCase,
  toKebabCase
} from '@slickgrid-universal/common';
import { Disposable, DOM, inject, singleton } from 'aurelia-framework';
import { Subscription } from 'aurelia-event-aggregator';

import { SlickgridEventAggregator } from '../custom-elements/slickgridEventAggregator';

/**
 * This is a Pub/Sub Service Wrapper for Slickgrid-Universal monorepo lib to work properly,
 * it must implement Slickgrid-Universal PubSubService interface to work properly
 */
@singleton(true)
@inject(SlickgridEventAggregator)
export class PubSubService implements UniversalPubSubService {
  private _subscriptions: Subscription[] = [];

  eventNamingStyle = EventNamingStyle.camelCase;

  constructor(private readonly pluginEa: SlickgridEventAggregator) { }

  /** Dispatch of Custom Event, which by default will bubble & is cancelable */
  dispatchCustomEvent<T = any>(element: Element, eventName: string, data?: T, eventPrefix = '', isBubbling = true, isCancelable = true): boolean {
    const eventNameByConvention = this.getEventNameByNamingConvention(eventName, eventPrefix);
    const eventInit: CustomEventInit<T> = { bubbles: isBubbling, cancelable: isCancelable };
    if (data) {
      eventInit.detail = data;
    }
    return element.dispatchEvent(DOM.createCustomEvent(eventNameByConvention, eventInit));
  }

  /**
   * Method to publish a message via the Aurelia Event Aggregator.
   * We return the dispatched event in a Promise with a delayed cycle and we do this because
   * most framework require a cycle before the binding is processed and binding a spinner end up showing too late
   * for example this is used for these events: onBeforeFilterClear, onBeforeFilterChange, onBeforeToggleTreeCollapse, onBeforeSortChange
   * @param event The event or channel to publish to.
   * @param data The data to publish on the channel.
   */
  publish<T = any>(eventName: string, data?: T): Promise<boolean> {
    const eventNameByConvention = this.getEventNameByNamingConvention(eventName, '');

    return new Promise(resolve => {
      this.pluginEa.publish(eventNameByConvention, data);
      setTimeout(() => resolve(true), 0);
    });
  }

  /**
   * Subscribes to a message channel or message type via the Aurelia Event Aggregator
   * @param event The event channel or event data type.
   * @param callback The callback to be invoked when the specified message is published.
   * @return possibly a Subscription
   */
  subscribe<T = any>(eventName: string, callback: (data: T) => void): Disposable {
    const eventNameByConvention = this.getEventNameByNamingConvention(eventName, '');
    const subscription = this.pluginEa.subscribe(eventNameByConvention, callback);
    this._subscriptions.push(subscription);
    return subscription;
  }

  unsubscribe() {
    throw new Error('The method "unsubscribe" is not implemented, please use "unsubscribeAll()" instead');
  }

  /**
   * Unsubscribes all subscriptions that currently exists
   * @param subscriptions - optionally pass the array of all subscriptions that we want to unsubscribe from
   * @returns - Subscriptions array which should be empty
   */
  unsubscribeAll(subscriptions?: Subscription[]): Subscription[] {
    let allSubscriptions = Array.isArray(subscriptions) ? subscriptions : this._subscriptions;

    while (allSubscriptions.length > 0) {
      const subscription = allSubscriptions.pop();
      if (subscription?.dispose) {
        subscription.dispose();
      }
    }
    allSubscriptions = [];
    return allSubscriptions;
  }

  /** Get the event name by the convention defined, it could be: all lower case, camelCase, PascalCase or kebab-case */
  getEventNameByNamingConvention(inputEventName: string, eventNamePrefix: string) {
    let outputEventName = '';

    switch (this.eventNamingStyle) {
      case EventNamingStyle.camelCase:
        outputEventName = (eventNamePrefix !== '') ? `${eventNamePrefix}${titleCase(inputEventName)}` : inputEventName;
        break;
      case EventNamingStyle.kebabCase:
        outputEventName = (eventNamePrefix !== '') ? `${eventNamePrefix}-${toKebabCase(inputEventName)}` : toKebabCase(inputEventName);
        break;
      case EventNamingStyle.lowerCase:
        outputEventName = `${eventNamePrefix}${inputEventName}`.toLowerCase();
        break;
      case EventNamingStyle.lowerCaseWithoutOnPrefix:
        outputEventName = `${eventNamePrefix}${inputEventName.replace(/^on/, '')}`.toLowerCase();
        break;
    }
    return outputEventName;
  }
}
