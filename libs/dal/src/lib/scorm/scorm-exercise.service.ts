import { Inject, Injectable } from '@angular/core';
import {
  ScormApiServiceInterface,
  ScormCmiInterface,
  SCORM_API_SERVICE_TOKEN
} from '@campus/scorm';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  CurrentExerciseActions,
  CurrentExerciseReducer
} from '../+state/current-exercise';
import { ScormExerciseServiceInterface } from './scorm-exercise.service.interface';

@Injectable({
  providedIn: 'root'
})
export class ScormExerciseService implements ScormExerciseServiceInterface {
  currentURL: Observable<String>;
  private currentResult$: Observable<ScormCmiInterface>;
  private commit$: Observable<any>;
  private scormWindow: Window;

  constructor(
    @Inject(SCORM_API_SERVICE_TOKEN) private scormApi: ScormApiServiceInterface,
    private store: Store<CurrentExerciseReducer.State>
  ) {}

  startExerciseAsPreviewWithAnswers(): void {
    this.saveExerciseToStore(17, 19, false, null, 2);

    // this.scormApi.init(, ScormCmiMode.CMI_MODE_PREVIEW);

    //this.currentResult$ = this.scormApi.cmi$;
    //this.commit$ = this.scormApi.commit$;
    /*this.currentResult$.subscribe(sub => {
      //dispatch update
    });
    this.commit$.subscribe(sub => {
      //commit
    });*/
  }

  startExerciseAsPreviewWithoutAnswers(): void {
    //this.scormApi.init(, ScormCmiMode.CMI_MODE_NORMAL);
    this.saveExerciseToStore(12, 12, false, null, 12);
  }

  startExerciseAsTask(): void {
    //this.scormApi.init(, ScormCmiMode.CMI_MODE_BROWSE);
    this.saveExerciseToStore(12, 12, true, 12, null);
  }

  startExerciseAsTraining(): void {
    //this.scormApi.init(, ScormCmiMode.CMI_MODE_NORMAL);
    this.saveExerciseToStore(12, 12, true, null, 12);
  }

  startExerciseAsReview(): void {
    //this.scormApi.init(, ScormCmiMode.CMI_MODE_REVIEW);
    this.saveExerciseToStore(12, 12, false, null, 12);
  }

  private saveExerciseToStore(
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

  private openWindow() {
    this.scormWindow = window.open('/popup.html', 'polpo-scorm');
  }

  private closeWindow() {
    this.scormWindow.close();
  }

  private closeExercise() {
    this.closeWindow();
    this.store.dispatch(new CurrentExerciseActions.ClearCurrentExercise());
  }
}
