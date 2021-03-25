import { EventAggregator } from 'aurelia-event-aggregator';
import { autoinject, bindable, DOM } from 'aurelia-framework';

@autoinject()
export class FilterSelect {
  @bindable selectedItem: any;
  selectedId = '';
  collection: any; // this will be filled by the collection of your column definition
  itemMatcher = (a: any, b: any) => a && b && a.id === b.id;

  constructor(private elm: Element, private ea: EventAggregator) {
    console.log(this.ea);
  }

  bind(bindingContext: any, overrideContext: any) {
    console.log(bindingContext, overrideContext);
  }

  selectedItemChanged(newItem: any) {
    console.log(newItem);
    if (newItem) {
      this.elm.dispatchEvent(DOM.createCustomEvent('on-select-changed', { detail: newItem }));
    }
  }
}
