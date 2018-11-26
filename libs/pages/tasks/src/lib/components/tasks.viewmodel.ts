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
  protected taskEducontents$: Observable<TaskEduContentInterface[]>;

  //dictionaries
  private eduContentIdsPerTaskIdDict$: Observable<
    Map<number, Map<number, boolean>[]>
  >;
  private uniqueEduContentIdsDict$: Observable<number[]>;
  private tasksPerLearningAreaIdDict$: Observable<Map<number, TaskInterface[]>>;
  private taskInstancesPerLearningAreaIdDict$: Observable<
    Map<number, TaskInstanceWithEduContentInfoInterface[]>
  >;

  //intermediate streams

  // Adds Educontents (with submitted prop)
  private tasksWithRelationInfo$: Observable<TaskWithRelationsInterface[]>;

  // Adds TaskInstances (with a reference to their task)
  private tasksWithInstance$: Observable<TaskWithRelationsInterface[]>;

  // Adds TaskWithInstances
  private learningAreasWithTasks$: Observable<LearningAreaWithTasksInterface[]>;

  // Adds EduContents
  // Adds EduContentsCount
  // Adds finished
  private taskInstancesWithEduContents$: Observable<
    TaskInstanceWithEduContentInfoInterface[]
  >;

  // presentation streams

  // Adds open/closed task count to learningAreas
  // Adds total task count
  public learningAreasWithTaskInstanceInfo$: Observable<
    LearningAreasWithTaskInstanceInfoInterface
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

  public getTeacherById(teacherId: number): Observable<PersonInterface> {
    return this.teachers$.pipe(
      map(teachers => teachers.find(teacher => teacher.id === teacherId))
    );
    // TODO: dit gebruiken eenmaal state in orde is.
    // return this.store.pipe(select(PersonQueries.getById, { id: teacherId }));
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

  public getTaskInstancesByLearningAreaId(
    areaId: number
  ): Observable<TaskInstancesWithEduContentInfoInterface> {
    return this.taskInstancesPerLearningAreaIdDict$.pipe(
      map(taskInstancesPerAreaId => {
        return { instances: taskInstancesPerAreaId.get(areaId) };
      })
    );
  }

  public getTaskInstanceWithEduContents(
    taskInstanceId: number
  ): Observable<TaskInstanceWithEduContentInfoInterface> {
    return this.taskInstancesWithEduContents$.pipe(
      map(instances =>
        instances.find(instance => instance.taskInstance.id === taskInstanceId)
      )
    );
  }

  //#endregion

  //#region mockData

  // Alles hier is nog TODO: ophalen uit state
  public loadMockData() {
    this.taskInstances$ = of(this.getMockTaskInstances());
    this.teachers$ = of(this.getMockTeachers());
    this.taskEducontents$ = of(this.getMockTaskEduContents());
  }
  //#endregion

  //#region set sourceStreams
  protected setSourceStreams() {
    this.listFormat$ = this.store.pipe(select(UiQuery.getListFormat));

    this.sharedTasks$ = this.store.pipe(
      select(TaskQueries.getShared, { userId: this.authService.userId })
    );

    this.tasksPerLearningAreaIdDict$ = this.getTasksPerLearningAreaIdDict$(
      this.sharedTasks$
    );

    this.learningAreas$ = this.tasksPerLearningAreaIdDict$.pipe(
      flatMap(ids =>
        this.store.pipe(
          select(LearningAreaQueries.getByIds, { ids: Array.from(ids.keys()) })
        )
      )
    );

    //this.taskeduContents$ //TODO selector maken voor sharedTask- en ownedTaskEducontent

    this.eduContentIdsPerTaskIdDict$ = this.getEduContentIdsPerTaskIdDict$(
      this.taskEducontents$
    );

    this.uniqueEduContentIdsDict$ = this.eduContentIdsPerTaskIdDict$.pipe(
      map(dict => this.flattenArrayToUniqueValues(Array.from(dict.keys())))
    );

    this.eduContents$ = this.uniqueEduContentIdsDict$.pipe(
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
  }
  //#endregion

  //#region set intermediateStreams
  protected setIntermediateStreams() {
    this.tasksWithRelationInfo$ = this.getTasksWithRelationInfo$(
      this.sharedTasks$,
      this.eduContents$,
      this.eduContentIdsPerTaskIdDict$
    );

    this.tasksWithInstance$ = this.getTasksWithInstances$(
      this.taskInstances$,
      this.tasksWithRelationInfo$
    );

    this.learningAreasWithTasks$ = this.getLearningAreasWithTasks$(
      this.learningAreas$,
      this.tasksWithInstance$
    );

    this.taskInstancesWithEduContents$ = this.getTaskInstancesWithEduContents$(
      this.tasksWithInstance$
    );

    this.taskInstancesPerLearningAreaIdDict$ = this.getTaskInstancesByLearningAreaIdDict$(
      this.taskInstancesWithEduContents$
    );
  }
  //#endregion

  //#region set presentationStreams
  protected setPresentationStreams() {
    this.learningAreasWithTaskInstanceInfo$ = this.getLearningAreasWithTaskInstanceInfo$(
      this.learningAreasWithTasks$
    );
  }
  //#endregion

  //#region private functions

  // creates a Map<number, TaskInterface[]>
  // the keys are the learningAreaId
  // the values are an array of the associated tasks
  private getTasksPerLearningAreaIdDict$(tasks$: Observable<TaskInterface[]>) {
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
  private getEduContentIdsPerTaskIdDict$(
    taskEducontents$: Observable<TaskEduContentInterface[]>
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
  private getSubmittedPerEduContentId(taskEduContent: TaskEduContentInterface) {
    return new Map<number, boolean>([
      [taskEduContent.eduContentId, taskEduContent.submitted]
    ]);
  }

  // Returns an array of Tasks with the related EduContents
  private getTasksWithRelationInfo$(
    sharedTasks$: Observable<TaskInterface[]>,
    eduContents$: Observable<EduContentInterface[]>,
    eduContentIdsPerTaskIdDict$: Observable<Map<number, Map<number, boolean>[]>>
  ) {
    return combineLatest(
      sharedTasks$,
      eduContents$,
      eduContentIdsPerTaskIdDict$
    ).pipe(
      map(([tasks, eduContents, eduContentIdsPerTaskIdDict]) =>
        tasks.map(task => {
          return {
            ...task,
            eduContents: this.getEduContentWithSubmitted(
              task.id,
              eduContents,
              eduContentIdsPerTaskIdDict
            )
          };
        })
      )
    );
  }

  // Returns an array of Tasks with their associated TaskInstances
  private getTasksWithInstances$(
    taskInstances$: Observable<TaskInstanceInterface[]>,
    tasks$: Observable<TaskWithRelationsInterface[]>
  ): Observable<TaskWithRelationsInterface[]> {
    return combineLatest(taskInstances$, tasks$).pipe(
      map(([instances, tasks]) =>
        tasks.map(task => {
          return {
            ...task,
            instance: {
              ...instances.find(instance => task.id === instance.taskId),
              taskId: task.id,
              task: task
            }
          } as TaskWithRelationsInterface;
        })
      )
    );
  }

  private getLearningAreasWithTasks$(
    learningAreas$: Observable<LearningAreaInterface[]>,
    tasksWithInstance$: Observable<TaskWithRelationsInterface[]>
  ): Observable<LearningAreaWithTasksInterface[]> {
    return combineLatest(
      learningAreas$,
      this.getTasksPerLearningAreaIdDict$(tasksWithInstance$) //dit cast naar TaskInterface
    ).pipe(
      map(([learningAreas, tasksPerLearningAreaIdDict]) =>
        learningAreas.map(learningArea => {
          return {
            ...learningArea,
            tasks: tasksPerLearningAreaIdDict
              .get(learningArea.id)
              .map(task => task as TaskWithRelationsInterface)
          };
        })
      )
    );
  }

  private getEduContentWithSubmitted(
    taskId: number,
    eduContents: EduContentInterface[],
    educontentIdsPerTaskIdDict: Map<number, Map<number, boolean>[]>
  ): EduContentWithSubmittedInterface[] {
    return educontentIdsPerTaskIdDict
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

  private getTaskInstancesWithEduContents$(
    tasksWithInstance$: Observable<TaskWithRelationsInterface[]>
  ): Observable<TaskInstanceWithEduContentInfoInterface[]> {
    return tasksWithInstance$.pipe(
      map(tasks =>
        tasks.map(task => {
          return {
            taskInstance: task.instance as TaskInstanceInterface,
            taskEduContents: task.taskEduContents,
            taskEduContentsCount: task.taskEduContents.length,
            finished: task.finished
          };
        })
      )
    );
  }

  private getTaskInstancesByLearningAreaIdDict$(
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

  private getLearningAreasWithTaskInstanceInfo$(
    learningAreasWithTasks$: Observable<LearningAreaWithTasksInterface[]>
  ): Observable<LearningAreasWithTaskInstanceInfoInterface> {
    return learningAreasWithTasks$.pipe(
      map(
        (learningAreas): LearningAreasWithTaskInstanceInfoInterface => {
          const learningAreaWithInfoArray = learningAreas.map(area =>
            this.getLearningAreaWithInfo(area)
          );

          const totalTasks = learningAreaWithInfoArray.reduce(
            (total, area) => total + area.openTasks + area.closedTasks,
            0
          );

          return {
            learningAreasWithInfo: learningAreaWithInfoArray,
            totalTasks: totalTasks
          };
        }
      )
    );
  }

  private getLearningAreaWithInfo(
    learningArea: LearningAreaWithTasksInterface
  ) {
    const totalTasksInArea = learningArea.tasks.length;
    const tasksFinishedAmount = learningArea.tasks.filter(task =>
      this.isTaskFinished(task)
    ).length;

    return {
      learningArea: learningArea,
      openTasks: totalTasksInArea - tasksFinishedAmount,
      closedTasks: tasksFinishedAmount
    };
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

  private getMockTaskEduContents(): TaskEduContentInterface[] {
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
  instance?: TaskInstanceWithTaskInterface;
  eduContents: EduContentWithSubmittedInterface[];
  finished?: boolean;
}

export interface TaskInstanceWithTaskInterface extends TaskInstanceInterface {
  task: TaskWithRelationsInterface;
}
//#endregion
