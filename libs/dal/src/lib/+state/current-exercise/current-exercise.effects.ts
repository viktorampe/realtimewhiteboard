import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { DataPersistence } from '@nrwl/nx';
import { undo } from 'ngrx-undo';
import { from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DalState } from '..';
import {
  ExerciseServiceInterface,
  EXERCISE_SERVICE_TOKEN
} from '../../exercise/exercise.service.interface';
import { EffectFeedback, Priority } from '../effect-feedback';
import { AddEffectFeedback } from '../effect-feedback/effect-feedback.actions';
import { LoadTaskEduContents } from '../task-edu-content/task-edu-content.actions';
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
          switchMap(ex => {
            const effectFeedback = new EffectFeedback({
              id: this.uuid(),
              triggerAction: action,
              message: 'Oefening is bewaard.'
            });
            return [
              new AddEffectFeedback({
                effectFeedback
              }),
              new LoadTaskEduContents({
                userId: action.payload.userId,
                force: effectFeedback.display
              })
            ];
          })
        );
      },
      undoAction: (action: SaveCurrentExercise, e: any) => {
        const undoAction = undo(action);

        const effectFeedback = new EffectFeedback({
          id: this.uuid(),
          triggerAction: action,
          message: 'Het is niet gelukt om de oefening te bewaren.',
          userActions: [
            {
              title: 'Opnieuw proberen.',
              userAction: action
            }
          ],
          type: 'error',
          priority: Priority.HIGH
        });
        // resetting the state won't help, because ludo won't update
        // todo examine further
        return from<Action>([
          undoAction,
          new AddEffectFeedback({ effectFeedback }),
          new CurrentExerciseError(new Error('failed'))
        ]);
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(EXERCISE_SERVICE_TOKEN)
    private exerciseService: ExerciseServiceInterface,
    @Inject('uuid') private uuid: Function
  ) {}
}
