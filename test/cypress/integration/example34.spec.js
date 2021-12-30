/// <reference types="cypress" />

describe('Example 34 - Real-Time Stock Trading', { retries: 1 }, () => {
  const titles = ['Currency', 'Symbol', 'Market', 'Company', 'Type', 'Change', 'Price', 'Quantity', 'Amount', 'Price History', 'Execution Timestamp'];
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
      cy.get(`[style="top:${GRID_ROW_HEIGHT * i}px"] > .slick-cell:nth(0)`).contains(/CAD|USD$/);
      cy.get(`[style="top:${GRID_ROW_HEIGHT * i}px"] > .slick-cell:nth(4)`).contains(/Buy|Sell$/);
      cy.get(`[style="top:${GRID_ROW_HEIGHT * i}px"] > .slick-cell:nth(5)`).contains(/\$\(?[0-9\.]*\)?/);
      cy.get(`[style="top:${GRID_ROW_HEIGHT * i}px"] > .slick-cell:nth(6)`).contains(/\$[0-9\.]*/);
      cy.get(`[style="top:${GRID_ROW_HEIGHT * i}px"] > .slick-cell:nth(7)`).contains(/\d$/);
      cy.get(`[style="top:${GRID_ROW_HEIGHT * i}px"] > .slick-cell:nth(8)`).contains(/\$[0-9\.]*/);
    }
  });

  it('should find multiple green & pink backgrounds to show gains & losses when in real-time mode', () => {
    cy.get('#refreshRateRange').invoke('val', 5).trigger('change');

    cy.get('.changed-gain').should('have.length.gt', 2);
    cy.get('.changed-loss').should('have.length.gt', 2);
  });

  it('should NOT find any green neither pink backgrounds when in real-time is stopped', () => {
    cy.get('[data-test="highlight-input"]').type('{backspace}{backspace}');
    cy.get('[data-test="stop-btn"]').click();

    cy.wait(5);
    cy.get('.changed-gain').should('have.length', 0);
    cy.get('.changed-loss').should('have.length', 0);
    cy.wait(1);
    cy.get('.changed-gain').should('have.length', 0);
    cy.get('.changed-loss').should('have.length', 0);
  });


});
