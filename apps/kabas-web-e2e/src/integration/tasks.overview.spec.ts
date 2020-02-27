/// <reference types="cypress" />

import { cyEnv, dataCy, login, performSetup } from '../support/commands';
import {
  ApiPathsInterface,
  AppPathsInterface,
  KabasTasksPagesInterface
} from '../support/interfaces';
import {
  checkAbsent,
  checkError,
  checkResults,
  clickTaskAction,
  dismissError,
  filterArchived,
  filterArea,
  filterDate,
  filterName,
  filterStatus,
  resetFilters,
  sortBy
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

  before(() => {
    performSetup('kabasTasksPages').then(res => {
      setup = res.body;

      filterValues = setup.kabasTasksPages.filterValues.overview;
      filterResults = setup.kabasTasksPages.expected.filterResults.overview;
      sortResults = setup.kabasTasksPages.expected.sortResults;
      smokeResults = setup.kabasTasksPages.expected.smokeResults;
      taskActions = setup.kabasTasksPages.taskActions;
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

    beforeEach(() => {
      cy.visit(`${appPaths.tasks}/manage`);
    });

    describe('digital', () => {
      xit('should show all the elements', () => {
        // tabs, can't use dataCy because they disappear
        cy.get('.mat-tab-label-content')
          .eq(0)
          .should('have.text', 'Digitale taken');
        cy.get('.mat-tab-label-content')
          .eq(1)
          .should('have.text', 'Papieren taken');

        // new task
        dataCy('new-task-digital').should('exist');
        dataCy('nav-new-task').should('exist');
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
        taskActions.forEach(taskAction => {
          if (taskAction.fromHeader) {
            // TODO: skipped, for now -> banner/timing issues
            return;
            //selectTask(taskAction.target);
            //clickHeaderAction(taskAction.action);
          } else {
            if (!taskAction.shouldError) {
              cy.route('patch', `${apiUrl}/api/Tasks/update-tasks*`).as('api');
            }

            clickTaskAction(taskAction.target, taskAction.action);

            if (!taskAction.shouldError) {
              cy.wait('@api');
            }
          }

          if (taskAction.removesTarget) {
            checkAbsent(taskAction.target);
          }

          if (taskAction.shouldError) {
            checkError(taskAction.target);
            dismissError();
          }
        });
      });

      /*
        e2e todo:
        - Delete action with success (Unassigned digital task)
        - Delete action with failure (Active + pending, should be listed in modal)
        - Unarchive action
        - View action should redirect
        - New action should redirect (header & button)
        - Tooltips (mat-tooltip)
        - Favorite/unfavorite (favorite button not visible!)
      */
    });
  });
});
