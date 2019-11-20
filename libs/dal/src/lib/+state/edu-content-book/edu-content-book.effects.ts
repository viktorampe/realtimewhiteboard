import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import { DalState } from '..';
import {
  TocServiceInterface,
  TOC_SERVICE_TOKEN
} from '../../toc/toc.service.interface';
import {
  EduContentBooksActionTypes,
  EduContentBooksLoaded,
  EduContentBooksLoadError,
  LoadEduContentBooks,
  LoadEduContentBooksFromIds
} from './edu-content-book.actions';

@Injectable()
export class EduContentBookEffects {
  @Effect()
  loadEduContentBooks$ = this.dataPersistence.fetch(
    EduContentBooksActionTypes.LoadEduContentBooks,
    {
      run: (action: LoadEduContentBooks, state: DalState) => {
        if (!action.payload.force && state.eduContentBooks.loaded) return;
        return this.tocService
          .getBooksByMethodIds(action.payload.methodIds)
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

  @Effect()
  loadEduContentBooksFromIds$ = this.dataPersistence.fetch(
    EduContentBooksActionTypes.LoadEduContentBooksFromIds,
    {
      run: (action: LoadEduContentBooksFromIds, state: DalState) => {
        if (!action.payload.force && state.eduContentBooks.loaded) return;
        return this.tocService
          .getBooksByIds(action.payload.bookIds)
          .pipe(
            map(
              eduContentBooks => new EduContentBooksLoaded({ eduContentBooks })
            )
          );
      },
      onError: (action: LoadEduContentBooksFromIds, error) => {
        return new EduContentBooksLoadError(error);
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(TOC_SERVICE_TOKEN)
    private tocService: TocServiceInterface
  ) {}
}
