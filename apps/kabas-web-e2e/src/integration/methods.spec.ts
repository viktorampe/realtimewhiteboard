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
});
