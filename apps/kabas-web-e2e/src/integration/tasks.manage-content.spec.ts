/// <reference types="cypress" />
import { cyEnv, login, performSetup } from '../support/commands';
import {
  ApiPathsInterface,
  AppPathsInterface,
  KabasTasksPagesInterface
} from '../support/interfaces';
describe('Manage task content', () => {
  const apiUrl = cyEnv('apiUrl');
  const appPaths = cyEnv('appPaths') as AppPathsInterface;
  const apiPaths = cyEnv('apiPaths') as ApiPathsInterface;
  let setup: KabasTasksPagesInterface;
  before(() => {
    performSetup('kabasTasksPages').then(res => {
      setup = res.body;
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
      cy.visit(
        `${appPaths.tasks}/manage/${setup.kabasTasksPages.taskId}/content`
      );
    });
    it('should show the right book', () => {
      // make some e2e tests
    });
  });
});
