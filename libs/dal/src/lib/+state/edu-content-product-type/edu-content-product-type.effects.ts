import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import { EduContentProductTypeServiceInterface, EDU_CONTENT_PRODUCT_TYPE_SERVICE_TOKEN } from '../../edu-content-product-type/edu-content-product-type.service.interface';
import {
  EduContentProductTypesActionTypes,
  EduContentProductTypesLoadError,
  LoadEduContentProductTypes,
  EduContentProductTypesLoaded
} from './edu-content-product-type.actions';
import { DalState } from '..';

@Injectable()
export class EduContentProductTypeEffects {
  @Effect()
  loadEduContentProductTypes$ = this.dataPersistence.fetch(
    EduContentProductTypesActionTypes.LoadEduContentProductTypes,
    {
      run: (action: LoadEduContentProductTypes, state: DalState) => {
        if (!action.payload.force && state.eduContentProductTypes.loaded) return;
        return this.eduContentProductTypeService
          .getAllForUser(action.payload.userId)
          .pipe(map(eduContentProductTypes => new EduContentProductTypesLoaded({ eduContentProductTypes })));
      },
      onError: (action: LoadEduContentProductTypes, error) => {
        return new EduContentProductTypesLoadError(error);
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(EDU_CONTENT_PRODUCT_TYPE_SERVICE_TOKEN)
    private eduContentProductTypeService: EduContentProductTypeServiceInterface
  ) {}
}
