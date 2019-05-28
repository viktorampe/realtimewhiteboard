import { Inject, Injectable } from '@angular/core';
import {
  AlertActions,
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  createHistoryFromEduContent,
  DalState,
  EduContentQueries,
  HistoryActions,
  LearningAreaInterface,
  LearningAreaQueries,
  LinkedPersonQueries,
  TaskEduContentInterface,
  TaskEduContentQueries,
  TaskInstanceQueries,
  TaskQueries,
  UiActions,
  UiQuery
} from '@campus/dal';
import {
  ScormExerciseServiceInterface,
  SCORM_EXERCISE_SERVICE_TOKEN
} from '@campus/shared';
import { ListFormat } from '@campus/ui';
import { select, Store } from '@ngrx/store';
import { MemoizedSelectorWithProps } from '@ngrx/store/src/selector';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  LearningAreasWithTaskInfoInterface,
  TasksWithInfoInterface,
  TaskWithInfoInterface
} from './tasks.viewmodel.interfaces';

@Injectable({
  providedIn: 'root'
})
export class TasksViewModel {
  //source streams
  public listFormat$: Observable<ListFormat>;

  // presentation streams
  public learningAreasWithTaskInfo$: Observable<
    LearningAreasWithTaskInfoInterface
  >;

  constructor(
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface,
    @Inject(SCORM_EXERCISE_SERVICE_TOKEN)
    private scormExerciseService: ScormExerciseServiceInterface
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

  public setTaskAlertRead(taskId: number): void {
    this.store.dispatch(
      new AlertActions.SetAlertReadByFilter({
        personId: this.authService.userId,
        intended: false,
        filter: {
          taskId: taskId
        },
        read: true,
        customFeedbackHandlers: {
          useCustomErrorHandler: 'useNoHandler',
          useCustomSuccessHandler: 'useNoHandler'
        }
      })
    );
  }

  public startExercise(taskEduContent: TaskEduContentInterface): void {
    this.scormExerciseService.startExerciseFromTask(
      this.authService.userId,
      taskEduContent.eduContentId,
      taskEduContent.taskId
    );

    this.store.dispatch(
      new HistoryActions.StartUpsertHistory({
        history: createHistoryFromEduContent(taskEduContent.eduContent)
      })
    );
  }

  public getTasksByLearningAreaId(
    areaId: number
  ): Observable<TasksWithInfoInterface> {
    const props = { userId: this.authService.userId, learningAreaId: areaId };
    return combineLatest(
      this.select(TaskQueries.getSharedTaskIdsByLearningAreaId, props),
      this.select(TaskInstanceQueries.getActiveTaskIds, { date: new Date() }),
      this.select(TaskQueries.getAllEntities),
      this.select(TaskInstanceQueries.getAllGroupedByTaskId),
      this.select(TaskEduContentQueries.getAllGroupedByTaskId)
    ).pipe(
      map(([ids, activeIds, entities, instancesById, taskEducontentById]) => {
        return {
          taskInfos: ids.reduce((acc, id) => {
            return activeIds.has(id)
              ? [
                  ...acc,
                  {
                    task: entities[id],
                    taskInstance: instancesById[id][0],
                    taskEduContents: taskEducontentById[id],
                    finished: taskEducontentById[id].every(te => te.submitted),
                    taskEduContentsCount: taskEducontentById[id].length
                  }
                ]
              : acc;
          }, [])
        };
      })
    );
  }

  public getTaskWithInfo(taskId: number): Observable<TaskWithInfoInterface> {
    return combineLatest(
      this.select(TaskInstanceQueries.getAllByTaskId, { taskId }),
      this.select(TaskEduContentQueries.getAllByTaskId, { taskId }),
      this.select(EduContentQueries.getAllEntities),
      this.select(TaskQueries.getById, { id: taskId }),
      this.select(LinkedPersonQueries.getAllEntities)
    ).pipe(
      map(([taskInstances, taskEduContents, eduContents, task, teachers]) => {
        if (!task) return null;
        return {
          task: {
            ...task,
            teacher: teachers[task.personId]
          },
          taskInstance: taskInstances[0],
          taskEduContents: taskEduContents.map(taskEduContent => {
            return {
              ...taskEduContent,
              eduContent: eduContents[taskEduContent.eduContentId]
            };
          }),
          finished: taskEduContents.every(te => te.submitted),
          taskEduContentsCount: taskEduContents.length
        };
      })
    );
  }

  private setSourceStreams() {
    this.listFormat$ = this.select(UiQuery.getListFormat);
  }

  private setPresentationStreams() {
    this.setLearningAreasWithTaskInfo();
  }

  private setLearningAreasWithTaskInfo() {
    const props = { userId: this.authService.userId };
    this.learningAreasWithTaskInfo$ = combineLatest(
      this.select(LearningAreaQueries.getAllEntities),
      this.select(TaskEduContentQueries.getUnfinishedTaskIds),
      this.select(TaskInstanceQueries.getActiveTaskIds, { date: new Date() }),
      this.select(TaskQueries.getShared, props),
      this.select(TaskQueries.getSharedLearningAreaIds, props)
    ).pipe(
      map(([areaEntities, unfinishedIds, activeIds, sharedTasks, areaIds]) => {
        return {
          learningAreasWithInfo: Array.from(areaIds.values()).map(id => {
            const tasks = sharedTasks.filter(
              t => t.learningAreaId === id && activeIds.has(t.id)
            );
            return {
              learningArea: areaEntities[id],
              openTasks: tasks.filter(t => unfinishedIds.has(t.id)).length,
              closedTasks: tasks.filter(t => !unfinishedIds.has(t.id)).length
            };
          }),
          totalTasks: sharedTasks.filter(t => activeIds.has(t.id)).length
        };
      })
    );
  }

  private select<T, Props>(
    selector: MemoizedSelectorWithProps<DalState, Props, T>,
    payload?: Props
  ): Observable<T> {
    return this.store.pipe(select(selector, payload));
  }
}
