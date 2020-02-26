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

      cy.wrap(taskListItem).within(() => listItemExpects(expects));
    });
}

function listItemExpects(expects) {
  if (expects.name) {
    dataCy('tli-title').should('contain.text', expects.name);
  }

  if (expects.area) {
    dataCy('tli-learning-area').should('contain.text', expects.area);
  }

  if (expects.startDate) {
    dataCy('tli-start-date').should('contain.text', expects.startDate);
  }

  if (expects.endDate) {
    dataCy('tli-end-date').should('contain.text', expects.endDate);
  }

  if (expects.classGroups) {
    dataCy('tli-classgroup').each((element, cgIndex) => {
      cy.wrap(element).should('contain.text', expects.classGroups[cgIndex]);
    });
  }

  if (expects.groupCount) {
    dataCy('tli-group-count').should('contain.text', expects.groupCount);
  }

  if (expects.individualCount) {
    dataCy('tli-student-count').should('contain.text', expects.individualCount);
  }

  if (expects.actions) {
    dataCy('tli-action').each((element, actionIndex) => {
      cy.wrap(element).should('contain.text', expects.actions[actionIndex]);
    });
  }
}
