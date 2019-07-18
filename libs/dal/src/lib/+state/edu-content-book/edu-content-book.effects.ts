import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import { DalState } from '..';
import {
  EduContentBookServiceInterface,
  EDU_CONTENT_BOOK_SERVICE_TOKEN
} from '../../edu-content-book/edu-content-book.service.interface';
import {
  EduContentBooksActionTypes,
  EduContentBooksLoaded,
  EduContentBooksLoadError,
  LoadEduContentBooks
} from './edu-content-book.actions';

@Injectable()
export class EduContentBookEffects {
  @Effect()
  loadEduContentBooks$ = this.dataPersistence.fetch(
    EduContentBooksActionTypes.LoadEduContentBooks,
    {
      run: (action: LoadEduContentBooks, state: DalState) => {
        if (!action.payload.force && state.eduContentBooks.loaded) return;
        return this.eduContentBookService
          .getAllForUser(action.payload.userId)
          .pipe(
            map(
              eduContentBooks => new EduContentBooksLoaded({ eduContentBooks })
            )
          );
      },
      onError: (action: LoadEduContentBooks, error) => {
        return new EduContentBooksLoadError(error);
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(EDU_CONTENT_BOOK_SERVICE_TOKEN)
    private eduContentBookService: EduContentBookServiceInterface
  ) {}
}
