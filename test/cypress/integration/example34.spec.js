/// <reference types="cypress" />

describe('Example 34 - Real-Time Stock Trading', { retries: 1 }, () => {
  const titles = ['Currency', 'Symbol', 'Company', 'Type', 'Change', 'Price', 'Quantity', 'Amount', 'Price History', 'Execution Timestamp'];
  const GRID_ROW_HEIGHT = 35;

  it('should display Example title', () => {
    cy.visit(`${Cypress.config('baseExampleUrl')}/example34`);
    cy.get('h2').should('contain', 'Example 34: Real-Time Stock Trading');
  });

  it('should have exact column titles on 1st grid', () => {
    cy.get('#grid34')
      .find('.slick-header-columns')
      .children()
      .each(($child, index) => expect($child.text()).to.eq(titles[index]));
  });

  it('should check first 5 rows and expect certain data', () => {
    for (let i = 0; i < 5; i++) {
      cy.get(`[style="top:${GRID_ROW_HEIGHT * 0}px"] > .slick-cell:nth(0)`).contains(/CAD|USD$/);
      cy.get(`[style="top:${GRID_ROW_HEIGHT * 0}px"] > .slick-cell:nth(3)`).contains(/Buy|Sell$/);
      cy.get(`[style="top:${GRID_ROW_HEIGHT * 0}px"] > .slick-cell:nth(4)`).contains(/\$\(?[0-9\.]*\)?/);
      cy.get(`[style="top:${GRID_ROW_HEIGHT * 0}px"] > .slick-cell:nth(5)`).contains(/\$[0-9\.]*/);
      cy.get(`[style="top:${GRID_ROW_HEIGHT * 0}px"] > .slick-cell:nth(6)`).contains(/\d$/);
      cy.get(`[style="top:${GRID_ROW_HEIGHT * 0}px"] > .slick-cell:nth(7)`).contains(/\$[0-9\.]*/);
    }
  });
});
