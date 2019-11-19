/// <reference types="cypress" />
import moment from 'moment-mini';

const presetMinComplete = 5;
const presetMaxComplete = 80;
const presetMinDuration = 4;
const presetMaxDuration = 88;
const presetLowestDay = moment().add(-2, 'days').format('YYYY-MM-DD');
const presetHighestDay = moment().add(20, 'days').format('YYYY-MM-DD');

describe('Example 23 - Range Filters', () => {
  it('should display Example title', () => {
    cy.visit(`${Cypress.config('baseExampleUrl')}/example23`);
    cy.get('h2').should('contain', 'Example 23: Filtering from Range of Search Values');
  });

  it('should have "% Complete" fields within the range (inclusive) of the filters presets', () => {
    cy.get('#grid23')
      .find('.slick-row')
      .each(($row) => {
        cy.wrap($row)
          .children('.slick-cell:nth(2)')
          .each(($cell) => {
            const value = parseInt($cell.text().trim(), 10);
            if (!isNaN(value)) {
              expect(value >= presetMinComplete).to.eq(true);
              expect(value <= presetMaxComplete).to.eq(true);
            }
          });
      });
  });

  it('should have Finish Dates within the range (inclusive) of the filters presets', () => {
    cy.get('#grid23')
      .find('.slick-row')
      .each(($row) => {
        cy.wrap($row)
          .children('.slick-cell:nth(4)')
          .each(($cell) => {
            const isDateBetween = moment($cell.text()).isBetween(presetLowestDay, presetHighestDay, null, '[]'); // [] is inclusive, () is exclusive
            expect(isDateBetween).to.eq(true);
          });
      });
  });

  it('should have "Duration" fields within the range (exclusive by default) of the filters presets', () => {
    cy.get('#grid23')
      .find('.slick-row')
      .each(($row) => {
        cy.wrap($row)
          .children('.slick-cell:nth(5)')
          .each(($cell) => {
            const value = parseInt($cell.text().trim(), 10);
            if (!isNaN(value)) {
              expect(value > presetMinDuration).to.eq(true);
              expect(value < presetMaxDuration).to.eq(true);
            }
          });
      });
  });

  it('should change "% Complete" filter range by using the slider left handle (min value) to make it a higher min value and expect all rows to be within new range', () => {
    let newLowest = presetMinComplete;
    let newHighest = presetMaxComplete;

    cy.get('.ui-slider-range')
      .click('bottom', { force: true });

    cy.get('.lowest-range-complete')
      .then(($lowest) => {
        newLowest = parseInt($lowest.text(), 10);
      });

    cy.get('.highest-range-complete')
      .then(($highest) => {
        newHighest = parseInt($highest.text(), 10);
      });

    cy.get('#grid23')
      .find('.slick-row')
      .each(($row) => {
        cy.wrap($row)
          .children('.slick-cell:nth(2)')
          .each(($cell) => {
            const value = parseInt($cell.text().trim(), 10);
            if (!isNaN(value)) {
              expect(value >= newLowest).to.eq(true);
              expect(value <= newHighest).to.eq(true);
            }
          });
      });
  });

  it('should change the "Duration" input filter and expect all rows to be within new range', () => {
    const newMin = 10;
    const newMax = 40;

    cy.get('[data-test=clear-filter-button]')
      .click({ force: true });

    cy.get('.search-filter.filter-duration')
      .focus()
      .type(`${newMin}..${newMax}`);

    cy.get('#grid23')
      .find('.slick-row')
      .each(($row) => {
        cy.wrap($row)
          .children('.slick-cell:nth(5)')
          .each(($cell) => {
            const value = parseInt($cell.text().trim(), 10);
            if (!isNaN(value)) {
              expect(value > newMin).to.eq(true);
              expect(value < newMax).to.eq(true);
            }
          });
      });
  });

  xit('should change the "Finish" date in the picker and expect all rows to be within new dates range', () => {
    cy.contains('Clear Filters')
      .click({ force: true });

    cy.get('.flatpickr.search-filter.filter-finish:nth(1)')
      .click('bottom', { force: true });

    cy.get('.flatpickr-days')
      .find('[aria-label]')
      .contains(moment().format('MMMM'));

    cy.get('.flatpickr-day:nth(7)')
      .click({ force: true });

    cy.get('.flatpickr-day')
      .should('contain', '28')
      .click({ force: true });

    cy.get('#grid23')
      .find('.slick-row')
      .each(($row) => {
        cy.wrap($row)
          .children('.slick-cell:nth(4)')
          .each(($cell) => {
            const isDateBetween = moment($cell.text()).isBetween(presetLowestDay, presetHighestDay, null, '[]'); // [] is inclusive, () is exclusive
            expect(isDateBetween).to.eq(true);
          });
      });
  });

  describe('Set Dymamic Filters', () => {
    const dynamicMinComplete = 12;
    const dynamicMaxComplete = 82;
    const dynamicMinDuration = 14;
    const dynamicMaxDuration = 78;
    const dynamicLowestDay = moment().add(-5, 'days').format('YYYY-MM-DD');
    const dynamicHighestDay = moment().add(25, 'days').format('YYYY-MM-DD');

    it('should click on Set Dynamic Filters', () => {
      cy.get('[data-test=set-dynamic-filter]')
        .click();
    });

    it('should have "% Complete" fields within the exclusive range of the filters presets', () => {
      cy.get('#grid23')
        .find('.slick-row')
        .each(($row) => {
          cy.wrap($row)
            .children('.slick-cell:nth(2)')
            .each(($cell) => {
              const value = parseInt($cell.text().trim(), 10);
              if (!isNaN(value)) {
                expect(value > dynamicMinComplete).to.eq(true);
                expect(value < dynamicMaxComplete).to.eq(true);
              }
            });
        });
    });

    it('should have "Duration" fields within the inclusive range of the dynamic filters', () => {
      cy.get('#grid23')
        .find('.slick-row')
        .each(($row) => {
          cy.wrap($row)
            .children('.slick-cell:nth(5)')
            .each(($cell) => {
              const value = parseInt($cell.text().trim(), 10);
              if (!isNaN(value)) {
                expect(value >= dynamicMinDuration).to.eq(true);
                expect(value <= dynamicMaxDuration).to.eq(true);
              }
            });
        });
    });

    it('should have Finish Dates within the range (inclusive) of the dynamic filters', () => {
      cy.get('.search-filter.filter-finish')
        .find('input')
        .invoke('val')
        .then(text => expect(text).to.eq(`${dynamicLowestDay} to ${dynamicHighestDay}`));

      cy.get('#grid23')
        .find('.slick-row')
        .each(($row) => {
          cy.wrap($row)
            .children('.slick-cell:nth(4)')
            .each(($cell) => {
              const isDateBetween = moment($cell.text()).isBetween(dynamicLowestDay, dynamicHighestDay, null, '[]'); // [] is inclusive, () is exclusive
              expect(isDateBetween).to.eq(true);
            });
        });
    });
  });
});
