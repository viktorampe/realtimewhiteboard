/// <reference types="cypress" />

const apiUrl = Cypress.env('apiUrl');

export const dataCy = (name: string) => cy.get('[data-cy=' + name + ']');

export const login = (username: string, password: string) =>
  cy
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
