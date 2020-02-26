/// <reference types="cypress" />

import { cyEnv, dataCy, login, performSetup } from '../support/commands';
import {
  ApiPathsInterface,
  AppPathsInterface,
  KabasTasksPagesInterface
} from '../support/interfaces';
import {
  checkResults,
  filterArchived,
  filterArea,
  filterDate,
  filterName,
  filterStatus,
  resetFilters,
  sortBy
} from './tasks.overview';

describe('Tasks Overview', () => {
  const apiUrl = cyEnv('apiUrl');
  const appPaths = cyEnv('appPaths') as AppPathsInterface;
  const apiPaths = cyEnv('apiPaths') as ApiPathsInterface;
  let setup: KabasTasksPagesInterface;
  let filterValues: typeof setup.kabasTasksPages.filterValues.overview;
  let filterResults: typeof setup.kabasTasksPages.expected.filterResults.overview;
  let sortResults: typeof setup.kabasTasksPages.expected.sortResults;

  before(() => {
    performSetup('kabasTasksPages').then(res => {
      setup = res.body;

      filterValues = setup.kabasTasksPages.filterValues.overview;
      filterResults = setup.kabasTasksPages.expected.filterResults.overview;
      sortResults = setup.kabasTasksPages.expected.sortResults;
    });
  });

  beforeEach(() => {
    cy.server();
  });

  describe('teacher', () => {
    beforeEach(() => {
      login(
        setup.kabasTasksPages.loginTeacher.username,
        setup.kabasTasksPages.loginTeacher.password
      );
    });

    beforeEach(() => {
      cy.visit(`${appPaths.tasks}/manage`);
    });

    describe('digital', () => {
      xit('should show all the elements', () => {
        // tabs, can't use dataCy because they disappear
        cy.get('.mat-tab-label-content')
          .eq(0)
          .should('have.text', 'Digitale taken');
        cy.get('.mat-tab-label-content')
          .eq(1)
          .should('have.text', 'Papieren taken');

        // new task
        dataCy('new-task-digital').should('exist');
        dataCy('nav-new-task').should('exist');
      });

      it('should filter tasks', () => {
        // individual filters
        filterName(filterValues.digital.name);
        checkResults(filterResults.digital.name);
        resetFilters();

        filterArea(filterValues.digital.area);
        checkResults(filterResults.digital.area);
        resetFilters();

        filterDate(filterValues.digital.date);
        checkResults(filterResults.digital.date);
        resetFilters();

        // TODO: assignee filter here! it's currently bugged on the front-end so can't test it

        filterValues.digital.status.forEach(statusFilter => {
          filterStatus(statusFilter);
        });
        checkResults(filterResults.digital.status);
        resetFilters();

        filterArchived();
        checkResults(filterResults.digital.archived);
        resetFilters();

        // combined filters:
        filterName(filterValues.digital.combined.name);
        filterArea(filterValues.digital.combined.area);
        filterDate(filterValues.digital.combined.date);
        filterValues.digital.combined.status.forEach(statusFilter => {
          filterStatus(statusFilter);
        });
        if (filterValues.digital.combined.archived) {
          filterArchived();
        }
        checkResults(filterResults.digital.combined);
        resetFilters();
      });

      it('should sort tasks', () => {
        setup.kabasTasksPages.sortValues.forEach(sortValue => {
          sortBy(sortValue);
          checkResults(sortResults.digital[sortValue]);
        });
      });
    });

    // it('practice manage page - in book', () => {
    //   dataCy('check-box-table-item-column-header')
    //     .should(
    //       'have.length',
    //       setup.kabasUnlockedFreePracticePages.expected.classGroups.length
    //     )
    //     .each(($item, index) => {
    //       expect($item).to.have.text(
    //         setup.kabasUnlockedFreePracticePages.expected.classGroups[index]
    //       );
    //     });

    //   dataCy('check-box-table-row-header').should(
    //     'have.length',
    //     setup.kabasUnlockedFreePracticePages.expected.chaptersTeacher.count
    //   );

    //   cy.route(`${apiUrl}/api/People/*/data?fields=unlockedFreePractices`).as(
    //     'api'
    //   );
    //   cy.route(
    //     'delete',
    //     `${apiUrl}/api/People/*/deleteManyUnlockedFreePracticeRemote*`
    //   ).as('api');
    // });
  });
});
