/// <reference types="cypress" />

import {
  ApiPathsInterface,
  AppPathsInterface,
  cyEnv,
  dataCy,
  KabasMethodsPagesInterface,
  login,
  performSetup
} from '../support';
import {
  checkLPGChecked,
  checkLPGUnchecked,
  checkNavOpenBoeke,
  checkSearchResultCount,
  clickBulkLPGCheckbox,
  clickDiaboloOutroFilter,
  clickLPGCheckbox,
  enterSearchTerm,
  getActiveTab
} from './methods';

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
      dataCy('method-books-title').contains(
        setup.kabasMethodsPages.expected.method.name
      );
      dataCy('method-books-link')
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
        } is een diabolo methode.`
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
      checkNavOpenBoeke(setup);
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
      checkNavOpenBoeke(setup);
    });
    it('should show the lesson links', () => {
      dataCy('lesson-link')
        .should(
          'have.length',
          setup.kabasMethodsPages.expected.lessons.count +
            setup.kabasMethodsPages.expected.chapters.count
        )
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
      enterSearchTerm(setup);
      checkSearchResultCount(
        setup.kabasMethodsPages.expected.chapterSearchByTerm.results
      );
    });
    it('should filter on diabolo phase', () => {
      clickDiaboloOutroFilter();
      checkSearchResultCount(
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
      checkNavOpenBoeke(setup);
    });
    it('should show the lesson links', () => {
      dataCy('lesson-link')
        .should(
          'have.length',
          setup.kabasMethodsPages.expected.lessons.count +
            setup.kabasMethodsPages.expected.chapters.count
        )
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
      enterSearchTerm(setup);
      checkSearchResultCount(
        setup.kabasMethodsPages.expected.lessonSearchByTerm.results
      );
    });
    it('should filter on diabolo phase', () => {
      clickDiaboloOutroFilter();
      checkSearchResultCount(
        setup.kabasMethodsPages.expected.lessonSearchDiabolo.results
      );
    });
  });

  describe('method learningplangoals chapter + lesson', () => {
    beforeEach(() => {
      cy.visit(
        `${appPaths.methods}/${setup.kabasMethodsPages.book}/${
          setup.kabasMethodsPages.chapter
        }/${setup.kabasMethodsPages.lesson}?tab=1`
      );
    });

    it('should check off a learning plan goal', () => {
      clickLPGCheckbox(0);

      cy.visit(
        `${appPaths.methods}/${setup.kabasMethodsPages.book}/${
          setup.kabasMethodsPages.chapter
        }?tab=1`
      );

      checkLPGChecked(0);
    });

    it('should uncheck a learning plan goal', () => {
      clickLPGCheckbox(1);

      cy.visit(
        `${appPaths.methods}/${setup.kabasMethodsPages.book}/${
          setup.kabasMethodsPages.chapter
        }?tab=1`
      );

      clickLPGCheckbox(1);

      dataCy('lesson-link')
        .first()
        .click();

      checkLPGUnchecked(1);
    });

    it('should stay on the learning plan goals tab', () => {
      getActiveTab().should('have.text', 'Leerplandoelen');

      cy.visit(
        `${appPaths.methods}/${setup.kabasMethodsPages.book}/${
          setup.kabasMethodsPages.chapter
        }?tab=1`
      );

      getActiveTab().should('have.text', 'Leerplandoelen');
    });

    it('should bulk check learning plan goals in lesson', () => {
      clickBulkLPGCheckbox(0);

      cy.visit(
        `${appPaths.methods}/${setup.kabasMethodsPages.book}/${
          setup.kabasMethodsPages.chapter
        }?tab=1`
      );

      for (let i = 0; i <= 2; i++) {
        checkLPGChecked(i);
      }
    });

    it('should bulk check learning plan goals in chapter', () => {
      cy.visit(
        `${appPaths.methods}/${setup.kabasMethodsPages.book}/${
          setup.kabasMethodsPages.chapter
        }?tab=1`
      );

      clickBulkLPGCheckbox(1);

      // Since the first chapter is selected, we can assume the first lesson link is the 2nd child (= index 1)
      dataCy('lesson-link')
        .eq(1)
        .click();

      for (let i = 0; i <= 2; i++) {
        checkLPGChecked(i);
      }
    });
  });

  describe('tabs navigation', () => {
    it('should keep the tab selected from method to chapter', () => {
      cy.visit(`${appPaths.methods}/${setup.kabasMethodsPages.book}`);

      cy.get('.mat-tab-label')
        .eq(1)
        .click();

      dataCy('chapter-link')
        .first()
        .click()
        .location('pathname')
        .should(
          'be',
          `${appPaths.methods}/${setup.kabasMethodsPages.book}/${
            setup.kabasMethodsPages.chapter
          }?tab=1`
        );
    });

    it('should keep the tab selected from chapter to lesson', () => {
      cy.visit(
        `${appPaths.methods}/${setup.kabasMethodsPages.book}/${
          setup.kabasMethodsPages.chapter
        }`
      );

      cy.get('.mat-tab-label')
        .eq(1)
        .click();

      dataCy('lesson-link')
        .first()
        .click()
        .location('pathname')
        .should(
          'be',
          `${appPaths.methods}/${setup.kabasMethodsPages.book}/${
            setup.kabasMethodsPages.chapter
          }/${setup.kabasMethodsPages.lesson}?tab=1`
        );
    });
  });
});
