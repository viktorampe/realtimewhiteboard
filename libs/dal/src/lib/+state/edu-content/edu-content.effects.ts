import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import {
  EduContentServiceInterface,
  EDUCONTENT_SERVICE_TOKEN
} from '../../edu-content/edu-content.service.interface';
import {
  EduContentsActionTypes,
  EduContentsLoaded,
  EduContentsLoadError,
  LoadEduContents
} from './edu-content.actions';
import { State } from './edu-content.reducer';

@Injectable()
export class EduContentsEffects {
  @Effect()
  loadEduContents$ = this.dataPersistence.fetch(
    EduContentsActionTypes.LoadEduContents,
    {
      run: (action: LoadEduContents, state: any) => {
        if (!action.payload.force && state.eduContents.loaded) return;
        return this.eduContentService
          .getAllForUser(11) //TODO: replace with state.user.current ...
          .pipe(map(eduContents => new EduContentsLoaded({ eduContents })));
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
