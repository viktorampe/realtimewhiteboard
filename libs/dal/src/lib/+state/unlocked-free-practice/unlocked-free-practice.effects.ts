import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import { DalState } from '..';
import {
  UnlockedFreePracticeServiceInterface,
  UNLOCKED_FREE_PRACTICE_SERVICE_TOKEN
} from '../../unlocked-free-practice/unlocked-free-practice.service.interface';
import {
  LoadUnlockedFreePractices,
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

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(UNLOCKED_FREE_PRACTICE_SERVICE_TOKEN)
    private unlockedFreePracticeService: UnlockedFreePracticeServiceInterface
  ) {}
}
