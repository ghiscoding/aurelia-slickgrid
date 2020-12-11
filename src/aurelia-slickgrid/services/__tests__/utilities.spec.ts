import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { disposeAllSubscriptions } from '../utilities';

describe('Service/Utilies', () => {
  describe('disposeAllSubscriptions method', () => {
    it('should return original array when array of subscriptions is empty', () => {
      const output = disposeAllSubscriptions([]);
      expect(output).toEqual([]);
    });

    it('should return unique values when input array has duplicate objects', () => {
      const subscriptions: Subscription[] = [];
      const ea1 = new EventAggregator();
      const ea2 = new EventAggregator();
      subscriptions.push(ea1.subscribe('test', () => { }), ea2.subscribe('test', () => { }));
      const output = disposeAllSubscriptions(subscriptions);
      expect(output).toHaveLength(0);
    });
  });
});
