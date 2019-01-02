import { InjectionToken } from '@angular/core';
import { ScormCmiMode } from '@campus/scorm';
import { Observable } from 'rxjs';
import { ResultInterface } from '../+models';
import { CurrentExerciseInterface } from './../+state/current-exercise/current-exercise.reducer';

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
