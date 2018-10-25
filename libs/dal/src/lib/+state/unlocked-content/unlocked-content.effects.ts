import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import { DalState } from '..';
import {
  UnlockedContentServiceInterface,
  UNLOCKED_CONTENT_SERVICE_TOKEN
} from '../../bundle/unlocked-content.service.interface';
import {
  LoadUnlockedContents,
  UnlockedContentsActionTypes,
  UnlockedContentsLoaded,
  UnlockedContentsLoadError
} from './unlocked-content.actions';

@Injectable()
export class UnlockedContentsEffects {
  @Effect()
  loadUnlockedContents$ = this.dataPersistence.fetch(
    UnlockedContentsActionTypes.LoadUnlockedContents,
    {
      run: (action: LoadUnlockedContents, state: DalState) => {
        if (!action.payload.force && state.unlockedContents.loaded) return;
        return this.unlockedContentService
          .getAllForUser(action.payload.userId)
          .pipe(
            map(
              unlockedContents =>
                new UnlockedContentsLoaded({ unlockedContents })
            )
          );
      },
      onError: (action: LoadUnlockedContents, error) => {
        return new UnlockedContentsLoadError(error);
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(UNLOCKED_CONTENT_SERVICE_TOKEN)
    private unlockedContentService: UnlockedContentServiceInterface
  ) {}
}
