import { bindable, autoinject } from 'aurelia-framework';

@autoinject()
export class DetailViewCustomElement {
  @bindable() model;

  bind(bindingContext, overrideContext) {
    if (bindingContext.model) {
      this.model = bindingContext.model;
    } else if (overrideContext && overrideContext.bindingContext && overrideContext.bindingContext.model) {
      this.model = overrideContext.bindingContext.model;
    } else if (overrideContext && overrideContext.parentOverrideContext && overrideContext.parentOverrideContext.bindingContext && overrideContext.parentOverrideContext.bindingContext.model) {
      this.model = overrideContext.parentOverrideContext.bindingContext.model;
    }
  }

  sayHello(name: string) {
    if (typeof name === 'string') {
      alert(`Assignee on this task is: ${name.toUpperCase()}`);
    } else {
      alert('No one is assigned to this task.');
    }
  }
}
