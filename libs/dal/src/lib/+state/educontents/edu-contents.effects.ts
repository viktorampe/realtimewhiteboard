import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import {
  EduContentServiceInterface,
  EDUCONTENT_SERVICE_TOKEN
} from '../../educontent/edu-content.service.interface';
import {
  AddEduContents,
  EduContentsActionTypes,
  EduContentsLoadError,
  LoadEduContents
} from './edu-contents.actions';
import { State } from './edu-contents.reducer';

@Injectable()
export class EduContentsEffects {
  @Effect()
  loadEduContents$ = this.dataPersistence.fetch(
    EduContentsActionTypes.LoadEduContents,
    {
      run: (action: LoadEduContents, state: State) => {
        return this.eduContentService.getAll().pipe(
          map(eduContents => {
            return new AddEduContents({ eduContents });
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
    private dataPersistence: DataPersistence<State>,
    @Inject(EDUCONTENT_SERVICE_TOKEN)
    private eduContentService: EduContentServiceInterface
  ) {}
}
