/// <reference types="cypress" />

import { cyEnv, dataCy } from '../support/commands';
import { ApiPathsInterface } from '../support/interfaces';

const apiUrl = cyEnv('apiUrl');
const apiPaths = cyEnv('apiPaths') as ApiPathsInterface;

export function checkModalContent(contents: string) {
  dataCy('cm-content').should('contain.text', contents);
}

export function confirmModal() {
  dataCy('cm-confirm').click();
}

export function cancelModal() {
  dataCy('cm-cancel').click();
}

export function checkError(containing: string) {
  dataCy('banner-content')
    .contains(containing)
    .should('exist');
}

export function checkAndCancelError(containing?: string) {
  const banner = dataCy('banner-content');
  if (containing) {
    banner.contains(containing);
  }
  banner.should('exist');
  dataCy('banner-action')
    .last()
    .click();
}

export function verifyTaskInfo(
  fields = {
    title: 'foo',
    description: 'bar'
  }
) {
  Object.keys(fields).forEach(field => {
    dataCy('task-' + field).contains(fields[field]);
  });
}

export function updateTaskInfo(
  fields = {
    title: 'foo',
    description: 'bar'
  }
) {
  dataCy('task-info').click();

  Object.keys(fields).forEach(field => {
    dataCy('task-' + field + '-input').type(fields[field]);
  });

  dataCy('edit-task-confirm').click();
}

export function selectTaskEduContent(eduContentTitles: string[]) {
  eduContentTitles.forEach(title => {
    cy.contains('[data-cy=task-edu-content]', title).click();
  });
}

export function addAssigneesToTask(
  assignees: string[],
  modalIsOpen: boolean = false
) {
  if (!modalIsOpen) dataCy('btn-add-task-assignees').click();
  dataCy('btn-assign-task-to').click();
  selectAssignee(assignees);
  dataCy('btn-select-task-assignees-confirm').click();
  dataCy('btn-manage-task-assignees-confirm').click();
}

export function removeAssigneesFromTask(
  assignees: string[],
  modalIsOpen: boolean = false
) {
  if (!modalIsOpen) dataCy('btn-add-task-assignees').click();
  removeAssignee(assignees, true);
  dataCy('btn-manage-task-assignees-confirm').click();
}
export function removeAssigneesFromTask2(assignees: string[]) {
  removeAssignee(assignees, false);
}

export function selectAssignee(assignees: string[]) {
  assignees.forEach(assignee => {
    dataCy('selectable-assignee-' + assignee).click();
  });
}

export function removeAssignee(assignees: string[], modal?: boolean) {
  assignees.forEach(assignee => {
    dataCy((modal ? 'removable-assignee-' : 'task-assignee-') + assignee)
      .find('mat-icon')
      .click();
  });
}

export function verifyTaskAssignees(
  assignees: string[],
  shouldNotExist: string[] = []
) {
  assignees.forEach(assignee => {
    dataCy('task-assignee-' + assignee).should('exist');
  });
  shouldNotExist.forEach(assignee => {
    dataCy('task-assignee-' + assignee).should('not.exist');
  });
}

export function verifyTaskContent(
  content: string[] = [],
  shouldNotExist: string[] = [],
  remainingContentCount?: number
) {
  content.forEach(title => {
    cy.contains('[data-cy=task-edu-content]', title).should('exist');
  });
  shouldNotExist.forEach(title => {
    cy.contains('[data-cy=task-edu-content]', title).should('not.exist');
  });
  if (Number.isInteger(remainingContentCount)) {
    dataCy('task-edu-content').should('have.length', remainingContentCount);
  }
}
