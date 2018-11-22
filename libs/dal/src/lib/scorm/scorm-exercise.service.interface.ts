import { InjectionToken } from '@angular/core';

export const SCORM_EXERCISE_SERVICE_TOKEN = new InjectionToken(
  'ScormExerciseService'
);

export interface ScormExerciseServiceInterface {
  startExerciseAsPreviewWithAnswers(): void;
  startExerciseAsPreviewWithoutAnswers(): void;
  startExerciseAsTask(): void;
  startExerciseAsTraining(): void;
  startExerciseAsReview(): void;
}
