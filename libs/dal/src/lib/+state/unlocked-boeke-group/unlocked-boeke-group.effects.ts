import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import {
  UnlockedBoekeGroupServiceInterface,
  UNLOCKED_BOEKE_GROUP_SERVICE_TOKEN
} from '../../boeke/unlocked-boeke-group.service.interface';
import {
  LoadUnlockedBoekeGroups,
  UnlockedBoekeGroupsActionTypes,
  UnlockedBoekeGroupsLoaded,
  UnlockedBoekeGroupsLoadError
} from './unlocked-boeke-group.actions';
import { State } from './unlocked-boeke-group.reducer';

@Injectable()
export class UnlockedBoekeGroupsEffects {
  @Effect()
  loadUnlockedBoekeGroups$ = this.dataPersistence.fetch(
    UnlockedBoekeGroupsActionTypes.LoadUnlockedBoekeGroups,
    {
      run: (action: LoadUnlockedBoekeGroups, state: any) => {
        if (!action.payload.force && state.unlockedBoekeGroups.loaded) return;
        //todo match current user
        return this.unlockedBoekeGroupService
          .getAllForUser(1)
          .pipe(
            map(
              unlockedBoekeGroups =>
                new UnlockedBoekeGroupsLoaded({ unlockedBoekeGroups })
            )
          );
      },
      onError: (action: LoadUnlockedBoekeGroups, error) => {
        return new UnlockedBoekeGroupsLoadError(error);
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<State>,
    @Inject(UNLOCKED_BOEKE_GROUP_SERVICE_TOKEN)
    private unlockedBoekeGroupService: UnlockedBoekeGroupServiceInterface
  ) {}
}
