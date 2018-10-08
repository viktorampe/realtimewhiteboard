import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import {
  EduContentServiceInterface,
  EDUCONTENT_SERVICE_TOKEN
} from '../../educontent/edu-content.service.interface';
import {
  EduContentsActionTypes,
  EduContentsLoaded,
  EduContentsLoadError,
  EduContentsLoadSuccessfull,
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
            return new EduContentsLoaded({ eduContents });
          })
        );
      },
      onError: (action: LoadEduContents, error) => {
        return new EduContentsLoadError(error);
      }
    }
  );
  @Effect()
  eduContentsLoaded$ = this.actions.pipe(
    ofType(EduContentsActionTypes.EduContentsLoaded),
    switchMap(a => of(new EduContentsLoadSuccessfull({ loaded: true })))
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<State>,
    @Inject(EDUCONTENT_SERVICE_TOKEN)
    private eduContentService: EduContentServiceInterface
  ) {}
}
