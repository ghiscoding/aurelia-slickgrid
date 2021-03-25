import { Subscription } from 'aurelia-event-aggregator';
import { EventSubscription } from '@slickgrid-universal/common';

/**
 * Loop through and dispose of all subscriptions when they are disposable
 * @param subscriptions
 * @return empty array
 */
export function disposeAllSubscriptions(subscriptions: Array<EventSubscription | Subscription>): Array<EventSubscription | Subscription> {
  if (Array.isArray(subscriptions)) {
    while (subscriptions.length > 0) {
      const subscription = subscriptions.pop() as EventSubscription | Subscription;
      if ((subscription as Subscription)?.dispose) {
        (subscription as Subscription).dispose();
      } else if ((subscription as EventSubscription)?.unsubscribe) {
        (subscription as EventSubscription).unsubscribe!();
      }
    }
  }
  return subscriptions;
}
