import { InjectionToken } from '@angular/core';
import { ExerciseInterface } from '@campus/dal';
import { Observable } from 'rxjs';

export const EXERCISE_SERVICE_TOKEN = new InjectionToken('ExerciseService');

export interface ExerciseServiceInterface {
  getAllForUser(userId: number): Observable<ExerciseInterface[]>;

  startExercise(
    userId: number,
    educontentId: number,
    taskId?: number,
    unlockedContentId?: number
  ): Observable<ExerciseInterface>;

  saveExercise(exercise: ExerciseInterface): Observable<ExerciseInterface>;
}
