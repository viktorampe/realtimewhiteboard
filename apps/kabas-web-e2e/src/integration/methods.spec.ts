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
    it('should show learningAreas', () => {
      dataCy('method-year-link').should('exist');
    });
  });
});
