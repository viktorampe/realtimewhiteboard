import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import {
  EducontentServiceInterface,
  EDUCONTENT_SERVICE_TOKEN
} from '../../educontent/edu-content.service.interface';
import {
  EduContentsActionTypes,
  EduContentsLoaded,
  EduContentsLoadError,
  LoadEduContents
} from './edu-contents.actions';
import { EduContentsState } from './edu-contents.reducer';

@Injectable()
export class EduContentsEffects {
  @Effect()
  loadEducontents$ = this.dataPersistence.fetch(
    EduContentsActionTypes.LoadEduContents,
    {
      run: (action: LoadEduContents, state: EduContentsState) => {
        this.eduContentService.getAll().pipe(
          map(eduContents => {
            return new EduContentsLoaded({ eduContents });
          })
        );
      },
      onError: (action: LoadEduContents, error) => {
        return new EduContentsLoadError(error);
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<EduContentsState>,
    @Inject(EDUCONTENT_SERVICE_TOKEN)
    private eduContentService: EducontentServiceInterface
  ) {}
}
