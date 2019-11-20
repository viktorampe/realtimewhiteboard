import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { DalState } from '..';
import {
  TocServiceInterface,
  TOC_SERVICE_TOKEN
} from '../../toc/toc.service.interface';
import { isBookLoaded } from '../edu-content-toc/edu-content-toc.selectors';
import {
  AddEduContentTocEduContentsForBook,
  AddLoadedBook,
  EduContentTocEduContentsActionTypes,
  EduContentTocEduContentsLoadError,
  LoadEduContentTocEduContentsForBook
} from './edu-content-toc-edu-content.actions';

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

        /* @TODO
        --------------
        
        return this.tocService
          .getEduContentTOCEduContentForBookId(requestedBookId)
          .pipe(
            map(
              eduContentTocEduContents =>
                new AddEduContentTocEduContentsForBook({
                  bookId: requestedBookId,
                  eduContentTocEduContents
                })
            )
          );
        */
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

        return new AddLoadedBook({
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
