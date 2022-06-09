/// <reference types="cypress" />

describe('Example 26 - Use of Aurelia Custom Elements', { retries: 1 }, () => {
  const fullTitles = ['Title', 'Assignee', 'Assignee with Aurelia Component', 'Duration (days)', '% Complete', 'Start', 'Finish'];

  it('should display Example title', () => {
    cy.visit(`${Cypress.config('baseUrl')}/slickgrid/example26`);
    cy.get('h2').should('contain', 'Example 26: Use of Aurelia Custom Elements');
  });

  it('should have exact column titles in grid', () => {
    cy.get('#slickGridContainer-grid26')
      .find('.slick-header-columns')
      .children()
      .each(($child, index) => expect($child.text()).to.eq(fullTitles[index]));
  });

  it('should expect a Custom Aurelia Select Dropdown Editor then select 1st option of 3 Assignee names', () => {
    cy.get('.slick-row:nth(0)')
      .children('.slick-cell:nth(1)')
      .click();

    cy.get('.slick-cell select.form-control option')
      .should('have.length', 4);

    cy.get('.slick-cell select.form-control')
      .select('John');

    cy.get('.slick-row:nth(1)')
      .children('.slick-cell:nth(1)')
      .click();

    cy.get('.slick-cell select.form-control')
      .select('Pierre');
  });

  it('should have 2 first rows with "Assignee" of "John" (0) then "Pierre" (1)', () => {
    const tasks = [['Task 0', 'John', 'John'], ['Task 1', 'Pierre', 'Pierre']];

    cy.get('#grid26')
      .find('.slick-row')
      .each(($row, index) => {
        if (index > tasks.length - 1) {
          return;
        }
        cy.wrap($row).children('.slick-cell:nth(0)').should('contain', tasks[index][0]);
        cy.wrap($row).children('.slick-cell:nth(1)').should('contain', tasks[index][1]);
        if (index === 0) {
          // cy.wrap($row).children('.slick-cell:nth(2)').should('contain', '...');
        } else {
          cy.wrap($row).children('.slick-cell:nth(2)').should('contain', tasks[index][2]);
        }
      });
  });
});
