import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  EduContentInterface,
  EduContentProductTypeInterface,
  EduContentQueries,
  LearningAreaInterface,
  LearningAreaQueries,
  MethodInterface,
  PersonInterface,
  ResultInterface,
  TaskEduContentInterface,
  TaskInstanceInterface,
  TaskInterface,
  TaskQueries,
  UiQuery,
  UserQueries
} from '@campus/dal';
import { ListFormat } from '@campus/ui';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ScormStatus } from './../../../../../dal/src/lib/results/enums/scorm-status.enum';
import {
  LearningAreasWithTaskInstanceInfoInterface,
  LearningAreaWithTaskInfo,
  TaskInstancesWithEduContentInfoInterface,
  TaskInstanceWithEduContentsInfoInterface
} from './tasks.viewmodel.interfaces';

@Injectable({
  providedIn: 'root'
})
export class TasksViewModel {
  //source streams //TODO private zetten waar nodig
  public listFormat$: Observable<ListFormat>;
  currentUser$: Observable<PersonInterface>;
  learningAreas$: Observable<LearningAreaInterface[]>;
  teachers$: Observable<PersonInterface[]>;
  tasks$: Observable<TaskInterface[]>;
  educontents$: Observable<EduContentInterface[]>;
  taskInstances$: Observable<TaskInstanceInterface[]>;
  results$: Observable<ResultInterface[]>;
  taskEducontents$: Observable<TaskEduContentInterface[]>;

  //intermediate streams  //TODO private zetten waar nodig
  tasksWithRelationInfo$: Observable<TaskInterface[]>;
  taskInstancesWithRelationInfo$: Observable<
    TaskInstanceWithRelationInfoInterface[]
  >;
  tasksWithInstances$: Observable<TaskWithInstanceInterface[]>;
  learningAreasWithTasks$: Observable<LearningAreaWithTasksInterface[]>;

  // presentation streams
  public learningAreasWithTaskInstances$: Observable<
    LearningAreasWithTaskInstanceInfoInterface
  >;

  public taskInstancesByLearningArea$: Observable<
    TaskInstancesWithEduContentInfoInterface[]
  >;

  public taskInstanceWithEduContents$: Observable<
    TaskInstanceWithEduContentsInfoInterface
  >;

  constructor(
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
  ) {
    this.loadMockData();
    this.setSourceStreams();
    this.setIntermediateStreams();
    this.setPresentationStreams();
  }

  public changeListFormat(value: ListFormat) {}

  public getLearningAreaById(
    areaId: number
  ): Observable<LearningAreaInterface> {
    return this.store.pipe(select(LearningAreaQueries.getById, { id: areaId }));
  }

  public getTaskById(taskId: number): Observable<TaskInterface> {
    return this.store.pipe(select(TaskQueries.getById, { id: taskId }));
  }

  // Alles hier is nog TODO: ophalen uit state
  private loadMockData() {
    this.taskInstances$ = of(this.getMockTaskInstances());
    this.results$ = of([]);
    this.teachers$ = of([this.getMockTeacher()]);
  }

  private setSourceStreams() {
    this.listFormat$ = this.store.pipe(
      select(UiQuery.getListFormat),
      map(listFormat => <ListFormat>listFormat)
    );

    this.currentUser$ = this.store.pipe(
      select(UserQueries.getCurrentUser),
      map(user => <PersonInterface>user)
    );

    this.learningAreas$ = this.store.pipe(select(LearningAreaQueries.getAll));

    //this.teachers$ = this.store.pipe(select(UserQueries.));

    this.tasks$ = this.store.pipe(select(TaskQueries.getAll));

    this.educontents$ = this.store.pipe(select(EduContentQueries.getAll));

    //this.taskInstances$
  }

