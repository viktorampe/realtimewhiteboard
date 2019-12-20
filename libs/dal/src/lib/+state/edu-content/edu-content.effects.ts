import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import { map } from 'rxjs/operators';
import { DalState } from '..';
import {
  EduContentServiceInterface,
  EDU_CONTENT_SERVICE_TOKEN
} from '../../edu-content/edu-content.service.interface';
import {
  EduContentsActionTypes,
  EduContentsLoaded,
  EduContentsLoadError,
  LoadEduContents
} from './edu-content.actions';

@Injectable()
export class EduContentsEffects {
  @Effect()
  loadEduContents$ = this.dataPersistence.fetch(
    EduContentsActionTypes.LoadEduContents,
    {
      run: (action: LoadEduContents, state: DalState) => {
        if (!action.payload.force && state.eduContents.loaded) return;
        return this.eduContentService
          .getAllForUser(action.payload.userId)
          .pipe(map(eduContents => new EduContentsLoaded({ eduContents })));
      },
      onError: (action: LoadEduContents, error) => {
        return new EduContentsLoadError(error);
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(EDU_CONTENT_SERVICE_TOKEN)
    private eduContentService: EduContentServiceInterface
  ) {}
}
