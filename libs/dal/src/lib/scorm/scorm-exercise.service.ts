import { Inject, Injectable } from '@angular/core';
import {
  ScormApiServiceInterface,
  SCORM_API_SERVICE_TOKEN
} from '@campus/scorm';
import { Observable } from 'rxjs';
import { ScormExerciseServiceInterface } from './scorm-exercise.service.interface';

@Injectable({
  providedIn: 'root'
})
export class ScormExerciseService implements ScormExerciseServiceInterface {
  currentURL: Observable<String>;

  constructor(
    @Inject(SCORM_API_SERVICE_TOKEN) private scormApi: ScormApiServiceInterface
  ) {}

  startExerciseAsPreviewWithAnswers(): void {
    this.scormApi.init();
    //dispatch START_NEW_EXERCISE_ACTION
    /* old code
      scormWindow.location.href = url;
      currentScormWindow = scormWindow;
      if (withAnswers === false) {
        currentMode = Scorm.mode.CMI_MODE_NORMAL;
        setCurrentEduContent({}, {});
      } else {
        currentMode = Scorm.mode.CMI_MODE_PREVIEW;
      }
    */
  }

  startExerciseAsPreviewWithoutAnswers(): void {}

  startExerciseAsTask(): void {}

  startExerciseAsTraining(): void {}

  startExerciseAsReview(): void {
    /* old code
    setCurrentEduContent(reviewContent.eduContent, reviewContent.result);
    setCurrentUser(user);
    scormWindow.location.href = url;
    currentScormWindow = scormWindow;
    currentMode = Scorm.mode.CMI_MODE_REVIEW;
    */
  }

  private startExcercise() {
    //dispatch START_NEW_EXERCISE_ACTION
    //
  }

  private closeExercise() {
    /* old code
    try {
        currentScormWindow.close();
    } catch (err) {
        console.log(err);
    }
    return;
    
    */
  }
}
