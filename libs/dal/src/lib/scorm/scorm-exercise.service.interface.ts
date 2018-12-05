import { InjectionToken } from '@angular/core';

export const SCORM_EXERCISE_SERVICE_TOKEN = new InjectionToken(
  'ScormExerciseService'
);

export interface ScormExerciseServiceInterface {
  startExerciseAsPreviewWithAnswers(
    userId: number,
    educontentId: number,
    unlockedContentId: number
  ): void;
  startExerciseAsPreviewWithoutAnswers(
    userId: number,
    educontentId: number,
    unlockedContentId: number
  ): void;
  startExerciseAsTask(
    userId: number,
    educontentId: number,
    taskId: number
  ): void;
  startExerciseAsTraining(
    userId: number,
    educontentId: number,
    unlockedContentId: number
  ): void;
  startExerciseAsReview(
    userId: number,
    educontentId: number,
    unlockedContentId: number
  ): void;
  closeExercise(): void;
}
