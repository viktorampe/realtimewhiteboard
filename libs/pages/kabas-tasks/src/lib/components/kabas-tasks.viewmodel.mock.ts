import { Injectable } from '@angular/core';
import { LearningAreaFixture, TaskFixture } from '@campus/dal';
import { ViewModelInterface } from '@campus/testing';
import { Observable, of } from 'rxjs';
import { KabasTasksViewModel } from './kabas-tasks.viewmodel';
import {
  AssigneeType,
  TaskWithAssigneesInterface
} from './kabas-tasks.viewmodel.selectors';

@Injectable({
  providedIn: 'root'
})
export class MockKabasTasksViewModel
  implements ViewModelInterface<KabasTasksViewModel> {
  public tasksWithAssignments$: Observable<TaskWithAssigneesInterface[]>;
  public paperTasksWithAssignments$: Observable<TaskWithAssigneesInterface[]>;

  constructor() {
    const tasks = this.setupTaskWithAssignments();
    this.tasksWithAssignments$ = of(tasks);

    this.paperTasksWithAssignments$ = of(
      tasks.map(task => {
        return {
          ...task,
          isPaperTask: true,
          name: `papier: ${task.name}`,
          description: `papieren taak: ${task.description}`
        };
      })
    );
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
        eduContentAmount: 3,
        learningArea: new LearningAreaFixture({ name: 'wiskunde' }),
        assignees: [
          {
            type: AssigneeType.CLASSGROUP,
            label: '1A',
            start: yesterday,
            end: nextWeek
          },
          {
            type: AssigneeType.GROUP,
            label: 'Remediëring 2c',
            start: yesterday,
            end: nextWeek
          },
          {
            type: AssigneeType.STUDENT,
            label: 'Polleke',
            start: yesterday,
            end: nextWeek
          },
          {
            type: AssigneeType.STUDENT,
            label: 'Anneke',
            start: yesterday,
            end: nextWeek
          }
        ]
      },
      //Task runs for all assignees in different timespans
      {
        ...new TaskFixture({ archivedAt: null, archivedYear: null }),
        eduContentAmount: 5,
        learningArea: new LearningAreaFixture({ name: 'wiskunde' }),
        assignees: [
          {
            type: AssigneeType.CLASSGROUP,
            label: '2A',
            start: yesterday,
            end: tomorrow
          },
          {
            type: AssigneeType.GROUP,
            label: 'Remediëring 2c',
            start: yesterday,
            end: nextWeek
          },
          {
            type: AssigneeType.STUDENT,
            label: 'Polleke',
            start: prevWeek,
            end: nextWeek
          }
        ]
      },
      //active
      {
        ...new TaskFixture({ archivedAt: null, archivedYear: null }),
        eduContentAmount: 3,
        learningArea: new LearningAreaFixture({ name: 'nederlands' }),
        assignees: [
          {
            type: AssigneeType.CLASSGROUP,
            label: '2A',
            start: prevMonth,
            end: nextWeek
          }
        ]
      },
      //pending
      {
        ...new TaskFixture({ archivedAt: null, archivedYear: null }),
        eduContentAmount: 5,
        learningArea: new LearningAreaFixture({ name: 'nederlands' }),
        assignees: [
          {
            type: AssigneeType.CLASSGROUP,
            label: '2A',
            start: tomorrow,
            end: nextWeek
          }
        ]
      },
      //finished
      {
        ...new TaskFixture({ archivedAt: null, archivedYear: null }),
        eduContentAmount: 5,
        learningArea: new LearningAreaFixture({ name: 'nederlands' }),
        assignees: [
          {
            type: AssigneeType.CLASSGROUP,
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
        eduContentAmount: 2,
        learningArea: new LearningAreaFixture({ name: 'wiskunde' }),
        assignees: [
          {
            type: AssigneeType.CLASSGROUP,
            label: '2A',
            start: prevMonth,
            end: prevWeek
          }
        ]
      }
    ];
  }
}
