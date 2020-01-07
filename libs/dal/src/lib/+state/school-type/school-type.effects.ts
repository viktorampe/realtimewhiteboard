import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import { map } from 'rxjs/operators';
import { DalState } from '..';
import {
  SchoolTypeServiceInterface,
  SCHOOL_TYPE_SERVICE_TOKEN
} from '../../metadata/school-type.service.interface';
import {
  LoadSchoolTypes,
  SchoolTypesActionTypes,
  SchoolTypesLoaded,
  SchoolTypesLoadError
} from './school-type.actions';

@Injectable()
export class SchoolTypeEffects {
  @Effect()
  loadSchoolTypes$ = this.dataPersistence.fetch(
    SchoolTypesActionTypes.LoadSchoolTypes,
    {
      run: (action: LoadSchoolTypes, state: DalState) => {
        if (!action.payload.force && state.schoolTypes.loaded) return;
        return this.schoolTypeService
          .getAll()
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
