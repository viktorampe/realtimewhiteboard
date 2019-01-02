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
  LoadExercise,
  SaveCurrentExercise
} from './current-exercise.actions';

@Injectable()
export class CurrentExerciseEffects {
  @Effect()
  loadExercise$ = this.dataPersistence.pessimisticUpdate(
    CurrentExerciseActionTypes.LoadExercise,
    {
      run: (action: LoadExercise, state: DalState) => {
        return this.exerciseService
          .loadExercise(
            action.payload.userId,
            action.payload.educontentId,
            action.payload.saveToApi,
            action.payload.cmiMode,
            action.payload.taskId,
            action.payload.unlockedContentId,
            action.payload.result
          )
          .pipe(map(ex => new CurrentExerciseLoaded(ex)));
      },
      onError: (action: LoadExercise, error) => {
        return new CurrentExerciseError(error);
      }
    }
  );

  @Effect()
  saveExercise$ = this.dataPersistence.optimisticUpdate(
    CurrentExerciseActionTypes.SaveCurrentExercise,
    {
      run: (action: SaveCurrentExercise, state: DalState) => {
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
      undoAction: (action: SaveCurrentExercise, state: any) => {
        // TODO: show error message to user
        // resetting the state won't help, because ludo won't update
        // todo examine further
        return new CurrentExerciseError(new Error('failed'));
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
