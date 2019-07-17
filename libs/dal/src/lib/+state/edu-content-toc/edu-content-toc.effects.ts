import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import { EduContentTocServiceInterface, EDU_CONTENT_TOC_SERVICE_TOKEN } from '../../edu-content-toc/edu-content-toc.service.interface';
import {
  EduContentTocsActionTypes,
  EduContentTocsLoadError,
  LoadEduContentTocs,
  EduContentTocsLoaded
} from './edu-content-toc.actions';
import { DalState } from '..';

@Injectable()
export class EduContentTocEffects {
  @Effect()
  loadEduContentTocs$ = this.dataPersistence.fetch(
    EduContentTocsActionTypes.LoadEduContentTocs,
    {
      run: (action: LoadEduContentTocs, state: DalState) => {
        if (!action.payload.force && state.eduContentTocs.loaded) return;
        return this.eduContentTocService
          .getAllForUser(action.payload.userId)
          .pipe(map(eduContentTocs => new EduContentTocsLoaded({ eduContentTocs })));
      },
      onError: (action: LoadEduContentTocs, error) => {
        return new EduContentTocsLoadError(error);
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(EDU_CONTENT_TOC_SERVICE_TOKEN)
    private eduContentTocService: EduContentTocServiceInterface
  ) {}
}
