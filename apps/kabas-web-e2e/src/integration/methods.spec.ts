/// <reference types="cypress" />

import { cyEnv, dataCy, login, performSetup } from '../support/commands';
import {
  ApiPathsInterface,
  AppPathsInterface,
  KabasMethodsPagesInterface
} from '../support/interfaces';

describe('Methods', () => {
  const apiUrl = cyEnv('apiUrl');
  const appPaths = cyEnv('appPaths') as AppPathsInterface;
  const apiPaths = cyEnv('apiPaths') as ApiPathsInterface;
  let setup: KabasMethodsPagesInterface;

  before(() => {
    performSetup('kabasMethodsPages').then(res => {
      setup = res.body;
    });
  });

  beforeEach(() => {
    login(
      setup.kabasMethodsPages.login.username,
      setup.kabasMethodsPages.login.password
    );
  });

  describe('methods overview page', () => {
    beforeEach(() => {
      cy.visit(`${appPaths.methods}`);
    });
    it('should show methods', () => {
      dataCy('method-year-title').contains(
        setup.kabasMethodsPages.expected.method.name
      );
      dataCy('method-year-link')
        .contains(setup.kabasMethodsPages.expected.method.year)
        .click()
        .location('pathname')
        .should('be', `${appPaths.methods}/${setup.kabasMethodsPages.book}`);
    });
  });

  describe('method page', () => {
    beforeEach(() => {
      cy.visit(`${appPaths.methods}/${setup.kabasMethodsPages.book}`, {
        onBeforeLoad(win) {
          cy.stub(win, 'open');
        }
      });
    });
    it('should show the boeke card', () => {
      dataCy('diabolo-info').contains(
        `${
          setup.kabasMethodsPages.expected.method.name
        } is een diabolo methode. Lees meer over diabolo`
      );
      dataCy('open-boeke').click();
      cy.window()
        .its('open')
        .should(
          'be.calledWithExactly',
          `${apiUrl}${apiPaths.eduContent}/${
            setup.kabasMethodsPages.expected.boeke.eduContentId
          }/redirectURL`
        );
    });
    it('should show the boeke link in the top bar', () => {
      dataCy('nav-open-boeke').click();
      cy.window()
        .its('open')
        .should(
          'be.calledWithExactly',
          `${apiUrl}${apiPaths.eduContent}/${
            setup.kabasMethodsPages.expected.boeke.eduContentId
          }/redirectURL`
        );
    });
    it('should show the general files', () => {
      dataCy('general-file').should(
        'have.length',
        setup.kabasMethodsPages.expected.generalFiles.count
      );
    });
    it('should show the chapter links', () => {
      dataCy('chapter-link')
        .should('have.length', setup.kabasMethodsPages.expected.chapters.count)
        .first()
        .click()
        .location('pathname')
        .should(
          'be',
          `${appPaths.methods}/${setup.kabasMethodsPages.book}/${
            setup.kabasMethodsPages.chapter
          }`
        );
    });
  });

  describe('method chapter page', () => {
    beforeEach(() => {
      cy.visit(
        `${appPaths.methods}/${setup.kabasMethodsPages.book}/${
          setup.kabasMethodsPages.chapter
        }`,
        {
          onBeforeLoad(win) {
            cy.stub(win, 'open');
          }
        }
      );
    });
    it('should show the boeke link in the top bar', () => {
      dataCy('nav-open-boeke').click();
      cy.window()
        .its('open')
        .should(
          'be.calledWithExactly',
          `${apiUrl}${apiPaths.eduContent}/${
            setup.kabasMethodsPages.expected.boeke.eduContentId
          }/redirectURL`
        );
    });
    it('should show the lesson links', () => {
      dataCy('lesson-link')
        .should('have.length', setup.kabasMethodsPages.expected.lessons.count)
        .first()
        .click()
        .location('pathname')
        .should(
          'be',
          `${appPaths.methods}/${setup.kabasMethodsPages.book}/${
            setup.kabasMethodsPages.chapter
          }/${setup.kabasMethodsPages.lesson}`
        );
    });
    it('should show search results', () => {
      cy.get('edu-content-search-result').should(
        'have.length',
        setup.kabasMethodsPages.expected.chapterSearchNoFilters.results
      );
    });
    it('should filter on search term', () => {
      dataCy('search-filters')
        .find('campus-search-term input')
        .type(setup.kabasMethodsPages.searchTerm)
        .type('{enter}');

      cy.get('edu-content-search-result').should(
        'have.length',
        setup.kabasMethodsPages.expected.chapterSearchByTerm.results
      );
    });
    it('should filter on diabolo phase', () => {
      dataCy('search-filters')
        .find('.button-toggle-filter-component__button')
        .last()
        .click();

      cy.get('edu-content-search-result').should(
        'have.length',
        setup.kabasMethodsPages.expected.chapterSearchDiabolo.results
      );
    });
  });

  describe('method lesson page', () => {
    beforeEach(() => {
      cy.visit(
        `${appPaths.methods}/${setup.kabasMethodsPages.book}/${
          setup.kabasMethodsPages.chapter
        }/${setup.kabasMethodsPages.lesson}`,
        {
          onBeforeLoad(win) {
            cy.stub(win, 'open');
          }
        }
      );
    });
    it('should show the boeke link in the top bar', () => {
      dataCy('nav-open-boeke').click();
      cy.window()
        .its('open')
        .should(
          'be.calledWithExactly',
          `${apiUrl}${apiPaths.eduContent}/${
            setup.kabasMethodsPages.expected.boeke.eduContentId
          }/redirectURL`
        );
    });
    it('should show the lesson links', () => {
      dataCy('lesson-link')
        .should('have.length', setup.kabasMethodsPages.expected.lessons.count)
        .last()
        .click()
        .location('pathname')
        .should(
          'be',
          `${appPaths.methods}/${setup.kabasMethodsPages.book}/${
            setup.kabasMethodsPages.chapter
          }/${setup.kabasMethodsPages.lessonLast}`
        );
    });
    it('should show search results', () => {
      cy.get('edu-content-search-result').should(
        'have.length',
        setup.kabasMethodsPages.expected.lessonSearchNoFilters.results
      );
    });
    it('should filter on search term', () => {
      dataCy('search-filters')
        .find('campus-search-term input')
        .type(setup.kabasMethodsPages.searchTerm)
        .type('{enter}');

      cy.get('edu-content-search-result').should(
        'have.length',
        setup.kabasMethodsPages.expected.lessonSearchByTerm.results
      );
    });
    it('should filter on diabolo phase', () => {
      dataCy('search-filters')
        .find('.button-toggle-filter-component__button')
        .last()
        .click();

      cy.get('edu-content-search-result').should(
        'have.length',
        setup.kabasMethodsPages.expected.lessonSearchDiabolo.results
      );
    });
  });

  describe('method learningplangoals chapter + lesson', () => {
    beforeEach(() => {
      cy.visit(
        `${appPaths.methods}/${setup.kabasMethodsPages.book}/${
          setup.kabasMethodsPages.chapter
        }/${setup.kabasMethodsPages.lesson}?tab=1`,
        {
          onBeforeLoad(win) {
            cy.stub(win, 'open');
          }
        }
      );
    });

    it('should check off a learning plan goal', () => {
      dataCy('goals-check-box-table')
        .find('mat-checkbox')
        .first()
        .click();

      dataCy('back-link').click();

      dataCy('goals-check-box-table')
        .find('mat-checkbox')
        .first()
        .should('have.class', 'mat-checkbox-checked');
    });

    it('should uncheck a learning plan goal', () => {
      dataCy('goals-check-box-table')
        .find('mat-checkbox')
        .eq(1)
        .click();

      dataCy('back-link').click();

      dataCy('goals-check-box-table')
        .find('mat-checkbox')
        .eq(1)
        .click();

      dataCy('lesson-link')
        .should('have.length', setup.kabasMethodsPages.expected.lessons.count)
        .first()
        .click();

      dataCy('goals-check-box-table')
        .find('mat-checkbox')
        .eq(1)
        .should('not.have.class', 'mat-checkbox-checked');
    });

    it('should stay on the learning plan goals tab', () => {
      cy.get('.mat-tab-label-active')
        .find('.mat-tab-label-content')
        .should('have.text', 'Leerplandoelen');

      dataCy('back-link').click();

      cy.get('.mat-tab-label-active')
        .find('.mat-tab-label-content')
        .should('have.text', 'Leerplandoelen');
    });
  });
});
