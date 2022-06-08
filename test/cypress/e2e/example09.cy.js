/// <reference types="cypress" />

describe('Example 9 - Grid Menu', { retries: 1 }, () => {
  const fullEnglishTitles = ['Title', 'Duration', '% Complete', 'Start', 'Finish', 'Completed'];
  const fullFrenchTitles = ['Titre', 'Durée', '% Achevée', 'Début', 'Fin', 'Terminé'];

  beforeEach(() => {
    // create a console.log spy for later use
    cy.window().then((win) => {
      cy.spy(win.console, 'log');
    });
  });

  it('should display Example title', () => {
    cy.visit(`${Cypress.config('baseUrl')}/example9`);
    cy.get('h2').should('contain', 'Example 9: Grid Menu Control');
  });

  describe('use English locale', () => {
    it('should have exact Column Titles in the grid', () => {
      cy.get('#grid9')
        .find('.slick-header-columns')
        .children()
        .each(($child, index) => expect($child.text()).to.eq(fullEnglishTitles[index]));
    });

    it('should open the Grid Menu and expect a title for "Custom Menus" and for "Columns"', () => {
      cy.get('#grid9')
        .find('button.slick-grid-menu-button')
        .trigger('click')
        .click({ force: true });

      cy.get('.slick-menu-command-list')
        .find('.slick-menu-title')
        .contains('Custom Commands');

      cy.get('.slick-grid-menu')
        .find('.slick-menu-title')
        .contains('Columns');

      cy.get('#grid9')
        .get('.slick-grid-menu:visible')
        .find('.close')
        .trigger('click')
        .click({ force: true });
    });

    it('should hover over the Title column and click on "Hide Column" command and remove 1st column from grid', () => {
      const smallerTitleList = fullEnglishTitles.slice(1);

      cy.get('#grid9')
        .find('.slick-header-column')
        .first()
        .trigger('mouseover')
        .children('.slick-header-menu-button')
        .should('be.hidden')
        .invoke('show')
        .trigger('click', { force: true });

      cy.get('.slick-header-menu')
        .should('be.visible')
        .children('.slick-menu-item:nth-of-type(4)')
        .children('.slick-menu-content')
        .should('contain', 'Hide Column')
        .click({ force: true });

      cy.get('#grid9')
        .find('.slick-header-columns')
        .children()
        .each(($child, index) => expect($child.text()).to.eq(smallerTitleList[index]));
    });

    it('should hide a column from the picker and then open the Grid Menu and expect the "Command 1" to NOT be usable', () => {
      const alertStub = cy.stub();
      cy.on('window:alert', alertStub);

      cy.get('#grid9')
        .find('button.slick-grid-menu-button')
        .click({ force: true });

      cy.get('.slick-menu-item.orange')
        .find('.slick-menu-content')
        .contains('Command 1')
        .click()
        .then(() => expect(alertStub.getCall(0)).to.be.null);

      cy.get('#grid9')
        .get('.slick-grid-menu:visible')
        .find('.close')
        .click({ force: true });
    });

    it('should type a filter and then open the Grid Menu and expect the "Command 2" to NOT be visible', () => {
      const alertStub = cy.stub();
      cy.on('window:alert', alertStub);

      cy.get('input.search-filter.filter-duration')
        .type('10');

      cy.get('#grid9')
        .find('button.slick-grid-menu-button')
        .trigger('click')
        .click({ force: true });

      cy.get('.slick-menu-item.red')
        .should('not.exist');
    });

    it('should clear all filters and expect no filters in the grid', () => {
      cy.get('#grid9')
        .find('button.slick-grid-menu-button')
        .trigger('click')
        .click({ force: true });

      cy.get('.slick-menu-item')
        .find('.slick-menu-content')
        .contains('Clear all Filters')
        .click();

      cy.get('input.search-filter.filter-duration')
        .each(($elm) => expect($elm.text()).to.eq(''));
    });

    it('should clear the filters and then open the Grid Menu and expect the "Command 2" to now be visible', () => {
      const alertStub = cy.stub();
      cy.on('window:alert', alertStub);

      cy.get('#grid9')
        .find('button.slick-grid-menu-button')
        .trigger('click')
        .click({ force: true });

      cy.get('.slick-menu-item.red')
        .find('.slick-menu-content.italic')
        .should('contain', 'Command 2');
    });

    it('should click on the Grid Menu to show the Title as 1st column again', () => {
      cy.get('#grid9')
        .find('button.slick-grid-menu-button')
        .trigger('click')
        .click({ force: true });

      cy.get('#grid9')
        .get('.slick-grid-menu:visible')
        .find('.slick-column-picker-list')
        .children('li:nth-child(1)')
        .children('label')
        .should('contain', 'Title')
        .click({ force: true });

      cy.get('#grid9')
        .get('.slick-grid-menu:visible')
        .find('.close')
        .trigger('click')
        .click({ force: true });

      cy.get('#grid9')
        .find('.slick-header-columns')
        .children()
        .each(($child, index) => expect($child.text()).to.eq(fullEnglishTitles[index]));
    });

    it('should now expect the "Command 1" to be usable since all columns are visible', () => {
      const alertStub = cy.stub();
      cy.on('window:alert', alertStub);

      cy.get('#grid9')
        .find('button.slick-grid-menu-button')
        .trigger('click')
        .click({ force: true });

      cy.get('.slick-menu-item.orange')
        .find('.slick-menu-content')
        .contains('Command 1')
        .click()
        .then(() => expect(alertStub.getCall(0)).to.be.calledWith('command1'));
    });

    it('should hover over the Title column and click on "Hide Column" command and remove 1st column from grid', () => {
      const smallerTitleList = fullEnglishTitles.slice(1);

      cy.get('#grid9')
        .find('.slick-header-column')
        .first()
        .trigger('mouseover')
        .children('.slick-header-menu-button')
        .should('be.hidden')
        .invoke('show')
        .trigger('click', { force: true });

      cy.get('.slick-header-menu')
        .should('be.visible')
        .children('.slick-menu-item:nth-of-type(4)')
        .children('.slick-menu-content')
        .should('contain', 'Hide Column')
        .click({ force: true });

      cy.get('#grid9')
        .find('.slick-header-columns')
        .children()
        .each(($child, index) => expect($child.text()).to.eq(smallerTitleList[index]));
    });

    it('should click on the External Grid Menu to show the Title as 1st column again', () => {
      cy.get('[data-test=external-gridmenu]')
        .trigger('click')
        .click({ force: true });

      cy.get('#grid9')
        .get('.slick-grid-menu:visible')
        .find('.slick-column-picker-list')
        .children('li:nth-child(1)')
        .children('label')
        .should('contain', 'Title')
        .click({ force: true });

      cy.get('#grid9')
        .get('.slick-grid-menu:visible')
        .find('.close')
        .trigger('click')
        .click({ force: true });

      cy.get('#grid9')
        .find('.slick-header-columns')
        .children()
        .each(($child, index) => expect($child.text()).to.eq(fullEnglishTitles[index]));

      cy.get('#grid9')
        .get('.slick-grid-menu')
        .find('.close')
        .trigger('click', { force: true })
        .click({ force: true });
    });
  });

  describe('switch to French language', () => {
    it('should switch locale to French and have column header titles in French', () => {
      cy.get('[data-test=language]')
        .click({ force: true });

      cy.get('[data-test=selected-locale]')
        .should('contain', 'fr.json');

      cy.get('#grid9')
        .find('.slick-header-columns')
        .children()
        .each(($child, index) => expect($child.text()).to.eq(fullFrenchTitles[index]));
    });

    it('should hover over the Title column and click on "Cacher la colonne" command and remove 1st column from grid', () => {
      const smallerTitleList = fullFrenchTitles.slice(1);

      cy.get('#grid9')
        .find('.slick-header-column')
        .first()
        .trigger('mouseover')
        .children('.slick-header-menu-button')
        .should('be.hidden')
        .invoke('show')
        .trigger('click', { force: true });

      cy.get('.slick-header-menu')
        .should('be.visible')
        .children('.slick-menu-item:nth-of-type(4)')
        .children('.slick-menu-content')
        .should('contain', 'Cacher la colonne')
        .click({ force: true });

      cy.get('#grid9')
        .find('.slick-header-columns')
        .children()
        .each(($child, index) => expect($child.text()).to.eq(smallerTitleList[index]));
    });

    it('should click on the Grid Menu to show the Title as 1st column again', () => {
      cy.get('#grid9')
        .find('button.slick-grid-menu-button')
        .trigger('click')
        .click({ force: true });

      cy.get('#grid9')
        .get('.slick-grid-menu:visible')
        .find('.slick-column-picker-list')
        .children('li:nth-child(1)')
        .children('label')
        .should('contain', 'Titre')
        .click({ force: true });

      cy.get('#grid9')
        .find('.slick-header-columns')
        .children()
        .each(($child, index) => expect($child.text()).to.eq(fullFrenchTitles[index]));
    });

    it('should hover over the Title column and click on "Hide Column" command and remove 1st column from grid', () => {
      const smallerTitleList = fullFrenchTitles.slice(1);

      cy.get('#grid9')
        .find('.slick-header-column')
        .first()
        .trigger('mouseover')
        .children('.slick-header-menu-button')
        .should('be.hidden')
        .invoke('show')
        .trigger('click', { force: true });

      cy.get('.slick-header-menu')
        .should('be.visible')
        .children('.slick-menu-item:nth-of-type(4)')
        .children('.slick-menu-content')
        .should('contain', 'Cacher la colonne')
        .click({ force: true });

      cy.get('#grid9')
        .find('.slick-header-columns')
        .children()
        .each(($child, index) => expect($child.text()).to.eq(smallerTitleList[index]));
    });

    it('should click on the External Grid Menu to show the Title as 1st column again', () => {
      cy.get('[data-test=external-gridmenu]')
        .trigger('click')
        .click({ force: true });

      cy.get('#grid9')
        .get('.slick-grid-menu:visible')
        .find('.slick-column-picker-list')
        .children('li:nth-child(1)')
        .children('label')
        .should('contain', 'Titre')
        .click({ force: true });

      cy.get('#grid9')
        .get('.slick-grid-menu:visible')
        .find('.close')
        .trigger('click')
        .click({ force: true });

      cy.get('#grid9')
        .find('.slick-header-columns')
        .children()
        .each(($child, index) => expect($child.text()).to.eq(fullFrenchTitles[index]));

      cy.get('#grid9')
        .get('.slick-grid-menu')
        .find('.close')
        .trigger('click', { force: true })
        .click({ force: true });
    });
  });
});
