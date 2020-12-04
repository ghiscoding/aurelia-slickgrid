import { Subscription } from 'aurelia-event-aggregator';

/**
 * Loop through and dispose of all subscriptions when they are disposable
 * @param subscriptions
 * @return empty array
 */
export function disposeAllSubscriptions(subscriptions: Subscription[]) {
  subscriptions.forEach((subscription: Subscription) => {
    if (subscription && subscription.dispose) {
      subscription.dispose();
    }
  });
  return [];
}
