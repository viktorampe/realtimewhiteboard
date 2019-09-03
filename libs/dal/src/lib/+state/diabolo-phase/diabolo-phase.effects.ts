import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import { DalState } from '..';
import {
  DiaboloPhaseServiceInterface,
  DIABOLO_PHASE_SERVICE_TOKEN
} from '../../metadata/diabolo-phase.service.interface';
import {
  DiaboloPhasesActionTypes,
  DiaboloPhasesLoaded,
  DiaboloPhasesLoadError,
  LoadDiaboloPhases
} from './diabolo-phase.actions';

@Injectable()
export class DiaboloPhaseEffects {
  @Effect()
  loadDiaboloPhases$ = this.dataPersistence.fetch(
    DiaboloPhasesActionTypes.LoadDiaboloPhases,
    {
      run: (action: LoadDiaboloPhases, state?: DalState) => {
        if (!action.payload.force && state.diaboloPhases.loaded) return;
        return this.diaboloPhaseService
          .getAll()
          .pipe(
            map(diaboloPhases => new DiaboloPhasesLoaded({ diaboloPhases }))
          );
      },
      onError: (action: LoadDiaboloPhases, error) => {
        return new DiaboloPhasesLoadError(error);
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(DIABOLO_PHASE_SERVICE_TOKEN)
    private diaboloPhaseService: DiaboloPhaseServiceInterface
  ) {}
}
