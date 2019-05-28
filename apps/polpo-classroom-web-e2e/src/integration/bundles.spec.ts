/// <reference types="cypress" />

import { getContentDisplayData } from '../support/bundles.po';
import { dataCy, login, performStudentSetup } from '../support/commands';
import { StudentOpenBundleContentInterface } from '../support/interfaces';

describe('Bundles', () => {
  const bundlesPath = 'bundles';
  let setup: StudentOpenBundleContentInterface;
  before(() => {
    performStudentSetup().then(res => {
      setup = res.body;
      console.log(JSON.stringify(res.body));
    });
  });
  beforeEach(() => {
    login(
      setup.studentOpenBundleContent.login.username,
      setup.studentOpenBundleContent.login.password
    );
  });
  describe('leaningarea page', () => {
    beforeEach(() => {
      cy.visit(`${bundlesPath}`);
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
          `${bundlesPath}/${setup.studentOpenBundleContent.learningArea.id}`
        );
    });
  });
  describe('bundles page', () => {
    beforeEach(() => {
      cy.visit(
        `${bundlesPath}/${setup.studentOpenBundleContent.learningArea.id}`
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
          `${bundlesPath}/${
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
    });
  });
  describe('bundle details page', () => {
    beforeEach(() => {
      cy.visit(
        `${bundlesPath}/${setup.studentOpenBundleContent.learningArea.id}/${
          setup.studentOpenBundleContent.bundle.id
        }`
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
        dataCy('content-info').contains(contentDisplayData[index].fileLabel);
        dataCy('content-info').contains(contentDisplayData[index].name);
      });
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
