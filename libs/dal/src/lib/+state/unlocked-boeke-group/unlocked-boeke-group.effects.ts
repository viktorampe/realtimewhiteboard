import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import { map } from 'rxjs/operators';
import { DalState } from '..';
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

@Injectable()
export class UnlockedBoekeGroupsEffects {
  @Effect()
  loadUnlockedBoekeGroups$ = this.dataPersistence.fetch(
    UnlockedBoekeGroupsActionTypes.LoadUnlockedBoekeGroups,
    {
      run: (action: LoadUnlockedBoekeGroups, state: DalState) => {
        if (!action.payload.force && state.unlockedBoekeGroups.loaded) return;
        return this.unlockedBoekeGroupService
          .getAllForUser(action.payload.userId)
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
    private dataPersistence: DataPersistence<DalState>,
    @Inject(UNLOCKED_BOEKE_GROUP_SERVICE_TOKEN)
    private unlockedBoekeGroupService: UnlockedBoekeGroupServiceInterface
  ) {}
}
