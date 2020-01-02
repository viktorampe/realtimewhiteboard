/// <reference types="cypress" />

import { SetupScenarioType } from './types';

export const cyEnv = (prop: string) => {
  return Cypress.env(Cypress.env('ENVIRONMENT'))[prop];
};

const apiUrl = cyEnv('apiUrl');
const defaultUsername = cyEnv('username');
const defaultPassword = cyEnv('password');

export const dataCy = (name: string) => cy.get('[data-cy=' + name + ']');

export const login = (username?: string, password?: string) => {
  if (!username) username = defaultUsername;
  if (!password) password = defaultPassword;
  return cy
    .request({
      method: 'POST',
      url: `${apiUrl}api/People/login?include=user`,
      body: {
        username: username,
        password: password
      }
    })
    .then(resp => {
      // set the cookies that the loopback sdk needs
      cy.setCookie('$LoopBackSDK$created', resp.body.created);
      cy.setCookie('$LoopBackSDK$id', resp.body.id);
      cy.setCookie('$LoopBackSDK$rememberMe', 'true');
      cy.setCookie('$LoopBackSDK$ttl', resp.body.ttl + '');
      cy.setCookie('$LoopBackSDK$user', JSON.stringify(resp.body.user));
      cy.setCookie('$LoopBackSDK$userId', resp.body.userId + '');
    });
};

export const logoutByAPIRequest = () => {
  cy.getCookie('$LoopBackSDK$id').then(cookie => {
    if (!cookie) return;
    cy.request(
      'POST',
      `${apiUrl}api/People/logout?access_token=${cookie.value}`
    );
  });
};

export const logoutByUI = () => {
  cy.visit('dev');
  dataCy('logoutButton').click();
};

export const performSetup = (scenarioName: SetupScenarioType) => {
  return cy.request(`${apiUrl}e2e/setup/${scenarioName}`);
};

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable<Subject> {
    login(email: string, password: string): void;
  }
}
//
// -- This is a parent command --
Cypress.Commands.add('login', (email, password) => {
  console.log('Custom command example: Login', email, password);
});
