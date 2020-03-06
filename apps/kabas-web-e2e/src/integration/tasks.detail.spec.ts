/// <reference types="cypress" />

import { cyEnv, dataCy, login, performSetup } from '../support/commands';
import {
  ApiPathsInterface,
  AppPathsInterface,
  KabasTasksPagesInterface
} from '../support/interfaces';
import {
  addAssigneesToTask,
  checkAndCancelError,
  removeAssigneesFromTask,
  removeAssigneesFromTask2,
  toggleTaskEduContentSelection,
  updateTaskInfo,
  verifyTaskAssignees,
  verifyTaskContent,
  verifyTaskInfo
} from './tasks.detail';

describe('Tasks Detail', () => {
  const apiUrl = cyEnv('apiUrl');
  const appPaths = cyEnv('appPaths') as AppPathsInterface;
  const apiPaths = cyEnv('apiPaths') as ApiPathsInterface;
  let setup: KabasTasksPagesInterface;
  let tasksPath;
  let taskId: {
    active: number;
    pending: number;
    finished: number;
    paper: number;
  };
  let activeTask: {
    id: number;
    name: string;
    description: string;
    assignees: string[];
  };
  let assignees: string[];

  before(() => {
    return performSetup('kabasTasksPages').then(res => {
      setup = res.body;

      tasksPath = `/${appPaths.tasks}/manage/`;
      ({
        activeTask,
        assignees,
        taskId
      } = setup.kabasTasksPages.manageTaskDetail);
    });
  });

  before(() => {
    cy.server();
  });

  describe('Teacher', () => {
    describe('Digital task', () => {
      let taskPath;
      before(() => {
        login(
          setup.kabasTasksPages.loginTeacher.username,
          setup.kabasTasksPages.loginTeacher.password
        );

        taskPath = tasksPath + activeTask.id;
        cy.visit(taskPath);
      });

      describe('pagebar buttons', () => {
        describe('without selected content', () => {
          it('should only show expected buttons', () => {
            dataCy('header-btn-add-educontent').should('exist');
            dataCy('header-btn-open-results').should('exist');
            dataCy('header-btn-open-matrix').should('exist');
            dataCy('header-btn-print').should('not.exist');
            dataCy('header-btn-print-selection').should('not.exist');
            dataCy('header-btn-preview-selection').should('not.exist');
            dataCy('header-btn-remove-selection').should('not.exist');
          });
        });

        describe('with 1 selected content', () => {
          it('should only show expected buttons', () => {
            toggleTaskEduContentSelection(['gemiddelde']);

            dataCy('header-btn-add-educontent').should('not.exist');
            dataCy('header-btn-open-results').should('not.exist');
            dataCy('header-btn-open-matrix').should('not.exist');
            dataCy('header-btn-print').should('not.exist');
            dataCy('header-btn-print-selection').should('not.exist');
            dataCy('header-btn-preview-selection').should('exist');
            dataCy('header-btn-remove-selection').should('exist');
          });
        });

        describe('with multiple selected content', () => {
          it('should only show expected buttons', () => {
            toggleTaskEduContentSelection(['breuken']);

            dataCy('header-btn-add-educontent').should('not.exist');
            dataCy('header-btn-open-results').should('not.exist');
            dataCy('header-btn-open-matrix').should('not.exist');
            dataCy('header-btn-print').should('not.exist');
            dataCy('header-btn-print-selection').should('not.exist');
            dataCy('header-btn-preview-selection').should('not.exist');
            dataCy('header-btn-remove-selection').should('exist');
          });
        });
      });

      describe('sidebar', () => {
        before(() => {
          // deselect values of previous describe block
          toggleTaskEduContentSelection(['gemiddelde', 'breuken']);
        });

        describe('without selected content', () => {
          describe('task info', () => {
            it('should show the task info', () => {
              verifyTaskInfo({
                title: activeTask.name,
                description: activeTask.description
              });
            });

            it('should allow task title and description to be updated', () => {
              updateTaskInfo({
                title: 'new title',
                description: 'new description'
              });
              verifyTaskInfo({
                title: 'new title',
                description: 'new description'
              });
            });
          });

          describe('assignees', () => {
            it('should open task assignees modal and add assignees', () => {
              addAssigneesToTask(
                setup.kabasTasksPages.manageTaskDetail.assignees
              );
              verifyTaskAssignees([
                ...activeTask.assignees,
                ...setup.kabasTasksPages.manageTaskDetail.assignees
              ]);
            });

            it('should open task assignees modal and remove assignees', () => {
              removeAssigneesFromTask(
                setup.kabasTasksPages.manageTaskDetail.assignees
              );
              verifyTaskAssignees(
                activeTask.assignees,
                setup.kabasTasksPages.manageTaskDetail.assignees
              );
            });

            it('should remove assignees without modal', () => {
              addAssigneesToTask([
                setup.kabasTasksPages.manageTaskDetail.assignees[0]
              ]);
              verifyTaskAssignees([
                ...activeTask.assignees,
                setup.kabasTasksPages.manageTaskDetail.assignees[0]
              ]);
              removeAssigneesFromTask2([
                setup.kabasTasksPages.manageTaskDetail.assignees[0]
              ]);
              verifyTaskAssignees(activeTask.assignees, [
                setup.kabasTasksPages.manageTaskDetail.assignees[0]
              ]);
            });
          });
        });

        describe('with selected content', () => {
          const selectedContent = ['gemiddelde', 'breuken'];
          before(() => {
            toggleTaskEduContentSelection(selectedContent);
          });

          it('should show task details', () => {
            selectedContent.forEach((content, i) => {
              dataCy('educontent-detail')
                .eq(i)
                .contains(content);
            });
          });

          it('should show task detail preview button', () => {
            selectedContent.forEach((content, i) => {
              dataCy('educontent-detail')
                .eq(i)
                .find('[data-cy=btn-preview-educontent]')
                .should('exist');
            });
          });

          it('should toggle all required', () => {
            dataCy('btn-all-required').click();
            selectedContent.forEach(title => {
              cy.contains('[data-cy=task-edu-content]', title).contains(
                'moetje'
              );
            });
          });

          it('should toggle all optional', () => {
            dataCy('btn-all-optional').click();
            selectedContent.forEach(title => {
              cy.contains('[data-cy=task-edu-content]', title).contains(
                'magje'
              );
            });
          });
        });
      });

      describe('sort content', () => {
        it('should toggle between regular and sort mode', () => {
          dataCy('btn-start-sort').click();
          dataCy('btn-cancel-sort').should('exist');
          dataCy('btn-save-sort').should('exist');

          dataCy('task-edu-content-drag').should('have.length', 5);
        });

        // drag-drop currently not possible
        it.skip('should sort items');
      });

      describe('Active task', () => {
        const selectedContent = ['gemiddelde', 'breuken'];

        before(() => {
          login(
            setup.kabasTasksPages.loginTeacher.username,
            setup.kabasTasksPages.loginTeacher.password
          );

          taskPath = tasksPath + taskId.active;
          cy.visit(taskPath);
        });

        describe('pagebar buttons', () => {
          it('should show error when `add eduContent` is clicked', () => {
            dataCy('header-btn-add-educontent')
              .click()
              .location('pathname')
              .should('eq', taskPath);

            checkAndCancelError();
          });

          it('should open confirmation dialog when clicking `delete selection` button and show error after confirmation', () => {
            toggleTaskEduContentSelection(selectedContent);
            dataCy('header-btn-remove-selection').click({ force: true });
            // check for confirm dialog
            dataCy('cm-confirm')
              .should('exist')
              .click();

            checkAndCancelError('in gebruik');
            verifyTaskContent(selectedContent, [], 5);
          });
        });

        describe('sidebar', () => {
          it('should open confirmation dialog when clicking `delete selection` button and show error after confirmation', () => {
            dataCy('btn-remove-selected-content').click({ force: true });
            dataCy('cm-confirm')
              .should('exist')
              .click();

            checkAndCancelError('in gebruik');
            verifyTaskContent(selectedContent, [], 5);
          });

          it('should fail adding content', () => {
            // de-select
            toggleTaskEduContentSelection(selectedContent);

            dataCy('sidebar-btn-add-educontent').click();
            checkAndCancelError('actief of voltooid');
          });
        });
      });

      describe('Pending task', () => {
        before(() => {
          login(
            setup.kabasTasksPages.loginTeacher.username,
            setup.kabasTasksPages.loginTeacher.password
          );

          taskPath = tasksPath + taskId.pending;
          cy.visit(taskPath);
        });

        describe('pagebar buttons', () => {
          it('should redirect when `add eduContent` is clicked', () => {
            dataCy('header-btn-add-educontent')
              .click()
              .location('pathname')
              .should('eq', taskPath + '/content')
              .go('back');
          });

          it('should open confirmation dialog when clicking `delete selection` button and remove content after confirmation', () => {
            // select taskEduContent
            const selectedContent = ['gemiddelde'];
            const remainingContentLength = 4;
            toggleTaskEduContentSelection(selectedContent);

            dataCy('header-btn-remove-selection').click({ force: true });
            // check for confirm dialog
            dataCy('cm-confirm')
              .should('exist')
              .click();

            verifyTaskContent([], selectedContent, remainingContentLength);
          });
        });

        describe('sidebar', () => {
          it('should open confirmation dialog when clicking `delete selection` button and remove content after confirmation', () => {
            const selectedContent = ['breuken'];
            toggleTaskEduContentSelection(selectedContent);

            const remainingContentLength = 3;
            dataCy('btn-remove-selected-content').click({ force: true });
            dataCy('cm-confirm')
              .should('exist')
              .click();

            verifyTaskContent([], selectedContent, remainingContentLength);
          });

          it('should allow adding content', () => {
            dataCy('sidebar-btn-add-educontent')
              .click()
              .location('pathname')
              .should('eq', taskPath + '/content')
              .go('back');
          });
        });
      });

      describe('Finished task', () => {
        const selectedContent = ['gemiddelde', 'breuken'];

        before(() => {
          login(
            setup.kabasTasksPages.loginTeacher.username,
            setup.kabasTasksPages.loginTeacher.password
          );

          taskPath = tasksPath + taskId.finished;
          cy.visit(taskPath);
        });

        describe('pagebar buttons', () => {
          it('should show error when `add eduContent` is clicked', () => {
            dataCy('header-btn-add-educontent')
              .click()
              .location('pathname')
              .should('eq', taskPath);

            checkAndCancelError();
          });

          it('should open confirmation dialog when clicking `delete selection` button and show error after confirmation', () => {
            toggleTaskEduContentSelection(selectedContent);
            dataCy('header-btn-remove-selection').click({ force: true });
            // check for confirm dialog
            dataCy('cm-confirm')
              .should('exist')
              .click();

            checkAndCancelError('in gebruik');
            verifyTaskContent(selectedContent, [], 5);
          });
        });

        describe('sidebar', () => {
          it('should open confirmation dialog when clicking `delete selection` button and show error after confirmation', () => {
            dataCy('btn-remove-selected-content').click({ force: true });
            dataCy('cm-confirm')
              .should('exist')
              .click();

            checkAndCancelError('in gebruik');
            verifyTaskContent(selectedContent, [], 5);
          });

          it('should fail adding content', () => {
            toggleTaskEduContentSelection(selectedContent);
            dataCy('sidebar-btn-add-educontent').click();
            checkAndCancelError('actief of voltooid');
          });
        });
      });
    });

    describe('Paper task', () => {
      let taskPath;
      before(() => {
        login(
          setup.kabasTasksPages.loginTeacher.username,
          setup.kabasTasksPages.loginTeacher.password
        );

        taskPath = tasksPath + taskId.paper;
        cy.visit(taskPath);
      });

      describe('pagebar buttons', () => {
        describe('without selected content', () => {
          it('should only show expected buttons', () => {
            dataCy('header-btn-add-educontent').should('exist');
            dataCy('header-btn-open-results').should('not.exist');
            dataCy('header-btn-open-matrix').should('exist');
            dataCy('header-btn-print').should('exist');
            dataCy('header-btn-print-selection').should('not.exist');
            dataCy('header-btn-preview-selection').should('not.exist');
            dataCy('header-btn-remove-selection').should('not.exist');
          });

          it('should open dialog with print links', () => {
            dataCy('header-btn-print').click();
            dataCy('modal-btn-print-paper').should('have.length', 3);
            dataCy('modal-btn-print-cancel').click();
          });
        });

        describe('with 1 selected content', () => {
          it('should only show expected buttons', () => {
            toggleTaskEduContentSelection(['Hoeken']);

            dataCy('header-btn-add-educontent').should('not.exist');
            dataCy('header-btn-open-results').should('not.exist');
            dataCy('header-btn-open-matrix').should('not.exist');
            dataCy('header-btn-print').should('not.exist');
            dataCy('header-btn-print-selection').should('not.exist');
            dataCy('header-btn-preview-selection').should('exist');
            dataCy('header-btn-remove-selection').should('exist');
          });
        });

        describe('with multiple selected content', () => {
          it('should only show expected buttons', () => {
            toggleTaskEduContentSelection(['Spiegelingen']);

            dataCy('header-btn-add-educontent').should('not.exist');
            dataCy('header-btn-open-results').should('not.exist');
            dataCy('header-btn-open-matrix').should('not.exist');
            dataCy('header-btn-print').should('not.exist');
            dataCy('header-btn-print-selection').should('not.exist');
            dataCy('header-btn-preview-selection').should('not.exist');
            dataCy('header-btn-remove-selection').should('exist');
          });
        });
      });

      describe('sidebar', () => {
        describe('without selected content', () => {
          before(() => {
            toggleTaskEduContentSelection(['Hoeken', 'Spiegelingen']);
          });

          describe('buttons', () => {
            it('should allow task title and description to be updated', () => {
              updateTaskInfo({
                title: 'new title',
                description: 'new description'
              });
              verifyTaskInfo({
                title: 'new title',
                description: 'new description'
              });
            });

            it('should allow adding content', () => {
              dataCy('sidebar-btn-add-educontent')
                .click()
                .location('pathname')
                .should('eq', taskPath + '/content')
                .go('back');
            });

            it('should download a pdf', () => {
              cy.window().then(window => cy.stub(window, 'open'));

              login(
                setup.kabasTasksPages.loginTeacher.username,
                setup.kabasTasksPages.loginTeacher.password
              );

              dataCy('btn-print-paper-with-assignees').click();
              cy.window()
                .its('open')
                .should(
                  'be.calledWithExactly',
                  `${apiUrl}api/tasks/paper-task-pdf?taskId=${taskId.paper}&withNames=true`
                );

              dataCy('btn-print-paper-without-assignees').click();
              cy.window()
                .its('open')
                .should(
                  'be.calledWithExactly',
                  `${apiUrl}api/tasks/paper-task-pdf?taskId=${taskId.paper}&withNames=false`
                );

              dataCy('btn-print-paper-with-solution').click();
              cy.window()
                .its('open')
                .should(
                  'be.calledWithExactly',
                  `${apiUrl}api/tasks/paper-task-solution-pdf?taskId=${taskId.paper}`
                );
            });
          });

          describe('assignees', () => {
            it('should open task assignees modal without date inputs and add assignees', () => {
              dataCy('btn-add-task-assignees').click();
              dataCy('manage-task-date-range-picker').should('not.exist');
              addAssigneesToTask(
                setup.kabasTasksPages.manageTaskDetail.assignees,
                true
              );
              verifyTaskAssignees([
                ...activeTask.assignees,
                ...setup.kabasTasksPages.manageTaskDetail.assignees
              ]);
            });

            it('should open task assignees modal without date inputs and remove assignees', () => {
              dataCy('btn-add-task-assignees').click();
              dataCy('manage-task-date-range-picker').should('not.exist');
              removeAssigneesFromTask(
                setup.kabasTasksPages.manageTaskDetail.assignees,
                true
              );
              verifyTaskAssignees(
                activeTask.assignees,
                setup.kabasTasksPages.manageTaskDetail.assignees
              );
            });

            it('should remove assignees without modal', () => {
              addAssigneesToTask([
                setup.kabasTasksPages.manageTaskDetail.assignees[0]
              ]);
              verifyTaskAssignees([
                ...activeTask.assignees,
                setup.kabasTasksPages.manageTaskDetail.assignees[0]
              ]);
              removeAssigneesFromTask2([
                setup.kabasTasksPages.manageTaskDetail.assignees[0]
              ]);
              verifyTaskAssignees(activeTask.assignees, [
                setup.kabasTasksPages.manageTaskDetail.assignees[0]
              ]);
            });
          });
        });

        describe('with selected content', () => {
          const selectedContent = ['Hoeken', 'Spiegelingen'];
          before(() => {
            toggleTaskEduContentSelection(selectedContent);
          });

          it('should show task details', () => {
            selectedContent.forEach((content, i) => {
              dataCy('educontent-detail')
                .eq(i)
                .contains(content);
            });
          });

          it('should show task detail preview button', () => {
            selectedContent.forEach((content, i) => {
              dataCy('educontent-detail')
                .eq(i)
                .find('[data-cy=btn-preview-educontent]')
                .should('exist');
            });
          });

          it('should not show toggle for required / optional', () => {
            dataCy('btn-all-required').should('not.exist');
          });

          it('should open confirmation dialog when clicking `delete selection` button and remove content after confirmation', () => {
            const remainingContentLength = 1;
            dataCy('btn-remove-selected-content').click({ force: true });
            dataCy('cm-confirm')
              .should('exist')
              .click();

            verifyTaskContent([], selectedContent, remainingContentLength);
          });
        });
      });
    });
  });
});