  private setIntermediateStreams() {
    this.tasksWithRelationInfo$ = combineLatest(
      this.tasks$,
      this.taskEducontents$,
      this.educontents$,
      this.learningAreas$,
      this.teachers$
    ).pipe(
      map(([tasks, taskEducontents, educontents, learningAreas, teachers]) =>
        tasks.map(task => {
          task.eduContents = educontents.filter(educontent =>
            taskEducontents.some(
              tE => tE.taskId === task.id && tE.eduContentId === educontent.id
            )
          );

          task.learningArea = learningAreas.find(
            learningArea => learningArea.id === task.learningAreaId
          );
          task.teacher = teachers.find(teacher => task.personId === teacher.id);

          return task;
        })
      )
    );

    this.taskInstancesWithRelationInfo$ = combineLatest(
      this.taskInstances$,
      this.tasksWithRelationInfo$,
      this.results$
    ).pipe(
      map(([taskInstances, tasks, results]) =>
        taskInstances.map(instance => {
          const instanceWithRelations = instance as TaskInstanceWithRelationInfoInterface;

          instanceWithRelations.task = tasks.find(
            task => task.id === instance.taskId
          );

          instanceWithRelations.results = results.filter(
            result =>
              result.taskId === instanceWithRelations.taskId &&
              result.personId === instanceWithRelations.personId
          );

          instanceWithRelations.isFinished = instanceWithRelations.results.some(
            result => result.status !== ScormStatus.STATUS_COMPLETED
          );

          return instanceWithRelations;
        })
      )
    );

    this.tasksWithInstances$ = combineLatest(
      this.tasks$,
      this.taskInstancesWithRelationInfo$
    ).pipe(
      map(([tasks, taskInstances]) =>
        tasks.map(task => {
          const taskWithInstanceInfo = task as TaskWithInstanceInterface;
          taskWithInstanceInfo.taskInstances = taskInstances.filter(
            instance => instance.taskId === taskWithInstanceInfo.id
          );
          return taskWithInstanceInfo;
        })
      )
    );

    this.learningAreasWithTasks$ = combineLatest(
      this.tasksWithInstances$,
      this.learningAreas$
    ).pipe(
      map(([tasks, learningAreas]) =>
        learningAreas.map(learningArea => {
          const learningAreasWithTasks = learningArea as LearningAreaWithTasksInterface;
          learningAreasWithTasks.tasks = tasks.filter(
            task => task.learningAreaId === learningArea.id
          );

          return learningAreasWithTasks;
        })
      )
    );
  }

  private setPresentationStreams() {
    this.learningAreasWithTaskInstances$ = this.learningAreasWithTasks$.pipe(
      map(
        (learningAreas): LearningAreasWithTaskInstanceInfoInterface => {
          const learningAreasWithInfo: LearningAreaWithTaskInfo[] = learningAreas.map(
            area => {
              const totalTasksInArea = area.tasks.filter(
                task => task.instances.length !== 0
              ).length;

              const tasksFinishedAmount = area.tasks.filter(task =>
                task.instances.filter(instance => instance.isFinished)
              ).length;

              return {
                learningArea: area,
                openTasks: totalTasksInArea - tasksFinishedAmount,
                closedTasks: tasksFinishedAmount
              };
            }
          );

          const totalTasks = learningAreasWithInfo.reduce(
            (total, area) => total + area.openTasks + area.closedTasks,
            0
          );

          return {
            learningAreasWithInfo: learningAreasWithInfo,
            totalTasks: totalTasks
          };
        }
      )
    );

    this.taskInstanceWithEduContents$ = this.taskInstancesWithRelationInfo$.pipe(
      map(
        (instances): TaskInstanceWithEduContentsInfoInterface => {
          instances.map(instance => {
            return {
              taskInstance: instance as TaskInstanceInterface,
              eduContents: instance.task.eduContents,
              finished: instance.isFinished
            };
          });

          return;
        }
      )
    );
  }

  private getMockLearningAreas(): LearningAreaInterface[] {
    let mockLearningArea1: LearningAreaInterface;
    mockLearningArea1 = {
      name: 'Wiskunde',
      icon: 'wiskunde',
      color: '#2c354f'
    };

    let mockLearningArea2: LearningAreaInterface;
    mockLearningArea2 = {
      name: 'Moderne Wetenschappen',
      icon: 'natuurwetenschappen',
      color: '#5e3b47'
    };

    let mockLearningArea3: LearningAreaInterface;
    mockLearningArea3 = {
      name: 'Engels',
      icon: 'engels',
      color: '#553030'
    };

    return [mockLearningArea1, mockLearningArea2, mockLearningArea3];
  }

