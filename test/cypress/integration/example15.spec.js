describe('Example 15: Grid State & Presets using Local Storage', () => {
  const fullEnglishTitles = ['', 'Title', 'Description', 'Duration', '% Complete', 'Start', 'Completed'];
  const fullFrenchTitles = ['', 'Titre', 'Description', 'Durée', '% Complete', 'Début', 'Terminé'];

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  it('should display Example 15 title', () => {
    cy.visit(`${Cypress.config('baseExampleUrl')}/example15`);
    cy.get('h2').should('contain', 'Example 15: Grid State & Presets using Local Storage');

    cy.get('[data-test=reset-button]').click();
  });

  it('should have exact Column Titles in the grid', () => {
    cy.get('#grid15')
      .find('.slick-header-columns')
      .children()
      .each(($child, index) => expect($child.text()).to.eq(fullEnglishTitles[index]));
  });

  it('should drag "Title" column to 3rd position in the grid', () => {
    const expectedTitles = ['', 'Description', 'Duration', 'Title', '% Complete', 'Start', 'Completed'];

    cy.get('.slick-header-columns')
      .children('.slick-header-column:nth(1)')
      .should('contain', 'Title')
      .trigger('mousedown', 'bottom', { which: 1 });

    cy.get('.slick-header-columns')
      .children('.slick-header-column:nth(3)')
      .should('contain', 'Duration')
      .trigger('mousemove', 'bottomRight')
      .trigger('mouseup', 'bottomRight', { force: true });

    cy.get('#grid15')
      .find('.slick-header-columns')
      .children()
      .each(($child, index) => expect($child.text()).to.eq(expectedTitles[index]));
  });

  // --
  // Cypress does not yet implement the .hover() method and this test won't work until then
  xit('should resize "Title" column and make it wider', () => {
    cy.get('.slick-header-columns')
      .children('.slick-header-column:nth(3)')
      .should('contain', 'Title');

    cy.get('.slick-header-columns')
      .children('.slick-header-column:nth(3)')
      .find('.slick-resizable-handle')
      .trigger('mouseover', -2, 50, { force: true })
      .should('be.visible')
      .invoke('show')
      .hover()
      .trigger('mousedown', -2, 50, { which: 1, force: true });

    cy.get('.slick-header-columns')
      .children('.slick-header-column:nth(5)')
      .trigger('mousemove', 'bottomLeft')
      .trigger('mouseup', 'bottomLeft', { force: true });
  });

  it('should hide the "Start" column from the Column Picker', () => {
    const expectedTitles = ['', 'Description', 'Duration', 'Title', '% Complete', 'Start', 'Completed'];

    cy.get('#grid15')
      .find('.slick-header-column')
      .first()
      .trigger('mouseover')
      .trigger('contextmenu')
      .invoke('show');

    cy.get('.slick-columnpicker')
      .find('.slick-columnpicker-list')
      .children()
      .each(($child, index) => {
        if (index === 0) {
          expect($child[0].className).to.eq('hidden');
          expect($child[0].offsetHeight).to.eq(0);
          expect($child[0].offsetWidth).to.eq(0);
        }

        expect($child.text()).to.eq(expectedTitles[index]);
      });

    cy.get('.slick-columnpicker')
      .find('.slick-columnpicker-list')
      .children('li:nth-child(6)')
      .children('label')
      .should('contain', 'Start')
      .click();

    cy.get('.slick-columnpicker:visible')
      .find('span.close')
      .trigger('click')
      .click();
  });

  it('should hover over the "Start" column and click on "Hide Column" remove the column from grid', () => {
    const expectedTitles = ['', 'Description', 'Duration', 'Title', '% Complete', 'Completed'];

    cy.get('.slick-header-columns')
      .children('.slick-header-column:nth(5)')
      .trigger('mouseover')
      .children('.slick-header-menubutton')
      .should('be.hidden')
      .invoke('show')
      .click();

    cy.get('.slick-header-menu')
      .should('be.visible')
      .children('.slick-header-menuitem:nth-child(6)')
      .children('.slick-header-menucontent')
      .should('contain', 'Hide Column')
      .click();

    cy.get('#grid15')
      .find('.slick-header-columns')
      .children()
      .each(($child, index) => expect($child.text()).to.eq(expectedTitles[index]));

    cy.reload();
  });

  it('should expect the same Grid State to persist after the page got reloaded', () => {
    const expectedTitles = ['', 'Description', 'Duration', 'Title', '% Complete', 'Completed'];

    // switch the language button and forth just to make sure that our page and grid finished loading
    // I couldn't find any other ways of detecting that the grid finished loading other than that
    cy.get('[data-test=language-button]')
      .click();

    cy.get('[data-test=selected-locale]')
      .should('contain', 'fr.json');

    cy.get('[data-test=language-button]')
      .click();

    cy.get('[data-test=selected-locale]')
      .should('contain', 'en.json');

    cy.get('[data-test=processing]')
      .should('be.hidden');

    cy.get('#grid15')
      .should('be.visible');

    cy.get('#grid15')
      .find('.slick-header-columns')
      .children()
      .each(($child, index) => expect($child.text()).to.eq(expectedTitles[index]));
  });

  it('should have French titles in Column Picker after switching to Language', () => {
    const expectedTitles = ['', 'Description', 'Durée', 'Titre', '% Complete', 'Début', 'Terminé'];

    cy.get('[data-test=language-button]')
      .click();

    cy.get('[data-test=selected-locale]')
      .should('contain', 'fr.json');

    cy.get('#grid15')
      .find('.slick-header-column')
      .first()
      .trigger('mouseover')
      .trigger('contextmenu')
      .invoke('show');

    cy.get('.slick-columnpicker')
      .find('.slick-columnpicker-list')
      .children()
      .each(($child, index) => {
        if (index === 0) {
          expect($child[0].className).to.eq('hidden');
          expect($child[0].offsetHeight).to.eq(0);
          expect($child[0].offsetWidth).to.eq(0);
        }

        expect($child.text()).to.eq(expectedTitles[index]);
      });

    cy.get('.slick-columnpicker:visible')
      .find('span.close')
      .trigger('click')
      .click();
  });

  it('should have French titles in Grid Menu after switching to Language', () => {
    const expectedTitles = ['', 'Description', 'Durée', 'Titre', '% Complete', 'Début', 'Terminé'];

    cy.get('#grid15')
      .find('button.slick-gridmenu-button')
      .trigger('click')
      .click();

    cy.get('.slick-gridmenu')
      .find('.slick-gridmenu-list')
      .children()
      .each(($child, index) => {
        if (index === 0) {
          expect($child[0].className).to.eq('hidden');
          expect($child[0].offsetHeight).to.eq(0);
          expect($child[0].offsetWidth).to.eq(0);
        }

        expect($child.text()).to.eq(expectedTitles[index]);
      });

    cy.get('.slick-gridmenu:visible')
      .find('span.close')
      .trigger('click')
      .click();
  });
});
