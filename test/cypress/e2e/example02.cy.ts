import { removeExtraSpaces } from '../plugins/utilities';

describe('Example 2 - Grid with Formatters', () => {
  it('should display Example title', () => {
    cy.visit(`${Cypress.config('baseUrl')}/example2`);
    cy.get('h2').should('contain', 'Example 2: Grid with Formatters');
  });

  it('should show a custom text in the grid footer left portion', () => {
    cy.get('#slickGridContainer-grid2')
      .find('.slick-custom-footer')
      .find('.left-footer')
      .contains('custom footer text');
  });

  it('should have some metrics shown in the grid footer', () => {
    cy.get('#slickGridContainer-grid2')
      .find('.slick-custom-footer')
      .find('.right-footer')
      .should($span => {
        const text = removeExtraSpaces($span.text()); // remove all white spaces
        expect(text).to.eq('500 items');
      });
  });
});
