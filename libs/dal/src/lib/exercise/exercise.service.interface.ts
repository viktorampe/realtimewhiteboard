import { InjectionToken } from '@angular/core';
import { ScormCmiMode } from '@campus/scorm';
import { Observable } from 'rxjs';
import { CurrentExerciseInterface } from './../+state/current-exercise/current-exercise.reducer';

export const EXERCISE_SERVICE_TOKEN = new InjectionToken('ExerciseService');

export interface ExerciseServiceInterface {
  startExercise(
    userId: number,
    educontentId: number,
    saveToApi: boolean,
    mode: ScormCmiMode,
    taskId?: number,
    unlockedContentId?: number
  ): Observable<CurrentExerciseInterface>;

  saveExercise(
    exercise: CurrentExerciseInterface
  ): Observable<CurrentExerciseInterface>;
}
