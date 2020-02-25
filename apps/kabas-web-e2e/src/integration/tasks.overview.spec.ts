/// <reference types="cypress" />

import { cyEnv, login, performSetup } from '../support/commands';
import {
  ApiPathsInterface,
  AppPathsInterface,
  KabasTasksPagesInterface
} from '../support/interfaces';

describe('Tasks Overview', () => {
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
      cy.visit(`${appPaths.tasks}/manage`);
    });

    it('doesnt do anything', () => {});

    // it('practice manage page - in book', () => {
    //   dataCy('check-box-table-item-column-header')
    //     .should(
    //       'have.length',
    //       setup.kabasUnlockedFreePracticePages.expected.classGroups.length
    //     )
    //     .each(($item, index) => {
    //       expect($item).to.have.text(
    //         setup.kabasUnlockedFreePracticePages.expected.classGroups[index]
    //       );
    //     });

    //   dataCy('check-box-table-row-header').should(
    //     'have.length',
    //     setup.kabasUnlockedFreePracticePages.expected.chaptersTeacher.count
    //   );

    //   cy.route(`${apiUrl}/api/People/*/data?fields=unlockedFreePractices`).as(
    //     'api'
    //   );
    //   cy.route(
    //     'delete',
    //     `${apiUrl}/api/People/*/deleteManyUnlockedFreePracticeRemote*`
    //   ).as('api');
    // });
  });
});
