import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import { DalActions, DalState } from '..';
import {
  ExerciseServiceInterface,
  EXERCISE_SERVICE_TOKEN
} from '../../exercise/exercise.service.interface';
import {
  CurrentExerciseActionTypes,
  CurrentExerciseError,
  CurrentExerciseLoaded,
  SaveCurrentExercise,
  StartExercise
} from './current-exercise.actions';

@Injectable()
export class CurrentExerciseEffects {
  @Effect()
  startExercise$ = this.dataPersistence.pessimisticUpdate(
    CurrentExerciseActionTypes.StartExercise,
    {
      run: (action: StartExercise, state: DalState) => {
        return this.exerciseService
          .startExercise(
            action.payload.userId,
            action.payload.educontentId,
            action.payload.saveToApi,
            action.payload.cmiMode,
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

  @Effect()
  saveExercise$ = this.dataPersistence.pessimisticUpdate(
    CurrentExerciseActionTypes.SaveCurrentExercise,
    {
      run: (action: SaveCurrentExercise, state: DalState) => {
        console.log('inside saveExercise effect');
        const exercise = action.payload.exercise;

        if (!exercise.saveToApi) return;

        return this.exerciseService.saveExercise(state.currentExercise).pipe(
          map(
            ex =>
              new DalActions.ActionSuccessful({
                successfulAction: 'Exercise saved'
              })
          )
        );
      },
      onError: (action: SaveCurrentExercise, error) => {
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
