import { inlineView } from 'aurelia-framework';

@inlineView(`<template><span style="font-weight: bold" innerHTML.bind="item.assignee.name"></span></template>`)
export class CustomTitleFormatter {
  item: any;

  bind(_bindingContext: any, overrideContext: any) {
    this.item = overrideContext.parentOverrideContext.bindingContext.model;
  }
}
