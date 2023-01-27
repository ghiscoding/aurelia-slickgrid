// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
import '@4tw/cypress-drag-drop';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      // triggerHover: (elements: NodeListOf<HTMLElement>) => void;
      saveLocalStorage: () => void;
      restoreLocalStorage: () => void;
    }
  }
}

// Cypress.Commands.add('triggerHover', (elements: NodeListOf<HTMLElement>) => {
//   elements.each((index, element) => {
//     fireEvent(element, 'mouseover');
//   });

//   function fireEvent(element, event) {
//     if (element.fireEvent) {
//       element.fireEvent('on' + event);
//     } else {
//       var evObj = document.createEvent('Events');

//       evObj.initEvent(event, true, false);

//       element.dispatchEvent(evObj);
//     }
//   }
// });

const LOCAL_STORAGE_MEMORY: any = {};

Cypress.Commands.add('saveLocalStorage', () => {
  Object.keys(localStorage).forEach(key => {
    LOCAL_STORAGE_MEMORY[key] = localStorage[key];
  });
});

Cypress.Commands.add('restoreLocalStorage', () => {
  Object.keys(LOCAL_STORAGE_MEMORY).forEach(key => {
    localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key]);
  });
});

