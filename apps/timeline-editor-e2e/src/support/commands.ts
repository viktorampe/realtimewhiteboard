/// <reference types="cypress" />

export const cyEnv = (prop: string) => {
  return Cypress.env(Cypress.env('ENVIRONMENT'))[prop];
};

const apiUrl = cyEnv('apiUrl');
const defaultUsername = cyEnv('username');
const defaultPassword = cyEnv('password');

export const dataCy = (name: string) => cy.get('[data-cy=' + name + ']');
