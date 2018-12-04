import { Injectable } from '@angular/core';
import {
  EduContentProductTypeInterface,
  LearningAreaFixture,
  LearningAreaInterface,
  TaskEduContentFixture,
  TaskFixture,
  TaskInstanceFixture,
  TaskInstanceInterface
} from '@campus/dal';
import { ListFormat } from '@campus/ui';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { TasksViewModel } from './tasks.viewmodel';
import {
  LearningAreasWithTaskInfoInterface,
  TasksWithInfoInterface,
  TaskWithInfoInterface
} from './tasks.viewmodel.interfaces';

type ViewModelInterface<T> = { [P in keyof T]: T[P] };

@Injectable({
  providedIn: 'root'
})
// implements TasksResolver
export class MockTasksViewModel implements ViewModelInterface<TasksViewModel> {
  learningAreasWithTaskInfo$: Observable<LearningAreasWithTaskInfoInterface>;
  selectedLearningArea$: Observable<LearningAreaInterface>;
  taskInstancesByLearningArea$: Observable<TasksWithInfoInterface>;
  selectedTaskInstance$: Observable<TaskInstanceInterface>;
  taskInstancesWithEduContents$: Observable<TaskWithInfoInterface[]>;
  listFormat$: Observable<ListFormat>;
  // routeParams$: TODO type?

  constructor() {
    this.loadMockData();
  }

  setTaskAlertRead(taskId: number) {}
  startExercise() {}

  getLearningAreaById(areaId: number): Observable<LearningAreaInterface> {
    return of(new LearningAreaFixture({ id: areaId }));
  }

  getTasksByLearningAreaId(
    learningAreaId: number
  ): Observable<TasksWithInfoInterface> {
    return of({
      taskInfos: [
        {
          task: new TaskFixture({ id: 1, learningAreaId }),
          taskInstance: new TaskInstanceFixture({ taskId: 1, id: 10 }),
          taskEduContentsCount: 2,
          taskEduContents: [
            new TaskEduContentFixture({ id: 1, submitted: true }),
            new TaskEduContentFixture({ id: 2, submitted: false })
          ],
          finished: false
        },
        {
          task: new TaskFixture({ id: 2, learningAreaId }),
          taskInstance: new TaskInstanceFixture({ taskId: 2, id: 12 }),
          taskEduContentsCount: 1,
          taskEduContents: [
            new TaskEduContentFixture({ id: 5, submitted: true })
          ],
          finished: false
        }
      ]
    });
  }

  public getTaskWithInfo(taskId: number): Observable<TaskWithInfoInterface> {
    return of({
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
    const mock: LearningAreasWithTaskInfoInterface = {
      learningAreasWithInfo: [
        {
          learningArea: new LearningAreaFixture({ id: 1 }),
          openTasks: 2,
          closedTasks: 3
        },
        {
          learningArea: new LearningAreaFixture({ id: 2 }),
          openTasks: 0,
          closedTasks: 2
        },
        {
          learningArea: new LearningAreaFixture({ id: 3 }),
          openTasks: 2,
          closedTasks: 0
        }
      ],
      totalTasks: 7
    };

    return of(mock);
  }

  getMockEduContentProductTypes(): EduContentProductTypeInterface[] {
    let mockProductType1: EduContentProductTypeInterface;
    mockProductType1 = {
      name: 'Jaarplan',
      icon: 'polpo-lesmateriaal',
      pedagogic: true,
      excludeFromFilter: false,
      id: 2
    };

    let mockProductType2: EduContentProductTypeInterface;
    mockProductType2 = {
      name: 'Online oefeningen',
      icon: 'polpo-tasks',
      pedagogic: false,
      excludeFromFilter: false,
      id: 4
    };

    let mockProductType3: EduContentProductTypeInterface;
    mockProductType3 = {
      name: 'Lessuggesties',
      icon: 'polpo-lesmateriaal',
      pedagogic: true,
      excludeFromFilter: false,
      id: 6
    };

    let mockProductType4: EduContentProductTypeInterface;
    mockProductType4 = {
      name: 'Links',
      icon: 'polpo-website',
      pedagogic: false,
      excludeFromFilter: false,
      id: 18
    };

    return [
      mockProductType1,
      mockProductType2,
      mockProductType3,
      mockProductType4
    ];
  }

  getMockListFormat(): Observable<ListFormat> {
    return new BehaviorSubject(ListFormat.GRID);
  }
}
