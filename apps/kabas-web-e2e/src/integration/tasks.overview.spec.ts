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
  checkResults,
  clickHeaderAction,
  clickTaskAction,
  filterArchived,
  filterArea,
  filterDate,
  filterName,
  filterStatus,
  resetFilters,
  sortBy,
  taskActionCheckError,
  taskActionExecute
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

        // TODO: assignee filter here! it's currently bugged on the front-end so can't test it

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
        setup.kabasTasksPages.sortValues.forEach(sortValue => {
          sortBy(sortValue);
          checkResults(sortResults.digital[sortValue]);
        });
      });

      it('should execute task actions', () => {
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
          cy.wait(500);

          // This action will do an API call, so we set up a guard to wait for it
          if (!taskAction.shouldError) {
            taskAction.action === 'delete'
              ? cy.route('post', `${apiUrl}/api/Tasks/destroy-tasks`).as('api')
              : cy
                  .route('patch', `${apiUrl}/api/Tasks/update-tasks*`)
                  .as('api');
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
        dataCy('new-task-digital')
          .click()
          .location('pathname')
          .should('be', `${appPaths.tasks}/manage/new?digital=true`)
          .go('back');

        clickHeaderAction('new')
          .location('pathname')
          .should('be', `${appPaths.tasks}/manage/new?digital=true`)
          .go('back');

        clickTaskAction(setup.kabasTasksPages.viewTask, 'view')
          .location('pathname')
          .should(
            'be',
            `${appPaths.tasks}/manage/${setup.kabasTasksPages.expected.viewTaskId}`
          );

        // TODO: tabs?
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
        // individual filters
        filterName(filterValues.paper.name);
        checkResults(filterResults.paper.name);
        resetFilters();

        filterArea(filterValues.paper.area);
        checkResults(filterResults.paper.area);
        resetFilters();

        // TODO: assignee filter here! it's currently bugged on the front-end so can't test it

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
        setup.kabasTasksPages.paperSortValues.forEach(sortValue => {
          sortBy(sortValue);
          checkResults(sortResults.paper[sortValue]);
        });
      });

      it('should execute task actions', () => {
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
          cy.wait(500);

          // This action will do an API call, so we set up a guard to wait for it
          if (!taskAction.shouldError) {
            taskAction.action === 'delete'
              ? cy.route('post', `${apiUrl}/api/Tasks/destroy-tasks`).as('api')
              : cy
                  .route('patch', `${apiUrl}/api/Tasks/update-tasks*`)
                  .as('api');
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
        dataCy('new-task-paper')
          .click()
          .location('pathname')
          .should('be', `${appPaths.tasks}/manage/new?paper=true`)
          .go('back');

        clickHeaderAction('new')
          .location('pathname')
          .should('be', `${appPaths.tasks}/manage/new?paper=true`)
          .go('back');

        clickTaskAction(setup.kabasTasksPages.paperViewTask, 'view')
          .location('pathname')
          .should(
            'be',
            `${appPaths.tasks}/manage/${setup.kabasTasksPages.expected.paperViewTaskId}`
          );

        // TODO: tabs?
      });
    });
  });
});
