import { Inject, Injectable } from '@angular/core';
import { WindowServiceInterface, WINDOW_SERVICE_TOKEN } from '@campus/browser';
import {
  ScormApiServiceInterface,
  ScormCmiInterface,
  ScormCmiMode,
  SCORM_API_SERVICE_TOKEN
} from '@campus/scorm';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  CurrentExerciseActions,
  CurrentExerciseQueries,
  CurrentExerciseReducer
} from '../+state/current-exercise';
import { CurrentExerciseInterface } from '../+state/current-exercise/current-exercise.reducer';
import { ScormExerciseServiceInterface } from './scorm-exercise.service.interface';

@Injectable({
  providedIn: 'root'
})
export class ScormExerciseService implements ScormExerciseServiceInterface {
  currentURL$: Observable<string>;
  private currentExercise$: Observable<CurrentExerciseInterface>;
  private currentResult$: Observable<ScormCmiInterface>;
  private commit$: Observable<any>;

  constructor(
    @Inject(WINDOW_SERVICE_TOKEN) private windowService: WindowServiceInterface,
    @Inject(SCORM_API_SERVICE_TOKEN) private scormApi: ScormApiServiceInterface,
    private store: Store<CurrentExerciseReducer.State>
  ) {
    this.currentExercise$ = this.store.pipe(
      select(CurrentExerciseQueries.getCurrentExercise)
    );

    this.currentURL$ = this.currentExercise$.pipe(
      map(data => {
        return data.url;
      })
    );

    this.currentURL$.subscribe(url => {
      this.openNewwUrl(url);
    });
  }

  startExerciseAsPreviewWithAnswers(
    userId: number,
    educontentId: number,
    unlockedContentId: number
  ): void {
    this.initializeApi(ScormCmiMode.CMI_MODE_PREVIEW);
    this.saveNewExerciseToStore(
      userId,
      educontentId,
      false,
      null,
      unlockedContentId
    );
  }

  startExerciseAsPreviewWithoutAnswers(
    userId: number,
    educontentId: number,
    unlockedContentId: number
  ): void {
    this.initializeApi(ScormCmiMode.CMI_MODE_NORMAL);
    this.saveNewExerciseToStore(
      userId,
      educontentId,
      false,
      null,
      unlockedContentId
    );
  }

  startExerciseAsTask(
    userId: number,
    educontentId: number,
    taskId: number
  ): void {
    this.initializeApi(ScormCmiMode.CMI_MODE_BROWSE);
    this.saveNewExerciseToStore(userId, educontentId, true, taskId, null);
  }

  startExerciseAsTraining(
    userId: number,
    educontentId: number,
    unlockedContentId: number
  ): void {
    this.initializeApi(ScormCmiMode.CMI_MODE_NORMAL);
    this.saveNewExerciseToStore(
      userId,
      educontentId,
      true,
      null,
      unlockedContentId
    );
  }

  startExerciseAsReview(
    userId: number,
    educontentId: number,
    unlockedContentId: number
  ): void {
    this.initializeApi(ScormCmiMode.CMI_MODE_REVIEW);
    this.saveNewExerciseToStore(
      userId,
      educontentId,
      false,
      null,
      unlockedContentId
    );
  }

  private openNewwUrl(url: string) {
    if (url) {
      this.openWindow(url);

      this.commit$.subscribe(() => {
        this.closeExercise();
      });

      combineLatest(this.currentExercise$, this.currentResult$)
        .pipe(
          map(data => {
            const state = data[0];
            const result = data[1];
            //update values in state and return
            state.result.cmi.mode = result.mode;
            state.result.score = result.core.score.raw;
            return state;
          })
        )
        .subscribe(currentExercise => {
          this.updateExerciseToStore(
            currentExercise.result.personId,
            currentExercise
          );
        });
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
    unlockedContentId: number = null
  ) {
    this.store.dispatch(
      new CurrentExerciseActions.StartExercise({
        userId: userId,
        educontentId: educontentId,
        saveToApi: saveToApi,
        taskId: taskId,
        unlockedContentId: unlockedContentId
      })
    );
  }

  private initializeApi(mode: ScormCmiMode) {
    this.scormApi.init({} as ScormCmiInterface, mode);
    this.currentResult$ = this.scormApi.cmi$;
    this.commit$ = this.scormApi.commit$;
  }

  private openWindow(url: any) {
    this.windowService.openWindow('polpo-scorm', url.url);
  }

  private closeWindow() {
    this.windowService.closeWindow('polpo-scorm');
  }

  closeExercise() {
    this.closeWindow();
    this.store.dispatch(new CurrentExerciseActions.ClearCurrentExercise());
  }
}
