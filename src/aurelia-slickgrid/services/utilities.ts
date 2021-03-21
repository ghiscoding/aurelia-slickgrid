import { Subscription } from 'aurelia-event-aggregator';
import { Subscription as SubscriptionRxJs, } from '@slickgrid-universal/common';
/**
 * Loop through and dispose of all subscriptions when they are disposable
 * @param subscriptions
 * @return empty array
 */
export function disposeAllSubscriptions(subscriptions: Array<Subscription | SubscriptionRxJs>) {
  subscriptions.forEach((subscription: Subscription) => {
    if (subscription && subscription.dispose) {
      subscription.dispose();
    }
  });
  return [];
}
