import { Inject, Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import { DalState } from '..';
import {
  MethodLevelServiceInterface,
  METHOD_LEVEL_SERVICE_TOKEN
} from '../../metadata/method-level.service.interface';
import {
  LoadMethodLevels,
  MethodLevelsActionTypes,
  MethodLevelsLoaded,
  MethodLevelsLoadError
} from './method-level.actions';

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
          .pipe(
            map(methodLevels =>
              methodLevels.map(methodLevel => {
                return {
                  ...methodLevel,
                  icon:
                    methodLevel.icon ||
                    `method-${methodLevel.methodId}-level-${
                      methodLevel.levelId
                    }`
                };
              })
            ),
            map(methodLevels => new MethodLevelsLoaded({ methodLevels }))
          );
      },
      onError: (action: LoadMethodLevels, error) => {
        return new MethodLevelsLoadError(error);
      }
    }
  );

  @Effect({ dispatch: false })
  methodLevelsLoaded$ = this.dataPersistence.fetch(
    MethodLevelsActionTypes.MethodLevelsLoaded,
    {
      run: (action: MethodLevelsLoaded, state: DalState) => {
        action.payload.methodLevels.forEach(methodLevel => {
          this.iconRegistry.addSvgIcon(
            methodLevel.icon,
            `assets/icons/methodlevels/${methodLevel.icon}.svg`
          );
        });
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    private iconRegistry: MatIconRegistry,
    @Inject(METHOD_LEVEL_SERVICE_TOKEN)
    private methodLevelService: MethodLevelServiceInterface
  ) {}
}
