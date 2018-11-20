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
  UiQuery,
  UserQueries
} from '@campus/dal';
import { ListFormat } from '@campus/ui';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
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
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface,
    private tasksResolver: TasksResolver
  ) {
    tasksResolver.resolve();
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
    this.results$ = of(this.getMockResults());
    this.teachers$ = of(this.getMockTeachers());
    this.taskEducontents$ = of(this.getMockTaskEduContents());
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
      new ResultFixture({ id: 1 }),
      new ResultFixture({ id: 2 }),
      new ResultFixture({ id: 3, status: ScormStatus.STATUS_INCOMPLETE })
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
  isFinished: boolean;
}
