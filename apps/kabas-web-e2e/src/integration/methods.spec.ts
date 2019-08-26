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

  function checkNavOpenBoeke() {
    dataCy('nav-open-boeke').click();
    cy.window()
      .its('open')
      .should(
        'be.calledWithExactly',
        `${apiUrl}${apiPaths.eduContent}/${
          setup.kabasMethodsPages.expected.boeke.eduContentId
        }/redirectURL`
      );
  }

  function enterSearchTerm() {
    dataCy('search-filters')
      .find('campus-search-term input')
      .type(setup.kabasMethodsPages.searchTerm)
      .type('{enter}');
  }

  function clickDiaboloFilter() {
    dataCy('search-filters')
      .find('.button-toggle-filter-component__button')
      .last()
      .click();
  }

  function hasSearchResultCount(count: number) {
    cy.get('edu-content-search-result').should('have.length', count);
  }

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
      checkNavOpenBoeke();
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
      checkNavOpenBoeke();
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
      enterSearchTerm();
      hasSearchResultCount(
        setup.kabasMethodsPages.expected.chapterSearchByTerm.results
      );
    });
    it('should filter on diabolo phase', () => {
      clickDiaboloFilter();
      hasSearchResultCount(
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
      checkNavOpenBoeke();
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
      enterSearchTerm();
      hasSearchResultCount(
        setup.kabasMethodsPages.expected.lessonSearchByTerm.results
      );
    });
    it('should filter on diabolo phase', () => {
      clickDiaboloFilter();
      hasSearchResultCount(
        setup.kabasMethodsPages.expected.lessonSearchDiabolo.results
      );
    });
  });
});
