/// <reference types="cypress" />

import { getContentDisplayData } from '../support/bundles.po';
import { dataCy, login, performSetup } from '../support/commands';
import {
  ApiPathsInterface,
  AppPathsInterface,
  StudentOpenBundleContentInterface
} from '../support/interfaces';

describe('Bundles', () => {
  const apiUrl = Cypress.env('APIURL');
  const appPaths = Cypress.env('appPaths') as AppPathsInterface;
  const apiPaths = Cypress.env('apiPaths') as ApiPathsInterface;
  let setup: StudentOpenBundleContentInterface;
  before(() => {
    performSetup('studentOpenBundleContent').then(res => {
      setup = res.body;
    });
  });
  beforeEach(() => {
    login(
      setup.studentOpenBundleContent.login.username,
      setup.studentOpenBundleContent.login.password
    );
  });
  describe('learningarea page', () => {
    beforeEach(() => {
      cy.visit(`${appPaths.bundles}`);
    });
    it('should show learningAreas', () => {
      dataCy('learningArea-count').contains('1 van 1 weergegeven');
      dataCy('learningArea-details')
        .contains('1 bundel')
        .contains('1 boek');
      dataCy('learningArea')
        .should(
          'have.attr',
          'ng-reflect-router-link',
          `${setup.studentOpenBundleContent.learningArea.id}`
        )
        .contains(setup.studentOpenBundleContent.learningArea.name)
        .click()
        .location('pathname')
        .should(
          'be',
          `${appPaths.bundles}/${
            setup.studentOpenBundleContent.learningArea.id
          }`
        );
    });
  });
  describe('bundles page', () => {
    beforeEach(() => {
      cy.visit(
        `${appPaths.bundles}/${setup.studentOpenBundleContent.learningArea.id}`,
        {
          onBeforeLoad(win) {
            cy.stub(win, 'open');
          }
        }
      );
    });
    it('should show the bundle', () => {
      dataCy('bundle-count').contains('1 van 1 weergegeven');
      dataCy('bundle-details').contains('3 items');
      dataCy('bundle')
        .contains(`${setup.studentOpenBundleContent.bundle.name}`)
        .click()
        .location('pathname')
        .should(
          'be',
          `${appPaths.bundles}/${
            setup.studentOpenBundleContent.bundle.learningAreaId
          }/${setup.studentOpenBundleContent.bundle.id}`
        );
    });
    it('should show the boeke', () => {
      dataCy('boeke-count').contains(
        `Je hebt 1 boek voor ${
          setup.studentOpenBundleContent.learningArea.name
        }`
      );
      dataCy('boeke').as('boeke');
      cy.get('@boeke').contains(
        setup.studentOpenBundleContent.boeke.publishedEduContentMetadata
          .fileLabel
      );
      cy.get('@boeke').contains(
        setup.studentOpenBundleContent.boeke.publishedEduContentMetadata.title
      );
      dataCy('boeke-view-content').click();
      cy.window()
        .its('open')
        .should(
          'be.calledWithExactly',
          `${apiUrl}${apiPaths.eduContent}/${
            setup.studentOpenBundleContent.boeke.publishedEduContentMetadata
              .eduContentId
          }/redirectURL`
        );
    });
  });
  describe('bundle details page', () => {
    beforeEach(() => {
      cy.visit(
        `${appPaths.bundles}/${
          setup.studentOpenBundleContent.learningArea.id
        }/${setup.studentOpenBundleContent.bundle.id}`,
        {
          onBeforeLoad(win) {
            cy.stub(win, 'open');
          }
        }
      );
    });
    it('should show the bundle details', () => {
      dataCy('bundle-header').contains(
        `${setup.studentOpenBundleContent.bundle.name}`
      );
      dataCy('bundle-count').contains('3 van 3 weergegeven');
      const contentDisplayData = getContentDisplayData(setup);
      dataCy('content')
        .should('have.length', 3)
        .each(($content, index, $list) => {
          cy.wrap($content).contains(contentDisplayData[index].fileLabel);
          cy.wrap($content).contains(contentDisplayData[index].name);
        });
      dataCy('bundle-info').as('info');
      cy.get('@info').contains(
        `${setup.studentOpenBundleContent.teacher.displayName}`
      );
      cy.get('@info').contains(`${setup.studentOpenBundleContent.bundle.name}`);
    });
    it('should show details if content is clicked', () => {
      const contentDisplayData = getContentDisplayData(setup);
      dataCy('content').each(($content, index, $list) => {
        cy.wrap($content)
          .contains(contentDisplayData[index].name)
          .click();
        dataCy('content-info').as('contentInfo');
        cy.get('@contentInfo').contains(contentDisplayData[index].fileLabel);
        cy.get('@contentInfo').contains(contentDisplayData[index].name);
      });
    });
    it('should open the exercise in an iframe', () => {
      dataCy('content-view-content')
        .first()
        .click();
      cy.get('iframe')
        .should('have.attr', 'src')
        .and(
          'contain',
          `${apiUrl}${apiPaths.ludoAssets}/${
            setup.studentOpenBundleContent.contentExercise.id
          }`
        );
    });
    it('should call open with the correct url for non exercise content', () => {
      dataCy('content-view-content')
        .eq(1)
        .click();
      cy.window()
        .its('open')
        .should(
          'be.calledWithExactly',
          `${apiUrl}${apiPaths.eduContent}/${
            setup.studentOpenBundleContent.contentDownloadable
              .publishedEduContentMetadata.eduContentId
          }/redirectURL`
        );
      dataCy('content-view-content')
        .last()
        .click();
      cy.window()
        .its('open')
        .should(
          'be.calledWithExactly',
          `${setup.studentOpenBundleContent.contentUserContent.link}`
        );
    });
    it('should change the status', () => {
      dataCy('content')
        .first()
        .click();
      dataCy('confirmable-select-select').click();
      dataCy('confirmable-select-option')
        .should('have.length', 3)
        .last()
        .then($option => {
          const lastStatus = $option.text();
          cy.wrap($option).click();
          dataCy('confirmable-select-confirm').click();
          cy.get('.mat-snack-bar-container').contains('Status is aangepast');
          dataCy('confirmable-select-select').contains(lastStatus);
        });
    });
  });
});