  private getMockTaskInstances(): TaskInstanceInterface[] {
    const mockTasks = this.getMockTasks();
    const mockStudent = this.getMockStudent();

    let mockTaskInstance1: TaskInstanceInterface;
    mockTaskInstance1 = {
      start: new Date(2018, 11 - 1, 5, 0 + 2),
      end: new Date(2018, 11 - 1, 15, 0 + 2),
      alerted: true,
      id: 1,
      taskId: mockTasks[0].id,
      task: mockTasks[0],
      personId: mockStudent.id,
      student: mockStudent
    };

    let mockTaskInstance2: TaskInstanceInterface;
    mockTaskInstance2 = {
      start: new Date(2018, 11 - 1, 5, 0 + 2),
      end: new Date(2018, 11 - 1, 6, 0 + 2),
      alerted: true,
      id: 2,
      taskId: mockTasks[1].id,
      task: mockTasks[1],
      personId: mockStudent.id,
      student: mockStudent
    };

    let mockTaskInstance3: TaskInstanceInterface;
    mockTaskInstance3 = {
      start: new Date(2018, 11 - 1, 15, 0 + 2),
      end: new Date(2018, 11 - 1, 30, 0 + 2),
      alerted: false,
      id: 3,
      taskId: mockTasks[2].id,
      task: mockTasks[2],
      personId: mockStudent.id,
      student: mockStudent
    };
    let mockTaskInstance4: TaskInstanceInterface;
    mockTaskInstance4 = {
      start: new Date(2018, 11 - 1, 15, 0 + 2),
      end: new Date(2018, 11 - 1, 30, 0 + 2),
      alerted: true,
      id: 4,
      taskId: mockTasks[0].id,
      task: mockTasks[0],
      personId: mockStudent.id,
      student: mockStudent
    };

    return [
      mockTaskInstance1,
      mockTaskInstance2,
      mockTaskInstance3,
      mockTaskInstance4
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
      // Avatar:
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
      teacher: mockTeacher,
      learningAreaId: mockLearningAreas[0].id,
      learningArea: mockLearningAreas[0]
    };

    let mockTask2: TaskInterface;
    mockTask2 = {
      name: 'Herhaling 1',
      description:
        'Maak deze taak als extra herhaling op de leerstof van vorige week.',
      id: 2,
      personId: mockTeacher.id,
      teacher: mockTeacher,
      learningAreaId: mockLearningAreas[1].id,
      learningArea: mockLearningAreas[1]
    };

    let mockTask3: TaskInterface;
    mockTask3 = {
      name: 'Archief groepstaak 1',
      description:
        'Maak deze taak als voorbereiding op de overhoring van volgende week.',
      id: 3,
      personId: mockTeacher.id,
      teacher: mockTeacher,
      learningAreaId: mockLearningAreas[2].id,
      learningArea: mockLearningAreas[2]
    };

    return [mockTask1, mockTask2, mockTask3];
  }

  getMockStudent(): PersonInterface {
    let mockStudent: PersonInterface;
    mockStudent = {
      name: 'Bakker',
      firstName: 'Manon',
      created: new Date('2018-09-04 14:21:14'),
      email: 'student0@mailinator.com',
      currentSchoolYear: 2018,
      terms: true,
      username: 'student1',
      emailVerified: true,
      id: 6,
      displayName: 'Manon Bakker'
    };

    return mockStudent;
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

  getMockMethods(): MethodInterface[] {
    const mockLearningAreas = this.getMockLearningAreas();

    let mockMethod1: MethodInterface;
    mockMethod1 = {
      name: 'Beautemps',
      icon: 'beautemps',
      logoUrl: 'beautemps.svg',
      experimental: false,
      id: 1,
      learningAreaId: mockLearningAreas[0].id,
      learningArea: mockLearningAreas[0]
    };

    let mockMethod2: MethodInterface;
    mockMethod2 = {
      name: 'Kapitaal',
      icon: 'kapitaal',
      logoUrl: 'kapitaal.svg',
      experimental: false,
      id: 2,
      learningAreaId: mockLearningAreas[1].id,
      learningArea: mockLearningAreas[1]
    };

    let mockMethod3: MethodInterface;
    mockMethod3 = {
      name: 'Beaufort',
      icon: 'beaufort',
      logoUrl: 'beaufort.svg',
      experimental: false,
      id: 3,
      learningAreaId: mockLearningAreas[2].id,
      learningArea: mockLearningAreas[2]
    };

    return [mockMethod1, mockMethod2, mockMethod3];
  }
}

export interface LearningAreaWithTasksInterface extends LearningAreaInterface {
  tasks: TaskWithInstanceInterface[];
}

export interface TaskWithInstanceInterface extends TaskInterface {
  instances: TaskInstanceWithRelationInfoInterface[];
}

export interface TaskInstanceWithRelationInfoInterface
  extends TaskInstanceInterface {
  results: ResultInterface[];
  isFinished: boolean;
}
