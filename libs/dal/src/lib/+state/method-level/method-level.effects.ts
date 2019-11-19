import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import { MethodLevelServiceInterface, METHOD_LEVEL_SERVICE_TOKEN } from '../../method-level/method-level.service.interface';
import {
  MethodLevelsActionTypes,
  MethodLevelsLoadError,
  LoadMethodLevels,
  MethodLevelsLoaded
} from './method-level.actions';
import { DalState } from '..';

@Injectable()
export class MethodLevelEffects {
  @Effect()
  loadMethodLevels$ = this.dataPersistence.fetch(
    MethodLevelsActionTypes.LoadMethodLevels,
    {
      run: (action: LoadMethodLevels, state: DalState) => {
        if (!action.payload.force && state.methodLevels.loaded) return;
        return this.methodLevelService
          .getAllForUser(action.payload.userId)
          .pipe(map(methodLevels => new MethodLevelsLoaded({ methodLevels })));
      },
      onError: (action: LoadMethodLevels, error) => {
        return new MethodLevelsLoadError(error);
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(METHOD_LEVEL_SERVICE_TOKEN)
    private methodLevelService: MethodLevelServiceInterface
  ) {}
}
