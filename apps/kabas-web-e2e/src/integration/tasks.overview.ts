/// <reference types="cypress" />

import { cyEnv, dataCy } from '../support/commands';
import {
  AdvancedDateOptions,
  ApiPathsInterface,
  ExpectedTaskListItemResult
} from '../support/interfaces';

const apiUrl = cyEnv('apiUrl');
const apiPaths = cyEnv('apiPaths') as ApiPathsInterface;

export function filterName(name: string) {
  dataCy('name-filter')
    .find('input')
    .focus()
    .type(name);
}

export function filterArea(area: string) {
  dataCy('area-filter').click();
  dataCy('select-option')
    .contains(area)
    .click();
  cy.get('body').type('{esc}');
}

export function filterDate(dateOptions: AdvancedDateOptions) {
  if (dateOptions.option) {
    filterDateOption(dateOptions.option);
  }

  if (dateOptions.today) {
    filterDateToday();
  }
}

function filterDateOption(option: string) {
  dataCy('date-filter').click();
  dataCy('date-option')
    .contains(option)
    .click();
  dataCy('date-confirm').click();
}

function filterDateToday() {
  dataCy('date-filter').click();
  dataCy('date-start-input').click();
  cy.get('.mat-calendar-body-today').click();
  dataCy('date-confirm').click();
}

export function filterAssignee(assigneeName: number) {
  dataCy('assignee-filter').click();
  dataCy('select-option')
    .contains(assigneeName)
    .click();
  cy.get('body').type('{esc}');
}

export function filterStatus(index: number) {
  dataCy('status-filter')
    .get('[data-cy=button-toggle-button')
    .eq(index)
    .click();
}

export function filterArchived() {
  dataCy('archived-filter').click();
}

export function resetFilters() {
  dataCy('reset-filters').click();
}

export function sortBy(mode: string) {
  dataCy('sort-dropdown').click();
  dataCy('sort-option')
    .contains(mode)
    .click();
}

export function checkResults(results: ExpectedTaskListItemResult[]) {
  dataCy('results-text').should(
    'contain.text',
    results.length + (results.length === 1 ? ' resultaat' : ' resultaten')
  );

  dataCy('task-list-item')
    .should('have.length', results.length)
    .each((taskListItem, index) => {
      const expects = results[index];

      if (expects.name) {
        cy.wrap(taskListItem)
          .find('[data-cy=tli-title]')
          .should('have.text', expects.name);
      }
    });
}
