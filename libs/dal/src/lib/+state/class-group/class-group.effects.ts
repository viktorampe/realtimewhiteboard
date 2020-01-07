import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import { map } from 'rxjs/operators';
import {
  ClassGroupServiceInterface,
  CLASS_GROUP_SERVICE_TOKEN
} from '../../class-group/class-group.service.interface';
import {
  ClassGroupsActionTypes,
  ClassGroupsLoadError,
  LoadClassGroups,
  ClassGroupsLoaded
} from './class-group.actions';
import { DalState } from '..';

@Injectable()
export class ClassGroupEffects {
  @Effect()
  loadClassGroups$ = this.dataPersistence.fetch(
    ClassGroupsActionTypes.LoadClassGroups,
    {
      run: (action: LoadClassGroups, state: DalState) => {
        if (!action.payload.force && state.classGroups.loaded) return;
        return this.classGroupService
          .getAllForUser(action.payload.userId)
          .pipe(map(classGroups => new ClassGroupsLoaded({ classGroups })));
      },
      onError: (action: LoadClassGroups, error) => {
        return new ClassGroupsLoadError(error);
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(CLASS_GROUP_SERVICE_TOKEN)
    private classGroupService: ClassGroupServiceInterface
  ) {}
}
