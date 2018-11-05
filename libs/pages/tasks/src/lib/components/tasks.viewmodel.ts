import { Injectable } from '@angular/core';
import {
  EduContentInterface,
  LearningAreaInterface,
  PersonInterface,
  TaskEduContentInterface,
  TaskInstanceInterface,
  TaskInterface
} from '@campus/dal';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  LearningAreasWithTaskInstanceInfoInterface,
  TaskInstancesWithEduContentInfoInterface,
  TaskInstanceWithEduContentsInfoInterface
} from './tasks.viewmodel.interfaces';

@Injectable({
  providedIn: 'root'
})
// implements TasksResolver
export class TasksViewModel {
  learningAreasWithTaskInstances$: Observable<
    LearningAreasWithTaskInstanceInfoInterface
  >;
  selectedLearningArea$: Observable<LearningAreaInterface>;
  taskInstancesByLearningArea$: Observable<
    TaskInstancesWithEduContentInfoInterface
  >;
  selectedTaskInstance$: Observable<TaskInstanceInterface>;
  taskInstanceWithEduContents$: Observable<
    TaskInstanceWithEduContentsInfoInterface
  >;

  constructor() {
    this.loadMockData();
  }

  private loadMockData() {
    this.learningAreasWithTaskInstances$ = this.getMockLearningAreasWithTaskInstances();
    this.selectedLearningArea$ = this.getMockSelectedLearningArea();
    this.taskInstancesByLearningArea$ = this.getMockTaskInstancesByLearningArea();
    this.selectedTaskInstance$ = this.getMockSelectedTaskInstance();
    this.taskInstanceWithEduContents$ = this.getMockTaskInstanceWithEduContents();
  }

  private getMockLearningAreasWithTaskInstances(): Observable<
    LearningAreasWithTaskInstanceInfoInterface
  > {
    const mockLearningAreas = this.getMockLearningAreas();

    let mock: LearningAreasWithTaskInstanceInfoInterface;
    mock = {
      learningAreas: [
        {
          learningArea: mockLearningAreas[0],
          openTasks: 2,
          closedTasks: 3
        },
        {
          learningArea: mockLearningAreas[1],
          openTasks: 0,
          closedTasks: 2
        },
        {
          learningArea: mockLearningAreas[2],
          openTasks: 2,
          closedTasks: 0
        }
      ],
      totalTasks: 9
    };

    return new BehaviorSubject(mock);
  }

  private getMockSelectedLearningArea(
    id: 0 | 1 | 2 = 0
  ): Observable<LearningAreaInterface> {
    const mockLearningAreas = this.getMockLearningAreas();
    return new BehaviorSubject(mockLearningAreas[id]);
  }

  private getMockTaskInstancesByLearningArea(): Observable<
    TaskInstancesWithEduContentInfoInterface
  > {
    const mockTaskInstancesAll = this.getMockTaskInstances();

    let mockTaskInstances: TaskInstancesWithEduContentInfoInterface;
    mockTaskInstances = {
      instances: [
        {
          taskInstance: mockTaskInstancesAll[0],
          taskEduContentsCount: 1,
          finished: true
        },
        {
          taskInstance: mockTaskInstancesAll[1],
          taskEduContentsCount: 2,
          finished: true
        },
        {
          taskInstance: mockTaskInstancesAll[2],
          taskEduContentsCount: 1,
          finished: false
        },
        {
          taskInstance: mockTaskInstancesAll[3],
          taskEduContentsCount: 2,
          finished: false
        }
      ]
    };

    return new BehaviorSubject(mockTaskInstances);
  }

  private getMockSelectedTaskInstance(
    id: 0 | 1 | 2 | 3 = 0
  ): Observable<TaskInstanceInterface> {
    return new BehaviorSubject(this.getMockTaskInstances()[id]);
  }

  private getMockTaskInstanceWithEduContents(
    id: 0 | 1 | 2 | 3 = 0,
    finished = false
  ): Observable<TaskInstanceWithEduContentsInfoInterface> {
    const mockTaskInstance = this.getMockTaskInstances()[id];
    const mockTaskEducontents = this.getMockTaskEducontents();

    let mockTaskInstanceWithEducontent: TaskInstanceWithEduContentsInfoInterface;
    mockTaskInstanceWithEducontent = {
      taskInstance: mockTaskInstance,
      taskEduContents: mockTaskEducontents,
      finished: finished
    };

    return new BehaviorSubject(mockTaskInstanceWithEducontent);
  }

  private getMockLearningAreas(): LearningAreaInterface[] {
    let mockLearningArea1: LearningAreaInterface;
    mockLearningArea1 = {
      name: 'Wiskunde',
      icon: 'polpo-wiskunde',
      color: '#2c354f'
    };

    let mockLearningArea2: LearningAreaInterface;
    mockLearningArea2 = {
      name: 'Moderne Wetenschappen',
      icon: 'polpo-natuurwetenschappen',
      color: '#5e3b47'
    };

    let mockLearningArea3: LearningAreaInterface;
    mockLearningArea3 = {
      name: 'Engels',
      icon: 'polpo-engels',
      color: '#553030'
    };

    return [mockLearningArea1, mockLearningArea2, mockLearningArea3];
  }

