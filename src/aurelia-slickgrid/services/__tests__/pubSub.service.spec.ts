import 'jest-extended';
import { EventNamingStyle } from '@slickgrid-universal/common';
import { EventAggregator } from 'aurelia-event-aggregator';

import { PubSubService } from '../pubSub.service';

describe('PubSub Service', () => {
  let ea: EventAggregator;
  let service: PubSubService;

  beforeEach(() => {
    ea = new EventAggregator();
    service = new PubSubService(ea);
    service.eventNamingStyle = EventNamingStyle.camelCase;
  });

  afterEach(() => {
    service.unsubscribeAll();
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  describe('publish/subscribe methods', () => {
    afterEach(() => {
      service.unsubscribeAll();
    });

    it('should call "dispatchCustomEvent" and expect "getEventNameByNamingConvention" and "dispatchEvent" to be called', () => {
      const getEventNameSpy = jest.spyOn(service, 'getEventNameByNamingConvention');
      const input = document.createElement('input');
      const dispatchSpy = jest.spyOn(input, 'dispatchEvent');

      service.dispatchCustomEvent(input, 'change', 'John', 'pre');

      expect(getEventNameSpy).toHaveBeenCalledWith('change', 'pre');
      expect(dispatchSpy).toHaveBeenCalledWith(new CustomEvent('change', { bubbles: true, detail: { target: { value: 'John' } } }));
    });

    it('should PubSub "publish" and expect EventAggregator publish to be called', () => {
      const eaSpy = jest.spyOn(ea, 'publish');
      service.publish('onchange', { name: 'John' });
      expect(eaSpy).toHaveBeenCalledWith('onchange', { name: 'John' });
    });

    it('should PubSub "subscribe" and expect EventAggregator subscribe to be called', () => {
      const eaSpy = jest.spyOn(ea, 'subscribe');
      const callbackMock = jest.fn();

      service.subscribe('onchange', callbackMock);

      expect(eaSpy).toHaveBeenCalledWith('onchange', callbackMock);
    });

    it('should display a not implemented when calling "unsubscribe" method', () => {
      expect(() => PubSubService.prototype.unsubscribe('event1', () => { })).toThrow('The method "unsubscribe" is not implemented, please use "unsubscribeAll()" instead');
    });
  });

  describe('getEventNameByNamingConvention method', () => {
    it('should return an event name as a camelCase string without prefix', () => {
      service.eventNamingStyle = EventNamingStyle.camelCase;
      const output = service.getEventNameByNamingConvention('onClick', '');
      expect(output).toBe('onClick');
    });

    it('should return an event name as a kebab-case string without prefix', () => {
      service.eventNamingStyle = EventNamingStyle.kebabCase;
      const output = service.getEventNameByNamingConvention('onClick', '');
      expect(output).toBe('on-click');
    });

    it('should return an event name as a lowercase string without prefix', () => {
      service.eventNamingStyle = EventNamingStyle.lowerCase;
      const output = service.getEventNameByNamingConvention('onClick', '');
      expect(output).toBe('onclick');
    });

    it('should return an event name as a lowercase (without "on" as prefix) string without prefix', () => {
      service.eventNamingStyle = EventNamingStyle.lowerCaseWithoutOnPrefix;
      const output = service.getEventNameByNamingConvention('onClick', '');
      expect(output).toBe('click');
    });

    it('should return an event name as a camelCase string with a prefix', () => {
      service.eventNamingStyle = EventNamingStyle.camelCase;
      const output = service.getEventNameByNamingConvention('onClick', 'pre');
      expect(output).toBe('preOnClick');
    });

    it('should return an event name as a kebab-case string with a prefix', () => {
      service.eventNamingStyle = EventNamingStyle.kebabCase;
      const output = service.getEventNameByNamingConvention('onClick', 'pre');
      expect(output).toBe('pre-on-click');
    });

    it('should return an event name as a lowercase string with a prefix', () => {
      service.eventNamingStyle = EventNamingStyle.lowerCase;
      const output = service.getEventNameByNamingConvention('onClick', 'pre');
      expect(output).toBe('preonclick');
    });

    it('should return an event name as a lowercase (without "on" as prefix) string with a prefix', () => {
      service.eventNamingStyle = EventNamingStyle.lowerCaseWithoutOnPrefix;
      const output = service.getEventNameByNamingConvention('onClick', 'pre');
      expect(output).toBe('preclick');
    });
  });
});
