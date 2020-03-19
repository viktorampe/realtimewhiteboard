/// <reference types="cypress" />

import { cyEnv, dataCy } from '../support/commands';
import {
  AdvancedDateOptions,
  ApiPathsInterface,
  ExpectedTaskListItemResult,
  TaskAction
} from '../support/interfaces';

const apiUrl = cyEnv('apiUrl');
const apiPaths = cyEnv('apiPaths') as ApiPathsInterface;

export function toggleFilters() {
  dataCy('toggle-filters-button').click();
}

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

export function filterAssignee(assigneeName: string) {
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

export function clickTaskAction(taskName: string, action: string) {
  return dataCy('task-list-item')
    .contains('[data-cy=task-list-item]', taskName)
    .within(() => {
      dataCy('tli-action')
        .contains(translateAction(action) || action)
        .click({
          force: true
        });
    });
}

export function favoriteTask(taskName: string) {
  return dataCy('task-list-item')
    .contains('[data-cy=task-list-item]', taskName)
    .within(() => {
      dataCy('tli-favorite-action').click({ force: true });
    });
}

function translateAction(action: string) {
  return {
    archive: 'Archiveren',
    unarchive: 'Dearchiveren',
    view: 'Bekijken'
  }[action];
}

function translateActionHeader(action: string) {
  return {
    archive: 'archiveer',
    delete: 'verwijder',
    new: 'nieuw'
  }[action];
}

export function taskActionExecute(taskAction: TaskAction) {
  // Task actions from the header work by selecting tasks first
  if (taskAction.fromHeader) {
    selectTask(taskAction.target);
    clickHeaderAction(taskAction.action);

    if (taskAction.action === 'delete' && !taskAction.shouldError) {
      confirmModal();
    }
  } else {
    if (taskAction.action === 'unarchive') {
      filterArchived();
      cy.wait(500);
    }

    if (taskAction.action === 'favorite') {
      favoriteTask(taskAction.target);
    } else {
      // Regular inline task actions
      clickTaskAction(taskAction.target, taskAction.action);
    }
  }
}

export function taskActionCheckError(taskAction: TaskAction) {
  if (taskAction.shouldError) {
    if (taskAction.action === 'delete' && taskAction.fromHeader) {
      checkModalContent(taskAction.target);
      cancelModal();
    } else {
      checkError(taskAction.target);
      dismissError();
    }
  }
}

export function setupRouteGuards(action: string) {
  switch (action) {
    case 'delete':
      cy.route('post', `${apiUrl}/api/Tasks/destroy-tasks`).as('api');
      break;
    case 'favorite':
      cy.route('post', `${apiUrl}/api/People/*/favorites`).as('api');
      break;
    default:
      cy.route('patch', `${apiUrl}/api/Tasks/update-tasks*`).as('api');
      break;
  }
}

export function selectTask(taskName: string) {
  dataCy('task-list-item')
    .contains('[data-cy=task-list-item]', taskName)
    .within(() => {
      dataCy('tli-status-icon').click();
    });
}

export function clickHeaderAction(action: string) {
  return dataCy('header-action')
    .contains('[data-cy=header-action]', translateActionHeader(action))
    .click();
}

export function confirmModal() {
  dataCy('cm-confirm').click();
}

export function cancelModal() {
  dataCy('cm-cancel').click();
}

export function waitForSnackBar() {
  cy.get('.mat-snack-bar-container').should('not.exist');
}

export function checkAbsent(taskName: string) {
  dataCy('task-list-item')
    .contains('[data-cy=task-list-item]', taskName)
    .should('not.exist');
}

export function checkFavorite(taskName: string) {
  dataCy('task-list-item')
    .contains('[data-cy=task-list-item]', taskName)
    .within(() => {
      dataCy('tli-favorite-action').should('have.class', 'favorite');
    });
}

export function checkError(containing: string) {
  dataCy('banner-content')
    .contains(containing)
    .should('exist');
}

export function checkModalContent(contents: string) {
  dataCy('cm-content').should('contain.text', contents);
}

export function dismissError() {
  dataCy('banner-action').click();
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

function listItemExpects(expects: ExpectedTaskListItemResult) {
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

  if (expects.favorite) {
    dataCy('tli-favorite-action').should('have.class', 'favorite');
  }
}
