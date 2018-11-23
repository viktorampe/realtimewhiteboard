import { Inject, Injectable } from '@angular/core';
import {
  AlertService,
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
import { ScormStatus } from '@campus/scorm';
import { ListFormat } from '@campus/ui';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable, of } from 'rxjs';
import { flatMap, map, tap } from 'rxjs/operators';
import { TasksResolver } from './tasks.resolver';
import {
  EduContentWithSubmittedInterface,
  LearningAreasWithTaskInstanceInfoInterface,
  TaskInstancesWithEduContentInfoInterface,
  TaskInstanceWithEduContentInfoInterface
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
  protected eduContents$: Observable<EduContentInterface[]>;
  protected taskInstances$: Observable<TaskInstanceInterface[]>;
  protected results$: Observable<ResultInterface[]>;
  protected taskEducontents$: Observable<
    TaskEduContentWithSubmittedInterface[]
  >;

  //dictionaries
  private eduContentIdsPerTaskId$: Observable<
    Map<number, Map<number, boolean>[]>
  >;
  private uniqueEduContentIds$: Observable<number[]>;
  private tasksPerLearningAreaId$: Observable<Map<number, TaskInterface[]>>;
  private tasksPerTeacherId$: Observable<Map<number, TaskInterface[]>>;

  //intermediate streams

  // Adds Educontents (with submitted prop)
  // Adds Teacher
  private tasksWithRelationInfo$: Observable<TaskWithRelationsInterface[]>;

  // Adds Results
  // Adds Task (with relation info)
  private taskInstancesWithResults$: Observable<
    TaskInstanceWithResultsInterface[]
  >;

  // Adds TaskInstanceWithResults
  private tasksWithInstanceWithResults$: Observable<
    TaskWithRelationsInterface[]
  >;

  // Adds TaskWithInstances
  private learningAreasWithTasks$: Observable<LearningAreaWithTasksInterface[]>;

  // presentation streams

  // Adds open/closed task count to learningAreas
  // Adds total task count
  public learningAreasWithTaskInstanceInfo$: Observable<
    LearningAreasWithTaskInstanceInfoInterface
  >;

  // Adds EduContents
  // Adds EduContentsCount
  // Adds finished
  public taskInstancesWithEduContents$: Observable<
    TaskInstanceWithEduContentInfoInterface[]
  >;

  //#region constructor
  constructor(
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface,
    private tasksResolver: TasksResolver,
    private alertService: AlertService
  ) {
    tasksResolver.resolve();
    this.loadMockData();
    this.setSourceStreams();
    this.setIntermediateStreams();
    this.setPresentationStreams();
  }
  //#endregion

  //#region public functions
  public changeListFormat(listFormat: ListFormat): void {
    this.store.dispatch(new UiActions.SetListFormat({ listFormat }));
  }

  public getLearningAreaById(
    areaId: number
  ): Observable<LearningAreaInterface> {
    return this.store.pipe(select(LearningAreaQueries.getById, { id: areaId }));
  }

  public getTaskById(taskId: number): Observable<TaskInterface> {
    return this.store.pipe(select(TaskQueries.getById, { id: taskId }));
  }

  // Filters taskInstances by LearningAreaId
  // Casts resulting taskInstances
  public getTaskInstancesByLearningAreaId(
    areaId: number
  ): Observable<TaskInstancesWithEduContentInfoInterface> {
    return this.taskInstancesWithEduContents$.pipe(
      map(taskInstances =>
        taskInstances.filter(
          taskInstance =>
            taskInstance.taskInstance.task.learningAreaId === areaId
        )
      ),
      map(filteredTaskInstances => {
        return { instances: filteredTaskInstances };
      })
    );
  }

  public getEduContentsWithSubmittedByTaskId(
    taskId: number
  ): Observable<EduContentWithSubmittedInterface[]> {
    return this.tasksWithRelationInfo$.pipe(
      map(tasks => tasks.find(task => task.id === taskId)),
      map(task => task.eduContents)
    );
  }

  public setTaskAlertRead(taskId: number): void {
    // Is dit niet iets wat beter door de service wordt afgehandeld?
    // een .setAlertsAboutTaskRead(taskId) methode of zo?
    const userId = this.authService.userId;
    this.alertService.getAllForUser(userId).pipe(
      map(alerts =>
        alerts.filter(alert => alert.taskId === taskId).map(alert => alert.id)
      ),
      tap(ids => this.alertService.setAlertAsRead(userId, ids))
    );
  }

  public startExercise(eduContentId: number): void {
    //waiting for Service
  }
  //#endregion

  //#region mockData

  // Alles hier is nog TODO: ophalen uit state
  public loadMockData() {
    this.taskInstances$ = of(this.getMockTaskInstances());
    this.results$ = of(this.getMockResults());
    this.teachers$ = of(this.getMockTeachers());
    this.taskEducontents$ = of(this.getMockTaskEduContents());
  }
  //#endregion

  //#region set sourceStreams
  protected setSourceStreams() {
    this.listFormat$ = this.store.pipe(
      select(UiQuery.getListFormat),
      map(listFormat => <ListFormat>listFormat) //TODO: remove mapping
    );

    this.sharedTasks$ = this.store.pipe(
      select(TaskQueries.getShared, { userId: this.authService.userId })
    );

    this.tasksPerLearningAreaId$ = this.getTasksPerLearningAreaId$(
      this.sharedTasks$
    );

    this.learningAreas$ = this.tasksPerLearningAreaId$.pipe(
      flatMap(ids =>
        this.store.pipe(
          select(LearningAreaQueries.getByIds, { ids: Array.from(ids.keys()) })
        )
      )
    );

    this.tasksPerTeacherId$ = this.getTasksPerTeacherId$(this.sharedTasks$);
    // this.teachers$ = this.tasksPerTeacherId$.pipe(
    //   flatMap(ids =>
    //     this.store.pipe(
    //       select(UserQueries.getByIds, { ids: Array.from(ids.keys()) })
    //     )
    //   )
    // );

    //this.taskeduContents$ //TODO selector maken voor sharedTask- en ownedTaskEducontent

    this.eduContentIdsPerTaskId$ = this.getEduContentIdsPerTaskId$(
      this.taskEducontents$
    );

    this.uniqueEduContentIds$ = this.eduContentIdsPerTaskId$.pipe(
      map(dict => this.flattenArrayToUniqueValues(Array.from(dict.keys())))
    );

    this.eduContents$ = this.uniqueEduContentIds$.pipe(
      flatMap(ids =>
        this.store.pipe(
          select(EduContentQueries.getByIds, {
            ids: Array.from(ids)
          })
        )
      )
    );

    //this.taskInstances$ //TODO selector maken voor sharedTask- en ownedTaskInstances
    // this.taskInstancesPerTaskId$ = this.getTaskInstancesPerTaskId$(
    //   this.taskInstances$
    // );

    //this.results$ //TODO selector maken voor ownResults en myTaskResults
  }
  //#endregion

  //#region set intermediateStreams
  protected setIntermediateStreams() {
    this.tasksWithRelationInfo$ = combineLatest(
      this.sharedTasks$,
      this.eduContents$,
      this.eduContentIdsPerTaskId$,
      this.teachers$
    ).pipe(
      map(([tasks, eduContents, eduContentIdsPerTaskId, teachers]) =>
        tasks.map(task => {
          return {
            ...task,
            eduContents: this.getEduContentWithSubmitted(
              task.id,
              eduContents,
              eduContentIdsPerTaskId
            ),
            teacher: teachers.find(teacher => task.personId === teacher.id)
          };
        })
      )
    );

    this.taskInstancesWithResults$ = this.getTaskInstancesWithRelations$(
      this.results$,
      this.taskInstances$,
      this.tasksWithRelationInfo$
    );

    this.tasksWithInstanceWithResults$ = this.taskInstancesWithResults$.pipe(
      map(taskInstances =>
        taskInstances.map(taskInstance => {
          return {
            ...taskInstance.task,
            instance: taskInstance
          };
        })
      )
    );

    this.learningAreasWithTasks$ = combineLatest(
      this.learningAreas$,
      this.getTasksPerLearningAreaId$(this.tasksWithInstanceWithResults$) //dit cast naar TaskInterface
    ).pipe(
      map(([learningAreas, tasksPerLearningAreaId]) =>
        learningAreas.map(learningArea => {
          return {
            ...learningArea,
            tasks: tasksPerLearningAreaId
              .get(learningArea.id)
              .map(task => task as TaskWithRelationsInterface)
          };
        })
      )
    );
  }
  //#endregion

  //#region set presentationStreams
  protected setPresentationStreams() {
    this.learningAreasWithTaskInstanceInfo$ = this.learningAreasWithTasks$.pipe(
      map(
        (learningAreas): LearningAreasWithTaskInstanceInfoInterface => {
          const learningAreasWithInfo = learningAreas.map(area => {
            const totalTasksInArea = area.tasks.length;
            const tasksFinishedAmount = area.tasks.filter(task =>
              this.isTaskFinished(task)
            ).length;

            return {
              learningArea: area,
              openTasks: totalTasksInArea - tasksFinishedAmount,
              closedTasks: tasksFinishedAmount
            };
          });

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

    this.taskInstancesWithEduContents$ = this.taskInstancesWithResults$.pipe(
      map(instances =>
        instances.map(instance => {
          return {
            taskInstance: instance as TaskInstanceInterface,
            taskEduContents: instance.task.taskEduContents,
            taskEduContentsCount: instance.task.taskEduContents.length,
            finished: (instance.task as TaskWithRelationsInterface).finished
          };
        })
      )
    );
  }
  //#endregion

  //#region private functions

  // creates a Map<number, TaskInterface[]>
  // the keys are the learningAreaId
  // the values are an array of the associated tasks
  private getTasksPerLearningAreaId$(tasks$: Observable<TaskInterface[]>) {
    return tasks$.pipe(
      map(taskArray =>
        taskArray.reduce((dict, task) => {
          let tasks: TaskInterface[];
          if (dict.has(task.learningAreaId)) {
            tasks = dict.get(task.learningAreaId);
            tasks.push(task);
          } else {
            tasks = [task];
          }
          dict.set(task.learningAreaId, tasks);

          return dict;
        }, new Map<number, TaskInterface[]>())
      )
    );
  }

  // creates a Map<number, Map<number, boolean>[]>
  // the keys are the taskId
  // the values are an array of the dictionaries of the associated EducontentId and its submitted value
  // gist: Map<taskId, [Map<eduContentId, eduContentSubmitted>]>
  // example: Map<1, [Map<2, true>]>
  private getEduContentIdsPerTaskId$(
    taskEducontents$: Observable<TaskEduContentWithSubmittedInterface[]>
  ) {
    return taskEducontents$.pipe(
      map(taskEducontents =>
        taskEducontents.reduce((dict, taskEducontent) => {
          let educontentIds: Map<number, boolean>[];
          if (dict.has(taskEducontent.taskId)) {
            educontentIds = dict.get(taskEducontent.taskId);
            educontentIds.push(
              this.getSubmittedPerEduContentId(taskEducontent)
            );
          } else {
            educontentIds = [this.getSubmittedPerEduContentId(taskEducontent)];
          }
          dict.set(taskEducontent.taskId, educontentIds);

          return dict;
        }, new Map<number, Map<number, boolean>[]>())
      )
    );
  }

  // creates a Map<number, boolean>
  // the keys are the educontentId
  // the value is the eduContent.submitted
  // note: this assumes that every task has a single taskInstance,
  // which is true for Student
  private getSubmittedPerEduContentId(
    taskEduContent: TaskEduContentWithSubmittedInterface
  ) {
    return new Map<number, boolean>([
      [taskEduContent.eduContentId, taskEduContent.submitted]
    ]);
  }

  // creates a Map<number, TaskInterface[]>
  // the keys are the teacherId
  // the values are an array of the associated tasks
  private getTasksPerTeacherId$(tasks$: Observable<TaskInterface[]>) {
    return tasks$.pipe(
      map(taskArray =>
        taskArray.reduce((dict, task) => {
          let tasks: TaskInterface[];
          if (dict.has(task.personId)) {
            tasks = dict.get(task.personId);
            tasks.push(task);
          } else {
            tasks = [task];
          }
          dict.set(task.personId, tasks);

          return dict;
        }, new Map<number, TaskInterface[]>())
      )
    );
  }

  // creates a Map<number, ResultInterface[]>
  // the keys are the taskId
  // the values are an array of the associated results
  private getResultsPerTaskId$(results$: Observable<ResultInterface[]>) {
    return results$.pipe(
      map(resultArray =>
        resultArray.reduce((dict, result) => {
          let results: ResultInterface[];
          if (dict.has(result.taskId)) {
            results = dict.get(result.taskId);
            results.push(result);
          } else {
            results = [result];
          }
          dict.set(result.taskId, results);

          return dict;
        }, new Map<number, ResultInterface[]>())
      )
    );
  }

  // Returns an array of TaskInstances with their associated Task and Results
  private getTaskInstancesWithRelations$(
    results$: Observable<ResultInterface[]>,
    taskInstances$: Observable<TaskInstanceInterface[]>,
    tasks$: Observable<TaskWithRelationsInterface[]>
  ): Observable<TaskInstanceWithResultsInterface[]> {
    return combineLatest(
      taskInstances$,
      this.getResultsPerTaskId$(results$),
      tasks$
    ).pipe(
      map(([instances, resultPerTaskIdMap, taskArray]) =>
        instances.map(instance => {
          return {
            ...instance,
            task: taskArray.find(task => task.id === instance.taskId),
            results: resultPerTaskIdMap
              .get(instance.taskId)
              .filter(result => result.personId === instance.personId)
          };
        })
      )
    );
  }

  private getEduContentWithSubmitted(
    taskId: number,
    eduContents: EduContentInterface[],
    educontentIdsPerTaskId: Map<number, Map<number, boolean>[]>
  ): EduContentWithSubmittedInterface[] {
    return educontentIdsPerTaskId
      .get(taskId)
      .map(dictOfEducontentIdAndSubmitted =>
        Array.from(dictOfEducontentIdAndSubmitted.entries()).map(
          ([educontentId, submittedValue]) => {
            return {
              ...eduContents.find(eduC => eduC.id === educontentId),
              submitted: submittedValue
            } as EduContentWithSubmittedInterface;
          }
        )
      )
      .reduce((acc, val) => acc.concat(val), []);
  }

  private getTaskInstancesByLearningAreaId$(
    taskInstances$: Observable<TaskInstanceWithEduContentInfoInterface[]>
  ): Observable<Map<number, TaskInstanceWithEduContentInfoInterface[]>> {
    return taskInstances$.pipe(
      map(taskInstanceArray =>
        taskInstanceArray.reduce((dict, instanceWithInfo) => {
          let taskInstances: TaskInstanceWithEduContentInfoInterface[];
          if (dict.has(instanceWithInfo.taskInstance.task.learningAreaId)) {
            taskInstances = dict.get(
              instanceWithInfo.taskInstance.task.learningAreaId
            );
            taskInstances.push(instanceWithInfo);
          } else {
            taskInstances = [instanceWithInfo];
          }
          dict.set(
            instanceWithInfo.taskInstance.task.learningAreaId,
            taskInstances
          );

          return dict;
        }, new Map<number, TaskInstanceWithEduContentInfoInterface[]>())
      )
    );
  }

  private isTaskFinished(task: TaskWithRelationsInterface): boolean {
    return task.eduContents.map(eduC => eduC).every(eduC => eduC.submitted);
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

  private getMockTaskEduContents(): TaskEduContentWithSubmittedInterface[] {
    return [
      {
        ...new TaskEduContentFixture({
          id: 1,
          teacherId: 186,
          taskId: 1,
          eduContentId: 1
        }),
        submitted: true
      },
      {
        ...new TaskEduContentFixture({
          id: 2,
          teacherId: 187,
          taskId: 2,
          eduContentId: 2
        }),
        submitted: true
      },
      {
        ...new TaskEduContentFixture({
          id: 3,
          teacherId: 187,
          taskId: 1,
          eduContentId: 2
        }),
        submitted: true
      }
    ];
  }
  //#endregion
}

//#region interfaces
export interface LearningAreaWithTasksInterface extends LearningAreaInterface {
  tasks: TaskWithRelationsInterface[];
}

export interface TaskWithRelationsInterface extends TaskInterface {
  instance?: TaskInstanceWithResultsInterface;
  eduContents: EduContentWithSubmittedInterface[];
  finished?: boolean;
}

export interface TaskInstanceWithResultsInterface
  extends TaskInstanceInterface {
  results: ResultInterface[];
  task: TaskWithRelationsInterface;
}

// TODO verwijderen bij update definitions
export interface TaskEduContentWithSubmittedInterface
  extends TaskEduContentInterface {
  submitted: boolean;
}
//#endregion
