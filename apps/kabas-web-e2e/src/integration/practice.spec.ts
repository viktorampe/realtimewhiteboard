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
    performSetup('kabasUnlockedFreePracticePages').then(res => {
      setup = res.body;
    });
  });

  beforeEach(() => {
    cy.server();
  });

  describe('teacher', () => {
    beforeEach(() => {
      login(
        setup.kabasUnlockedFreePracticePages.loginTeacher.username,
        setup.kabasUnlockedFreePracticePages.loginTeacher.password
      );
    });

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
            `${appPaths.practice}/manage/${setup.kabasUnlockedFreePracticePages.book}`
          );
      });
    });

    describe('practice manage page - in book', () => {
      beforeEach(() => {
        cy.visit(
          `${appPaths.practice}/manage/${setup.kabasUnlockedFreePracticePages.book}`
        );
      });

      it('should allow enabling and disabling chapters for students', () => {
        dataCy('check-box-table-item-column-header')
          .should(
            'have.length',
            setup.kabasUnlockedFreePracticePages.expected.classGroups.length
          )
          .each(($item, index) => {
            expect($item).to.have.text(
              setup.kabasUnlockedFreePracticePages.expected.classGroups[index]
            );
          });

        dataCy('check-box-table-row-header').should(
          'have.length',
          setup.kabasUnlockedFreePracticePages.expected.chaptersTeacher.count
        );

        cy.route(`${apiUrl}/api/People/*/data?fields=unlockedFreePractices`).as(
          'api'
        );
        cy.route(
          'delete',
          `${apiUrl}/api/People/*/deleteManyUnlockedFreePracticeRemote*`
        ).as('api');

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

    describe('block student version of page for teacher', () => {
      beforeEach(() => {
        cy.visit(`${appPaths.practice}`);
      });

      it('should error', () => {
        cy.location().should('be', `error/401`);
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

    describe('practice overview page', () => {
      beforeEach(() => {
        cy.visit(`${appPaths.practice}`, {
          onBeforeLoad(win) {
            cy.stub(win, 'open');
          }
        });
      });

      it('should show the method tiles and kweetet link', () => {
        dataCy('method-book-tile-title').should(
          'contain',
          setup.kabasUnlockedFreePracticePages.expected.methodStudent.name
        );

        dataCy('method-book-tile-area-name').should(
          'contain',
          setup.kabasUnlockedFreePracticePages.expected.methodStudent.areaName
        );

        dataCy('kweetet-link').click();

        cy.window()
          .its('open')
          .should('be.calledWithMatch', 'www.kweetet.be');
      });
    });

    describe('practice book page', () => {
      beforeEach(() => {
        cy.visit(
          `${appPaths.practice}/${setup.kabasUnlockedFreePracticePages.book}`
        );
      });

      it('should show the book chapters', () => {
        dataCy('chapter-block-title').should(
          'contain',
          setup.kabasUnlockedFreePracticePages.expected.chaptersStudent
            .firstChapter.name
        );
        dataCy('chapter-block-exercises-available').should(
          'contain',
          setup.kabasUnlockedFreePracticePages.expected.chaptersStudent
            .firstChapter.exercisesAvailable
        );
        dataCy('chapter-block-exercises-completed').should(
          'contain',
          setup.kabasUnlockedFreePracticePages.expected.chaptersStudent
            .firstChapter.exercisesCompleted
        );
        dataCy('chapter-block-kwetons-remaining').should(
          'contain',
          setup.kabasUnlockedFreePracticePages.expected.chaptersStudent
            .firstChapter.kwetonsRemaining
        );

        dataCy('chapter-block')
          .should(
            'have.length',
            setup.kabasUnlockedFreePracticePages.expected.chaptersStudent.count
          )
          .first()
          .click()
          .location('pathname')
          .should(
            'be',
            `${appPaths.practice}/${setup.kabasUnlockedFreePracticePages.book}/${setup.kabasUnlockedFreePracticePages.chapter}`
          );
      });

      it('should have a back link', () => {
        dataCy('back-link')
          .click()
          .location('pathname')
          .should('be', `${appPaths.practice}`);
      });
    });

    describe('practice book chapter page', () => {
      beforeEach(() => {
        cy.visit(
          `${appPaths.practice}/${setup.kabasUnlockedFreePracticePages.book}/${setup.kabasUnlockedFreePracticePages.chapter}`
        );
      });

      it('should show the chapters and lessons as well as results', () => {
        dataCy('search-results-count').should(
          'contain',
          setup.kabasUnlockedFreePracticePages.expected.chapterSearchNoFilters
            .results
        );

        dataCy('chapter-item').should(
          'contain',
          setup.kabasUnlockedFreePracticePages.expected.chaptersStudent
            .firstChapter.name
        );

        dataCy('lesson-link')
          .should(
            'have.length',
            setup.kabasUnlockedFreePracticePages.expected.lessons.count
          )
          .first()
          .click()
          .location('pathname')
          .should(
            'be',
            `${appPaths.practice}/${setup.kabasUnlockedFreePracticePages.book}/${setup.kabasUnlockedFreePracticePages.chapter}/${setup.kabasUnlockedFreePracticePages.lesson}`
          );
      });

      it('should have a back link', () => {
        dataCy('back-link')
          .click()
          .location('pathname')
          .should('be', `${appPaths.practice}`);
      });
    });

    describe('practice book chapter lesson page', () => {
      beforeEach(() => {
        cy.visit(
          `${appPaths.practice}/${setup.kabasUnlockedFreePracticePages.book}/${setup.kabasUnlockedFreePracticePages.chapter}/${setup.kabasUnlockedFreePracticePages.lesson}`
        );
      });

      it('should show the chapters and lessons as well as results', () => {
        dataCy('search-results-count').should(
          'contain',
          setup.kabasUnlockedFreePracticePages.expected.lessonSearchNoFilters
            .results
        );

        dataCy('lesson-link').should(
          'have.length',
          setup.kabasUnlockedFreePracticePages.expected.lessons.count
        );

        dataCy('chapter-item')
          .should(
            'contain',
            setup.kabasUnlockedFreePracticePages.expected.chaptersStudent
              .firstChapter.name
          )
          .first()
          .click()
          .location('pathname')
          .should(
            'be',
            `${appPaths.practice}/${setup.kabasUnlockedFreePracticePages.book}/${setup.kabasUnlockedFreePracticePages.chapter}`
          );
      });

      it('should have a back link', () => {
        dataCy('back-link')
          .click()
          .location('pathname')
          .should('be', `${appPaths.practice}`);
      });
    });

    describe('block teacher version of page for student', () => {
      beforeEach(() => {
        cy.visit(`${appPaths.practice}/manage`);
      });

      it('should error', () => {
        cy.location().should('be', `error/401`);
      });
    });
  });
});
