import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
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
import { State } from './unlocked-content.reducer';

@Injectable()
export class UnlockedContentsEffects {
  @Effect()
  loadUnlockedContents$ = this.dataPersistence.fetch(
    UnlockedContentsActionTypes.LoadUnlockedContents,
    {
      run: (action: LoadUnlockedContents, state: any) => {
        if (!action.payload.force && state.unlockedContent.loaded) return;
        //todo attach current user
        return this.unlockedContentService
          .getAllForUser(1)
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
    private dataPersistence: DataPersistence<State>,
    @Inject(UNLOCKED_CONTENT_SERVICE_TOKEN)
    private unlockedContentService: UnlockedContentServiceInterface
  ) {}
}
