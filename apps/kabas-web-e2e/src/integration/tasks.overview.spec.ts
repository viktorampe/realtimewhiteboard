/// <reference types="cypress" />

import { cyEnv, dataCy, login, performSetup } from '../support/commands';
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

    describe('digital', () => {
      xit('should show all the elements', () => {
        // tabs, can't use dataCy because they disappear
        cy.get('.mat-tab-label-content')
          .eq(0)
          .should('have.text', 'Digitale taken');
        cy.get('.mat-tab-label-content')
          .eq(1)
          .should('have.text', 'Papieren taken');

        // filters
        dataCy('name-filter').should('exist');
        dataCy('area-filter').should('exist');
        dataCy('date-filter').should('exist');
        dataCy('assignee-filter').should('exist');
        dataCy('status-filter').should('exist');
        dataCy('archived-filter').should('exist');
        dataCy('reset-filters').should('exist');

        // sorting
        dataCy('sort-dropdown').should('exist');

        // new task
        dataCy('new-task-digital').should('exist');
        dataCy('nav-new-task').should('exist');
      });

      it('should filter tasks', () => {
        dataCy('name-filter')
          .find('input')
          .focus()
          .type('active');

        dataCy('area-filter').click();
        dataCy('select-option')
          .eq(0)
          .click();
        cy.get('body').type('{esc}');

        dataCy('date-filter').click();
        dataCy('date-option')
          .eq(1)
          .click();
        dataCy('date-confirm').click();

        dataCy('assignee-filter').click();
        dataCy('select-option')
          .eq(0)
          .click();
        cy.get('body').type('{esc}');

        dataCy('status-filter')
          .get('[data-cy=button-toggle-button')
          .eq(1)
          .click();

        dataCy('archived-filter').click();
        dataCy('reset-filters').click();
      });
    });

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