  private getMockTaskInstances(): TaskInstanceInterface[] {
    const mockTasks = this.getMockTasks();

    let mockTaskInstance1: TaskInstanceInterface;
    mockTaskInstance1 = {
      start: new Date(2018, 11 - 1, 5, 0 + 2),
      end: new Date(2018, 11 - 1, 15, 0 + 2),
      alerted: true,
      id: 1,
      taskId: mockTasks[0].id,
      task: mockTasks[0]
    };

    let mockTaskInstance2: TaskInstanceInterface;
    mockTaskInstance2 = {
      start: new Date(2018, 11 - 1, 5, 0 + 2),
      end: new Date(2018, 11 - 1, 6, 0 + 2),
      alerted: true,
      id: 2,
      taskId: mockTasks[1].id,
      task: mockTasks[1]
    };

    let mockTaskInstance3: TaskInstanceInterface;
    mockTaskInstance3 = {
      start: new Date(2018, 11 - 1, 15, 0 + 2),
      end: new Date(2018, 11 - 1, 30, 0 + 2),
      alerted: false,
      id: 3,
      taskId: mockTasks[2].id,
      task: mockTasks[2]
    };
    let mockTaskInstance4: TaskInstanceInterface;
    mockTaskInstance4 = {
      start: new Date(2018, 11 - 1, 15, 0 + 2),
      end: new Date(2018, 11 - 1, 30, 0 + 2),
      alerted: true,
      id: 4,
      taskId: mockTasks[0].id,
      task: mockTasks[0]
    };

    return [
      mockTaskInstance1,
      mockTaskInstance2,
      mockTaskInstance3,
      mockTaskInstance4
    ];
  }

  private getMockTaskEducontents(): TaskEduContentInterface[] {
    const mockTeacher = this.getMockTeacher();
    const mockTasks = this.getMockTasks();
    const mockEducontents = this.getMockEducontents();

    let mockTaskEducontents1: TaskEduContentInterface;
    mockTaskEducontents1 = {
      index: 10000,
      id: 1,
      teacherId: mockTeacher.id,
      eduContentId: 1,
      taskId: 1,
      teacher: mockTeacher,
      eduContent: mockEducontents[0],
      task: mockTasks[0]
    };

    let mockTaskEducontents2: TaskEduContentInterface;
    mockTaskEducontents2 = {
      index: 10000,
      id: 2,
      teacherId: mockTeacher.id,
      eduContentId: 2,
      taskId: 2,
      teacher: mockTeacher,
      eduContent: mockEducontents[1],
      task: mockTasks[1]
    };

    let mockTaskEducontents3: TaskEduContentInterface;
    mockTaskEducontents3 = {
      index: 10000,
      id: 3,
      teacherId: mockTeacher.id,
      eduContentId: 3,
      taskId: 3,
      teacher: mockTeacher,
      eduContent: mockEducontents[2],
      task: mockTasks[2]
    };

    let mockTaskEducontents4: TaskEduContentInterface;
    mockTaskEducontents4 = {
      index: 10000,
      id: 4,
      teacherId: mockTeacher.id,
      eduContentId: 4,
      taskId: 1,
      teacher: mockTeacher,
      eduContent: mockEducontents[0],
      task: mockTasks[0]
    };

    return [
      mockTaskEducontents1,
      mockTaskEducontents2,
      mockTaskEducontents3,
      mockTaskEducontents4
    ];
  }

  private getMockTeacher(): PersonInterface {
    let mockTeacher: PersonInterface;
    mockTeacher = {
      name: 'Mertens',
      firstName: 'Tom',
      created: new Date('2018-09-04 14:21:15'),
      email: 'teacher1@mailinator.com',
      currentSchoolYear: 2018,
      id: 187,
      displayName: 'Tom Mertens'
    };

    return mockTeacher;
  }

  private getMockTasks(): TaskInterface[] {
    const mockTeacher = this.getMockTeacher();
    const mockLearningAreas = this.getMockLearningAreas();

    let mockTask1: TaskInterface;
    mockTask1 = {
      name: 'Overhoring 1',
      description:
        'Maak deze taak als voorbereiding op de overhoring van volgende week.',
      id: 1,
      personId: mockTeacher.id,
      learningAreaId: mockLearningAreas[0].id,
      teacher: mockTeacher
    };

    let mockTask2: TaskInterface;
    mockTask2 = {
      name: 'Herhaling 1',
      description:
        'Maak deze taak als extra herhaling op de leerstof van vorige week.',
      id: 2,
      personId: mockTeacher.id,
      learningAreaId: mockLearningAreas[1].id,
      teacher: mockTeacher
    };

    let mockTask3: TaskInterface;
    mockTask3 = {
      name: 'Archief groepstaak 1',
      description:
        'Maak deze taak als voorbereiding op de overhoring van volgende week.',
      id: 3,
      personId: mockTeacher.id,
      learningAreaId: mockLearningAreas[2].id,
      teacher: mockTeacher
    };

    return [mockTask1, mockTask2, mockTask3];
  }

  private getMockEducontents(): EduContentInterface[] {
    let mockEducontent1: EduContentInterface;
    mockEducontent1 = {
      type: 'boek-e',
      id: 1
    };

    let mockEducontent2: EduContentInterface;
    mockEducontent2 = {
      type: 'link',
      id: 2
    };

    let mockEducontent3: EduContentInterface;
    mockEducontent3 = {
      type: 'exercise',
      id: 3
    };

    let mockEducontent4: EduContentInterface;
    mockEducontent4 = {
      type: 'file',
      id: 4
    };

    return [mockEducontent1, mockEducontent2, mockEducontent3, mockEducontent4];
  }
}
