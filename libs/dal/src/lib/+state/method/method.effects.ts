import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import {
  MethodServiceInterface,
  METHOD_SERVICE_TOKEN
} from '../../metadata/method.service.interface';
import { DalState } from '../dal.state.interface';
import {
  AllowedMethodsLoaded,
  AllowedMethodsLoadError,
  LoadAllowedMethods,
  LoadMethods,
  MethodsActionTypes,
  MethodsLoaded,
  MethodsLoadError
} from './method.actions';

@Injectable()
export class MethodEffects {
  @Effect()
  loadMethods$ = this.dataPersistence.fetch(MethodsActionTypes.LoadMethods, {
    run: (action: LoadMethods, state: DalState) => {
      if (!action.payload.force && state.methods.loaded) return;
      return this.methodService
        .getAllForUser(action.payload.userId)
        .pipe(map(methods => new MethodsLoaded({ methods })));
    },
    onError: (action: LoadMethods, error) => {
      return new MethodsLoadError(error);
    }
  });

  @Effect()
  loadAllowedMethods$ = this.dataPersistence.fetch(
    MethodsActionTypes.LoadAllowedMethods,
    {
      run: (action: LoadAllowedMethods, state: DalState) => {
        if (!action.payload.force && state.methods.allowedMethodsLoaded) return;
        return this.methodService
          .getAllowedMethodIds(action.payload.userId)
          .pipe(
            map(
              (methodIds: number[]) => new AllowedMethodsLoaded({ methodIds })
            )
          );
      },
      onError: (action: LoadAllowedMethods, error) => {
        return new AllowedMethodsLoadError(error);
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(METHOD_SERVICE_TOKEN)
    private methodService: MethodServiceInterface
  ) {}
}
