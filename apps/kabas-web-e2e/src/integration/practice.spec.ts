/// <reference types="cypress" />

import { cyEnv, dataCy, login, performSetup } from '../support/commands';
import {
  ApiPathsInterface,
  AppPathsInterface,
  KabasPracticePagesInterface
} from '../support/interfaces';

describe('Practice', () => {
  const apiUrl = cyEnv('apiUrl');
  const appPaths = cyEnv('appPaths') as AppPathsInterface;
  const apiPaths = cyEnv('apiPaths') as ApiPathsInterface;
  let setup: KabasPracticePagesInterface;

  before(() => {
    performSetup('kabasUnlockedFreePracticePages').then(res => {
      setup = res.body;
    });
  });

  describe('teacher', () => {
    beforeEach(() => {
      login(
        setup.kabasUnlockedFreePracticePages.loginTeacher.username,
        setup.kabasUnlockedFreePracticePages.loginTeacher.password
      );
    });

    /*describe('practice manage page', () => {
      beforeEach(() => {
        cy.visit(`${appPaths.practice}/manage`);
      });
      it('should show methods', () => {
        dataCy('method-books-title').contains(
          setup.kabasUnlockedFreePracticePages.expected.methodTeacher.name
        );
        dataCy('method-books-link')
          .contains(
            setup.kabasUnlockedFreePracticePages.expected.methodTeacher.year
          )
          .click()
          .location('pathname')
          .should(
            'be',
            `${appPaths.practice}/manage/${
              setup.kabasUnlockedFreePracticePages.book
            }`
          );
      });
    });*/

    describe('practice manage page - in book', () => {
      beforeEach(() => {
        cy.visit(
          `${appPaths.practice}/manage/${
            setup.kabasUnlockedFreePracticePages.book
          }`
        );
      });
      /*it('should show classgroup columns', () => {
        cy.get('.ui-multi-check-box-table__header--item').each(
          ($item, index) => {
            expect($item).to.have.text(
              setup.kabasUnlockedFreePracticePages.expected.classGroups[index]
            );
          }
        );
      });
      it('should show chapter row headers', () => {
        cy.get('.ui-multi-check-box-table__body__row__cell--row-header').should(
          'have.length',
          setup.kabasUnlockedFreePracticePages.expected.chaptersTeacher.count
        );
      });*/

      it('should show disable chapter checkboxes when checking all for classgroup', () => {
        cy.server();
        cy.route(
          apiUrl + 'api/People/468/data?fields=unlockedFreePractices'
        ).as('dataUFP');

        dataCy('practice-check-box-table')
          .find('mat-checkbox')
          .eq(1)
          .click();

        cy.wait('@dataUFP');

        dataCy('practice-check-box-table')
          .find('mat-checkbox')
          .eq(3)
          .should('have.class', 'mat-checkbox-disabled');

        //clickPracticeCheckbox(1);
        //checkPracticeDisabled(3);
      });
    });
  });

  describe('student', () => {
    beforeEach(() => {
      login(
        setup.kabasUnlockedFreePracticePages.loginStudent.username,
        setup.kabasUnlockedFreePracticePages.loginStudent.password
      );
    });
  });
});
