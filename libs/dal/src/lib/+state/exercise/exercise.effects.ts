import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import { DalState } from '..';
import {
  ExerciseServiceInterface,
  EXERCISE_SERVICE_TOKEN
} from '../../exercise/exercise.service.interface';
import {
  CurrentExerciseError,
  CurrentExerciseLoaded,
  ExercisesActionTypes,
  ExercisesLoaded,
  ExercisesLoadError,
  LoadExercises,
  StartExercise
} from './exercise.actions';

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

  @Effect()
  startExercise$ = this.dataPersistence.pessimisticUpdate(
    ExercisesActionTypes.StartExercise,
    {
      run: (action: StartExercise, state: DalState) => {
        return this.exerciseService
          .startExercise(
            action.payload.userId,
            action.payload.educontentId,
            action.payload.taskId,
            action.payload.unlockedContentId
          )
          .pipe(map(ex => new CurrentExerciseLoaded(ex)));
      },
      onError: (action: StartExercise, error) => {
        return new CurrentExerciseError(error);
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
