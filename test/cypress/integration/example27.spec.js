/// <reference types="cypress" />

function removeExtraSpaces(text) {
  return `${text}`.replace(/\s+/g, ' ').trim();
}

describe('Example 27 - Tree Data (from a Hierarchical Dataset)', () => {
  const GRID_ROW_HEIGHT = 45;
  const titles = ['Title', 'Duration', '% Complete', 'Start', 'Finish', 'Effort Driven'];

  it('should display Example title', () => {
    cy.visit(`${Cypress.config('baseExampleUrl')}/example27`);
    cy.get('h2').should('contain', 'Example 27: Tree Data (from a flat dataset with parentId references)');
  });

  it('should have exact column titles in grid', () => {
    cy.get('#grid27')
      .find('.slick-header-columns')
      .children()
      .each(($child, index) => expect($child.text()).to.eq(titles[index]));
  });

  it('should have a Grid Preset Filter on 3rd column "% Complete" and expect all rows to be filtered as well', () => {
    cy.get('.input-group-text.rangeOutput_percentComplete')
      .contains('25');

    cy.get('.search-filter.filter-percentComplete')
      .find('.input-group-addon.operator select')
      .contains('>=');
  });

  it('should collapsed all rows from "Collapse All" button', () => {
    cy.get('[data-test=collapse-all-btn]')
      .contains('Collapse All')
      .click();

    cy.get('#grid27')
      .find('.slick-group-toggle.expanded')
      .should('have.length', 0);

    cy.get('#grid27')
      .find('.slick-group-toggle.collapsed')
      .should(($rows) => expect($rows).to.have.length.greaterThan(0));
  });

  it('should expand all rows from "Expand All" button', () => {
    cy.get('[data-test=expand-all-btn]')
      .contains('Expand All')
      .click();

    cy.get('#grid27')
      .find('.slick-group-toggle.collapsed')
      .should('have.length', 0);

    cy.get('#grid27')
      .find('.slick-group-toggle.expanded')
      .should(($rows) => expect($rows).to.have.length.greaterThan(0));
  });

  it('should collapsed all rows from "Collapse All" context menu', () => {
    cy.get('#grid27')
      .contains('5 days');

    cy.get('#grid27')
      .find('.slick-row .slick-cell:nth(1)')
      .rightclick({ force: true });

    cy.get('.slick-context-menu.dropright .slick-context-menu-command-list')
      .find('.slick-context-menu-item')
      .find('.slick-context-menu-content')
      .contains('Collapse all Groups')
      .click();

    cy.get('#grid27')
      .find('.slick-group-toggle.expanded')
      .should('have.length', 0);

    cy.get('#grid27')
      .find('.slick-group-toggle.collapsed')
      .should(($rows) => expect($rows).to.have.length.greaterThan(0));
  });

  it('should collapsed all rows from "Expand All" context menu', () => {
    cy.get('#grid27')
      .contains('5 days');

    cy.get('#grid27')
      .find('.slick-row .slick-cell:nth(1)')
      .rightclick({ force: true });

    cy.get('.slick-context-menu.dropright .slick-context-menu-command-list')
      .find('.slick-context-menu-item')
      .find('.slick-context-menu-content')
      .contains('Expand all Groups')
      .click();

    cy.get('#grid27')
      .find('.slick-group-toggle.collapsed')
      .should('have.length', 0);

    cy.get('#grid27')
      .find('.slick-group-toggle.expanded')
      .should(($rows) => expect($rows).to.have.length.greaterThan(0));
  });

  it('should have data filtered, with "% Complete" >=25, and not show the full item count in the footer', () => {
    cy.get('.search-filter.filter-percentComplete .operator .form-control')
      .should('have.value', '>=');

    cy.get('.rangeInput_percentComplete')
      .invoke('val')
      .then(text => expect(text).to.eq('25'));

    cy.get('.search-filter .input-group-text')
      .should($span => expect($span.text()).to.eq('25'));

    cy.get('.right-footer')
      .should($span => {
        const text = removeExtraSpaces($span.text()); // remove all white spaces
        expect(text).not.to.eq('500 of 500 items');
      });
  });

  it('should open the Grid Menu "Clear all Filters" command', () => {
    cy.get('#grid27')
      .find('button.slick-gridmenu-button')
      .trigger('click')
      .click();

    cy.get(`.slick-gridmenu:visible`)
      .find('.slick-gridmenu-item')
      .first()
      .find('span')
      .contains('Clear all Filters')
      .click();
  });

  it('should no longer have filters and it should show the full item count in the footer', () => {
    cy.get('.search-filter.filter-percentComplete .operator .form-control')
      .should('have.value', null);

    cy.get('.rangeInput_percentComplete')
      .invoke('val')
      .then(text => expect(text).to.eq('0'));

    cy.get('.search-filter .input-group-text')
      .should($span => expect($span.text()).to.eq('0'));

    cy.get('.right-footer')
      .should($span => {
        const text = removeExtraSpaces($span.text()); // remove all white spaces
        expect(text).to.eq('500 of 500 items');
      });
  });

  it('should click on the "Dynamically Change Filter" button and expect all child items to have a "% Complete" lower than 40', () => {
    cy.get('[data-test="change-filter-dynamically"]').click();
    cy.get('[data-test=expand-all-btn]')
      .contains('Expand All')
      .click();

    const readLineCount = 10;
    for (let row = 0; row < readLineCount; row++) {
      cy.get(`[style="top:${GRID_ROW_HEIGHT * row}px"]`)
        .should($elm => {
          // only read the percent complete value if it's not a parent
          const $slickGroupToggleNotExpanded = $elm.children('.slick-cell:nth(0)').children('.slick-group-toggle:not(.expanded)');
          if ($slickGroupToggleNotExpanded.length > 1) {
            const percentComplete = $elm.children('.slick-cell:nth(2)').first('div.percent-complete-bar-with-text').text();
            expect(+percentComplete).to.be.lt(40)
          }
        });
    }
  });

  it('should open the Grid Menu "Clear all Filters" command', () => {
    cy.get('#grid27')
      .find('button.slick-gridmenu-button')
      .trigger('click')
      .click();

    cy.get(`.slick-gridmenu:visible`)
      .find('.slick-gridmenu-item')
      .first()
      .find('span')
      .contains('Clear all Filters')
      .click();
  });

  it('should add an item (Task 500) in the first parent it finds and so we should expect it to be inserted at tree level 1', () => {
    cy.get('[data-test=add-item-btn]')
      .contains('Add New Item')
      .click();

    cy.get('.slick-tree-title[level=1]')
      .get('.slick-cell')
      .contains('Task 500');
  });

  it('should collapse the Tree and not expect to see the newly inserted item (Task 500) because all child will be collapsed', () => {
    cy.get('[data-test=collapse-all-btn]')
      .contains('Collapse All')
      .click();

    cy.get('.slick-tree-title[level=1]')
      .should('have.length', 0);

    cy.get('.slick-tree-title')
      .get('.slick-cell')
      .contains(/^((?!Task 500).)*$/);
  });
});
