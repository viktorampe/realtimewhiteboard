import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import { YearServiceInterface, YEAR_SERVICE_TOKEN } from '../../year/year.service.interface';
import {
  YearsActionTypes,
  YearsLoadError,
  LoadYears,
  YearsLoaded
} from './year.actions';
import { DalState } from '..';

@Injectable()
export class YearEffects {
  @Effect()
  loadYears$ = this.dataPersistence.fetch(
    YearsActionTypes.LoadYears,
    {
      run: (action: LoadYears, state: DalState) => {
        if (!action.payload.force && state.years.loaded) return;
        return this.yearService
          .getAllForUser(action.payload.userId)
          .pipe(map(years => new YearsLoaded({ years })));
      },
      onError: (action: LoadYears, error) => {
        return new YearsLoadError(error);
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(YEAR_SERVICE_TOKEN)
    private yearService: YearServiceInterface
  ) {}
}
