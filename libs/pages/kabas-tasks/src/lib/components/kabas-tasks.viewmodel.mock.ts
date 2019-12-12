import { Injectable } from '@angular/core';
import { LearningAreaFixture, TaskFixture } from '@campus/dal';
import { ViewModelInterface } from '@campus/testing';
import { BehaviorSubject, Observable } from 'rxjs';
import { AssigneeTypesEnum } from '../interfaces/Assignee.interface';
import {
  TaskStatusEnum,
  TaskWithAssigneesInterface
} from '../interfaces/TaskWithAssignees.interface';
import { KabasTasksViewModel } from './kabas-tasks.viewmodel';

@Injectable({
  providedIn: 'root'
})
export class MockKabasTasksViewModel
  implements ViewModelInterface<KabasTasksViewModel> {
  public tasksWithAssignments$: Observable<TaskWithAssigneesInterface[]>;
  public paperTasksWithAssignments$: Observable<TaskWithAssigneesInterface[]>;

  constructor() {
    const tasks = this.setupTaskWithAssignments();
    this.tasksWithAssignments$ = new BehaviorSubject<
      TaskWithAssigneesInterface[]
    >(tasks);

    this.paperTasksWithAssignments$ = new BehaviorSubject<
      TaskWithAssigneesInterface[]
    >(
      tasks.slice(0, 3).map(task => {
        return {
          ...task,
          isPaperTask: true,
          name: `papier: ${task.name}`,
          description: `papieren taak: ${task.description}`
        };
      })
    );
  }

  public getTaskDates() {
    return {
      startDate: new Date(),
      endDate: new Date(),
      status: this.getTaskStatus()
    };
  }
  public getTaskStatus() {
    return TaskStatusEnum.ACTIVE;
  }

  private setupTaskWithAssignments(): TaskWithAssigneesInterface[] {
    const today = new Date();
    const yesterday = new Date(today.setDate(today.getDate() - 1));
    const tomorrow = new Date(today.setDate(today.getDate() + 1));
    const nextWeek = new Date(today.setDate(today.getDate() + 7));
    const prevWeek = new Date(today.setDate(today.getDate() - 7));
    const prevMonth = new Date(today.setMonth(today.getMonth() - 1));

    return [
      //Task runs for all assignees from yesterday to next week
      {
        ...new TaskFixture({ archivedAt: null, archivedYear: null }),
        name: 'Titel van de eerste oefening',
        eduContentAmount: 3,
        learningArea: new LearningAreaFixture({ name: 'wiskunde' }),
        assignees: [
          {
            type: AssigneeTypesEnum.CLASSGROUP,
            label: '1A',
            start: yesterday,
            end: nextWeek
          },
          {
            type: AssigneeTypesEnum.GROUP,
            label: 'Remediëring 2c',
            start: yesterday,
            end: nextWeek
          },
          {
            type: AssigneeTypesEnum.STUDENT,
            label: 'Polleke',
            start: yesterday,
            end: nextWeek
          },
          {
            type: AssigneeTypesEnum.STUDENT,
            label: 'Anneke',
            start: yesterday,
            end: nextWeek
          }
        ]
      },
      //Task runs for all assignees in different timespans
      {
        ...new TaskFixture({ archivedAt: null, archivedYear: null }),
        name: 'Titel van de tweede oefening',
        eduContentAmount: 5,
        learningArea: new LearningAreaFixture({ name: 'wiskunde' }),
        assignees: [
          {
            type: AssigneeTypesEnum.CLASSGROUP,
            label: '2A',
            start: yesterday,
            end: tomorrow
          },
          {
            type: AssigneeTypesEnum.GROUP,
            label: 'Remediëring 2c',
            start: yesterday,
            end: nextWeek
          },
          {
            type: AssigneeTypesEnum.STUDENT,
            label: 'Polleke',
            start: prevWeek,
            end: nextWeek
          }
        ]
      },
      //active
      {
        ...new TaskFixture({ archivedAt: null, archivedYear: null }),
        name: 'Actieve oefening voor één klasgroep',
        eduContentAmount: 3,
        learningArea: new LearningAreaFixture({ name: 'nederlands' }),
        assignees: [
          {
            type: AssigneeTypesEnum.CLASSGROUP,
            label: '2A',
            start: prevMonth,
            end: nextWeek
          }
        ]
      },
      //pending
      {
        ...new TaskFixture({ archivedAt: null, archivedYear: null }),
        name: 'Pending oefening voor één klasgroep',
        eduContentAmount: 5,
        learningArea: new LearningAreaFixture({ name: 'nederlands' }),
        assignees: [
          {
            type: AssigneeTypesEnum.CLASSGROUP,
            label: '2A',
            start: tomorrow,
            end: nextWeek
          }
        ]
      },
      //finished
      {
        ...new TaskFixture({ archivedAt: null, archivedYear: null }),
        name: 'Finished oefening',
        eduContentAmount: 5,
        learningArea: new LearningAreaFixture({ name: 'nederlands' }),
        assignees: [
          {
            type: AssigneeTypesEnum.CLASSGROUP,
            label: '2A',
            start: prevMonth,
            end: prevWeek
          }
        ]
      },
      //archived
      {
        ...new TaskFixture({
          archivedAt: prevWeek,
          archivedYear: prevWeek.getFullYear()
        }),
        name: 'Gearchiveerde oefening',
        eduContentAmount: 2,
        learningArea: new LearningAreaFixture({ name: 'wiskunde' }),
        assignees: [
          {
            type: AssigneeTypesEnum.CLASSGROUP,
            label: '2A',
            start: prevMonth,
            end: prevWeek
          }
        ]
      }
    ];
  }
}
