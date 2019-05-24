/// <reference types="cypress" />

import { login } from '../support/app.po';

describe('temp', () => {
  beforeEach(() => {
    login('teacher1', 'testje');
    cy.visit('dev');
  });

  it('should display welcome message', () => {
    cy.get('h1').contains('Welcome to the dev side');
  });
});
