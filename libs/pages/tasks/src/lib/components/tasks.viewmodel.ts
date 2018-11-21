import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  EduContentInterface,
  EduContentQueries,
  LearningAreaInterface,
  LearningAreaQueries,
  PersonFixture,
  PersonInterface,
  ResultFixture,
  ResultInterface,
  TaskEduContentFixture,
  TaskEduContentInterface,
  TaskInstanceFixture,
  TaskInstanceInterface,
  TaskInterface,
  TaskQueries,
  UiActions,
  UiQuery
} from '@campus/dal';
import { ListFormat } from '@campus/ui';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable, of } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { ScormStatus } from './../../../../../dal/src/lib/results/enums/scorm-status.enum';
import { TasksResolver } from './tasks.resolver';
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
  //source streams
  public listFormat$: Observable<ListFormat>;
  protected learningAreas$: Observable<LearningAreaInterface[]>;
  protected teachers$: Observable<PersonInterface[]>;
  protected sharedTasks$: Observable<TaskInterface[]>;
  protected educontents$: Observable<EduContentInterface[]>;
  protected taskInstances$: Observable<TaskInstanceInterface[]>;
  protected results$: Observable<ResultInterface[]>;
  protected taskEducontents$: Observable<TaskEduContentInterface[]>;

  //dictionaries
  private EduContentIdsPerTaskId$: Observable<Map<number, number[]>>;
  private TaskIdsPerLearningAreaId$: Observable<Map<number, number[]>>;
  private TaskIdsPerTeacherId$: Observable<Map<number, number[]>>;

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
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface,
    private tasksResolver: TasksResolver
  ) {
    tasksResolver.resolve();
    this.loadMockData();
    this.setSourceStreams();
    this.setIntermediateStreams();
    this.setPresentationStreams();
  }

  public changeListFormat(listFormat: ListFormat): void {
    this.store.dispatch(new UiActions.SetListFormatUi({ listFormat }));
  }

  public getLearningAreaById(
    areaId: number
  ): Observable<LearningAreaInterface> {
    return this.store.pipe(select(LearningAreaQueries.getById, { id: areaId }));
  }

  public getTaskById(taskId: number): Observable<TaskInterface> {
    return this.store.pipe(select(TaskQueries.getById, { id: taskId }));
  }

  // Alles hier is nog TODO: ophalen uit state
  public loadMockData() {
    this.taskInstances$ = of(this.getMockTaskInstances());
    this.results$ = of(this.getMockResults());
    this.teachers$ = of(this.getMockTeachers());
    this.taskEducontents$ = of(this.getMockTaskEduContents());
  }

  public setSourceStreams() {
    this.listFormat$ = this.store.pipe(
      select(UiQuery.getListFormat),
      map(listFormat => <ListFormat>listFormat) //TODO: remove mapping
    );

    this.sharedTasks$ = this.store.pipe(
      select(TaskQueries.getShared, { userId: this.authService.userId })
    );

    this.TaskIdsPerLearningAreaId$ = this.getTaskIdsPerLearningAreaId$(
      this.sharedTasks$
    );

    this.learningAreas$ = this.TaskIdsPerLearningAreaId$.pipe(
      flatMap(ids =>
        this.store.pipe(
          select(LearningAreaQueries.getByIds, { ids: Array.from(ids.keys()) })
        )
      )
    );

    this.TaskIdsPerTeacherId$ = this.getTaskIdsPerTeacherId$(this.sharedTasks$);
    //this.teachers$ = this.store.pipe(select(UserQueries.getByIds, { ids: Array.from(ids.keys()) };

    //this.taskEducontents$ //TODO selector maken voor sharedTask- en ownedTaskEducontent

    this.EduContentIdsPerTaskId$ = this.getEduContentIdsPerTaskId$(
      this.taskEducontents$
    );
    const UniqueEduContentIds$ = this.EduContentIdsPerTaskId$.pipe(
      map(dict => this.flattenArrayToUniqueValues(Array.from(dict.values())))
    );

    this.educontents$ = UniqueEduContentIds$.pipe(
      flatMap(ids =>
        this.store.pipe(
          select(EduContentQueries.getByIds, {
            ids: Array.from(ids)
          })
        )
      )
    );

    //this.taskInstances$ //TODO selector maken voor sharedTask- en ownedTaskInstances
    const sharedTaskInstanceIds$ = combineLatest(
      this.sharedTasks$,
      this.taskInstances$
    ).pipe(
      map(([tasks, taskInstances]) =>
        taskInstances
          .filter(tI => tasks.some(task => task.id === tI.taskId))
          .reduce(
            (array, tI) => {
              if (!array.includes(tI.id)) {
                array.push(tI.id);
              }
              return array;
            },
            [] as number[]
          )
      )
    );
  }

  private setIntermediateStreams() {
    this.tasksWithRelationInfo$ = combineLatest(
      this.sharedTasks$,
      this.educontents$,
      this.learningAreas$,
      this.teachers$
    ).pipe(
      map(([tasks, educontents, learningAreas, teachers]) =>
        tasks.map(task => {
          return {
            ...task,
            eduContents: educontents,
            learningArea: learningAreas.find(
              learningArea => learningArea.id === task.learningAreaId
            ),
            teacher: teachers.find(teacher => task.personId === teacher.id)
          };
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
          return {
            ...instance,
            task: tasks.find(task => task.id === instance.taskId),
            results: results.filter(
              result =>
                result.taskId === instance.taskId &&
                result.personId === instance.personId
            )
          };
        })
      )
    );

    this.tasksWithInstances$ = combineLatest(
      this.sharedTasks$,
      this.taskInstancesWithRelationInfo$
    ).pipe(
      map(([tasks, taskInstances]) =>
        tasks.map(task => {
          return {
            ...task,
            instances: taskInstances.filter(
              instance => instance.taskId === task.id
            )
          };
        })
      )
    );

    this.learningAreasWithTasks$ = combineLatest(
      this.tasksWithInstances$,
      this.learningAreas$
    ).pipe(
      map(([tasks, learningAreas]) =>
        learningAreas.map(learningArea => {
          return {
            ...learningArea,
            tasks: tasks.filter(task => task.learningAreaId === learningArea.id)
          };
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

              const tasksFinishedAmount = area.tasks.filter(
                task => task.instances.filter(instance => instance.isFinished) //TODO: aanpassen
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
              finished: instance.isFinished //TODO: aanpassen
            };
          });

          return;
        }
      )
    );
  }

  // creates a Map<number, number[]>
  // the keys are the learningAreaId
  // the values are an array of the ids of the associated tasks
  private getTaskIdsPerLearningAreaId$(tasks$: Observable<TaskInterface[]>) {
    return tasks$.pipe(
      map(tasks =>
        tasks.reduce((dict, task) => {
          let taskIds: number[];
          if (dict.has(task.learningAreaId)) {
            taskIds = dict.get(task.learningAreaId);
            taskIds.push(task.id);
          } else {
            taskIds = [task.id];
          }
          dict.set(task.learningAreaId, taskIds);

          return dict;
        }, new Map<number, number[]>())
      )
    );
  }

  // creates a Map<number, number[]>
  // the keys are the taskId
  // the values are an array of the ids of the associated Educontent
  private getEduContentIdsPerTaskId$(
    taskEducontents$: Observable<TaskEduContentInterface[]>
  ) {
    return taskEducontents$.pipe(
      map(taskEducontents =>
        taskEducontents.reduce((dict, taskEducontent) => {
          let educontentIds: number[];
          if (dict.has(taskEducontent.taskId)) {
            educontentIds = dict.get(taskEducontent.taskId);
            educontentIds.push(taskEducontent.eduContentId);
          } else {
            educontentIds = [taskEducontent.eduContentId];
          }
          dict.set(taskEducontent.taskId, educontentIds);

          return dict;
        }, new Map<number, number[]>())
      )
    );
  }

  // creates a Map<number, number[]>
  // the keys are the teacherId
  // the values are an array of the ids of the associated tasks
  private getTaskIdsPerTeacherId$(tasks$: Observable<TaskInterface[]>) {
    return tasks$.pipe(
      map(tasks =>
        tasks.reduce((dict, task) => {
          let taskIds: number[];
          if (dict.has(task.personId)) {
            taskIds = dict.get(task.personId);
            taskIds.push(task.id);
          } else {
            taskIds = [task.id];
          }
          dict.set(task.personId, taskIds);

          return dict;
        }, new Map<number, number[]>())
      )
    );
  }

  private flattenArrayToUniqueValues(array: any[]): any[] {
    return Array.from(
      new Set(Array.from(array).reduce((acc, val) => acc.concat(val), []))
    ).sort();
  }

  private getMockTaskInstances(): TaskInstanceInterface[] {
    return [
      new TaskInstanceFixture({ id: 1, taskId: 1, personId: 1 }),
      new TaskInstanceFixture({ id: 2, taskId: 2, personId: 1 }),
      new TaskInstanceFixture({ id: 3, taskId: 3, personId: 1 })
    ];
  }

  private getMockTeachers(): PersonInterface[] {
    return [new PersonFixture({ id: 186 }), new PersonFixture({ id: 187 })];
  }

  private getMockResults(): ResultInterface[] {
    return [
      new ResultFixture({ id: 1, eduContentId: 1, taskId: 1, personId: 1 }),
      new ResultFixture({ id: 2, eduContentId: 2, taskId: 1, personId: 1 }),
      new ResultFixture({
        id: 3,
        eduContentId: 2,
        taskId: 1,
        personId: 1,
        status: ScormStatus.STATUS_INCOMPLETE
      })
    ];
  }

  private getMockTaskEduContents(): TaskEduContentInterface[] {
    return [
      new TaskEduContentFixture({
        id: 1,
        teacherId: 186,
        taskId: 1,
        eduContentId: 1
      }),
      new TaskEduContentFixture({
        id: 2,
        teacherId: 187,
        taskId: 2,
        eduContentId: 2
      }),
      new TaskEduContentFixture({
        id: 3,
        teacherId: 187,
        taskId: 1,
        eduContentId: 2
      })
    ];
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
}
