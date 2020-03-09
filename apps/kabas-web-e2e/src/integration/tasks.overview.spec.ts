/// <reference types="cypress" />

import { cyEnv, dataCy, login, performSetup } from '../support/commands';
import {
  ApiPathsInterface,
  AppPathsInterface,
  KabasTasksPagesInterface,
  TaskAction
} from '../support/interfaces';
import {
  checkAbsent,
  checkFavorite,
  checkResults,
  clickHeaderAction,
  clickTaskAction,
  filterArchived,
  filterArea,
  filterAssignee,
  filterDate,
  filterName,
  filterStatus,
  resetFilters,
  setupRouteGuards,
  sortBy,
  taskActionCheckError,
  taskActionExecute,
  toggleFilters
} from './tasks.overview';

describe('Tasks Overview', () => {
  const apiUrl = cyEnv('apiUrl');
  const appPaths = cyEnv('appPaths') as AppPathsInterface;
  const apiPaths = cyEnv('apiPaths') as ApiPathsInterface;
  let setup: KabasTasksPagesInterface;
  let filterValues: typeof setup.kabasTasksPages.filterValues.overview;
  let filterResults: typeof setup.kabasTasksPages.expected.filterResults.overview;
  let sortResults: typeof setup.kabasTasksPages.expected.sortResults;
  let smokeResults: typeof setup.kabasTasksPages.expected.smokeResults;
  let taskActions: typeof setup.kabasTasksPages.taskActions;
  let paperTaskActions: typeof setup.kabasTasksPages.paperTaskActions;

  before(() => {
    performSetup('kabasTasksPages').then(res => {
      setup = res.body;

      filterValues = setup.kabasTasksPages.filterValues.overview;
      filterResults = setup.kabasTasksPages.expected.filterResults.overview;
      sortResults = setup.kabasTasksPages.expected.sortResults;
      smokeResults = setup.kabasTasksPages.expected.smokeResults;
      taskActions = setup.kabasTasksPages.taskActions;
      paperTaskActions = setup.kabasTasksPages.paperTaskActions;
    });
  });

  beforeEach(() => {
    cy.server();
  });

  describe('teacher', () => {
    beforeEach(() => {
      login(
        setup.kabasTasksPages.loginTeacher.username,
        setup.kabasTasksPages.loginTeacher.password
      );
    });

    describe('digital', () => {
      beforeEach(() => {
        cy.visit(`${appPaths.tasks}/manage`);
      });

      it('should show the right task info', () => {
        checkResults(
          smokeResults.digital.map(listItem => {
            return Object.assign({}, listItem, {
              actions: ['Bekijken', 'Archiveren', 'Resultaten', 'Doelenmatrix']
            });
          })
        );
      });

      it('should filter tasks', () => {
        toggleFilters();

        // individual filters
        filterName(filterValues.digital.name);
        checkResults(filterResults.digital.name);
        resetFilters();

        filterArea(filterValues.digital.area);
        checkResults(filterResults.digital.area);
        resetFilters();

        filterDate(filterValues.digital.date);
        checkResults(filterResults.digital.date);
        resetFilters();

        filterAssignee(filterValues.digital.assignee);
        checkResults(filterResults.digital.assignee);
        resetFilters();

        filterValues.digital.status.forEach(statusFilter => {
          filterStatus(statusFilter);
        });
        checkResults(filterResults.digital.status);
        resetFilters();

        filterArchived();
        checkResults(filterResults.digital.archived);
        resetFilters();

        // combined filters:
        filterName(filterValues.digital.combined.name);
        filterArea(filterValues.digital.combined.area);
        filterDate(filterValues.digital.combined.date);
        filterValues.digital.combined.status.forEach(statusFilter => {
          filterStatus(statusFilter);
        });
        if (filterValues.digital.combined.archived) {
          filterArchived();
        }
        checkResults(filterResults.digital.combined);
        resetFilters();
      });

      it('should sort tasks', () => {
        toggleFilters();

        setup.kabasTasksPages.sortValues.forEach(sortValue => {
          sortBy(sortValue);
          checkResults(sortResults.digital[sortValue]);
        });
      });

      it('should execute task actions', () => {
        // used for dearchive action
        toggleFilters();

        let lastAction: TaskAction = null;

        taskActions.forEach(taskAction => {
          if (
            lastAction &&
            !lastAction.fromHeader &&
            lastAction.action === 'unarchive'
          ) {
            resetFilters();
          }

          // Wait for the store to settle, normally not needed but this test was flaky otherwise
          cy.wait(2000);

          // This action will do an API call, so we set up a guard to wait for it
          if (!taskAction.shouldError) {
            setupRouteGuards(taskAction.action);
          }

          // Do the action
          taskActionExecute(taskAction);

          // Now we wait for our action to be processed by the API first
          if (!taskAction.shouldError) {
            cy.wait('@api');
          }

          if (taskAction.removesTarget) {
            checkAbsent(taskAction.target);
          }

          if (taskAction.shouldFavorite) {
            checkFavorite(taskAction.target);
          }

          // Error message checking
          taskActionCheckError(taskAction);

          lastAction = taskAction;
        });
      });

      it('should navigate to the right pages', () => {
        dataCy('new-task-button')
          .click()
          .location('pathname')
          .should('eq', `/${appPaths.tasks}/manage/new`)
          .location('search')
          .should('eq', '?digital=true')
          .go('back');

        clickHeaderAction('new')
          .location('pathname')
          .should('eq', `/${appPaths.tasks}/manage/new`)
          .location('search')
          .should('eq', '?digital=true')
          .go('back');

        clickTaskAction(setup.kabasTasksPages.viewTask, 'view')
          .location('pathname')
          .should(
            'eq',
            `/${appPaths.tasks}/manage/${setup.kabasTasksPages.expected.viewTaskId}`
          );
      });
    });

    describe('paper', () => {
      beforeEach(() => {
        cy.visit(`${appPaths.tasks}/manage?tab=1`);
      });

      it('should show the right task info', () => {
        checkResults(
          smokeResults.paper.map(listItem => {
            return Object.assign({}, listItem, {
              actions: ['Bekijken', 'Archiveren', 'Resultaten', 'Doelenmatrix']
            });
          })
        );
      });

      it('should filter tasks', () => {
        toggleFilters();

        // individual filters
        filterName(filterValues.paper.name);
        checkResults(filterResults.paper.name);
        resetFilters();

        filterArea(filterValues.paper.area);
        checkResults(filterResults.paper.area);
        resetFilters();

        filterAssignee(filterValues.paper.assignee);
        checkResults(filterResults.paper.assignee);
        resetFilters();

        filterArchived();
        checkResults(filterResults.paper.archived);
        resetFilters();

        // combined filters:
        filterName(filterValues.paper.combined.name);
        filterArea(filterValues.paper.combined.area);
        if (filterValues.paper.combined.archived) {
          filterArchived();
        }
        checkResults(filterResults.paper.combined);
        resetFilters();
      });

      it('should sort tasks', () => {
        toggleFilters();

        setup.kabasTasksPages.paperSortValues.forEach(sortValue => {
          sortBy(sortValue);
          checkResults(sortResults.paper[sortValue]);
        });
      });

      it('should execute task actions', () => {
        // used for dearchive action
        toggleFilters();

        let lastAction: TaskAction = null;

        paperTaskActions.forEach(taskAction => {
          if (
            lastAction &&
            !lastAction.fromHeader &&
            lastAction.action === 'unarchive'
          ) {
            resetFilters();
          }

          // Wait for the store to settle, normally not needed but this test was flaky otherwise
          cy.wait(2000);

          // This action will do an API call, so we set up a guard to wait for it
          if (!taskAction.shouldError) {
            setupRouteGuards(taskAction.action);
          }

          // Do the action
          taskActionExecute(taskAction);

          // Now we wait for our action to be processed by the API first
          if (!taskAction.shouldError) {
            cy.wait('@api');
          }

          if (taskAction.removesTarget) {
            checkAbsent(taskAction.target);
          }

          // Error message checking
          taskActionCheckError(taskAction);

          lastAction = taskAction;
        });
      });

      it('should navigate to the right pages', () => {
        dataCy('new-task-button')
          .click()
          .location('pathname')
          .should('eq', `/${appPaths.tasks}/manage/new`)
          .location('search')
          .should('eq', '?paper=true')
          .go('back');

        clickHeaderAction('new')
          .location('pathname')
          .should('eq', `/${appPaths.tasks}/manage/new`)
          .location('search')
          .should('eq', '?paper=true')
          .go('back');

        clickTaskAction(setup.kabasTasksPages.paperViewTask, 'view')
          .location('pathname')
          .should(
            'eq',
            `/${appPaths.tasks}/manage/${setup.kabasTasksPages.expected.paperViewTaskId}`
          );
      });
    });
  });
});
