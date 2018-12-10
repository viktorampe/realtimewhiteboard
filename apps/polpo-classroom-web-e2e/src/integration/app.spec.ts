/// <reference types="cypress" />
import { getGreeting } from '../support/app.po';
xdescribe('Hello Nx', () => {
  beforeEach(() => cy.visit('dev'));
  xit('should display welcome message', () => {
    getGreeting().contains('Welcome to the dev side');
  });
});
