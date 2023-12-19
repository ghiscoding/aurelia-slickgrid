import { EventAggregator, IDisposable } from 'aurelia';
import { disposeAllSubscriptions } from '../utilities';

describe('Service/Utilies', () => {
  describe('disposeAllSubscriptions method', () => {
    it('should return original array when array of subscriptions is empty', () => {
      const output = disposeAllSubscriptions([]);
      expect(output).toEqual([]);
    });

    it('should return unique values when input array has duplicate objects', () => {
      const subscriptions: IDisposable[] = [];
      const ea1 = new EventAggregator();
      const ea2 = new EventAggregator();
      subscriptions.push(ea1.subscribe('test', () => { }), ea2.subscribe('test', () => { }));
      const output = disposeAllSubscriptions(subscriptions);
      expect(output).toHaveLength(0);
    });

    it('should be able to unsubscribe all PubSub events or anything that has an unsubscribe method', () => {
      const mockUnsubscribe1 = jest.fn();
      const mockUnsubscribe2 = jest.fn();
      const mockSubscription1 = { unsubscribe: mockUnsubscribe1 };
      const mockSubscription2 = { unsubscribe: mockUnsubscribe2 };
      const mockSubscriptions = [mockSubscription1, mockSubscription2];

      disposeAllSubscriptions(mockSubscriptions);

      expect(mockUnsubscribe1).toHaveBeenCalledTimes(1);
      expect(mockUnsubscribe2).toHaveBeenCalledTimes(1);
    });
  });
});
