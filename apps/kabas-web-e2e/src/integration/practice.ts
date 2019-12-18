import { cyEnv, dataCy } from '../support/commands';
import { ApiPathsInterface } from '../support/interfaces';

const apiUrl = cyEnv('apiUrl');
const apiPaths = cyEnv('apiPaths') as ApiPathsInterface;

/**
 * Checks if there are this many search results on the page
 * @param count Number of expected search result
 */
export function checkSearchResultCount(count: number) {
  cy.get('edu-content-search-result').should('have.length', count);
}

/**
 * Checks if the n-th practice checkbox is checked
 * @param index 0-based index
 */
export function checkPracticeChecked(index: number) {
  getPracticeCheckbox(index).should('have.class', 'mat-checkbox-checked');
}

/**
 * Checks if the n-th practice checkbox is disabled
 * @param index 0-based index
 */
export function checkPracticeDisabled(index: number) {
  getPracticeCheckbox(index).should('have.class', 'mat-checkbox-disabled');
}

/**
 * Checks if the n-th practice checkbox is unchecked
 * @param index 0-based index
 */
export function checkPracticeUnchecked(index: number) {
  getPracticeCheckbox(index).should('not.have.class', 'mat-checkbox-checked');
}

/**
 * Returns the right column of table checkboxes
 */
export function getPracticeCheckboxes(): Cypress.Chainable<
  JQuery<HTMLElement>
> {
  return dataCy('practice-check-box-table').find('mat-checkbox');
}

/**
 * Returns the n-th checkbox in the right column of table checkboxes
 */
function getPracticeCheckbox(
  index: number
): Cypress.Chainable<JQuery<HTMLElement>> {
  return getPracticeCheckboxes().eq(index);
}

/**
 * Clicks the n-th practice checkbox
 * @param index 0-based index
 */
export function clickPracticeCheckbox(index: number) {
  return getPracticeCheckbox(index).click();
}

/**
 * Clicks the n-th bulk practice checkbox
 * @param index 0-based index
 */
export function clickBulkPracticeCheckbox(index: number) {
  dataCy('goals-check-box-table')
    .find('.ui-multi-check-box-table__body__row--subLevel--item')
    .eq(index)
    .find('mat-icon')
    .click();
}
