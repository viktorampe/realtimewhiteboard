import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import { undo } from 'ngrx-undo';
import { from } from 'rxjs';
import { map, mapTo, switchMap } from 'rxjs/operators';
import { DalState } from '..';
import {
  UnlockedFreePracticeServiceInterface,
  UNLOCKED_FREE_PRACTICE_SERVICE_TOKEN
} from '../../unlocked-free-practice/unlocked-free-practice.service.interface';
import { EffectFeedback, EffectFeedbackActions } from '../effect-feedback';
import { AddEffectFeedback } from '../effect-feedback/effect-feedback.actions';
import {
  DeleteUnlockedFreePractices,
  LoadUnlockedFreePractices,
  StartAddManyUnlockedFreePractices,
  UnlockedFreePracticesActionTypes,
  UnlockedFreePracticesLoaded,
  UnlockedFreePracticesLoadError
} from './unlocked-free-practice.actions';

@Injectable()
export class UnlockedFreePracticeEffects {
  @Effect()
  loadUnlockedFreePractices$ = this.dataPersistence.fetch(
    UnlockedFreePracticesActionTypes.LoadUnlockedFreePractices,
    {
      run: (action: LoadUnlockedFreePractices, state: DalState) => {
        if (!action.payload.force && state.unlockedFreePractices.loaded) return;
        return this.unlockedFreePracticeService
          .getAllForUser(action.payload.userId)
          .pipe(
            map(
              unlockedFreePractices =>
                new UnlockedFreePracticesLoaded({ unlockedFreePractices })
            )
          );
      },
      onError: (action: LoadUnlockedFreePractices, error) => {
        return new UnlockedFreePracticesLoadError(error);
      }
    }
  );

  @Effect()
  deleteUnlockedFreePractices$ = this.dataPersistence.optimisticUpdate(
    UnlockedFreePracticesActionTypes.DeleteUnlockedFreePractices,
    {
      run: (action: DeleteUnlockedFreePractices, state: DalState) => {
        return this.unlockedFreePracticeService
          .deleteUnlockedFreePractices(
            action.payload.userId,
            action.payload.ids
          )
          .pipe(
            mapTo(
              new AddEffectFeedback({
                effectFeedback: new EffectFeedback({
                  id: this.uuid(),
                  triggerAction: action,
                  message: "De 'vrij oefenen' status werd gewijzigd."
                })
              })
            )
          );
      },
      undoAction: (action: DeleteUnlockedFreePractices, error) => {
        const undoAction = undo(action);
        const effectFeedback = EffectFeedback.generateErrorFeedback(
          this.uuid(),
          action,
          "Het is niet gelukt om de 'vrij oefenen' status aan te passen."
        );
        const effectFeedbackAction = new EffectFeedbackActions.AddEffectFeedback(
          { effectFeedback }
        );

        return from([undoAction, effectFeedbackAction]);
      }
    }
  );

  @Effect()
  startAddManyUnlockedFreePractices$ = this.dataPersistence.pessimisticUpdate(
    UnlockedFreePracticesActionTypes.StartAddManyUnlockedFreePractices,
    {
      run: (action: StartAddManyUnlockedFreePractices, state: DalState) => {
        return this.unlockedFreePracticeService
          .createUnlockedFreePractices(
            action.payload.userId,
            action.payload.unlockedFreePractices
          )
          .pipe(
            switchMap(unlockedFreePractices => {
              return from([
                new LoadUnlockedFreePractices({
                  force: true,
                  userId: action.payload.userId
                }),
                new AddEffectFeedback({
                  effectFeedback: new EffectFeedback({
                    id: this.uuid(),
                    triggerAction: action,
                    message: "De 'vrij oefenen' status werd gewijzigd."
                  })
                })
              ]);
            })
          );
      },
      onError: (action: StartAddManyUnlockedFreePractices, error) => {
        const effectFeedback = EffectFeedback.generateErrorFeedback(
          this.uuid(),
          action,
          "Het is niet gelukt om de 'vrij oefenen' status van het hoofdstuk aan te passen."
        );
        const effectFeedbackAction = new EffectFeedbackActions.AddEffectFeedback(
          { effectFeedback }
        );
        return effectFeedbackAction;
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject('uuid') private uuid: Function,
    @Inject(UNLOCKED_FREE_PRACTICE_SERVICE_TOKEN)
    private unlockedFreePracticeService: UnlockedFreePracticeServiceInterface
  ) {}
}
