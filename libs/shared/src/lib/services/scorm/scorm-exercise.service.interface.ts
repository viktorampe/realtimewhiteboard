import { InjectionToken } from '@angular/core';
import { ResultInterface } from '@campus/dal';

export const SCORM_EXERCISE_SERVICE_TOKEN = new InjectionToken(
  'ScormExerciseService'
);

export interface ScormExerciseServiceInterface {
  previewExerciseFromUnlockedContent(
    userId: number,
    educontentId: number,
    unlockedContentId: number,
    showAnswers: boolean
  ): void;
  previewExerciseFromTask(
    userId: number,
    educontentId: number,
    taskId: number,
    showAnswers: boolean
  ): void;
  startExerciseFromUnlockedContent(
    userId: number,
    educontentId: number,
    unlockedContentId: number
  ): void;
  startExerciseFromUnlockedFreePractice(
    userId: number,
    eduContentId: number,
    unlockedFreePracticeId: number
  ): void;
  startExerciseFromTask(
    userId: number,
    educontentId: number,
    taskId: number
  ): void;
  reviewExerciseFromResult(result: ResultInterface);
  closeExercise(): void;
}
