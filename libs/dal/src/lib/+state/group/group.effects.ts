import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import {
  GroupServiceInterface,
  GROUP_SERVICE_TOKEN
} from '../../group/group.service.interface';
import {
  GroupsActionTypes,
  GroupsLoadError,
  LoadGroups,
  GroupsLoaded
} from './group.actions';
import { DalState } from '..';

@Injectable()
export class GroupEffects {
  @Effect()
  loadGroups$ = this.dataPersistence.fetch(GroupsActionTypes.LoadGroups, {
    run: (action: LoadGroups, state: DalState) => {
      if (!action.payload.force && state.groups.loaded) return;
      return this.groupService
        .getAllForUser(action.payload.userId)
        .pipe(map(groups => new GroupsLoaded({ groups })));
    },
    onError: (action: LoadGroups, error) => {
      return new GroupsLoadError(error);
    }
  });

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(GROUP_SERVICE_TOKEN)
    private groupService: GroupServiceInterface
  ) {}
}
