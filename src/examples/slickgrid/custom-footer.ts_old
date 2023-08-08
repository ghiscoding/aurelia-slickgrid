import { inlineView } from 'aurelia-framework';

@inlineView(`<template>
  <button click.delegate="clickMe()">I'm a button from an Aurelia custom element (click me)</button>
  <div if.bind="clickedTimes">You've clicked me \${clickedTimes} time(s)</div>
</template>`)
export class CustomFooter {
  clickedTimes = 0;

  clickMe() {
    this.clickedTimes++;
  }
}
