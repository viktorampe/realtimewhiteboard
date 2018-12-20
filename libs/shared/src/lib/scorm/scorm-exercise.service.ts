import { Inject, Injectable } from '@angular/core';
import { WindowServiceInterface, WINDOW_SERVICE_TOKEN } from '@campus/browser';
import {
  CurrentExerciseActions,
  CurrentExerciseInterface,
  CurrentExerciseQueries,
  DalState
} from '@campus/dal';
import {
  ScormApiServiceInterface,
  ScormCmiMode,
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
    this.saveNewExerciseToStore(
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
    this.saveNewExerciseToStore(
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
    this.saveNewExerciseToStore(
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
    this.saveNewExerciseToStore(
      userId,
      educontentId,
      true,
      taskId,
      null,
      ScormCmiMode.CMI_MODE_BROWSE
    );
  }
  reviewExerciseFromUnlockedContent(
    userId: number,
    educontentId: number,
    unlockedContentId: number
  ): void {
    this.saveNewExerciseToStore(
      userId,
      educontentId,
      false,
      null,
      unlockedContentId,
      ScormCmiMode.CMI_MODE_REVIEW
    );
  }
  reviewExerciseFromTask(
    userId: number,
    educontentId: number,
    taskId: number
  ): void {
    this.saveNewExerciseToStore(
      userId,
      educontentId,
      false,
      taskId,
      null,
      ScormCmiMode.CMI_MODE_REVIEW
    );
  }

  /**
   * Only open an new window, when the current exercise changes the eduConent
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
          newCurrentExercise.result.cmi,
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
    this.store.dispatch(
      new CurrentExerciseActions.SaveCurrentExercise({
        userId: userId,
        exercise: currentExercise
      })
    );
  }

  private saveNewExerciseToStore(
    userId: number,
    educontentId: number,
    saveToApi: boolean,
    taskId: number = null,
    unlockedContentId: number = null,
    mode: ScormCmiMode
  ) {
    this.store.dispatch(
      new CurrentExerciseActions.StartExercise({
        userId: userId,
        educontentId: educontentId,
        saveToApi: saveToApi,
        taskId: taskId,
        unlockedContentId: unlockedContentId,
        cmiMode: mode
      })
    );
  }

  private openWindow(url: string) {
    this.windowService.openWindow('scorm', url);
  }

  private closeWindow() {
    this.windowService.closeWindow('scorm');
  }

  closeExercise() {
    this.closeWindow();
    this.store.dispatch(new CurrentExerciseActions.ClearCurrentExercise());
  }
}
