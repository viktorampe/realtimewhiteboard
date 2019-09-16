import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultInterface } from '../+models';
import { CurrentExerciseInterface } from './../+state/current-exercise/current-exercise.reducer';
import { ScormCmiMode } from './scorm-api.interface';

export const EXERCISE_SERVICE_TOKEN = new InjectionToken('ExerciseService');

export interface ExerciseServiceInterface {
  loadExercise(
    userId: number,
    educontentId: number,
    saveToApi: boolean,
    mode: ScormCmiMode,
    taskId?: number,
    unlockedContentId?: number,
    result?: ResultInterface
  ): Observable<CurrentExerciseInterface>;

  saveExercise(
    exercise: CurrentExerciseInterface
  ): Observable<CurrentExerciseInterface>;
}
