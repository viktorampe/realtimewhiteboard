import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import { map } from 'rxjs/operators';
import { DalState } from '..';
import {
  TocServiceInterface,
  TOC_SERVICE_TOKEN
} from '../../toc/toc.service.interface';
import {
  AddEduContentTocsForBook,
  AddLoadedBook,
  EduContentTocsActionTypes,
  EduContentTocsLoadError,
  LoadEduContentTocsForBook
} from './edu-content-toc.actions';
import { isBookLoaded } from './edu-content-toc.selectors';

@Injectable()
export class EduContentTocEffects {
  @Effect()
  loadEduContentTocsForBook$ = this.dataPersistence.fetch(
    EduContentTocsActionTypes.LoadEduContentTocsForBook,
    {
      run: (action: LoadEduContentTocsForBook, state: DalState) => {
        const requestedBookId = action.payload.bookId;

        if (isBookLoaded(state, { bookId: requestedBookId })) {
          return;
        }

        return this.eduContentTocService.getTocsForBookId(requestedBookId).pipe(
          map(
            eduContentTocs =>
              new AddEduContentTocsForBook({
                bookId: requestedBookId,
                eduContentTocs
              })
          )
        );
      },
      onError: (action: LoadEduContentTocsForBook, error) => {
        return new EduContentTocsLoadError(error);
      }
    }
  );

  // When AddEduContentTocsForBook is dispatched
  // also dispatch an action to add the book to the loadedBooks
  @Effect()
  addLoadedBook$ = this.dataPersistence.pessimisticUpdate(
    EduContentTocsActionTypes.AddEduContentTocsForBook,
    {
      run: (action: AddEduContentTocsForBook, state: DalState) => {
        const addedBookId = action.payload.bookId;

        return new AddLoadedBook({
          bookId: addedBookId
        });
      },
      onError: (action: AddEduContentTocsForBook, error) => {
        return new EduContentTocsLoadError(error);
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(TOC_SERVICE_TOKEN)
    private eduContentTocService: TocServiceInterface
  ) {}
}
