import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import { DalState } from '..';
import {
  UnlockedFreePracticeServiceInterface,
  UNLOCKED_FREE_PRACTICE_SERVICE_TOKEN
} from '../../unlocked-free-practice/unlocked-free-practice.service.interface';
import { EffectFeedback, EffectFeedbackActions } from '../effect-feedback';
import {
  AddUnlockedFreePractices,
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
            map(
              unlockedFreePractices =>
                new AddUnlockedFreePractices({
                  unlockedFreePractices
                })
            )
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
