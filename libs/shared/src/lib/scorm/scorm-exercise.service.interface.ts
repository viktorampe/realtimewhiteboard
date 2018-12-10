import { InjectionToken } from '@angular/core';

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
  startExerciseFromTask(
    userId: number,
    educontentId: number,
    taskId: number
  ): void;
  reviewExerciseFromUnlockedContent(
    userId: number,
    educontentId: number,
    unlockedContentId: number
  ): void;
  reviewExerciseFromTask(userId: number, educontentId: number, taskId: number);
  closeExercise(): void;
}
