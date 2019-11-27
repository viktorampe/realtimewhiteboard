import { Inject, Injectable } from '@angular/core';
import { WindowServiceInterface, WINDOW_SERVICE_TOKEN } from '@campus/browser';
import {
  CurrentExerciseActions,
  CurrentExerciseInterface,
  CurrentExerciseQueries,
  DalState,
  ResultActions,
  ResultInterface
} from '@campus/dal';
import {
  ScormApiServiceInterface,
  ScormCmiMode,
  ScormStatus,
  SCORM_API_SERVICE_TOKEN
} from '@campus/scorm';
import { select, Store } from '@ngrx/store';
import { distinctUntilChanged, filter, withLatestFrom } from 'rxjs/operators';
import { ScormExerciseServiceInterface } from './scorm-exercise.service.interface';

@Injectable({
  providedIn: 'root'
})
export class ScormExerciseService implements ScormExerciseServiceInterface {
  constructor(
    @Inject(WINDOW_SERVICE_TOKEN) private windowService: WindowServiceInterface,
    @Inject(SCORM_API_SERVICE_TOKEN) private scormApi: ScormApiServiceInterface,
    private store: Store<DalState>
  ) {
    this.listenToStoreForNewExercise();
    this.listenToScormForUpdates();
  }

  previewExerciseFromUnlockedContent(
    userId: number,
    educontentId: number,
    unlockedContentId: number,
    showAnswers: boolean
  ): void {
    this.loadNewExerciseToStore(
      userId,
      educontentId,
      false,
      null,
      unlockedContentId,
      showAnswers ? ScormCmiMode.CMI_MODE_PREVIEW : ScormCmiMode.CMI_MODE_NORMAL
    );
  }
  previewExerciseFromTask(
    userId: number,
    educontentId: number,
    taskId: number,
    showAnswers: boolean
  ): void {
    this.loadNewExerciseToStore(
      userId,
      educontentId,
      false,
      taskId,
      null,
      showAnswers ? ScormCmiMode.CMI_MODE_PREVIEW : ScormCmiMode.CMI_MODE_NORMAL
    );
  }
  startExerciseFromUnlockedContent(
    userId: number,
    educontentId: number,
    unlockedContentId: number
  ): void {
    this.loadNewExerciseToStore(
      userId,
      educontentId,
      true,
      null,
      unlockedContentId,
      ScormCmiMode.CMI_MODE_NORMAL
    );
  }
  startExerciseFromTask(
    userId: number,
    educontentId: number,
    taskId: number
  ): void {
    this.loadNewExerciseToStore(
      userId,
      educontentId,
      true,
      taskId,
      null,
      ScormCmiMode.CMI_MODE_BROWSE
    );
  }
  reviewExerciseFromResult(result: ResultInterface): void {
    this.loadNewExerciseToStore(
      result.personId,
      result.eduContentId,
      false,
      result.taskId,
      result.unlockedContentId,
      ScormCmiMode.CMI_MODE_REVIEW,
      result
    );
  }

  /**
   * Only open an new window, when the current exercise changes the eduContent
   */
  private listenToStoreForNewExercise() {
    this.store
      .pipe(
        select(CurrentExerciseQueries.getCurrentExercise),
        distinctUntilChanged((x, y) => x.eduContentId === y.eduContentId),
        filter(ex => !!ex.eduContentId)
      )
      .subscribe(newCurrentExercise => {
        this.scormApi.init(
          newCurrentExercise.result && newCurrentExercise.result.cmi,
          newCurrentExercise.cmiMode
        );
        this.openNewUrl(newCurrentExercise.url);
      });
  }

  private listenToScormForUpdates() {
    this.scormApi.cmi$
      .pipe(
        filter(cmi => !!cmi),
        withLatestFrom(
          this.store.pipe(select(CurrentExerciseQueries.getCurrentExercise))
        )
      )
      .subscribe(([cmi, state]) => {
        //update values in state and return
        this.updateExerciseToStore(state.result.personId, {
          ...state,
          result: {
            ...state.result,
            cmi: cmi
          }
        });
      });
  }

  private openNewUrl(url: string) {
    if (url) {
      this.openWindow(url);
    }
  }

  private updateExerciseToStore(
    userId: number,
    currentExercise: CurrentExerciseInterface
  ) {
    const cmi = JSON.parse(currentExercise.result.cmi);
    const exerciseCompleted = cmi
      ? cmi.core.lesson_status === ScormStatus.STATUS_COMPLETED
      : false;

    this.store.dispatch(
      new CurrentExerciseActions.SaveCurrentExercise({
        userId: userId,
        exercise: currentExercise,
        // since the exercise is constantly saved, we only want to display feedback when the exercise is completed
        customFeedbackHandlers: { useCustomSuccessHandler: !exerciseCompleted }
      })
    );

    // this won't update the state if a student does not complete an exercise
    // the alternative is always updating the results store, but that would be execessive
    if (exerciseCompleted && currentExercise.saveToApi) {
      this.store.dispatch(
        new ResultActions.UpsertResult({ result: currentExercise.result })
      );
    }
  }

  private loadNewExerciseToStore(
    userId: number,
    educontentId: number,
    saveToApi: boolean,
    taskId: number = null,
    unlockedContentId: number = null,
    mode: ScormCmiMode,
    result?: ResultInterface
  ) {
    this.store.dispatch(
      new CurrentExerciseActions.LoadExercise({
        userId: userId,
        educontentId: educontentId,
        saveToApi: saveToApi,
        taskId: taskId,
        unlockedContentId: unlockedContentId,
        cmiMode: mode,
        result: result
      })
    );
  }

  private openWindow(url: string) {
    this.windowService.openWindow('scorm', url, true);
  }

  private closeWindow() {
    this.windowService.closeWindow('scorm');
  }

  closeExercise() {
    this.closeWindow();
    this.store.dispatch(new CurrentExerciseActions.ClearCurrentExercise());
  }
}
