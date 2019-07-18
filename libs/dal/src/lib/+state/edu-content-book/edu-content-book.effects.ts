import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import { DalState } from '..';
import { TocServiceInterface, TOC_SERVICE_TOKEN } from '../../..';
import {
  DiaboloEnabledEduContentBookIdsLoaded,
  DiaboloEnabledEduContentBookIdsLoadError,
  EduContentBooksActionTypes,
  EduContentBooksLoaded,
  EduContentBooksLoadError,
  LoadDiaboloEnabledEduContentBookIds,
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
  loadDiaboloEnabledEduContentBookIds$ = this.dataPersistence.fetch(
    EduContentBooksActionTypes.LoadDiaboloEnabledEduContentBookIds,
    {
      run: (action: LoadDiaboloEnabledEduContentBookIds, state: DalState) => {
        if (!action.payload.force && state.eduContentBooks.loaded) return;
        //TODO -- implent service that is still to be created for non existing api endpoint https://dev.azure.com/diekeure-webdev/LK2020/_workitems/edit/1658
        return new DiaboloEnabledEduContentBookIdsLoaded({
          diaboloEnabledEduContentBookIds: []
        });
      },
      onError: (action: LoadDiaboloEnabledEduContentBookIds, error) => {
        return new DiaboloEnabledEduContentBookIdsLoadError(error);
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
