import { Injectable } from '@angular/core';
import {
  LearningAreaFixture,
  LearningAreaInterface,
  TaskEduContentFixture,
  TaskFixture,
  TaskInstanceFixture
} from '@campus/dal';
import { ViewModelInterface } from '@campus/testing';
import { ListFormat } from '@campus/ui';
import { BehaviorSubject, Observable } from 'rxjs';
import { TasksViewModel } from './tasks.viewmodel';
import {
  LearningAreasWithTaskInfoInterface,
  TasksWithInfoInterface,
  TaskWithInfoInterface
} from './tasks.viewmodel.interfaces';

@Injectable({
  providedIn: 'root'
})
// implements TasksResolver
export class MockTasksViewModel implements ViewModelInterface<TasksViewModel> {
  learningAreasWithTaskInfo$: Observable<LearningAreasWithTaskInfoInterface>;

  listFormat$: Observable<ListFormat>;
  // routeParams$: TODO type?

  constructor() {
    this.loadMockData();
  }

  setTaskAlertRead(taskId: number) {}
  startExercise() {}

  getLearningAreaById(areaId: number): Observable<LearningAreaInterface> {
    return new BehaviorSubject(new LearningAreaFixture({ id: areaId }));
  }

  getTasksByLearningAreaId(
    learningAreaId: number
  ): Observable<TasksWithInfoInterface> {
    return new BehaviorSubject({
      taskInfos: [
        {
          task: new TaskFixture({ id: 1, learningAreaId }),
          taskInstance: new TaskInstanceFixture({ taskId: 1, id: 1 }),
          taskEduContentsCount: 1,
          taskEduContents: [
            new TaskEduContentFixture({ id: 1, submitted: true })
          ],
          finished: true
        },
        {
          task: new TaskFixture({ id: 2, learningAreaId }),
          taskInstance: new TaskInstanceFixture({ taskId: 2, id: 2 }),
          taskEduContentsCount: 2,
          taskEduContents: [
            new TaskEduContentFixture({ id: 2, submitted: true }),
            new TaskEduContentFixture({ id: 3, submitted: true })
          ],
          finished: true
        },
        {
          task: new TaskFixture({ id: 3, learningAreaId }),
          taskInstance: new TaskInstanceFixture({ taskId: 3, id: 3 }),
          taskEduContentsCount: 1,
          taskEduContents: [
            new TaskEduContentFixture({ id: 4, submitted: false })
          ],
          finished: false
        },
        {
          task: new TaskFixture({ id: 4, learningAreaId }),
          taskInstance: new TaskInstanceFixture({ taskId: 4, id: 4 }),
          taskEduContentsCount: 2,
          taskEduContents: [
            new TaskEduContentFixture({ id: 5, submitted: false }),
            new TaskEduContentFixture({ id: 6, submitted: true })
          ],
          finished: false
        }
      ]
    });
  }

  public getTaskWithInfo(taskId: number): Observable<TaskWithInfoInterface> {
    return new BehaviorSubject({
      task: new TaskFixture({ id: taskId }),
      taskInstance: new TaskInstanceFixture({ taskId: 1, id: 10 }),
      taskEduContentsCount: 2,
      taskEduContents: [
        new TaskEduContentFixture({ id: 1, submitted: true }),
        new TaskEduContentFixture({ id: 2, submitted: false })
      ],
      finished: false
    });
  }

  changeListFormat() {}

  private loadMockData() {
    this.learningAreasWithTaskInfo$ = this.getMockLearningAreasWithTaskInstances();
    this.listFormat$ = this.getMockListFormat();
  }

  private getMockLearningAreasWithTaskInstances(): Observable<
    LearningAreasWithTaskInfoInterface
  > {
    return new BehaviorSubject({
      learningAreasWithInfo: [
        {
          learningArea: new LearningAreaFixture({
            id: 1,
            name: 'Wiskunde',
            icon: 'wiskunde',
            color: '#2c354f'
          }),
          openTasks: 2,
          closedTasks: 3
        },
        {
          learningArea: new LearningAreaFixture({
            id: 2,
            name: 'Moderne Wetenschappen',
            icon: 'natuurwetenschappen',
            color: '#5e3b47'
          }),
          openTasks: 0,
          closedTasks: 2
        },
        {
          learningArea: new LearningAreaFixture({
            id: 3,
            name: 'Engels',
            icon: 'engels',
            color: '#553030'
          }),
          openTasks: 2,
          closedTasks: 0
        }
      ],
      totalTasks: 7
    });
  }

  getMockListFormat(): Observable<ListFormat> {
    return new BehaviorSubject(ListFormat.GRID);
  }
}
