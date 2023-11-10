

describe('Example 29 - Header and Footer slots', () => {
  it('should display a custom header as slot', () => {
    cy.visit(`${Cypress.config('baseUrl')}/slickgrid/example29`);
    cy.get('div[slot="slickgrid-header"]')
      .find('h3')
      .contains('Grid with header and footer slot');
  });

  it('should render a footer slot', () => {
    cy.get('custom-footer[slot="slickgrid-footer"]')
      .should('exist');
  });

  it('should render a custom element inside footer slot', () => {
    cy.get('custom-footer[slot="slickgrid-footer"]')
      .find('button')
      .click()
      .click()
      .click()
      .siblings('div')
      .should('contain', '3 time(s)');
  });
});
