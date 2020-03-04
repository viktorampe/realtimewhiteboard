/// <reference types="cypress" />
import { cyEnv, dataCy, login, performSetup } from '../support/commands';
import {
  ApiPathsInterface,
  AppPathsInterface,
  KabasTasksPagesInterface
} from '../support/interfaces';
import {
  filterByBook,
  filterByChapter,
  filterByLesson,
  dragDrop
} from './tasks.manage-content';
describe('Manage task content', () => {
  const apiUrl = cyEnv('apiUrl');
  const appPaths = cyEnv('appPaths') as AppPathsInterface;
  const apiPaths = cyEnv('apiPaths') as ApiPathsInterface;
  let setup: KabasTasksPagesInterface;
  let manageTaskContentSetup: typeof setup.kabasTasksPages.manageTaskContent;
  let filterSetup: typeof manageTaskContentSetup.expected.filter;
  let searchSetup: typeof manageTaskContentSetup.expected.search;

  before(() => {
    performSetup('kabasTasksPages').then(res => {
      setup = res.body;
      manageTaskContentSetup = setup.kabasTasksPages.manageTaskContent;
      filterSetup = manageTaskContentSetup.expected.filter;
      searchSetup = manageTaskContentSetup.expected.search;
    });
  });
  beforeEach(() => {
    cy.server();
  });

  describe('teacher', () => {
    describe('filters', () => {
      describe('digital task', () => {
        before(() => {
          login(
            setup.kabasTasksPages.loginTeacher.username,
            setup.kabasTasksPages.loginTeacher.password
          );
          cy.visit(
            `${appPaths.tasks}/manage/${manageTaskContentSetup.taskId}/content`
          );
        });

        it('should select a favorite book', () => {
          dataCy('book-title').should(
            'contain',
            filterSetup.book.favoriteBookTitle
          );
          dataCy('change-book').should('contain', 'Zoek in ander boek');
          dataCy('method-books-title')
            .should('not.be.undefined')
            .location('pathname')
            .should(
              'be',
              `${appPaths.tasks}/manage/content?book=${filterSetup.book.favoriteBookId}`
            );
        });

        it('should show the right method', () => {
          dataCy('change-book')
            .click()
            .should('contain', 'Boeken verbergen');
          dataCy('method-books-title').should(
            'contain',
            filterSetup.book.methodName
          );
        });

        it('should filter by choosing a book', () => {
          filterByBook()
            .location('pathname')
            .should(
              'be',
              `${appPaths.tasks}/manage/content?book=${filterSetup.book.id}`
            );
          dataCy('book-title').should('contain', filterSetup.book.bookTitle);
        });

        it('should filter by choosing a book chapter', () => {
          filterByChapter()
            .location('pathname')
            .should(
              'be',
              `${appPaths.tasks}/manage/content?book=${filterSetup.book.id}&chapter=${filterSetup.chapter.id}`
            );
        });

        it('should filter by choosing a book lesson', () => {
          filterByLesson()
            .location('pathname')
            .should(
              'be',
              `${appPaths.tasks}/manage/content?book=${filterSetup.book.id}&chapter=${filterSetup.chapter.id}&lesson=lalalaal`
            );
        });

        it('should filter by searching by term', () => {
          filterByBook();

          dataCy('search-term-filter')
            .find('input')
            .focus()
            .type(`${filterSetup.term.value}{enter}`);

          dataCy('search-results-count').should(
            'contain',
            `${filterSetup.term.resultCount} resultaten`
          );
        });

        it('should reset the search term filter', () => {
          dataCy('search-filter-reset').click();

          dataCy('search-results-count').should(
            'contain',
            `${filterSetup.book.resultCount} resultaten`
          );
        });
      });

      describe.only('paper task', () => {
        before(() => {
          login(
            setup.kabasTasksPages.loginTeacher.username,
            setup.kabasTasksPages.loginTeacher.password
          );
          cy.visit(
            `${appPaths.tasks}/manage/${manageTaskContentSetup.paperTaskId}/content?book=34`
          );
        });

        it('should return paper exercises', () => {
          dataCy('search-results-count').should(
            'contain',
            `${manageTaskContentSetup.paperExpected.resultCount} resultaten`
          );
        });
      });
    });

    describe('manage task content', () => {
      before(() => {
        login(
          setup.kabasTasksPages.loginTeacher.username,
          setup.kabasTasksPages.loginTeacher.password
        );
        cy.visit(
          `${appPaths.tasks}/manage/${manageTaskContentSetup.taskId}/content?book=${filterSetup.book.id}`
        );
      });

      it('should add content to a task', () => {
        const secondTaskIndex = +Object.keys(searchSetup.results)[1];

        dataCy('search-result')
          .first()
          .find('[data-cy="search-result-action"]')
          .first()
          .should('contain', 'Toevoegen aan taak')
          .click();

        dataCy('task-content')
          .should('have.length', 1)
          .first()
          .should('contain', searchSetup.results[0].name);

        dataCy('search-result')
          .eq(secondTaskIndex)
          .find('[data-cy="search-result-action"]')
          .first()
          .should('contain', 'Toevoegen aan taak')
          .click();

        dataCy('task-content')
          .should('have.length', 2)
          .eq(1)
          .should('contain', searchSetup.results[secondTaskIndex].name);
      });

      it.skip('should reorder content in a task, from the sidebar', () => {
        const dragItem = cy.get('[data-cy="task-content-drag"]').first();

        const dropZone = dataCy('task-content')
          .eq(1)
          .find('[data-cy="task-content-drag"]');

        dragDrop(dragItem, dropZone); // <- can't get this to work

        dataCy('task-content')
          .first()
          .should('contain', 'De breuken');

        dataCy('task-content')
          .eq(1)
          .should('contain', 'Dagelijkse kost');
      });

      it('should remove content from a task', () => {
        dataCy('search-result')
          .first()
          .find('[data-cy="search-result-action"]')
          .first()
          .should('contain', 'Verwijderen uit taak')
          .click();

        dataCy('task-content')
          .should('have.length', 1)
          .should('not.contain', searchSetup.results[0].name);

        dataCy('search-result')
          .first()
          .find('[data-cy="search-result-action"]')
          .first()
          .should('contain', 'Toevoegen aan taak');
      });

      it('should remove content from a task, from the sidebar', () => {
        dataCy('task-content')
          .first()
          .find('[data-cy="task-content-remove"]')
          .click({ force: true });

        dataCy('task-content').should('have.length', 0);

        dataCy('search-result')
          .eq(5)
          .find('[data-cy="search-result-action"]')
          .first()
          .should('contain', 'Toevoegen aan taak');
      });
    });

    describe('open content', () => {
      beforeEach(() => {
        login(
          setup.kabasTasksPages.loginTeacher.username,
          setup.kabasTasksPages.loginTeacher.password
        );
        cy.visit(
          `${appPaths.tasks}/manage/${manageTaskContentSetup.taskId}/content?book=${filterSetup.book.id}`
        );
        cy.route('GET', `${apiUrl}api/EduContents/*/requestURL*`).as('api');
      });

      it('should open content', () => {
        dataCy('search-result')
          .first()
          .find('[data-cy="search-result-action"]')
          .eq(1)
          .should('contain', 'Openen')
          .click();

        cy.wait('@api').should('have.property', 'status', 200);

        // request
        cy.get('@api').should((xhr: any) => {
          expect(xhr.url).to.contain(
            '?stream=false',
            'contains correct query string'
          );
          expect(xhr.url).to.contain(
            `${searchSetup.results[0].id}/requestURL`,
            'contains correct eduContentId'
          );
        });

        //response
        cy.get('@api').should((xhr: any) => {
          expect(xhr.response.body.url).to.match(
            new RegExp(searchSetup.results[0].ludoUrl),
            'matches ludo url'
          );
        });

        //TODO figure out how to check if the exercise is opened in normal mode
      });

      it('should open content as solution', () => {
        dataCy('search-result')
          .first()
          .find('[data-cy="search-result-action"]')
          .eq(2)
          .should('contain', 'Toon oplossing')
          .click();

        cy.wait('@api').should('have.property', 'status', 200);

        // request
        cy.get('@api').should((xhr: any) => {
          expect(xhr.url).to.contain(
            '?stream=false',
            'contains correct query string'
          );
          expect(xhr.url).to.contain(
            `${searchSetup.results[0].id}/requestURL`,
            'contains correct eduContentId'
          );
        });

        //response
        cy.get('@api').should((xhr: any) => {
          expect(xhr.response.body.url).to.match(
            new RegExp(searchSetup.results[0].ludoUrl),
            'matches ludo url'
          );
        });

        //TODO figure out how to check if the exercise is opened in preview mode
      });
    });

    describe('navigation', () => {
      before(() => {
        login(
          setup.kabasTasksPages.loginTeacher.username,
          setup.kabasTasksPages.loginTeacher.password
        );
        cy.visit(
          `${appPaths.tasks}/manage/${manageTaskContentSetup.taskId}/content?book=${filterSetup.book.id}`
        );
      });

      it('should return to the task detail page', () => {
        dataCy('side-panel-done')
          .first()
          .click();

        cy.url().should(
          'be',
          `${appPaths.tasks}/manage/${manageTaskContentSetup.taskId}`
        );
      });
    });
  });
});
