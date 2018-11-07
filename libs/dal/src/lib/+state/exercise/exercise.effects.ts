import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import { ExerciseServiceInterface, EXERCISE_SERVICE_TOKEN } from '../../exercise/exercise.service.interface';
import {
  ExercisesActionTypes,
  ExercisesLoadError,
  LoadExercises,
  ExercisesLoaded
} from './exercise.actions';
import { DalState } from '..';

@Injectable()
export class ExerciseEffects {
  @Effect()
  loadExercises$ = this.dataPersistence.fetch(
    ExercisesActionTypes.LoadExercises,
    {
      run: (action: LoadExercises, state: DalState) => {
        if (!action.payload.force && state.exercises.loaded) return;
        return this.exerciseService
          .getAllForUser(action.payload.userId)
          .pipe(map(exercises => new ExercisesLoaded({ exercises })));
      },
      onError: (action: LoadExercises, error) => {
        return new ExercisesLoadError(error);
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(EXERCISE_SERVICE_TOKEN)
    private exerciseService: ExerciseServiceInterface
  ) {}
}
