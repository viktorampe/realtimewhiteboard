import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { ScormCmiMode } from '../+external-interfaces/scorm-api.interface';
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
    result?: ResultInterface,
    unlockedFreePracticeId?: number
  ): Observable<CurrentExerciseInterface>;

  saveExercise(
    exercise: CurrentExerciseInterface
  ): Observable<CurrentExerciseInterface>;
}
