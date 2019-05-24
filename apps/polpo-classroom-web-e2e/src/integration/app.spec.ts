/// <reference types="cypress" />

import { login, logoutByUI } from '../support/app.po';

describe('api login example', () => {
  beforeEach(() => {
    login('teacher1', 'testje');
    cy.visit('dev');
  });

  it('should display welcome message', () => {
    cy.get('h1').contains('Welcome to the dev side');
  });
});

describe('exported const as command example', () => {
  beforeEach(() => {
    login('teacher1', 'testje');
    cy.visit('');
  });
  it('should logout if the logout using the ui command', () => {
    logoutByUI();
  });
});
