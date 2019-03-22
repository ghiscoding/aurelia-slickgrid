/// <reference types="Cypress" />

describe('Example 1 - Basic Grids', () => {
  it('should display Example 1 title', () => {
    cy.visit(`${Cypress.config('baseUrl')}`);
    cy.get('h2').should('contain', 'Example 1: Basic Grid');
  });

  it('should have 2 grids of size 800 by 300px', () => {
    cy.get('#slickGridContainer-grid1')
      .should('have.css', 'width', '800px');

    cy.get('#slickGridContainer-grid1 > .slickgrid-container')
      .should('have.css', 'height', '300px');

    cy.get('#slickGridContainer-grid2')
      .should('have.css', 'width', '800px');

    cy.get('#slickGridContainer-grid2 > .slickgrid-container')
      .should('have.css', 'height', '300px');
  });
});
