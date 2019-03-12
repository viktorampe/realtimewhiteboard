import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import { EduNetServiceInterface, EDU_NET_SERVICE_TOKEN } from '../../edu-net/edu-net.service.interface';
import {
  EduNetsActionTypes,
  EduNetsLoadError,
  LoadEduNets,
  EduNetsLoaded
} from './edu-net.actions';
import { DalState } from '..';

@Injectable()
export class EduNetEffects {
  @Effect()
  loadEduNets$ = this.dataPersistence.fetch(
    EduNetsActionTypes.LoadEduNets,
    {
      run: (action: LoadEduNets, state: DalState) => {
        if (!action.payload.force && state.eduNets.loaded) return;
        return this.eduNetService
          .getAllForUser(action.payload.userId)
          .pipe(map(eduNets => new EduNetsLoaded({ eduNets })));
      },
      onError: (action: LoadEduNets, error) => {
        return new EduNetsLoadError(error);
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(EDU_NET_SERVICE_TOKEN)
    private eduNetService: EduNetServiceInterface
  ) {}
}
