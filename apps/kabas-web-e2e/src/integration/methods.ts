import { cyEnv, dataCy } from '../support/commands';
import {
  ApiPathsInterface,
  KabasMethodsPagesInterface
} from '../support/interfaces';

const apiUrl = cyEnv('apiUrl');
const apiPaths = cyEnv('apiPaths') as ApiPathsInterface;

/**
 * Clicks on the open boeke button in the top navigation and checks if it opens the expected window
 * @param setup The scenario setup data
 */
export function checkNavOpenBoeke(setup: KabasMethodsPagesInterface) {
  dataCy('nav-open-boeke').click();
  cy.window()
    .its('open')
    .should(
      'be.calledWithExactly',
      `${apiUrl}${apiPaths.eduContent}/${
        setup.kabasMethodsPages.expected.boeke.eduContentId
      }/redirectURL`
    );
}

/**
 * Checks if there are this many search results on the page
 * @param count Number of expected search result
 */
export function checkSearchResultCount(count: number) {
  cy.get('edu-content-search-result').should('have.length', count);
}

/**
 * Enter the search term from the setup in the search field and press enter
 * @param setup The scenario setup data
 */
export function enterSearchTerm(setup: KabasMethodsPagesInterface) {
  dataCy('search-filters')
    .find('campus-search-term input')
    .type(setup.kabasMethodsPages.searchTerm)
    .type('{enter}');
}

/**
 * Clicks the diabolo outro filter
 */
export function clickDiaboloOutroFilter() {
  dataCy('search-filters')
    .find('.button-toggle-filter-component__button')
    .last()
    .click();
}

/**
 * Checks if the n-th learning plan goal checkbox is checked
 * @param index 0-based index
 */
export function checkLPGChecked(index: number) {
  getLPGCheckbox(index).should('have.class', 'mat-checkbox-checked');
}

/**
 * Checks if the n-th learning plan goal checkbox is unchecked
 * @param index 0-based index
 */
export function checkLPGUnchecked(index: number) {
  getLPGCheckbox(index).should('not.have.class', 'mat-checkbox-checked');
}

/**
 * Returns the element for the n-th learning plan goal checkbox
 * @param index 0-based index
 */
function getLPGCheckbox(index: number): Cypress.Chainable<JQuery<HTMLElement>> {
  return dataCy('goals-check-box-table')
    .find('mat-checkbox')
    .eq(index);
}

/**
 * Clicks the n-th learning plan goal checkbox
 * @param index 0-based index
 */
export function clickLPGCheckbox(index: number) {
  getLPGCheckbox(index).click();
}

/**
 * Clicks the n-th bulk learning plan goal checkbox
 * @param index 0-based index
 */
export function clickBulkLPGCheckbox(index: number) {
  dataCy('goals-check-box-table')
    .find('.ui-multi-check-box-table__body__row--subLevel--item')
    .eq(index)
    .find('mat-icon')
    .click();
}

/**
 * Returns the element for the current active tab on the page
 */
export function getActiveTab(): Cypress.Chainable<JQuery<HTMLElement>> {
  return cy.get('.mat-tab-label-active').find('.mat-tab-label-content');
}
