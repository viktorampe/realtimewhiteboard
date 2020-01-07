import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import { map } from 'rxjs/operators';
import { DalState } from '..';
import {
  YearServiceInterface,
  YEAR_SERVICE_TOKEN
} from '../../metadata/year.service.interface';
import {
  LoadYears,
  YearsActionTypes,
  YearsLoaded,
  YearsLoadError
} from './year.actions';

@Injectable()
export class YearEffects {
  @Effect()
  loadYears$ = this.dataPersistence.fetch(YearsActionTypes.LoadYears, {
    run: (action: LoadYears, state: DalState) => {
      if (!action.payload.force && state.years.loaded) return;
      return this.yearService
        .getAll()
        .pipe(map(years => new YearsLoaded({ years })));
    },
    onError: (action: LoadYears, error) => {
      return new YearsLoadError(error);
    }
  });

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(YEAR_SERVICE_TOKEN)
    private yearService: YearServiceInterface
  ) {}
}
