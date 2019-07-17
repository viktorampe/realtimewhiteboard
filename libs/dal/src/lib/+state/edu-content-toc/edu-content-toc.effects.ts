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
  AddEduContentTocsForBook,
  EduContentTocsActionTypes,
  EduContentTocsLoadError,
  LoadEduContentTocsForBook
} from './edu-content-toc.actions';

@Injectable()
export class EduContentTocEffects {
  @Effect()
  loadEduContentTocsForBook$ = this.dataPersistence.fetch(
    EduContentTocsActionTypes.LoadEduContentTocsForBook,
    {
      run: (action: LoadEduContentTocsForBook, state: DalState) => {
        const requestedBookId = action.payload.bookId;

        if (
          state.eduContentTocs.loadedBooks.some(
            loadedbookId => (loadedbookId = requestedBookId)
          )
        ) {
          return;
        }

        return this.eduContentTocService.getTree(requestedBookId).pipe(
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

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(TOC_SERVICE_TOKEN)
    private eduContentTocService: TocServiceInterface
  ) {}
}
