import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import { SchoolTypeServiceInterface, SCHOOL_TYPE_SERVICE_TOKEN } from '../../school-type/school-type.service.interface';
import {
  SchoolTypesActionTypes,
  SchoolTypesLoadError,
  LoadSchoolTypes,
  SchoolTypesLoaded
} from './school-type.actions';
import { DalState } from '..';

@Injectable()
export class SchoolTypeEffects {
  @Effect()
  loadSchoolTypes$ = this.dataPersistence.fetch(
    SchoolTypesActionTypes.LoadSchoolTypes,
    {
      run: (action: LoadSchoolTypes, state: DalState) => {
        if (!action.payload.force && state.schoolTypes.loaded) return;
        return this.schoolTypeService
          .getAllForUser(action.payload.userId)
          .pipe(map(schoolTypes => new SchoolTypesLoaded({ schoolTypes })));
      },
      onError: (action: LoadSchoolTypes, error) => {
        return new SchoolTypesLoadError(error);
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(SCHOOL_TYPE_SERVICE_TOKEN)
    private schoolTypeService: SchoolTypeServiceInterface
  ) {}
}
