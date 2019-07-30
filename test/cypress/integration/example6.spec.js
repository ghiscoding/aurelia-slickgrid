describe('Example 6 - GraphQL Grid', () => {
  it('should display Example 6 title', () => {
    cy.visit(`${Cypress.config('baseExampleUrl')}/example6`);
    cy.get('h2').should('contain', 'Example 6: Grid with Backend GraphQL Service');
  });

  it('should have a grid of size 800 by 200px', () => {
    cy.get('#slickGridContainer-grid6')
      .should('have.css', 'width', '800px');

    cy.get('#slickGridContainer-grid6 > .slickgrid-container')
      .should('have.css', 'height', '200px');
  });

  it('should have default GraphQL query', () => {
    cy.get('[data-test=alert-graphql-query]').should('exist');
    cy.get('[data-test=alert-graphql-query]').should('contain', 'GraphQL Query');

    // wait for the query to finish
    cy.get('[data-test=status]').should('contain', 'done');

    cy.get('[data-test=graphql-query-result]')
      .should(($span) => {
        const text = $span.text().replace(/\s/g, ''); // remove all white spaces
        expect(text).to.eq('query{users(first:20,offset:20,orderBy:[{field:"name",direction:ASC},{field:"company",direction:DESC}],filterBy:[{field:"gender",operator:EQ,value:"male"},{field:"name",operator:Contains,value:"JohnDoe"},{field:"company",operator:IN,value:"xyz"}],locale:"en",userId:123){totalCount,nodes{id,name,gender,company,billing{address{street,zip}}}}}');
      });
  });

  it('should change Pagination to next page', () => {
    cy.get('.icon-seek-next').click();

    // wait for the query to finish
    cy.get('[data-test=status]').should('contain', 'done');

    cy.get('[data-test=graphql-query-result]')
      .should(($span) => {
        const text = $span.text().replace(/\s/g, ''); // remove all white spaces
        expect(text).to.eq('query{users(first:20,offset:40,orderBy:[{field:"name",direction:ASC},{field:"company",direction:DESC}],filterBy:[{field:"gender",operator:EQ,value:"male"},{field:"name",operator:Contains,value:"JohnDoe"},{field:"company",operator:IN,value:"xyz"}],locale:"en",userId:123){totalCount,nodes{id,name,gender,company,billing{address{street,zip}}}}}');
      });
  });

  it('should change Pagination to last page', () => {
    cy.get('.icon-seek-end').click();

    // wait for the query to finish
    cy.get('[data-test=status]').should('contain', 'done');

    cy.get('[data-test=graphql-query-result]')
      .should(($span) => {
        const text = $span.text().replace(/\s/g, ''); // remove all white spaces
        expect(text).to.eq('query{users(first:20,offset:80,orderBy:[{field:"name",direction:ASC},{field:"company",direction:DESC}],filterBy:[{field:"gender",operator:EQ,value:"male"},{field:"name",operator:Contains,value:"JohnDoe"},{field:"company",operator:IN,value:"xyz"}],locale:"en",userId:123){totalCount,nodes{id,name,gender,company,billing{address{street,zip}}}}}');
      });
  });

  it('should change Pagination to first page with 30 items', () => {
    cy.get('.icon-seek-first').click();

    cy.get('#items-per-page-label').select('30');

    // wait for the query to finish
    cy.get('[data-test=status]').should('contain', 'done');

    cy.get('[data-test=graphql-query-result]')
      .should(($span) => {
        const text = $span.text().replace(/\s/g, ''); // remove all white spaces
        expect(text).to.eq('query{users(first:30,offset:0,orderBy:[{field:"name",direction:ASC},{field:"company",direction:DESC}],filterBy:[{field:"gender",operator:EQ,value:"male"},{field:"name",operator:Contains,value:"JohnDoe"},{field:"company",operator:IN,value:"xyz"}],locale:"en",userId:123){totalCount,nodes{id,name,gender,company,billing{address{street,zip}}}}}');
      });
  });

  it('should clear a single filter, that is not empty, by the header menu and expect query change', () => {
    cy.get('#grid6')
      .find('.slick-header-column:nth(1)')
      .trigger('mouseover')
      .children('.slick-header-menubutton')
      .should('be.hidden')
      .invoke('show')
      .click();

    cy.get('.slick-header-menu')
      .should('be.visible')
      .children('.slick-header-menuitem:nth-child(4)')
      .children('.slick-header-menucontent')
      // .should('contain', 'Remove Filter')
      .click();

    // wait for the query to finish
    cy.get('[data-test=status]').should('contain', 'done');

    cy.get('[data-test=graphql-query-result]')
      .should(($span) => {
        const text = $span.text().replace(/\s/g, ''); // remove all white spaces
        expect(text).to.eq('query{users(first:30,offset:0,orderBy:[{field:"name",direction:ASC},{field:"company",direction:DESC}],filterBy:[{field:"gender",operator:EQ,value:"male"},{field:"company",operator:IN,value:"xyz"}],locale:"en",userId:123){totalCount,nodes{id,name,gender,company,billing{address{street,zip}}}}}');
      });
  });

  it('should try clearing same filter, which is now empty, by the header menu and expect same query without loading spinner', () => {
    cy.get('#grid6')
      .find('.slick-header-column:nth(1)')
      .trigger('mouseover')
      .children('.slick-header-menubutton')
      .invoke('show')
      .click();

    cy.get('.slick-header-menu')
      .should('be.visible')
      .children('.slick-header-menuitem:nth-child(4)')
      .children('.slick-header-menucontent')
      // .should('contain', 'Remove Filter')
      .click();

    // wait for the query to finish
    cy.get('[data-test=status]').should('contain', 'done');

    cy.get('[data-test=graphql-query-result]')
      .should(($span) => {
        const text = $span.text().replace(/\s/g, ''); // remove all white spaces
        expect(text).to.eq('query{users(first:30,offset:0,orderBy:[{field:"name",direction:ASC},{field:"company",direction:DESC}],filterBy:[{field:"gender",operator:EQ,value:"male"},{field:"company",operator:IN,value:"xyz"}],locale:"en",userId:123){totalCount,nodes{id,name,gender,company,billing{address{street,zip}}}}}');
      });
  });

  it('should clear all Filters & Sorts', () => {
    cy.contains('Clear all Filter & Sorts').click();

    // wait for the query to finish
    cy.get('[data-test=status]').should('contain', 'done');

    cy.get('[data-test=graphql-query-result]')
      .should(($span) => {
        const text = $span.text().replace(/\s/g, ''); // remove all white spaces
        expect(text).to.eq('query{users(first:30,offset:0,locale:"en",userId:123){totalCount,nodes{id,name,gender,company,billing{address{street,zip}}}}}');
      });
  });
});
