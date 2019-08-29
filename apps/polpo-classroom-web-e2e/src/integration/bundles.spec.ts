/// <reference types="cypress" />

import { getContentDisplayData } from '../support/bundles.po';
import { cyEnv, dataCy, login, performSetup } from '../support/commands';
import {
  ApiPathsInterface,
  AppPathsInterface,
  PolpoStudentOpenBundleContentInterface
} from '../support/interfaces';

describe('Bundles', () => {
  const apiUrl = cyEnv('apiUrl');
  const appPaths = cyEnv('appPaths') as AppPathsInterface;
  const apiPaths = cyEnv('apiPaths') as ApiPathsInterface;
  let setup: PolpoStudentOpenBundleContentInterface;
  before(() => {
    performSetup('polpoStudentOpenBundleContent').then(res => {
      setup = res.body;
    });
  });
  beforeEach(() => {
    login(
      setup.polpoStudentOpenBundleContent.login.username,
      setup.polpoStudentOpenBundleContent.login.password
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
        .contains(setup.polpoStudentOpenBundleContent.learningArea.name)
        .click()
        .location('pathname')
        .should(
          'be',
          `${appPaths.bundles}/${
            setup.polpoStudentOpenBundleContent.learningArea.id
          }`
        );
    });
  });
  describe('bundles page', () => {
    beforeEach(() => {
      cy.visit(
        `${appPaths.bundles}/${
          setup.polpoStudentOpenBundleContent.learningArea.id
        }`,
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
        .contains(`${setup.polpoStudentOpenBundleContent.bundle.name}`)
        .click()
        .location('pathname')
        .should(
          'be',
          `${appPaths.bundles}/${
            setup.polpoStudentOpenBundleContent.bundle.learningAreaId
          }/${setup.polpoStudentOpenBundleContent.bundle.id}`
        );
    });
    it('should show the boeke', () => {
      dataCy('boeke-count').contains(
        `Je hebt 1 boek voor ${
          setup.polpoStudentOpenBundleContent.learningArea.name
        }`
      );
      dataCy('boeke').as('boeke');
      cy.get('@boeke').contains(
        setup.polpoStudentOpenBundleContent.boeke.publishedEduContentMetadata
          .fileLabel
      );
      cy.get('@boeke').contains(
        setup.polpoStudentOpenBundleContent.boeke.publishedEduContentMetadata
          .title
      );
      dataCy('boeke-view-content').click();
      cy.window()
        .its('open')
        .should(
          'be.calledWithExactly',
          `${apiUrl}${apiPaths.eduContent}/${
            setup.polpoStudentOpenBundleContent.boeke
              .publishedEduContentMetadata.eduContentId
          }/redirectURL`
        );
    });
  });
  describe('bundle details page', () => {
    beforeEach(() => {
      cy.visit(
        `${appPaths.bundles}/${
          setup.polpoStudentOpenBundleContent.learningArea.id
        }/${setup.polpoStudentOpenBundleContent.bundle.id}`,
        {
          onBeforeLoad(win) {
            cy.stub(win, 'open');
          }
        }
      );
    });
    it('should show the bundle details', () => {
      dataCy('bundle-header').contains(
        `${setup.polpoStudentOpenBundleContent.bundle.name}`
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
        `${setup.polpoStudentOpenBundleContent.teacher.displayName}`
      );
      cy.get('@info').contains(
        `${setup.polpoStudentOpenBundleContent.bundle.name}`
      );
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
            setup.polpoStudentOpenBundleContent.contentExercise.id
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
            setup.polpoStudentOpenBundleContent.contentDownloadable
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
          `${setup.polpoStudentOpenBundleContent.contentUserContent.link}`
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
