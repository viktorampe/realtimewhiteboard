import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  LearningAreaInterface,
  LearningAreaQueries,
  PersonFixture,
  PersonInterface,
  TaskEduContentQueries,
  TaskInstanceQueries,
  TaskQueries,
  UiActions,
  UiQuery
} from '@campus/dal';
import { ListFormat } from '@campus/ui';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
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

  // presentation streams
  public learningAreasWithTaskInstanceInfo$: Observable<
    LearningAreasWithTaskInstanceInfoInterface
  >;

  constructor(
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
  ) {
    this.setSourceStreams();
    this.setPresentationStreams();
  }

  public changeListFormat(listFormat: ListFormat): void {
    this.store.dispatch(new UiActions.SetListFormat({ listFormat }));
  }

  public getLearningAreaById(
    areaId: number
  ): Observable<LearningAreaInterface> {
    return this.store.pipe(select(LearningAreaQueries.getById, { id: areaId }));
  }

  public startExercise(eduContentId: number): void {
    //waiting for Service
  }

  public getTaskInstancesByLearningAreaId(
    areaId: number
  ): Observable<TaskInstancesWithEduContentInfoInterface> {
    const props = { userId: this.authService.userId, learningAreaId: areaId };
    return combineLatest(
      this.store.pipe(
        select(TaskQueries.getSharedTaskIdsByLearningAreaId, props)
      ),
      this.store.pipe(select(TaskQueries.getAllEntities)),
      this.store.pipe(select(TaskInstanceQueries.getAllGroupedByTaskId)),
      this.store.pipe(select(TaskEduContentQueries.getAllGroupedByTaskId))
    ).pipe(
      map(
        ([
          taskIds,
          taskEntities,
          taskInstancesByTaskId,
          taskEduContentsByTaskId
        ]) => {
          return {
            instances: taskIds.map(id => {
              return {
                task: taskEntities[id],
                taskInstance: taskInstancesByTaskId[id][0],
                taskEduContents: taskEduContentsByTaskId[id],
                finished: taskEduContentsByTaskId[id].every(te => te.submitted),
                taskEduContentsCount: taskEduContentsByTaskId[id].length
              };
            })
          };
        }
      )
    );
  }

  public getTaskInstanceWithEduContents(
    taskId: number
  ): Observable<TaskInstanceWithEduContentInfoInterface> {
    return combineLatest(
      this.store.pipe(select(TaskInstanceQueries.getAllByTaskId, { taskId })),
      this.store.pipe(select(TaskEduContentQueries.getAllByTaskId, { taskId })),
      this.store.pipe(select(TaskQueries.getById, { id: taskId })),
      this.getMockTeachers() //todo select teacher entities here
    ).pipe(
      map(([taskInstances, taskEduContents, task, teachers]) => {
        return {
          //todo place teacher here on task
          task: task,
          taskInstance: taskInstances[0],
          taskEduContents: taskEduContents,
          finished: taskEduContents.every(te => te.submitted),
          taskEduContentsCount: taskEduContents.length
        };
      })
    );
  }

  private setSourceStreams() {
    this.listFormat$ = this.store.pipe(select(UiQuery.getListFormat));
  }

  private setPresentationStreams() {
    this.getLearningAreasWithTaskInstanceInfo();
  }

  private getLearningAreasWithTaskInstanceInfo() {
    let props = { userId: this.authService.userId };
    this.learningAreasWithTaskInstanceInfo$ = combineLatest(
      this.store.pipe(select(LearningAreaQueries.getAllEntities)),
      this.store.pipe(select(TaskEduContentQueries.getUnfinishedTaskIds)),
      this.store.pipe(select(TaskQueries.getShared, props)),
      this.store.pipe(select(TaskQueries.getSharedLearningAreaIds, props))
    ).pipe(
      map(([areaEntities, unfinishedTaskIds, sharedTasks, areaIds]) => {
        return {
          learningAreasWithInfo: Array.from(areaIds.values()).map(id => {
            let tasks = sharedTasks.filter(t => t.learningAreaId === id);
            return {
              learningArea: areaEntities[id],
              openTasks: tasks.filter(t => unfinishedTaskIds.has(t.id)).length,
              closedTasks: tasks.filter(t => !unfinishedTaskIds.has(t.id))
                .length
            };
          }),
          totalTasks: sharedTasks.length
        };
      })
    );
  }

  private getMockTeachers(): Observable<PersonInterface[]> {
    return of([new PersonFixture({ id: 186 }), new PersonFixture({ id: 187 })]);
  }
}
