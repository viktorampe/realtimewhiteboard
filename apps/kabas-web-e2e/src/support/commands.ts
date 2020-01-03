/// <reference types="cypress" />

import { SetupScenarioType } from './types';

export const cyEnv = (prop: string) => {
  return Cypress.env(Cypress.env('ENVIRONMENT'))[prop];
};

const apiUrl = cyEnv('apiUrl');
const cookieDomain = cyEnv('cookieDomain');
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
      cy.setCookie('$LoopBackSDK$created', resp.body.created, {
        domain: cookieDomain
      });
      cy.setCookie('$LoopBackSDK$id', resp.body.id, {
        domain: cookieDomain
      });
      cy.setCookie('$LoopBackSDK$rememberMe', 'true', {
        domain: cookieDomain
      });
      cy.setCookie('$LoopBackSDK$ttl', resp.body.ttl + '', {
        domain: cookieDomain
      });
      cy.setCookie('$LoopBackSDK$userId', resp.body.userId + '', {
        domain: cookieDomain
      });
      cy.setCookie('$LoopBackSDK$user', JSON.stringify(resp.body.user), {
        domain: cookieDomain
      });
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
