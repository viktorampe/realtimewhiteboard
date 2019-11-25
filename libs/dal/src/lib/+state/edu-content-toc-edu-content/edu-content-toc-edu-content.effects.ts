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
  AddEduContentTocEduContentsForBook,
  AddLoadedBookForEduContentTocEduContent,
  EduContentTocEduContentsActionTypes,
  EduContentTocEduContentsLoadError,
  LoadEduContentTocEduContentsForBook
} from './edu-content-toc-edu-content.actions';
import { isBookLoaded } from './edu-content-toc-edu-content.selectors';

@Injectable()
export class EduContentTocEduContentEffects {
  @Effect()
  loadEduContentTocEduContents$ = this.dataPersistence.fetch(
    EduContentTocEduContentsActionTypes.LoadEduContentTocEduContentsForBook,
    {
      run: (action: LoadEduContentTocEduContentsForBook, state: DalState) => {
        const requestedBookId = action.payload.bookId;

        if (isBookLoaded(state, { bookId: requestedBookId })) {
          return;
        }

        return this.tocService
          .getEduContentTocEduContentForBookId(requestedBookId)
          .pipe(
            map(
              eduContentTocEduContents =>
                new AddEduContentTocEduContentsForBook({
                  bookId: requestedBookId,
                  eduContentTocEduContents
                })
            )
          );
      },
      onError: (action: LoadEduContentTocEduContentsForBook, error) => {
        return new EduContentTocEduContentsLoadError(error);
      }
    }
  );

  @Effect()
  addLoadedBook$ = this.dataPersistence.pessimisticUpdate(
    EduContentTocEduContentsActionTypes.AddEduContentTocEduContentsForBook,
    {
      run: (action: AddEduContentTocEduContentsForBook, state: DalState) => {
        const addedBookId = action.payload.bookId;

        return new AddLoadedBookForEduContentTocEduContent({
          bookId: addedBookId
        });
      },
      onError: (action: AddEduContentTocEduContentsForBook, error) => {
        return new EduContentTocEduContentsLoadError(error);
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
