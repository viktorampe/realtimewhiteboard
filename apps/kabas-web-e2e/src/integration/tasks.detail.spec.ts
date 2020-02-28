/// <reference types="cypress" />

import { cyEnv, dataCy, login, performSetup } from '../support/commands';
import {
  ApiPathsInterface,
  AppPathsInterface,
  KabasTasksPagesInterface
} from '../support/interfaces';

describe('Tasks Detail', () => {
  const apiUrl = cyEnv('apiUrl');
  const appPaths = cyEnv('appPaths') as AppPathsInterface;
  const apiPaths = cyEnv('apiPaths') as ApiPathsInterface;
  let setup: KabasTasksPagesInterface;
  let taskPath;

  before(() => {
    performSetup('kabasTasksPages').then(res => {
      setup = res.body;

      taskPath = `${appPaths.tasks}/manage/${setup.kabasTasksPages.manageTaskDetail.taskId}`;

      // filterValues = setup.kabasTasksPages.filterValues.overview;
      // filterResults = setup.kabasTasksPages.expected.filterResults.overview;
      // sortResults = setup.kabasTasksPages.expected.sortResults;
      // smokeResults = setup.kabasTasksPages.expected.smokeResults;
      // taskActions = setup.kabasTasksPages.taskActions;
      // paperTaskActions = setup.kabasTasksPages.paperTaskActions;
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

    describe('Digital task - active', () => {
      beforeEach(() => {
        cy.visit(taskPath);
      });

      describe('pagebar', () => {
        describe('primary action buttons with correct links', () => {
          it('should allow to `add eduContent`', () => {
            dataCy('header-btn-add-educontent')
              .click()
              .location('pathname')
              .should('eq', `${taskPath}/content`);
            // .go('back');
          });

          it('should allow to `open results`', () => {
            dataCy('header-btn-open-results').should('exist');
          });

          it('should allow to `open matrix`', () => {
            dataCy('header-btn-open-matrix').should('exist');
          });

          it('should not allow to `print`', () => {
            dataCy('header-btn-print').should('not.exist');
          });
        });
      });
    });
  });
});
