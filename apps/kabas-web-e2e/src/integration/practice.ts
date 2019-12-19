/// <reference types="cypress" />

import { cyEnv, dataCy } from '../support/commands';
import { ApiPathsInterface, WaitTimesInterface } from '../support/interfaces';

const apiUrl = cyEnv('apiUrl');
const apiPaths = cyEnv('apiPaths') as ApiPathsInterface;
const waitTimes = cyEnv('waitTimes') as WaitTimesInterface;

/**
 * Clicks the n-th bulk practice checkbox
 * @param index 0-based index
 */
export function clickBulkPracticeCheckbox(index: number) {
  getBulkPracticeCheckbox(index).click();

  return cy.wait(waitTimes.short);
}

/**
 * Clicks the n-th item practice checkbox
 * @param index 0-based index
 */
export function clickItemPracticeCheckbox(index: number) {
  getItemPracticeCheckbox(index).click();

  return cy.wait(waitTimes.short);
}

/**
 * Checks whether the n-th item practice checkbox is disabled
 * @param index 0-based index
 */
export function checkItemPracticeCheckboxDisabled(index: number) {
  return getItemPracticeCheckbox(index).should(
    'have.class',
    'mat-checkbox-disabled'
  );
}

/**
 * Checks whether the n-th item practice checkbox is enabled
 * @param index 0-based index
 */
export function checkItemPracticeCheckboxEnabled(index: number) {
  return getItemPracticeCheckbox(index).should(
    'not.have.class',
    'mat-checkbox-disabled'
  );
}

export function checkItemPracticeCheckboxUnchecked(index: number) {
  return getItemPracticeCheckbox(index).should(
    'not.have.class',
    'mat-checkbox-checked'
  );
}

/**
 * Returns a chainable n-th bulk practice checkbox
 * @param index 0-based index
 */
export function getBulkPracticeCheckbox(index: number) {
  return dataCy('check-box-table-select-all').eq(index);
}
/**
 * Returns a chainable n-th item practice checkbox
 * @param index 0-based index
 */
export function getItemPracticeCheckbox(index: number) {
  return dataCy('check-box-table-select-item').eq(index);
}
