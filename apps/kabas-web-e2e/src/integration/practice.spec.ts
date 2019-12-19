/// <reference types="cypress" />

import { cyEnv, dataCy, login, performSetup } from '../support/commands';
import {
  ApiPathsInterface,
  AppPathsInterface,
  KabasPracticePagesInterface
} from '../support/interfaces';
import {
  checkItemPracticeCheckboxDisabled,
  checkItemPracticeCheckboxEnabled,
  checkItemPracticeCheckboxUnchecked,
  clickBulkPracticeCheckbox,
  clickItemPracticeCheckbox
} from './practice';

describe('Practice', () => {
  const apiUrl = cyEnv('apiUrl');
  const appPaths = cyEnv('appPaths') as AppPathsInterface;
  const apiPaths = cyEnv('apiPaths') as ApiPathsInterface;
  let setup: KabasPracticePagesInterface;

  before(() => {
    Cypress.Cookies.debug(true);
    Cypress.Cookies.preserveOnce();
    return performSetup('kabasUnlockedFreePracticePages').then(res => {
      setup = res.body;
      return login(
        setup.kabasUnlockedFreePracticePages.loginTeacher.username,
        setup.kabasUnlockedFreePracticePages.loginTeacher.password
      );
    });
  });

  describe('teacher', () => {
    beforeEach(() => {});

    describe('practice manage page', () => {
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
    });

    describe('practice manage page - in book', () => {
      beforeEach(() => {
        cy.visit(
          `${appPaths.practice}/manage/${
            setup.kabasUnlockedFreePracticePages.book
          }`
        );
      });

      it('should allow enabling and disabling chapters for students', () => {
        dataCy('check-box-table-item-column-header').each(($item, index) => {
          expect($item).to.have.text(
            setup.kabasUnlockedFreePracticePages.expected.classGroups[index]
          );
        });

        dataCy('check-box-table-row-header').should(
          'have.length',
          setup.kabasUnlockedFreePracticePages.expected.chaptersTeacher.count
        );

        clickItemPracticeCheckbox(1);
        clickBulkPracticeCheckbox(1);
        checkItemPracticeCheckboxDisabled(1);
        clickBulkPracticeCheckbox(1);
        checkItemPracticeCheckboxEnabled(1);
        checkItemPracticeCheckboxUnchecked(1);

        clickBulkPracticeCheckbox(0);
        checkItemPracticeCheckboxEnabled(0);

        clickItemPracticeCheckbox(0);
        clickItemPracticeCheckbox(2);
        clickItemPracticeCheckbox(4);

        checkItemPracticeCheckboxEnabled(0);
        checkItemPracticeCheckboxEnabled(2);
        checkItemPracticeCheckboxEnabled(4);
      });

      it('should persist changes to the unlocked chapters', () => {
        checkItemPracticeCheckboxEnabled(0);
        checkItemPracticeCheckboxEnabled(2);
        checkItemPracticeCheckboxEnabled(4);
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
