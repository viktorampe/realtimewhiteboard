import { InjectionToken } from '@angular/core';

export const SCORM_EXERCISE_SERVICE_TOKEN = new InjectionToken(
  'ScormExerciseService'
);

export interface ScormExerciseServiceInterface {
  previewWithAnswers(): any;
  previewWithoutAnswers(): any;
  task(): any;
  training(): any;
  review(): any;
}
