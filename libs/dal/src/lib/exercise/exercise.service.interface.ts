import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrentExerciseInterface } from './../+state/current-exercise/current-exercise.reducer';

export const EXERCISE_SERVICE_TOKEN = new InjectionToken('ExerciseService');

export interface ExerciseServiceInterface {
  startExercise(
    userId: number,
    educontentId: number,
    saveToApi: boolean,
    taskId?: number,
    unlockedContentId?: number
  ): Observable<CurrentExerciseInterface>;

  saveExercise(
    exercise: CurrentExerciseInterface
  ): Observable<CurrentExerciseInterface>;
}
