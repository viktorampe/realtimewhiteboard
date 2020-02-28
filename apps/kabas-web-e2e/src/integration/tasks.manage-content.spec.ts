/// <reference types="cypress" />
import { cyEnv, dataCy, login, performSetup } from '../support/commands';
import {
  ApiPathsInterface,
  AppPathsInterface,
  KabasTasksPagesInterface
} from '../support/interfaces';
import {
  filteryByBook,
  filteryByChapter,
  filteryByLesson
} from './tasks.manage-content';
describe('Manage task content', () => {
  const apiUrl = cyEnv('apiUrl');
  const appPaths = cyEnv('appPaths') as AppPathsInterface;
  const apiPaths = cyEnv('apiPaths') as ApiPathsInterface;
  let setup: KabasTasksPagesInterface;
  let manageTaskContentSetup: typeof setup.kabasTasksPages.manageTaskContent;
  let filterSetup: typeof manageTaskContentSetup.expected.filter;
  before(() => {
    performSetup('kabasTasksPages').then(res => {
      setup = res.body;
      manageTaskContentSetup = setup.kabasTasksPages.manageTaskContent;
      filterSetup = manageTaskContentSetup.expected.filter;
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
        `${appPaths.tasks}/manage/${manageTaskContentSetup.taskId}/content`
      );
    });

    it('should show the right method', () => {
      dataCy('method-books-title').contains('Katapult');
    });

    it('should filter by choosing a book', () => {
      filteryByBook()
        .location('pathname')
        .should(
          'be',
          `${appPaths.tasks}/manage/content?book=${filterSetup.book.id}`
        );
    });

    it('should filter by choosing a book chapter', () => {
      filteryByChapter()
        .location('pathname')
        .should(
          'be',
          `${appPaths.tasks}/manage/content?book=${filterSetup.book.id}&chapter=${filterSetup.chapter.id}`
        );
    });

    it('should filter by choosing a book lesson', () => {
      filteryByLesson()
        .location('pathname')
        .should(
          'be',
          `${appPaths.tasks}/manage/content?book=${filterSetup.book.id}&chapter=${filterSetup.chapter.id}&lesson=lalalaal`
        );
    });

    it('should filter by searching by term', () => {
      dataCy('search-term-filter')
        .find('input')
        .focus()
        .type(`${filterSetup.term.value}{enter}`);

      dataCy('search-results-count').contains(
        `${filterSetup.term.resultCount} resultaten`
      );
    });
  });
});
